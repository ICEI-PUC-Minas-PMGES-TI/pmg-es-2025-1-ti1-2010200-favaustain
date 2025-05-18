document.addEventListener('DOMContentLoaded', () => {
  const path = window.location.pathname;

  if (path.includes('index.html') || path.endsWith('/')) {
    fetch('empresas.json')
      .then(res => res.json())
      .then(empresas => {
        ['recomendada', 'nova', 'pioneira'].forEach(categoria => {
          const container = document.getElementById(categoria + 's');
          empresas
            .filter(e => e.categoria === categoria)
            .forEach(e => {
              const card = document.createElement('div');
              card.className = 'card';
              card.innerHTML = `
                <a href="empresa-info.html?nome=${encodeURIComponent(e.nome)}&categoria=${e.categoria}" class="card-link">
                  <div class="card-img">
                    <img src="${e.imagem}" alt="Logo da ${e.nome}" />
                  </div>
                  <div class="card-content">
                    <h3>${e.nome}</h3>
                    <p>${e.descricao}</p>
                  </div>
                </a>
              `;
              container.appendChild(card);
            });
        });
      })
      .catch(err => console.error('Erro ao carregar empresas:', err));
  }

  if (path.includes('empresa-info.html')) carregarDetalhesEmpresa();
});

function carregarDetalhesEmpresa() {
  const urlParams = new URLSearchParams(window.location.search);
  const nomeEmpresa = urlParams.get('nome');
  const categoriaEmpresa = urlParams.get('categoria');

  if (!nomeEmpresa || !categoriaEmpresa) {
    window.location.href = 'index.html';
    return;
  }

  const empresaTitulo = document.getElementById('empresa-titulo');
  const empresaCategoria = document.getElementById('empresa-categoria');
  const empresaLogo = document.getElementById('empresa-logo');

  empresaTitulo.textContent = nomeEmpresa;

  const categorias = {
    recomendada: 'Empresa Recomendada',
    nova: 'Nova no Mercado',
    pioneira: 'Empresa Pioneira'
  };

  empresaCategoria.textContent = categorias[categoriaEmpresa] || categoriaEmpresa;

  fetch('empresas.json')
    .then(res => res.json())
    .then(empresas => {
      const empresa = empresas.find(e => e.nome === nomeEmpresa);
      if (!empresa) return;

      empresaLogo.innerHTML = `<img src="${empresa.imagem}" alt="${empresa.nome}" style="width: 100%; height: 100%;">`;

      const detalhes = document.querySelector('.empresa-detalhes');
      detalhes.innerHTML = `
        <h3>Serviços</h3>
        <ul>${empresa.servicos.map(s => `<li>${s}</li>`).join('')}</ul>

        <h3>Contatos</h3>
        <p>Email: ${empresa.contato.email}</p>
        <p>Telefone: ${empresa.contato.telefone}</p>
        <p>Endereço: ${empresa.contato.endereco}</p>

        <h3>Histórico</h3>
        <p>${empresa.historico}</p>
      `;
    })
    .catch(err => console.error('Erro ao carregar detalhes da empresa:', err));
}