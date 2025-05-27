function aplicarMascaraCPF(valor) {
  valor = valor.replace(/\D/g, "").substring(0, 11);
  return valor.replace(/(\d{3})(\d)/, "$1.$2")
              .replace(/(\d{3})(\d)/, "$1.$2")
              .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
}

function aplicarMascaraCEP(valor) {
  valor = valor.replace(/\D/g, "").substring(0, 8);
  return valor.replace(/(\d{5})(\d{1,3})$/, "$1-$2");
}

function limparMascara(valor) {
  return valor.replace(/\D/g, "");
}

const form = document.getElementById("formulario");

form.addEventListener("submit", async function (e) {
  e.preventDefault();

  const nome = form.nome.value.trim();
  const email = form.email.value.trim();
  const senha = form.senha.value.trim();
  const cpf = limparMascara(form.cpf.value);
  const cep = limparMascara(form.cep.value);
  const logradouro = form.logradouro.value.trim();
  const bairro = form.bairro.value.trim();
  const cidade = form.cidade.value.trim();
  const estado = form.estado.value.trim();

  if (!nome || !email || !senha || !cpf || !cep || !logradouro || !bairro || !cidade || !estado) {
    alert("Por favor, preencha todos os campos.");
    return;
  }

  if (cpf.length !== 11 || cep.length !== 8) {
    alert("CPF ou CEP inválido.");
    return;
  }

  const novoUsuario = {
    nome,
    email,
    senha,
    cpf,
    cep,
    logradouro,
    bairro,
    cidade,
    estado
  };

  try {
    const resposta = await fetch("http://localhost:3000/usuarios", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(novoUsuario)
    });

    if (!resposta.ok) throw new Error();

    alert("Cadastro realizado com sucesso!");
    form.reset();
  } catch {
    alert("Erro ao salvar dados.");
  }
});

document.getElementById("cpf").addEventListener("input", e => {
  e.target.value = aplicarMascaraCPF(e.target.value);
});

document.getElementById("cep").addEventListener("input", e => {
  e.target.value = aplicarMascaraCEP(e.target.value);
});
