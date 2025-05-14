document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("formulario");

  document.getElementById("cpf").addEventListener("input", (e) => {
    e.target.value = e.target.value.replace(/\D/g, "");
  });

  document.getElementById("cep").addEventListener("input", (e) => {
    e.target.value = e.target.value.replace(/\D/g, "");
  });

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    const usuario = {
      nome: form.nome.value.trim(),
      email: form.email.value.trim(),
      cpf: form.cpf.value.trim(),
      cep: form.cep.value.trim(),
      logradouro: form.logradouro.value.trim(),
      bairro: form.bairro.value.trim(),
      cidade: form.cidade.value.trim(),
      estado: form.estado.value.trim(),
    };

    if (!validarCPF(usuario.cpf)) {
      alert("CPF inválido.");
      return;
    }

    if (usuario.cep.length !== 8) {
      alert("CEP inválido.");
      return;
    }

    fetch("http://localhost:3000/usuarios", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(usuario)
    })
      .then(res => {
        if (res.ok) {
          alert("Usuário cadastrado com sucesso!");
          form.reset();
        } else {
          alert("Erro ao cadastrar usuário.");
        }
      })
      .catch(err => {
        alert("Erro na requisição.");
        console.error(err);
      });
  });

  function validarCPF(cpf) {
    cpf = cpf.replace(/\D/g, "");
    if (cpf.length !== 11 || /^(\d)\1+$/.test(cpf)) return false;

    let soma = 0;
    for (let i = 0; i < 9; i++) {
      soma += parseInt(cpf.charAt(i)) * (10 - i);
    }
    let dig1 = 11 - (soma % 11);
    dig1 = dig1 >= 10 ? 0 : dig1;

    soma = 0;
    for (let i = 0; i < 10; i++) {
      soma += parseInt(cpf.charAt(i)) * (11 - i);
    }
    let dig2 = 11 - (soma % 11);
    dig2 = dig2 >= 10 ? 0 : dig2;

    return dig1 === parseInt(cpf.charAt(9)) && dig2 === parseInt(cpf.charAt(10));
  }
});
