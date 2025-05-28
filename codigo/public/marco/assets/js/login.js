document.getElementById("loginForm").addEventListener("submit", async function (e) {
  e.preventDefault();

  const email = e.target.email.value.trim();
  const senha = e.target.senha.value.trim();

  if (!email || !senha) {
    alert("Preencha todos os campos.");
    return;
  }

  try {
    const resposta = await fetch("http://localhost:3000/usuarios");
    const usuarios = await resposta.json();

    const usuarioValido = usuarios.find(
      u => u.email === email && u.senha === senha
    );

    if (usuarioValido) {
      alert("Login realizado com sucesso!");
      localStorage.setItem("usuarioLogado", JSON.stringify(usuarioValido));
    } else {
      alert("Email ou senha incorretos.");
    }
  } catch {
    alert("Erro ao tentar fazer login.");
  }
});
