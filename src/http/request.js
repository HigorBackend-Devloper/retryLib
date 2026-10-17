import { retry } from "../retry.js";

export async function request(metodoHtp, body, url, tentativas, headers) {
  try {
    const response = await retry(tentativas, async () => {
      const res = await fetch(url, {
        method: metodoHtp,
        headers,
        body,
      });
      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }
      return res;
    });
    return response;
  } catch (error) {
    throw error;
  }
}
