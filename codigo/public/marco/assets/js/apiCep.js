document.getElementById('cep').addEventListener('blur', async function() {
  const cep = this.value.replace(/\D/g, '');
  if (cep.length !== 8) return;
  try {
    const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
    const data = await response.json();
    if (data.erro) throw new Error('CEP não encontrado');
    document.getElementById('logradouro').value = data.logradouro;
    document.getElementById('logradouro').dispatchEvent(new Event('input'));
  } catch (error) {
    alert('CEP inválido: ' + error.message);
  }
});
