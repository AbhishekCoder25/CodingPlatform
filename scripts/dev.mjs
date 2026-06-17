import { spawn } from "node:child_process";

const commands = [
  {
    name: "frontend",
    command: "npm",
    args: ["run", "dev", "--workspace", "frontend"]
  },
  {
    name: "backend",
    command: "npm",
    args: ["run", "dev", "--workspace", "backend"]
  }
];

const children = commands.map(({ name, command, args }) => {
  const child = spawn(command, args, {
    stdio: "inherit",
    shell: true
  });

  child.on("exit", (code) => {
    if (code && code !== 0) {
      console.error(`${name} exited with code ${code}`);
    }
  });

  return child;
});

function shutdown(signal) {
  for (const child of children) {
    if (!child.killed) {
      child.kill(signal);
    }
  }
}

process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));
