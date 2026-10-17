export async function retry(tentativas, operacao) {
  const maxTentativas = tentativas;
  let contador = 0;

   do {
    contador++;
    try {
      const resultado = await operacao();
      return resultado;
    } catch (erro) {
      if (contador >= maxTentativas) {
        throw new Error(`HTTP ${erro.response?.status ?? erro.status ?? 'desconhecido'}`);
      }
    }
  } while (contador < maxTentativas);

}
