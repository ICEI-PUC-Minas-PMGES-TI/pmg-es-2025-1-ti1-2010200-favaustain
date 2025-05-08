document.getElementById('cpf').addEventListener('input', function(e) {
  let value = e.target.value.replace(/\D/g, '');
  if (value.length > 3) value = value.replace(/^(\d{3})/, '$1.');
  if (value.length > 7) value = value.replace(/^(\d{3})\.(\d{3})/, '$1.$2.');
  if (value.length > 11) value = value.replace(/^(\d{3})\.(\d{3})\.(\d{3})/, '$1.$2.$3-');
  e.target.value = value.substring(0, 14);
});

document.getElementById('cadastroForm').addEventListener('submit', function(e) {
  e.preventDefault();
  const cpf = document.getElementById('cpf').value.replace(/\D/g, '');
  if (cpf.length !== 11 || !validarCPF(cpf)) {
    alert('CPF inválido!');
    return;
  }
  alert('Cadastro realizado com sucesso!');
});

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
