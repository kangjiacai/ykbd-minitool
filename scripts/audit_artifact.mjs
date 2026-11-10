#!/usr/bin/env node
/** Audit deterministic mini-tool package and text-file size limits. */

import fs from "node:fs";
import path from "node:path";

const MIB = 1024 * 1024;
const ZIP_LIMIT = 10 * MIB;
const ZIP_RECOMMENDED = 2 * MIB;
const TEXT_FILE_WARNING = 2 * MIB;
const TEXT_TOTAL_WARNING = 5 * MIB;
const TEXT_SUFFIXES = new Set([".html", ".css", ".js", ".json"]);
/** 小红书小工具包允许的后缀。目录项不算文件。 */
const ALLOWED_EXTENSIONS = new Set([
  ".jpg", ".jpeg", ".css", ".gif", ".svg", ".png", ".js",
  ".json", ".html", ".woff", ".woff2", ".webp"
]);

function extensionOf(name) {
  return path.extname(name).toLowerCase();
}

function disallowedType(name) {
  const ext = extensionOf(name);
  if (ALLOWED_EXTENSIONS.has(ext)) return "";
  return ext || "(no extension)";
}

function formatSize(size) {
  return `${(size / MIB).toFixed(2)} MiB`;
}

function walkDirectory(root) {
  const files = [];
  function walk(current) {
    for (const entry of fs.readdirSync(current, { withFileTypes: true })) {
      if (entry.name === ".git") continue;
      const target = path.join(current, entry.name);
      if (entry.isDirectory()) walk(target);
      else if (entry.isFile()) files.push(target);
    }
  }
  walk(root);
  return files;
}

function auditDirectory(root) {
  const errors = [];
  const warnings = [];
  const files = walkDirectory(root);
  let textTotal = 0;

  for (const file of files) {
    const name = path.relative(root, file).split(path.sep).join("/");
    const blocked = disallowedType(name);
    if (blocked) {
      errors.push(`${name}: file type ${blocked} is not allowed in the package`);
    }
    if (!TEXT_SUFFIXES.has(extensionOf(name))) continue;
    const size = fs.statSync(file).size;
    textTotal += size;
    if (size > TEXT_FILE_WARNING) {
      warnings.push(`${name}: text file is ${formatSize(size)}; review parse and memory cost`);
    }
  }
  if (textTotal > TEXT_TOTAL_WARNING) {
    warnings.push(`uncompressed HTML/CSS/JS/JSON total is ${formatSize(textTotal)}; review for embedded databases or generated content`);
  }
  return { errors, warnings, count: files.length };
}

function listZipFiles(file) {
  const buf = fs.readFileSync(file);
  let eocd = -1;
  const min = Math.max(0, buf.length - 22 - 65535);
  for (let i = buf.length - 22; i >= min; i--) {
    if (buf.readUInt32LE(i) === 0x06054b50) {
      eocd = i;
      break;
    }
  }
  if (eocd < 0) throw new Error("zip end of central directory not found");
  const count = buf.readUInt16LE(eocd + 10);
  const cdSize = buf.readUInt32LE(eocd + 12);
  const cdOffset = buf.readUInt32LE(eocd + 16);
  if (count === 0xffff || cdOffset === 0xffffffff || cdSize === 0xffffffff) {
    throw new Error("zip64 is not supported by this audit");
  }
  const names = [];
  let p = cdOffset;
  for (let n = 0; n < count; n++) {
    if (p + 46 > buf.length || buf.readUInt32LE(p) !== 0x02014b50) {
      throw new Error("zip central directory is truncated");
    }
    const nameLen = buf.readUInt16LE(p + 28);
    const extraLen = buf.readUInt16LE(p + 30);
    const commentLen = buf.readUInt16LE(p + 32);
    const name = buf.toString("utf8", p + 46, p + 46 + nameLen).replace(/\\/g, "/");
    if (!name.endsWith("/")) names.push(name);
    p += 46 + nameLen + extraLen + commentLen;
  }
  return names;
}

function auditZipSize(file) {
  const errors = [];
  const warnings = [];
  const size = fs.statSync(file).size;
  if (size > ZIP_LIMIT) errors.push(`${path.basename(file)}: zip is ${formatSize(size)}; hard limit is 10 MiB`);
  else if (size > ZIP_RECOMMENDED) warnings.push(`${path.basename(file)}: zip is ${formatSize(size)}; recommended target is 2 MiB`);
  const names = listZipFiles(file);
  for (const name of names) {
    const blocked = disallowedType(name);
    if (blocked) errors.push(`${name}: file type ${blocked} is not allowed in the package`);
  }
  return { errors, warnings, count: names.length };
}

function main() {
  const target = process.argv[2];
  if (!target) {
    console.error("Usage: node audit_artifact.mjs <artifact-directory-or-zip>");
    return 2;
  }
  const resolved = path.resolve(target);
  if (!fs.existsSync(resolved)) {
    console.error(`ERROR: path not found: ${resolved}`);
    return 2;
  }

  let result;
  try {
    result = fs.statSync(resolved).isDirectory()
      ? auditDirectory(resolved)
      : auditZipSize(resolved);
  } catch (error) {
    console.error(`ERROR: cannot inspect ${resolved}: ${error.message}`);
    return 2;
  }

  for (const message of result.errors) console.log(`ERROR: ${message}`);
  for (const message of result.warnings) console.log(`WARN: ${message}`);
  if (result.note) console.log(`NOTE: ${result.note}`);
  if (result.errors.length) {
    console.log(`FAILED: ${result.errors.length} error(s), ${result.warnings.length} warning(s)`);
    return 1;
  }
  console.log(`PASS: ${result.count} file(s), ${result.warnings.length} warning(s)`);
  return 0;
}

process.exitCode = main();
