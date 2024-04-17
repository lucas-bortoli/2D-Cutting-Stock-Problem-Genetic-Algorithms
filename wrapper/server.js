import http from "node:http";
import Logger from "./logger.js";
import { solve } from "./solver.js";

const logger = new Logger("main");

async function consumeStream(readable) {
  const chunks = [];
  for await (let chunk of readable) {
    chunks.push(chunk);
  }
  return Buffer.concat(chunks);
}

const server = http.createServer(async function (request, response) {
  const method = request.method.toUpperCase();
  const url = new URL(request.url, `http://${request.headers.host}`);

  logger.info(method, request.url);

  if (method === "GET" && url.pathname === "/") {
    response.writeHead(200, { "Content-Type": "text/html " });
    response.end("");
  } else if (method === "POST" && url.pathname === "/solve") {
    const input = (await consumeStream(request)).toString("utf-8");
    const result = await solve([
      { width: 800, height: 500 },
      { width: 810, height: 800 },
      { width: 20, height: 500 },
      { width: 800, height: 121 },
      { width: 850, height: 500 },
      { width: 800, height: 20 },
    ]);

    // Enviar cabeçalho para o navegador não abandonar o request
    response.writeHead(200, { "Content-Type": "application/json" });
    response.end(JSON.stringify(result));
  } else {
    // 404
    logger.error("404!");
    response.writeHead(404);
    response.end("Not Found");
  }
});

const port = parseInt(process.env.PORT) || 3000;
server.listen(port, () => {
  logger.info("Server listening on port", port);
});
