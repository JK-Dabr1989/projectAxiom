import { readdir, readFile, stat } from "node:fs/promises";
import { join, relative, sep } from "node:path";

const distRoot = "dist";
const forbiddenFilePatterns = [
  /\.map$/i,
  /\.tsx?$/i,
  /\.md$/i,
  /(^|\/)\.env/i,
  /(^|\/)(src|tests|node_modules|\.git)(\/|$)/i,
  /(^|\/)(AGENTS|PARITY|CHANGELOG|README|DEPLOYMENT)\.md$/i
];
const forbiddenContentPatterns = [
  /\/Users\/jd\//,
  /Axiom-Web-App\/src/,
  /MockScaleTransport/,
  /evt_mock_/,
  /Development mock/i,
  /sourceMappingURL/,
  /github_pat/i,
  /ghp_[A-Za-z0-9_]+/,
  /api[_-]?key/i,
  /BEGIN PRIVATE/i,
  /SECRET/
];

async function collectFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const absolutePath = join(directory, entry.name);
    if (entry.isDirectory()) {
      files.push(...await collectFiles(absolutePath));
    } else {
      files.push(absolutePath);
    }
  }

  return files;
}

const files = await collectFiles(distRoot);
const relativeFiles = files.map((file) => relative(distRoot, file).split(sep).join("/"));
const forbiddenFiles = relativeFiles.filter((file) => forbiddenFilePatterns.some((pattern) => pattern.test(file)));

if (forbiddenFiles.length > 0) {
  console.error(`Forbidden files in production artifact:\n${forbiddenFiles.join("\n")}`);
  process.exit(1);
}

for (const absolutePath of files) {
  const info = await stat(absolutePath);
  if (info.size > 2_000_000) continue;

  const content = await readFile(absolutePath, "utf8").catch(() => "");
  const match = forbiddenContentPatterns.find((pattern) => pattern.test(content));
  if (match) {
    console.error(`Forbidden content matched ${match} in ${relative(distRoot, absolutePath)}`);
    process.exit(1);
  }
}

console.log(`Verified ${files.length} production artifact files.`);
