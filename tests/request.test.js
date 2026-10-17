import { test, before, after } from "node:test";
import assert from "node:assert/strict";
import http from "node:http";
import { request } from "../src/http/request.js";

// Servidor local que responde conforme uma lista de status, um por requisição
let server;
let baseUrl;
let respostas = [];
let chamadas = 0;

before(async () => {
  server = http.createServer((req, res) => {
    const status = respostas[chamadas] ?? respostas.at(-1);
    chamadas++;
    res.writeHead(status);
    res.end(`status ${status}`);
  });
  await new Promise((resolve) => server.listen(0, resolve));
  baseUrl = `http://localhost:${server.address().port}`;
});

after(() => server.close());

function configurar(lista) {
  respostas = lista;
  chamadas = 0;
}

test("retorna a resposta quando o servidor responde 200", async () => {
  configurar([200]);
  const response = await request("GET", undefined, baseUrl, 3);

  assert.equal(response.status, 200);
  assert.equal(chamadas, 1);
});

test("tenta de novo quando o servidor responde 500 e depois 200", async () => {
  configurar([500, 500, 200]);
  const response = await request("GET", undefined, baseUrl, 3);

  assert.equal(response.status, 200);
  assert.equal(chamadas, 3);
});

test("lança erro quando o servidor responde 500 em todas as tentativas", async () => {
  configurar([500]);
  await assert.rejects(request("GET", undefined, baseUrl, 3));

  assert.equal(chamadas, 3);
});

test("lança erro quando não consegue conectar", async () => {
  // porta 1 não tem nada escutando -> falha de rede
  await assert.rejects(request("GET", undefined, "http://localhost:1", 2));
});
