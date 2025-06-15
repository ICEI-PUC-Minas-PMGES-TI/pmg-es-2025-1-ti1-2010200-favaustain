export function aplicarMascaraCPF(valor) {
  // Remove tudo que não é dígito e limita a 11 caracteres
  valor = valor.replace(/\D/g, "").substring(0, 11);
  return valor.replace(/(\d{3})(\d)/, "$1.$2")
              .replace(/(\d{3})(\d)/, "$1.$2")
              .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
}

export function aplicarMascaraCEP(valor) {
  // Remove tudo que não é dígito e limita a 8 caracteres
  valor = valor.replace(/\D/g, "").substring(0, 8);
  return valor.replace(/(\d{5})(\d{1,3})$/, "$1-$2");
}

export function validarCPF(cpf) {
  cpf = cpf.replace(/\D/g, "");
  
  if (cpf.length !== 11) return false;
  
  // Verifica se todos os dígitos são iguais
  if (/^(\d)\1{10}$/.test(cpf)) return false;
  
  // Validação do primeiro dígito verificador
  let soma = 0;
  for (let i = 0; i < 9; i++) {
    soma += parseInt(cpf.charAt(i)) * (10 - i);
  }
  let resto = 11 - (soma % 11);
  if (resto === 10 || resto === 11) resto = 0;
  if (resto !== parseInt(cpf.charAt(9))) return false;
  
  // Validação do segundo dígito verificador
  soma = 0;
  for (let i = 0; i < 10; i++) {
    soma += parseInt(cpf.charAt(i)) * (11 - i);
  }
  resto = 11 - (soma % 11);
  if (resto === 10 || resto === 11) resto = 0;
  if (resto !== parseInt(cpf.charAt(10))) return false;
  
  return true;
}

export function validarCEP(cep) {
  cep = cep.replace(/\D/g, "");
  return cep.length === 8 && /^\d{8}$/.test(cep);
}

export function limparMascara(valor) {
  return valor.replace(/\D/g, "");
}

export function exibirMensagem(elemento, tipo, texto) {
  elemento.textContent = texto;
  elemento.className = `mensagem ${tipo}`;
  setTimeout(() => {
    elemento.className = 'mensagem';
    elemento.textContent = '';
  }, 5000);
}

export function exibirErroInput(inputElement, mensagem) {
  const erroSpan = inputElement.nextElementSibling;
  if (erroSpan && erroSpan.classList.contains('erro-mensagem')) {
    erroSpan.textContent = mensagem;
    erroSpan.classList.add('visivel');
    inputElement.classList.add('invalido');
  }
}

export function limparErroInput(inputElement) {
  const erroSpan = inputElement.nextElementSibling;
  if (erroSpan && erroSpan.classList.contains('erro-mensagem')) {
    erroSpan.textContent = '';
    erroSpan.classList.remove('visivel');
    inputElement.classList.remove('invalido');
  }
}

export function validarEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(String(email).toLowerCase());
}

export function validarSenha(senha) {
  const re = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  return re.test(senha);
}