import { test } from "node:test";
import assert from "node:assert/strict";
import { retry } from "../src/retry.js";

test("retorna o resultado quando a operação funciona de primeira", async () => {
  let chamadas = 0;
  const resultado = await retry(3, async () => {
    chamadas++;
    return "ok";
  });

  assert.equal(resultado, "ok");
  assert.equal(chamadas, 1);
});

test("tenta de novo até dar certo", async () => {
  let chamadas = 0;
  const resultado = await retry(3, async () => {
    chamadas++;
    if (chamadas < 3) throw new Error("falhou");
    return "ok";
  });

  assert.equal(resultado, "ok");
  assert.equal(chamadas, 3);
});

test("lança erro quando todas as tentativas falham", async () => {
  let chamadas = 0;
  await assert.rejects(
    retry(3, async () => {
      chamadas++;
      throw new Error("sempre falha");
    }),
  );

  assert.equal(chamadas, 3);
});
