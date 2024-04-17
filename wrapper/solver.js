import { spawn } from "node:child_process";
import Logger from "./logger.js";
import { EOL } from "node:os";

const logger = new Logger("solver");

function spawnAlgorithm(stdin) {
  return new Promise((resolve, reject) => {
    const child = spawn("/solver", []);

    let stdoutData = "";

    child.stderr.on("data", (data) => {
      const lines = data.toString("utf-8").split("\n");
      for (let line of lines) {
        line = line.trim();
        if (line) logger.debug(line);
      }
    });

    child.stdout.on("data", (data) => {
      stdoutData += data.toString();
    });

    child.on("error", (err) => {
      reject(err);
    });

    child.on("close", (code) => {
      if (code !== 0) {
        reject(new Error(`Solver process exited with code ${code}`));
      } else {
        resolve(stdoutData);
      }
    });

    child.stdin.write(stdin);
    child.stdin.end();
  });
}

/**
 *
 * @param {{ width: number, height: number }[]} pieces
 * @returns {Promise<{ area: number, pieces: { x: number, y: number; rotated_90: boolean, width: number, height: number }[] }>}
 */
export async function solve(inputPieces) {
  const input = inputPieces
    .map((piece) => `${piece.width} ${piece.height}`)
    .join("\n");

  const algoOutput = await spawnAlgorithm(input);
  let lines = algoOutput.split(EOL);

  const area = parseInt(lines.shift());
  const pieces = [];

  for (let line of lines) {
    // Pular linhas vazias
    line = line.trim();
    if (line.length < 1) continue;

    const [width, height, x, y, rotated] = line
      .split(" ")
      .filter((s) => s.length)
      .map(Number);

    logger.debug(line, width, height, x, y, rotated);

    pieces.push({ x, y, width, height, rotated_90: rotated === 1 });
  }

  return { area, pieces };
}
