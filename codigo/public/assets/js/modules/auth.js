import { exibirMensagem, exibirErroInput, limparErroInput, validarEmail } from './utils.js';
import { userService } from './db-service.js';

document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.getElementById("loginForm");
  const emailInput = document.getElementById("email");
  const senhaInput = document.getElementById("senha");
  const btnLogin = document.getElementById("btnLogin");
  const mensagemGeral = document.getElementById("mensagem-geral");

  const inputs = [emailInput, senhaInput];

  inputs.forEach(input => {
    input.addEventListener("input", () => limparErroInput(input));
  });

  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    btnLogin.disabled = true;
    exibirMensagem(mensagemGeral, "", "");

    let formularioValido = true;

    if (!validarEmail(emailInput.value.trim())) { exibirErroInput(emailInput, "Email inválido."); formularioValido = false; }
    if (!senhaInput.value.trim()) { exibirErroInput(senhaInput, "A senha é obrigatória."); formularioValido = false; }

    if (!formularioValido) {
      exibirMensagem(mensagemGeral, "erro", "Por favor, preencha os campos corretamente.");
      btnLogin.disabled = false;
      return;
    }

    try {
      // Usa o serviço de usuário local em vez de API REST
      const usuario = userService.authenticate(emailInput.value.trim(), senhaInput.value.trim());

      if (usuario) {
        // Salva dados da sessão no localStorage (não sessionStorage para persistir)
        localStorage.setItem('currentUser', JSON.stringify({
          id: usuario.id,
          nome: usuario.nome,
          email: usuario.email
        }));
        
        exibirMensagem(mensagemGeral, "sucesso", "Login realizado com sucesso! Redirecionando...");
        setTimeout(() => {
          window.location.href = "perfil.html";
        }, 1500);
      } else {
        exibirMensagem(mensagemGeral, "erro", "Email ou senha inválidos.");
        exibirErroInput(emailInput, " ");
        exibirErroInput(senhaInput, " ");
      }
    } catch (error) {
      exibirMensagem(mensagemGeral, "erro", `Erro no login: ${error.message}`);
    } finally {
      btnLogin.disabled = false;
    }
  });
});