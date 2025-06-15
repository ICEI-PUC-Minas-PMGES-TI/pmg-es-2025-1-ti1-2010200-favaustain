import { aplicarMascaraCPF, aplicarMascaraCEP, limparMascara, exibirMensagem, exibirErroInput, limparErroInput, validarEmail, validarSenha, validarCPF, validarCEP } from './utils.js';
import { userService } from './db-service.js';
import { buscarCep } from './cep.js';

document.addEventListener("DOMContentLoaded", () => {
  const usuario = JSON.parse(localStorage.getItem("currentUser"));

  if (!usuario) {
    window.location.href = "login.html";
    return;
  }

  // Buscar dados completos do usuário
  const usuarioCompleto = userService.getById(usuario.id);
  if (!usuarioCompleto) {
    localStorage.removeItem("currentUser");
    window.location.href = "login.html";
    return;
  }

  const form = document.getElementById("perfilForm");
  const nomeInput = document.getElementById("nome");
  const emailInput = document.getElementById("email");
  const senhaInput = document.getElementById("senha");
  const cpfInput = document.getElementById("cpf");
  const cepInput = document.getElementById("cep");
  const logradouroInput = document.getElementById("logradouro");
  const bairroInput = document.getElementById("bairro");
  const cidadeInput = document.getElementById("cidade");
  const estadoInput = document.getElementById("estado");
  const btnSalvar = document.getElementById("btnSalvar");
  const btnExcluir = document.getElementById("excluirConta");
  const btnLogout = document.getElementById("logoutButton");
  const mensagemGeral = document.getElementById("mensagem-geral");

  const inputs = [nomeInput, emailInput, senhaInput, cpfInput, cepInput, logradouroInput, bairroInput, cidadeInput, estadoInput];

  inputs.forEach(input => {
    if (input) {
      input.addEventListener("input", () => limparErroInput(input));
    }
  });

  // Preencher campos com dados do usuário
  if (nomeInput) nomeInput.value = usuarioCompleto.nome || "";
  if (emailInput) emailInput.value = usuarioCompleto.email || "";
  if (cpfInput) cpfInput.value = aplicarMascaraCPF(usuarioCompleto.cpf || "");
  if (cepInput) cepInput.value = aplicarMascaraCEP(usuarioCompleto.cep || "");
  if (logradouroInput) logradouroInput.value = usuarioCompleto.logradouro || "";
  if (bairroInput) bairroInput.value = usuarioCompleto.bairro || "";
  if (cidadeInput) cidadeInput.value = usuarioCompleto.cidade || "";
  if (estadoInput) estadoInput.value = usuarioCompleto.estado || "";

  if (cpfInput) {
    cpfInput.addEventListener("input", (e) => {
      e.target.value = aplicarMascaraCPF(e.target.value);
    });
  }

  if (cepInput) {
    cepInput.addEventListener("input", (e) => {
      e.target.value = aplicarMascaraCEP(e.target.value);
    });
    
    // Buscar endereço pelo CEP
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

  if (form) {
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      if (btnSalvar) btnSalvar.disabled = true;
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
      if (senhaInput && senhaInput.value.trim() && !validarSenha(senhaInput.value)) { 
        exibirErroInput(senhaInput, "Senha deve ter min. 8 caracteres, maiúscula, minúscula, número e símbolo."); 
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
        if (mensagemGeral) exibirMensagem(mensagemGeral, "erro", "Por favor, preencha os campos corretamente.");
        if (btnSalvar) btnSalvar.disabled = false;
        return;
      }

      const dadosAtualizados = {
        nome: nomeInput.value.trim(),
        email: emailInput.value.trim(),
        cpf: limparMascara(cpfInput.value),
        cep: limparMascara(cepInput.value),
        logradouro: logradouroInput.value.trim(),
        bairro: bairroInput.value.trim(),
        cidade: cidadeInput.value.trim(),
        estado: estadoInput.value.trim()
      };

      // Só atualizar senha se foi fornecida
      if (senhaInput && senhaInput.value.trim()) {
        dadosAtualizados.senha = senhaInput.value;
      }

      try {
        // Verificar se o email já existe em outro usuário
        const usuarioExistente = userService.getByEmail(dadosAtualizados.email);
        if (usuarioExistente && usuarioExistente.id !== usuario.id) {
          throw new Error("Este email já está sendo usado por outro usuário.");
        }

        const usuarioAtualizado = userService.update(usuario.id, dadosAtualizados);
        
        // Atualizar dados da sessão
        localStorage.setItem("currentUser", JSON.stringify({
          id: usuarioAtualizado.id,
          nome: usuarioAtualizado.nome,
          email: usuarioAtualizado.email
        }));
        
        if (mensagemGeral) exibirMensagem(mensagemGeral, "sucesso", "Dados atualizados com sucesso!");
        if (senhaInput) senhaInput.value = "";
      } catch (error) {
        if (mensagemGeral) exibirMensagem(mensagemGeral, "erro", `Erro ao salvar alterações: ${error.message}`);
      } finally {
        if (btnSalvar) btnSalvar.disabled = false;
      }
    });
  }

  if (btnExcluir) {
    btnExcluir.addEventListener("click", async () => {
      if (!confirm("Tem certeza que deseja excluir sua conta? Esta ação é irreversível.")) {
        return;
      }
      btnExcluir.disabled = true;
      if (mensagemGeral) exibirMensagem(mensagemGeral, "", "");

      try {
        const sucesso = userService.delete(usuario.id);
        if (!sucesso) {
          throw new Error("Erro ao excluir conta.");
        }

        localStorage.removeItem("currentUser");
        if (mensagemGeral) exibirMensagem(mensagemGeral, "sucesso", "Conta excluída com sucesso. Redirecionando...");
        setTimeout(() => {
          window.location.href = "../index.html";
        }, 1500);
      } catch (error) {
        if (mensagemGeral) exibirMensagem(mensagemGeral, "erro", `Erro ao excluir conta: ${error.message}`);
      } finally {
        btnExcluir.disabled = false;
      }
    });
  }

  if (btnLogout) {
    btnLogout.addEventListener("click", () => {
      localStorage.removeItem("currentUser");
      window.location.href = "../index.html";
    });
  }
});