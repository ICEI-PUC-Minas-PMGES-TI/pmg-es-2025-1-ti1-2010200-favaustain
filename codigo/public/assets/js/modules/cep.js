import { exibirErroInput, limparErroInput, exibirMensagem, validarCEP } from './utils.js';

export async function buscarCep(cep) {
  try {
    const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
    if (!response.ok) {
      throw new Error("Erro ao buscar CEP.");
    }
    const data = await response.json();

    if (data.erro) {
      return null;
    }

    return data;
  } catch (error) {
    console.error("Erro ao buscar CEP:", error);
    return null;
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const cepInput = document.getElementById("cep");
  const logradouroInput = document.getElementById("logradouro");
  const bairroInput = document.getElementById("bairro");
  const cidadeInput = document.getElementById("cidade");
  const estadoInput = document.getElementById("estado");
  const mensagemGeral = document.getElementById("mensagem-geral");

  if (!cepInput) return; // Se não há campo CEP na página, não executa

  const preencherEndereco = (data) => {
    if (logradouroInput) logradouroInput.value = data.logradouro || "";
    if (bairroInput) bairroInput.value = data.bairro || "";
    if (cidadeInput) cidadeInput.value = data.localidade || "";
    if (estadoInput) estadoInput.value = data.uf || "";
    limparErroInput(cepInput);
    if (logradouroInput) limparErroInput(logradouroInput);
  };

  const limparEndereco = () => {
    if (logradouroInput) logradouroInput.value = "";
    if (bairroInput) bairroInput.value = "";
    if (cidadeInput) cidadeInput.value = "";
    if (estadoInput) estadoInput.value = "";
    exibirErroInput(cepInput, "CEP não encontrado ou inválido.");
    if (logradouroInput) exibirErroInput(logradouroInput, "Endereço não preenchido.");
  };

  cepInput.addEventListener("blur", async () => {
    const cep = cepInput.value.replace(/\D/g, "");
    
    if (!validarCEP(cep)) {
      limparEndereco();
      return;
    }

    try {
      const data = await buscarCep(cep);

      if (!data) {
        limparEndereco();
        return;
      }

      preencherEndereco(data);
    } catch (error) {
      if (mensagemGeral) {
        exibirMensagem(mensagemGeral, "erro", `Erro ao buscar CEP: ${error.message}`);
      }
      limparEndereco();
    }
  });
});