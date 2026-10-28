import { spawn } from "node:child_process";

const children = [];
let stopping = false;
const stop = (code = 0) => {
  if (stopping) return;
  stopping = true;
  for (const child of children) child.kill();
  process.exitCode = code;
};
function launch(args) {
  const child = spawn(process.execPath, args, { stdio: "inherit", windowsHide: true });
  children.push(child);
  child.on("error", (error) => { console.error(error.message); stop(1); });
  child.on("exit", (code) => { if (!stopping) stop(code ?? 1); });
}
let health;
try { const response = await fetch("http://127.0.0.1:4311/api/health", { signal: AbortSignal.timeout(1000) }); health = await response.json(); } catch {}
if (health && health.service !== "alltour-leads") throw new Error("Port 4311 belongs to another service.");
if (!health) launch(["--import", "tsx", "server/leadServer.ts"]);
launch(["node_modules/vite/bin/vite.js", "--host", "127.0.0.1", "--port", "3000"]);
for (const signal of ["SIGINT", "SIGTERM"]) process.on(signal, () => stop());
