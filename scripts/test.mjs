import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";

function discover(directory) {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const name = path.join(directory, entry.name);
    return entry.isDirectory() ? discover(name) : /\.test\.[cm]?[jt]sx?$/.test(name) ? [name] : [];
  });
}
const files = discover("src").sort();
if (!files.length) throw new Error("No test files discovered");
const result = spawnSync(process.execPath, ["--import", "tsx", "--test", ...files], { stdio: "inherit" });
process.exit(result.status ?? 1);
