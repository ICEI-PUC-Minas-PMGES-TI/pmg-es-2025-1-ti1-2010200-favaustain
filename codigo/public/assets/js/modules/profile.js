import { aplicarMascaraCPF, aplicarMascaraCEP, limparMascara, exibirMensagem, exibirErroInput, limparErroInput, validarEmail, validarSenha, validarCPF, validarCEP } from './utils.js';
import { userService } from './db-service.js';
import { buscarCep } from './cep.js';

document.addEventListener("DOMContentLoaded", async () => {
  const usuarioSessao = JSON.parse(localStorage.getItem("currentUser"));

  if (!usuarioSessao) {
    window.location.href = "/pages/login.html";
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

  try {
    const usuarioCompleto = await userService.getById(usuarioSessao.id);
    if (!usuarioCompleto) {
        throw new Error("Usuário não encontrado.");
    }

    const inputs = [nomeInput, emailInput, senhaInput, cpfInput, cepInput, logradouroInput, bairroInput, cidadeInput, estadoInput];

    inputs.forEach(input => {
        if (input) {
        input.addEventListener("input", () => limparErroInput(input));
        }
    });

    if (nomeInput) nomeInput.value = usuarioCompleto.nome || "";
    if (emailInput) emailInput.value = usuarioCompleto.email || "";
    if (cpfInput) cpfInput.value = aplicarMascaraCPF(usuarioCompleto.cpf || "");
    if (cepInput && usuarioCompleto.endereco) cepInput.value = aplicarMascaraCEP(usuarioCompleto.endereco.cep || "");
    if (logradouroInput && usuarioCompleto.endereco) logradouroInput.value = usuarioCompleto.endereco.logradouro || "";
    if (bairroInput && usuarioCompleto.endereco) bairroInput.value = usuarioCompleto.endereco.bairro || "";
    if (cidadeInput && usuarioCompleto.endereco) cidadeInput.value = usuarioCompleto.endereco.cidade || "";
    if (estadoInput && usuarioCompleto.endereco) estadoInput.value = usuarioCompleto.endereco.estado || "";

    if (cpfInput) {
        cpfInput.addEventListener("input", (e) => {
        e.target.value = aplicarMascaraCPF(e.target.value);
        });
    }

    if (cepInput) {
        cepInput.addEventListener("input", (e) => {
        e.target.value = aplicarMascaraCEP(e.target.value);
        });
        
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
        // Removendo a adição do link "Minhas Empresas" aqui, pois a página será removida.
        // const divButtons = document.createElement('div');
        // divButtons.className = 'mt-3'; 
        // const linkMinhasEmpresas = document.createElement('a');
        // linkMinhasEmpresas.href = '/pages/minhas-empresas.html';
        // linkMinhasEmpresas.className = 'btn btn-outline';
        // linkMinhasEmpresas.textContent = 'Minhas Empresas';
        // divButtons.appendChild(linkMinhasEmpresas);
        // form.insertBefore(divButtons, btnSalvar.nextElementSibling); 

        form.addEventListener("submit", async (e) => {
        e.preventDefault();
        if (btnSalvar) btnSalvar.disabled = true;
        if (mensagemGeral) exibirMensagem(mensagemGeral, "", "");

        let formularioValido = true;
        
        if (!formularioValido) {
            if (mensagemGeral) exibirMensagem(mensagemGeral, "erro", "Por favor, preencha os campos corretamente.");
            if (btnSalvar) btnSalvar.disabled = false;
            return;
        }

        const dadosAtualizados = {
            nome: nomeInput.value.trim(),
            email: emailInput.value.trim(),
            cpf: limparMascara(cpfInput.value),
            endereco: {
                cep: limparMascara(cepInput.value),
                logradouro: logradouroInput.value.trim(),
                bairro: bairroInput.value.trim(),
                cidade: cidadeInput.value.trim(),
                estado: estadoInput.value.trim()
            }
        };

        if (senhaInput && senhaInput.value.trim()) {
            if(validarSenha(senhaInput.value)) {
                dadosAtualizados.senha = senhaInput.value;
            } else {
                exibirErroInput(senhaInput, "Senha deve ter min. 8 caracteres, maiúscula, minúscula, número e símbolo."); 
                formularioValido = false;
            }
        }

        if(!formularioValido) {
            if (btnSalvar) btnSalvar.disabled = false;
            return;
        }

        try {
            const usuarioExistente = await userService.getByEmail(dadosAtualizados.email);
            if (usuarioExistente && usuarioExistente.id !== usuarioCompleto.id) {
            throw new Error("Este email já está sendo usado por outro usuário.");
            }

            const usuarioAtualizado = await userService.update(usuarioCompleto.id, dadosAtualizados);
            
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

        try {
            await userService.delete(usuarioCompleto.id);
            localStorage.removeItem("currentUser");
            
            if (mensagemGeral) exibirMensagem(mensagemGeral, "sucesso", "Conta excluída com sucesso. Redirecionando...");
            setTimeout(() => {
            window.location.href = "/";
            }, 1500);
        } catch (error) {
            if (mensagemGeral) exibirMensagem(mensagemGeral, "erro", `Erro ao excluir conta: ${error.message}`);
            btnExcluir.disabled = false;
        }
        });
    }

    if (btnLogout) {
        btnLogout.addEventListener("click", () => {
        localStorage.removeItem("currentUser");
        window.location.href = "/";
        });
    }

  } catch (error) {
    localStorage.removeItem("currentUser");
    window.location.href = "/pages/login.html";
  }
});