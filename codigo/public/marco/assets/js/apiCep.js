document.addEventListener("DOMContentLoaded", () => {
  const cepInput = document.getElementById("cep");

  cepInput.addEventListener("blur", () => {
    const cep = cepInput.value.replace(/\D/g, "");
    if (cep.length !== 8) return;

    fetch(`https://viacep.com.br/ws/${cep}/json/`)
      .then(res => res.json())
      .then(data => {
        if (data.erro) {
          alert("CEP não encontrado.");
          return;
        }

        document.getElementById("logradouro").value = data.logradouro;
        document.getElementById("bairro").value = data.bairro;
        document.getElementById("cidade").value = data.localidade;
        document.getElementById("estado").value = data.uf;
      })
      .catch(() => {
        alert("Erro ao buscar CEP.");
      });
  });
});
