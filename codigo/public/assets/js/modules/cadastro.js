import { userService } from './db-service.js';
import { buscarCep } from './cep.js';
import { aplicarMascaraCPF, aplicarMascaraCEP, limparMascara, exibirMensagem, exibirErroInput, limparErroInput, validarEmail, validarSenha, validarCPF, validarCEP } from './utils.js';

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("formulario");
  const nomeInput = document.getElementById("nome");
  const emailInput = document.getElementById("email");
  const senhaInput = document.getElementById("senha");
  const confirmaSenhaInput = document.getElementById("confirmaSenha");
  const cpfInput = document.getElementById("cpf");
  const cepInput = document.getElementById("cep");
  const logradouroInput = document.getElementById("logradouro");
  const bairroInput = document.getElementById("bairro");
  const cidadeInput = document.getElementById("cidade");
  const estadoInput = document.getElementById("estado");
  const btnCadastrar = document.getElementById("btnCadastrar");
  const mensagemGeral = document.getElementById("mensagem-geral");

  const inputs = [nomeInput, emailInput, senhaInput, confirmaSenhaInput, cpfInput, cepInput, logradouroInput, bairroInput, cidadeInput, estadoInput];

  inputs.forEach(input => {
    if (input) {
      input.addEventListener("input", () => limparErroInput(input));
    }
  });

  if (cpfInput) {
    cpfInput.addEventListener("input", (e) => {
      e.target.value = aplicarMascaraCPF(e.target.value);
    });
  }

  if (cepInput) {
    cepInput.addEventListener("input", (e) => {
      e.target.value = aplicarMascaraCEP(e.target.value);
    });
  }

  if (form) {
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      if (btnCadastrar) btnCadastrar.disabled = true;
      if (mensagemGeral) exibirMensagem(mensagemGeral, "", "");

      let formularioValido = true;

      if (!nomeInput || nomeInput.value.trim().length < 3) { 
        if (nomeInput) exibirErroInput(nomeInput, "Nome deve ter no mínimo 3 caracteres."); 
        formularioValido = false; 
      }
      if (!emailInput || !validarEmail(emailInput.value.trim())) { 
        if (emailInput) exibirErroInput(emailInput, "Email inválido."); 
        formularioValido = false; 
      }
      if (!senhaInput || !validarSenha(senhaInput.value)) { 
        if (senhaInput) exibirErroInput(senhaInput, "Senha deve ter min. 8 caracteres, maiúscula, minúscula, número e símbolo."); 
        formularioValido = false; 
      }
      if (!confirmaSenhaInput || senhaInput.value !== confirmaSenhaInput.value) { 
        if (confirmaSenhaInput) exibirErroInput(confirmaSenhaInput, "As senhas não coincidem."); 
        formularioValido = false; 
      }
      if (!cpfInput || !validarCPF(cpfInput.value)) { 
        if (cpfInput) exibirErroInput(cpfInput, "CPF inválido."); 
        formularioValido = false; 
      }
      if (!cepInput || !validarCEP(cepInput.value)) { 
        if (cepInput) exibirErroInput(cepInput, "CEP inválido."); 
        formularioValido = false; 
      }
      if (!logradouroInput || !logradouroInput.value.trim()) { 
        if (logradouroInput) exibirErroInput(logradouroInput, "Logradouro é obrigatório."); 
        formularioValido = false; 
      }
      if (!bairroInput || !bairroInput.value.trim()) { 
        if (bairroInput) exibirErroInput(bairroInput, "Bairro é obrigatório."); 
        formularioValido = false; 
      }
      if (!cidadeInput || !cidadeInput.value.trim()) { 
        if (cidadeInput) exibirErroInput(cidadeInput, "Cidade é obrigatória."); 
        formularioValido = false; 
      }
      if (!estadoInput || !estadoInput.value.trim()) { 
        if (estadoInput) exibirErroInput(estadoInput, "Estado é obrigatório."); 
        formularioValido = false; 
      }

      if (!formularioValido) {
        if (mensagemGeral) exibirMensagem(mensagemGeral, "erro", "Por favor, preencha todos os campos corretamente.");
        if (btnCadastrar) btnCadastrar.disabled = false;
        return;
      }

      const novoUsuario = {
        nome: nomeInput.value.trim(),
        email: emailInput.value.trim(),
        senha: senhaInput.value,
        cpf: limparMascara(cpfInput.value),
        cep: limparMascara(cepInput.value),
        logradouro: logradouroInput.value.trim(),
        bairro: bairroInput.value.trim(),
        cidade: cidadeInput.value.trim(),
        estado: estadoInput.value.trim()
      };

      try {
        // Cria o novo usuário
        const usuarioCriado = userService.create(novoUsuario);
        if (mensagemGeral) exibirMensagem(mensagemGeral, "sucesso", "Cadastro realizado com sucesso! Redirecionando para o login...");
        form.reset();
        
        setTimeout(() => {
          window.location.href = "login.html";
        }, 1500); 
      } catch (error) {
        if (mensagemGeral) exibirMensagem(mensagemGeral, "erro", `Erro no cadastro: ${error.message}`);
      } finally {
        if (btnCadastrar) btnCadastrar.disabled = false;
      }
    });
  }

  if (cepInput) {
    cepInput.addEventListener('blur', async (e) => {
      const cep = e.target.value.replace(/\D/g, '');
      if (cep.length === 8) {
          const endereco = await buscarCep(cep);
          if (endereco) {
              if (logradouroInput) logradouroInput.value = endereco.logradouro;
              if (bairroInput) bairroInput.value = endereco.bairro;
              if (cidadeInput) cidadeInput.value = endereco.localidade;
              if (estadoInput) estadoInput.value = endereco.uf;
          }
      }
    });
  }
});

function mostrarMensagem(texto, tipo) {
    const mensagem = document.getElementById('mensagem-geral');
    if (mensagem) {
      mensagem.textContent = texto;
      mensagem.className = `mensagem ${tipo}`;
    }
}