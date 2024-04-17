import util from "node:util";
import { EOL } from "node:os";
import chalk from "chalk";

export default class Logger {
  constructor(tag = "default", sink = process.stderr) {
    this.tag = tag;
    this.sink = sink;
  }

  #print(severity, ...args) {
    const colors = {
      debug: chalk.green,
      info: chalk.blue,
      warn: chalk.yellow,
      error: chalk.red,
    };

    this.sink.write(
      colors[severity](
        `${new Date().toISOString()} ${severity.padEnd(6)} ${this.tag} `
      )
    );

    this.sink.write(
      args
        .map((arg) => (typeof arg === "string" ? arg : util.inspect(arg)))
        .join(" ") + EOL
    );
  }

  debug(...args) {
    this.#print("debug", ...args);
  }

  info(...args) {
    this.#print("info", ...args);
  }

  warn(...args) {
    this.#print("warn", ...args);
  }

  error(...args) {
    this.#print("error", ...args);
  }
}
