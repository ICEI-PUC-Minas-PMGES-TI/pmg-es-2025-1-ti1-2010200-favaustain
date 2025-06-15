// Arquivo principal de JavaScript para o Favsustein
// Gerencia funcionalidades globais e inicialização

class FavsusteinApp {
  constructor() {
    this.init();
  }

  init() {
    this.setupGlobalEventListeners();
    this.setupNavigation();
    this.setupAnimations();
    this.checkAuthStatus();
  }

  setupGlobalEventListeners() {
    // Smooth scroll para links internos
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
          target.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }
      });
    });

    // Fechar mensagens ao clicar
    document.addEventListener('click', (e) => {
      if (e.target.classList.contains('mensagem')) {
        e.target.style.opacity = '0';
        setTimeout(() => {
          e.target.style.visibility = 'hidden';
        }, 300);
      }
    });
  }

  setupNavigation() {
    // Destacar página atual na navegação
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
      const href = link.getAttribute('href');
      if (href === currentPage || 
          (currentPage === '' && href === 'index.html') ||
          (currentPage === 'index.html' && href === '../index.html')) {
        link.classList.add('active');
      }
    });

    // Menu mobile (se necessário)
    this.setupMobileMenu();
  }

  setupMobileMenu() {
    // Implementar menu mobile responsivo se necessário
    const header = document.querySelector('.header');
    if (window.innerWidth <= 768) {
      // Lógica para menu mobile
    }
  }

  setupAnimations() {
    // Animações de entrada para elementos
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('fade-in-up');
        }
      });
    }, observerOptions);

    // Observar elementos que devem ter animação
    document.querySelectorAll('.feature-card, .card, .form-container').forEach(el => {
      observer.observe(el);
    });
  }

  checkAuthStatus() {
    // Verificar se o usuário está logado
    const user = localStorage.getItem('currentUser');
    const authButtons = document.querySelector('.auth-buttons');
    
    if (user && authButtons) {
      const userData = JSON.parse(user);
      authButtons.innerHTML = `
        <a href="pages/perfil.html" class="btn btn-outline">Olá, ${userData.nome}</a>
        <button onclick="app.logout()" class="btn btn-primary">Sair</button>
      `;
    }
  }

  logout() {
    localStorage.removeItem('currentUser');
    window.location.href = '../index.html';
  }

  // Utilitários globais
  showMessage(message, type = 'info') {
    const messageEl = document.getElementById('mensagem-geral') || 
                     document.querySelector('.mensagem');
    
    if (messageEl) {
      messageEl.textContent = message;
      messageEl.className = `mensagem ${type}`;
      messageEl.style.visibility = 'visible';
      messageEl.style.opacity = '1';

      // Auto-hide após 5 segundos
      setTimeout(() => {
        messageEl.style.opacity = '0';
        setTimeout(() => {
          messageEl.style.visibility = 'hidden';
        }, 300);
      }, 5000);
    }
  }

  formatCurrency(value) {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  }

  formatCPF(cpf) {
    return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
  }

  formatCEP(cep) {
    return cep.replace(/(\d{5})(\d{3})/, '$1-$2');
  }

  validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  }

  validateCPF(cpf) {
    cpf = cpf.replace(/[^\d]/g, '');
    if (cpf.length !== 11) return false;
    
    // Verificar se todos os dígitos são iguais
    if (/^(\d)\1{10}$/.test(cpf)) return false;
    
    // Validar dígitos verificadores
    let sum = 0;
    for (let i = 0; i < 9; i++) {
      sum += parseInt(cpf.charAt(i)) * (10 - i);
    }
    let digit = 11 - (sum % 11);
    if (digit === 10 || digit === 11) digit = 0;
    if (digit !== parseInt(cpf.charAt(9))) return false;
    
    sum = 0;
    for (let i = 0; i < 10; i++) {
      sum += parseInt(cpf.charAt(i)) * (11 - i);
    }
    digit = 11 - (sum % 11);
    if (digit === 10 || digit === 11) digit = 0;
    if (digit !== parseInt(cpf.charAt(10))) return false;
    
    return true;
  }
}

// Inicializar aplicação quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', () => {
  window.app = new FavsusteinApp();
});

// Exportar para uso em módulos
if (typeof module !== 'undefined' && module.exports) {
  module.exports = FavsusteinApp;
}

