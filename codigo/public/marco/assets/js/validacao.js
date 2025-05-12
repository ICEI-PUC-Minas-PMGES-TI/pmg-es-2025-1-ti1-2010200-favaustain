document.getElementById('cpf').addEventListener('input', function(e) {
  let value = e.target.value.replace(/\D/g, '');
  if (value.length > 3) value = value.replace(/^(\d{3})/, '$1.');
  if (value.length > 6) value = value.replace(/^(\d{3})\.(\d{3})/, '$1.$2.');
  if (value.length > 9) value = value.replace(/^(\d{3})\.(\d{3})\.(\d{3})/, '$1.$2.$3-');
  e.target.value = value.substring(0, 14);
});

document.getElementById('cep').addEventListener('input', function(e) {
  e.target.value = e.target.value.replace(/\D/g, '').substring(0, 8);
});

document.getElementById('cadastroForm').addEventListener('submit', async function(e) {
  e.preventDefault();

  const cpf = document.getElementById('cpf').value.replace(/\D/g, '');
  const email = document.getElementById('email').value.trim();

  if (!validarEmail(email)) {
    alert('E-mail inválido!');
    return;
  }

  if (cpf.length !== 11 || !validarCPF(cpf)) {
    alert('CPF inválido!');
    return;
  }

  alert('Cadastro realizado com sucesso!');
});

function validarEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email.toLowerCase());
}

function validarCPF(cpf) {
  if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) return false;
  let soma = 0;
  for (let i = 0; i < 9; i++) soma += parseInt(cpf.charAt(i)) * (10 - i);
  let resto = (soma * 10) % 11;
  if (resto === 10 || resto === 11) resto = 0;
  if (resto !== parseInt(cpf.charAt(9))) return false;
  soma = 0;
  for (let i = 0; i < 10; i++) soma += parseInt(cpf.charAt(i)) * (11 - i);
  resto = (soma * 10) % 11;
  if (resto === 10 || resto === 11) resto = 0;
  return resto === parseInt(cpf.charAt(10));
}
