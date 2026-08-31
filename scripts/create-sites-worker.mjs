import { mkdir, readdir, readFile, writeFile } from "node:fs/promises";
import { extname, join, relative, sep } from "node:path";

const distRoot = "dist";
const serverDir = join(distRoot, "server");

const contentTypes = new Map([
  [".css", "text/css; charset=utf-8"],
  [".html", "text/html; charset=utf-8"],
  [".js", "text/javascript; charset=utf-8"],
  [".json", "application/json; charset=utf-8"],
  [".svg", "image/svg+xml; charset=utf-8"],
  [".webmanifest", "application/manifest+json; charset=utf-8"]
]);

async function collectAssets(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const absolutePath = join(directory, entry.name);
    if (absolutePath === serverDir || absolutePath.startsWith(`${serverDir}${sep}`)) continue;

    if (entry.isDirectory()) {
      files.push(...await collectAssets(absolutePath));
      continue;
    }

    const body = await readFile(absolutePath);
    const webPath = `/${relative(distRoot, absolutePath).split(sep).join("/")}`;
    files.push({
      path: webPath,
      body: body.toString("base64"),
      contentType: contentTypes.get(extname(entry.name)) ?? "application/octet-stream"
    });
  }

  return files;
}

const files = await collectAssets(distRoot);
const assets = Object.fromEntries(files.map((file) => [file.path, {
  body: file.body,
  contentType: file.contentType
}]));

const worker = `const securityHeaders = {
  "X-Content-Type-Options": "nosniff",
  "Referrer-Policy": "strict-origin-when-cross-origin"
};

const cacheHeaders = {
  immutable: "public, max-age=31536000, immutable",
  revalidate: "public, max-age=0, must-revalidate"
};

const assets = ${JSON.stringify(assets)};

function decodeBase64(value) {
  const binary = atob(value);
  const bytes = new Uint8Array(binary.length);
  for (let index = 0; index < binary.length; index += 1) bytes[index] = binary.charCodeAt(index);
  return bytes;
}

function responseFor(pathname, request) {
  const normalized = pathname === "/" ? "/index.html" : pathname;
  const asset = assets[normalized] ?? (!normalized.includes(".") ? assets["/index.html"] : undefined);
  if (!asset) return new Response("Not found", { status: 404, headers: securityHeaders });

  const headers = new Headers(securityHeaders);
  headers.set("Content-Type", asset.contentType);
  headers.set("Cache-Control", normalized.startsWith("/assets/") ? cacheHeaders.immutable : cacheHeaders.revalidate);
  return new Response(request.method === "HEAD" ? null : decodeBase64(asset.body), { headers });
}

export default {
  async fetch(request) {
    const url = new URL(request.url);
    if (request.method !== "GET" && request.method !== "HEAD") return new Response("Method not allowed", { status: 405, headers: securityHeaders });
    return responseFor(url.pathname, request);
  }
};
`;

await mkdir(serverDir, { recursive: true });
await writeFile(join(serverDir, "index.js"), worker);
