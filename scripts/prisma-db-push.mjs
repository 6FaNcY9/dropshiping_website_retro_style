import { execSync } from "child_process";

console.log("Pushing Prisma schema to database...");
try {
  execSync("npx prisma db push --accept-data-loss", {
    stdio: "inherit",
    cwd: process.cwd(),
  });
  console.log("Database schema pushed successfully!");
} catch (error) {
  console.error("Failed to push database schema:", error.message);
  process.exit(1);
}
