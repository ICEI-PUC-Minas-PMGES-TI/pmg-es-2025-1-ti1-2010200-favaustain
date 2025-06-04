const usuario = JSON.parse(localStorage.getItem("usuarioLogado"))

if (!usuario) {
  window.location.href = "login.html"
}

const form = document.getElementById("perfilForm")
const campos = ["nome", "email", "senha", "cpf", "cep", "logradouro", "bairro", "cidade", "estado"]

campos.forEach(campo => {
  document.getElementById(campo).value = usuario[campo] || ""
})

form.addEventListener("submit", async function (e) {
  e.preventDefault()

  const dadosAtualizados = {}
  campos.forEach(campo => {
    dadosAtualizados[campo] = document.getElementById(campo).value
  })

  const resposta = await fetch(`http://localhost:3000/usuarios/${usuario.id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ id: usuario.id, ...dadosAtualizados })
  })

  if (resposta.ok) {
    alert("Dados atualizados com sucesso")
    localStorage.setItem("usuarioLogado", JSON.stringify({ id: usuario.id, ...dadosAtualizados }))
  }
})

document.getElementById("excluirConta").addEventListener("click", async function () {
  const confirmacao = confirm("Tem certeza que deseja excluir sua conta?")
  if (!confirmacao) return

  const resposta = await fetch(`http://localhost:3000/usuarios/${usuario.id}`, {
    method: "DELETE"
  })

  if (resposta.ok) {
    localStorage.removeItem("usuarioLogado")
    alert("Conta excluída com sucesso")
    window.location.href = "index.html"
  }
})
