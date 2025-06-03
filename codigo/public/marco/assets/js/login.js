document.getElementById('loginForm').addEventListener('submit', async function (e) {
  e.preventDefault();
  const login = document.getElementById('login').value;
  const senha = document.getElementById('senha').value;
  const mensagemErro = document.getElementById('mensagem-erro');

  try {
    const resposta = await fetch('http://localhost:3000/usuarios');
    const usuarios = await resposta.json();
    const usuarioEncontrado = usuarios.find(u => u.email === login && u.senha === senha);

    if (usuarioEncontrado) {
      localStorage.setItem('usuarioLogado', JSON.stringify(usuarioEncontrado));
      window.location.href = 'index.html';
    } else {
      mensagemErro.textContent = 'Login ou senha inválidos.';
    }
  } catch (erro) {
    mensagemErro.textContent = 'Erro ao conectar com o servidor.';
  }
});
