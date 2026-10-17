# retrylib

Retry simples para operações assíncronas e requisições HTTP, sem dependências.

Se uma operação falhar, a lib tenta de novo até o número de tentativas que você definir. Se todas falharem, o erro é lançado para você tratar.

## Instalação

```bash
npm install retrylib
```

Requer Node.js 18 ou superior (usa o `fetch` nativo).

## Uso

### `request` — requisição HTTP com retry

```js
import { request } from "retrylib";

const response = await request(
  "GET",                          // método HTTP
  undefined,                      // body
  "https://api.exemplo.com/users", // url
  3,                              // número de tentativas
  { Accept: "application/json" }, // headers (opcional)
);

const dados = await response.json();
```

Enviando um body:

```js
const response = await request(
  "POST",
  JSON.stringify({ nome: "Maria" }),
  "https://api.exemplo.com/users",
  3,
  { "Content-Type": "application/json" },
);
```

Uma nova tentativa é feita quando:

- a requisição falha por erro de rede (servidor fora do ar, DNS, conexão recusada);
- o servidor responde com status fora da faixa 2xx (por exemplo, 500 ou 503).

Retorna o objeto [`Response`](https://developer.mozilla.org/pt-BR/docs/Web/API/Response) da primeira tentativa que der certo.

### `retry` — qualquer operação assíncrona

```js
import { retry } from "retrylib";

const resultado = await retry(3, async () => {
  return await buscarAlgoInstavel();
});
```

A função passada é chamada novamente sempre que lançar um erro, até atingir o número de tentativas.

> Passe uma **função**, e não o resultado dela. `retry(3, () => buscar())` funciona; `retry(3, buscar())` não, porque a operação já teria sido executada antes do retry.

## API

### `request(metodoHttp, body, url, tentativas, headers?)`

| Parâmetro    | Tipo     | Descrição                                     |
| ------------ | -------- | --------------------------------------------- |
| `metodoHttp` | `string` | Método HTTP: `"GET"`, `"POST"`, `"PUT"` etc.  |
| `body`       | `any`    | Corpo da requisição, ou `undefined`.          |
| `url`        | `string` | Endereço da requisição.                       |
| `tentativas` | `number` | Número máximo de tentativas.                  |
| `headers`    | `object` | Cabeçalhos da requisição (opcional).          |

Retorna `Promise<Response>`.

### `retry(tentativas, operacao)`

| Parâmetro    | Tipo                 | Descrição                              |
| ------------ | -------------------- | -------------------------------------- |
| `tentativas` | `number`             | Número máximo de tentativas.           |
| `operacao`   | `() => Promise<any>` | Função a ser executada e repetida.     |

Retorna `Promise` com o valor retornado pela `operacao`.

## Tratando erros

Se todas as tentativas falharem, a promise é rejeitada:

```js
try {
  await request("GET", undefined, "https://api.exemplo.com", 3);
} catch (erro) {
  console.error("Falhou depois de 3 tentativas:", erro.message);
}
```

## Limitações atuais

- As tentativas acontecem em sequência, sem intervalo entre elas.
- Qualquer status fora de 2xx dispara nova tentativa, incluindo erros do cliente como 400 e 404.

## Testes

```bash
npm test
```

## Licença

ISC
