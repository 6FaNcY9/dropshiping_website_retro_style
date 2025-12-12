const fs = require("fs");
const path = require("path");

const projectRoot = process.cwd();
const nextManifestPath = path.join(
  projectRoot,
  ".next",
  "routes-manifest.json",
);
const vercelOutputDir = path.join(projectRoot, ".vercel", "output");
const vercelManifestPath = path.join(vercelOutputDir, "routes-manifest.json");

if (!fs.existsSync(nextManifestPath)) {
  console.error(
    "routes-manifest.json not found in .next; ensure `next build` ran successfully.",
  );
  process.exit(1);
}

fs.mkdirSync(vercelOutputDir, { recursive: true });
fs.copyFileSync(nextManifestPath, vercelManifestPath);

console.log(
  "Copied routes-manifest.json to .vercel/output to satisfy Vercel build expectations.",
);
