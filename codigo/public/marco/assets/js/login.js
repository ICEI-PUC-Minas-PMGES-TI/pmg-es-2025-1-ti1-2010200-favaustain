document.getElementById("loginForm").addEventListener("submit", async function (e) {
  e.preventDefault()
  const email = document.getElementById("login").value
  const senha = document.getElementById("senha").value

  const resposta = await fetch("http://localhost:3000/usuarios")
  const usuarios = await resposta.json()

  const usuario = usuarios.find(u => u.email === email && u.senha === senha)

  if (usuario) {
    localStorage.setItem("usuarioLogado", JSON.stringify(usuario))
    window.location.href = "perfil.html"
  } else {
    document.getElementById("mensagem-erro").textContent = "Email ou senha inválidos"
  }
})
