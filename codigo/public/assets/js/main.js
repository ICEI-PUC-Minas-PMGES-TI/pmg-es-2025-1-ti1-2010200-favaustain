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
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navList = document.querySelector('.nav-list');
    
    if (navList) {
        navList.querySelectorAll('.nav-link').forEach(link => link.classList.remove('active'));

        const user = localStorage.getItem('currentUser');
        if (user) {
            const existingMyCompaniesLink = navList.querySelector('a[href="/pages/minhas-empresas.html"]');
            if (!existingMyCompaniesLink) {
                const li = document.createElement('li');
                li.innerHTML = '<a href="/pages/minhas-empresas.html" class="nav-link">Minhas Empresas</a>';
                const cadastrarEmpresaLi = navList.querySelector('a[href="/pages/cadastro-empresas.html"]')?.closest('li');
                if (cadastrarEmpresaLi) {
                    navList.insertBefore(li, cadastrarEmpresaLi);
                } else {
                    navList.appendChild(li);
                }
            }
        } else {
            const existingMyCompaniesLink = navList.querySelector('a[href="/pages/minhas-empresas.html"]')?.closest('li');
            if (existingMyCompaniesLink) {
                navList.removeChild(existingMyCompaniesLink);
            }
        }

        navList.querySelectorAll('.nav-link').forEach(link => {
            const href = link.getAttribute('href').split('/').pop();
            if (href === currentPage) {
                link.classList.add('active');
            }
        });
    }

    this.setupMobileMenu();
  }

  setupMobileMenu() {
    const header = document.querySelector('.header');
    if (window.innerWidth <= 768) {
    }
  }

  setupAnimations() {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('fade-in-up');
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    document.querySelectorAll('.feature-card, .card, .form-container').forEach(el => {
      observer.observe(el);
    });
  }

  checkAuthStatus() {
    const user = localStorage.getItem('currentUser');
    const authButtons = document.querySelector('.auth-buttons');
    
    if (user && authButtons) {
      try {
        const userData = JSON.parse(user);
        const userName = userData.nome ? userData.nome.split(' ')[0] : 'Usuário';

        authButtons.innerHTML = `
          <a href="/pages/perfil.html" class="btn btn-outline">Olá, ${userName}</a>
          <button id="globalLogoutButton" class="btn btn-primary">Sair</button>
        `;
        
        document.getElementById('globalLogoutButton').addEventListener('click', () => this.logout());

      } catch (e) {
        localStorage.removeItem('currentUser');
        authButtons.innerHTML = `
            <a href="/pages/login.html" class="btn btn-outline">Login</a>
            <a href="/pages/cadastro.html" class="btn btn-primary">Cadastrar</a>
        `;
      }
    } else {
         authButtons.innerHTML = `
            <a href="/pages/login.html" class="btn btn-outline">Login</a>
            <a href="/pages/cadastro.html" class="btn btn-primary">Cadastrar</a>
        `;
    }
    this.setupNavigation();
  }

  logout() {
    localStorage.removeItem('currentUser');
    window.location.href = '/';
  }
}

document.addEventListener('DOMContentLoaded', () => {
  window.app = new FavsusteinApp();
});

if (typeof module !== 'undefined' && module.exports) {
  module.exports = FavsusteinApp;
}