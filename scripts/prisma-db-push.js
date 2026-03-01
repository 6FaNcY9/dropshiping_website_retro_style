import { execSync } from "child_process";

console.log("Running prisma db push...");
try {
  execSync("npx prisma db push --skip-generate", {
    stdio: "inherit",
    cwd: process.cwd(),
  });
  console.log("Database schema pushed successfully!");
} catch (error) {
  console.error("Failed to push database schema:", error.message);
  process.exit(1);
}
