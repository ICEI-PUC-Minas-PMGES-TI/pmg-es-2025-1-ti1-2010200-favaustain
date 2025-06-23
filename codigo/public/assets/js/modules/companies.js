import { companyService } from './db-service.js';

const empresasDataFicticia = [
  {
    id: 1,
    nome: "EcoSolar Brasil",
    categoria: "recomendada",
    descricao: "Especialista em energia solar fotovoltaica com mais de 10 anos de experiência no mercado brasileiro.",
    imagem: "../assets/img/empresa-recomendada-1.svg",
    servicos: [
      "Instalação de painéis solares residenciais",
      "Sistemas de energia solar comercial",
      "Manutenção e monitoramento",
      "Consultoria em eficiência energética",
      "Financiamento facilitado"
    ],
    contato: {
      email: "contato@ecosolarbrasil.com.br",
      telefone: "(11) 3456-7890",
      endereco: "Rua das Palmeiras, 123 - São Paulo, SP"
    },
    historico: "Fundada em 2013, a EcoSolar Brasil já instalou mais de 5.000 sistemas solares em todo o país, sendo reconhecida pela qualidade e confiabilidade de seus serviços.",
    avaliacao: 4.8,
    projetos: 5247,
    economia_media: "R$ 850/mês"
  },
  {
    id: 2,
    nome: "GreenPower Soluções",
    categoria: "recomendada",
    descricao: "Líder em soluções integradas de energia renovável e eficiência energética para residências e empresas.",
    imagem: "../assets/img/empresa-recomendada-2.svg",
    servicos: [
      "Energia solar fotovoltaica",
      "Sistemas de aquecimento solar",
      "LED e iluminação eficiente",
      "Automação residencial",
      "Auditoria energética"
    ],
    contato: {
      email: "info@greenpower.com.br",
      telefone: "(21) 2345-6789",
      endereco: "Av. Atlântica, 456 - Rio de Janeiro, RJ"
    },
    historico: "Com 15 anos de atuação, a GreenPower é pioneira em soluções sustentáveis, tendo economizado mais de R$ 50 milhões em contas de energia para seus clientes.",
    avaliacao: 4.9,
    projetos: 3890,
    economia_media: "R$ 920/mês"
  },
  {
    id: 3,
    nome: "SunTech Energia",
    categoria: "recomendada",
    descricao: "Tecnologia avançada em energia solar com foco em comunidades periféricas e projetos sociais.",
    imagem: "../assets/img/empresa-recomendada-3.svg",
    servicos: [
      "Energia solar comunitária",
      "Microgeração distribuída",
      "Projetos sociais de energia",
      "Capacitação técnica",
      "Financiamento popular"
    ],
    contato: {
      email: "social@suntech.com.br",
      telefone: "(31) 3456-7890",
      endereco: "Rua da Esperança, 789 - Belo Horizonte, MG"
    },
    historico: "Especializada em levar energia limpa para comunidades de baixa renda, a SunTech já beneficiou mais de 10.000 famílias com projetos de energia solar acessível.",
    avaliacao: 4.7,
    projetos: 2156,
    economia_media: "R$ 680/mês"
  },
  {
    id: 4,
    nome: "InovaSolar Tech",
    categoria: "nova",
    descricao: "Startup inovadora focada em soluções de energia solar inteligente com tecnologia IoT integrada.",
    imagem: "../assets/img/empresa-nova-1.svg",
    servicos: [
      "Painéis solares inteligentes",
      "Monitoramento via app",
      "Sistemas de armazenamento",
      "Integração com smart home",
      "Análise preditiva de consumo"
    ],
    contato: {
      email: "hello@inovasolar.tech",
      telefone: "(11) 9876-5432",
      endereco: "Hub de Inovação, 321 - São Paulo, SP"
    },
    historico: "Fundada em 2022 por engenheiros formados na USP, a InovaSolar traz as mais recentes tecnologias em energia solar com foco na experiência do usuário.",
    avaliacao: 4.6,
    projetos: 287,
    economia_media: "R$ 780/mês"
  },
  {
    id: 5,
    nome: "EnergiaPop",
    categoria: "nova",
    descricao: "Democratizando o acesso à energia solar através de soluções modulares e financiamento flexível.",
    imagem: "../assets/img/empresa-nova-2.svg",
    servicos: [
      "Kits solares modulares",
      "Instalação simplificada",
      "Financiamento sem burocracia",
      "Suporte técnico 24/7",
      "Garantia estendida"
    ],
    contato: {
      email: "atendimento@energiapop.com.br",
      telefone: "(85) 3210-9876",
      endereco: "Rua do Futuro, 654 - Fortaleza, CE"
    },
    historico: "Criada em 2023 com o objetivo de tornar a energia solar acessível para todos, a EnergiaPop já atende mais de 500 famílias no Nordeste.",
    avaliacao: 4.4,
    projetos: 523,
    economia_media: "R$ 590/mês"
  },
  {
    id: 6,
    nome: "SolarFlex Solutions",
    categoria: "nova",
    descricao: "Especializada em soluções flexíveis de energia solar para diferentes tipos de moradia e orçamento.",
    imagem: "../assets/img/empresa-nova-3.svg",
    servicos: [
      "Sistemas flexíveis",
      "Energia solar portátil",
      "Soluções para apartamentos",
      "Consultoria personalizada",
      "Manutenção preventiva"
    ],
    contato: {
      email: "contato@solarflex.com.br",
      telefone: "(47) 3456-7890",
      endereco: "Av. Inovação, 987 - Florianópolis, SC"
    },
    historico: "Nascida da necessidade de adaptar energia solar para diferentes realidades habitacionais, a SolarFlex inovou com soluções para apartamentos e casas pequenas.",
    avaliacao: 4.5,
    projetos: 412,
    economia_media: "R$ 650/mês"
  },
  {
    id: 7,
    nome: "Solar Pioneira Ltda",
    categoria: "pioneira",
    descricao: "Uma das primeiras empresas de energia solar do Brasil, com mais de 20 anos de tradição e inovação.",
    imagem: "../assets/img/empresa-pioneira-1.svg",
    servicos: [
      "Grandes projetos solares",
      "Consultoria especializada",
      "Pesquisa e desenvolvimento",
      "Treinamento profissional",
      "Certificação técnica"
    ],
    contato: {
      email: "institucional@solarpioneira.com.br",
      telefone: "(11) 2345-6789",
      endereco: "Rua dos Pioneiros, 100 - São Paulo, SP"
    },
    historico: "Fundada em 2003, foi uma das primeiras empresas a apostar na energia solar no Brasil, participando ativamente da regulamentação do setor e formação de profissionais.",
    avaliacao: 4.9,
    projetos: 8750,
    economia_media: "R$ 1.200/mês"
  },
  {
    id: 8,
    nome: "BrasilSolar Energia",
    categoria: "pioneira",
    descricao: "Pioneira em projetos de grande escala e desenvolvimento de tecnologia solar adaptada ao clima brasileiro.",
    imagem: "../assets/img/empresa-pioneira-2.svg",
    servicos: [
      "Usinas solares",
      "Projetos industriais",
      "Desenvolvimento tecnológico",
      "Consultoria regulatória",
      "Estudos de viabilidade"
    ],
    contato: {
      email: "projetos@brasilsolar.com.br",
      telefone: "(61) 3456-7890",
      endereco: "SQN 123, Bloco A - Brasília, DF"
    },
    historico: "Atuando desde 2005, a BrasilSolar participou da construção das primeiras usinas solares do país e desenvolveu tecnologias específicas para o clima tropical.",
    avaliacao: 4.8,
    projetos: 6543,
    economia_media: "R$ 1.450/mês"
  },
  {
    id: 9,
    nome: "TradSolar Engenharia",
    categoria: "pioneira",
    descricao: "Tradição em engenharia solar com foco em projetos customizados e soluções de alta performance.",
    imagem: "../assets/img/empresa-pioneira-3.svg",
    servicos: [
      "Engenharia customizada",
      "Projetos especiais",
      "Análise de performance",
      "Otimização de sistemas",
      "Consultoria técnica avançada"
    ],
    contato: {
      email: "engenharia@tradsolar.com.br",
      telefone: "(19) 3456-7890",
      endereco: "Rua da Engenharia, 456 - Campinas, SP"
    },
    historico: "Com mais de 18 anos de experiência, a TradSolar é reconhecida pela excelência em projetos de engenharia solar e pela formação de especialistas no setor.",
    avaliacao: 4.7,
    projetos: 4321,
    economia_media: "R$ 1.100/mês"
  }
];

document.addEventListener('DOMContentLoaded', () => {
  carregarEmpresas();
  adicionarEventListenersGlobais();
});

function carregarEmpresas() {
  let empresasData = companyService.getAll();

  if (empresasData.length === 0) {
      empresasData = empresasDataFicticia;
  }

  const recomendadasContainer = document.getElementById('recomendadas');
  if (recomendadasContainer) {
    const empresasRecomendadas = empresasData.filter(e => e.categoria === 'recomendada');
    recomendadasContainer.innerHTML = empresasRecomendadas.map(empresa => criarCardEmpresa(empresa)).join('');
  }

  const novasContainer = document.getElementById('novas');
  if (novasContainer) {
    const empresasNovas = empresasData.filter(e => e.categoria === 'nova');
    novasContainer.innerHTML = empresasNovas.map(empresa => criarCardEmpresa(empresa)).join('');
  }

  const pioneirasContainer = document.getElementById('pioneiras');
  if (pioneirasContainer) {
    const empresasPioneiras = empresasData.filter(e => e.categoria === 'pioneira');
    pioneirasContainer.innerHTML = empresasPioneiras.map(empresa => criarCardEmpresa(empresa)).join('');
  }
}

function criarCardEmpresa(empresa) {
  const estrelas = '★'.repeat(Math.floor(empresa.avaliacao)) + '☆'.repeat(5 - Math.floor(empresa.avaliacao));
  
  return `
    <div class="card" data-empresa-id="${empresa.id}">
      <div class="card-header">
        <img src="${empresa.imagem}" alt="Logo ${empresa.nome}" class="empresa-logo">
        <div class="empresa-badge ${empresa.categoria}">
          ${empresa.categoria === 'recomendada' ? 'Recomendada' : 
            empresa.categoria === 'nova' ? 'Nova' : 'Pioneira'}
        </div>
      </div>
      <div class="card-content">
        <h3 class="empresa-nome">${empresa.nome}</h3>
        <p class="empresa-descricao">${empresa.descricao}</p>
        <div class="empresa-stats">
          <div class="stat">
            <span class="stat-label">Avaliação:</span>
            <span class="stat-value">${estrelas} ${empresa.avaliacao}</span>
          </div>
          <div class="stat">
            <span class="stat-label">Projetos:</span>
            <span class="stat-value">${empresa.projetos.toLocaleString()}</span>
          </div>
          <div class="stat">
            <span class="stat-label">Economia média:</span>
            <span class="stat-value">${empresa.economia_media}</span>
          </div>
        </div>
        <div class="empresa-servicos">
          <strong>Principais serviços:</strong>
          <ul>
            ${empresa.servicos.slice(0, 3).map(servico => `<li>${servico}</li>`).join('')}
          </ul>
        </div>
      </div>
      <div class="card-footer">
        <button class="btn btn-primary btn-small btn-detalhes">Ver Detalhes</button>
        <button class="btn btn-outline btn-small btn-contato">Contato</button>
      </div>
    </div>
  `;
}

function abrirDetalhesEmpresa(empresaId) {
    let empresasData = companyService.getAll();
    if (empresasData.length === 0) {
        empresasData = empresasDataFicticia;
    }
    const empresa = empresasData.find(e => e.id == empresaId);
    if (!empresa) return;

    const modalOverlay = document.createElement('div');
    modalOverlay.className = 'modal-overlay';

    const modalContent = document.createElement('div');
    modalContent.className = 'modal-content';

    const modalHeader = document.createElement('div');
    modalHeader.className = 'modal-header';
    const h2 = document.createElement('h2');
    h2.textContent = empresa.nome;
    const closeButtonHeader = document.createElement('button');
    closeButtonHeader.className = 'modal-close';
    closeButtonHeader.innerHTML = '&times;';
    modalHeader.append(h2, closeButtonHeader);

    const modalBody = document.createElement('div');
    modalBody.className = 'modal-body';
    
    const secaoServicos = document.createElement('div');
    secaoServicos.className = 'secao';
    const h3Servicos = document.createElement('h3');
    h3Servicos.textContent = 'Serviços Oferecidos';
    const ulServicos = document.createElement('ul');
    ulServicos.className = 'servicos-lista';
    empresa.servicos.forEach(servicoText => {
        const li = document.createElement('li');
        li.textContent = servicoText;
        ulServicos.appendChild(li);
    });
    secaoServicos.append(h3Servicos, ulServicos);

    const secaoContato = document.createElement('div');
    secaoContato.className = 'secao';
    secaoContato.innerHTML = `
        <h3>Informações de Contato</h3>
        <div class="contato-info">
            <p><strong>Email:</strong> ${empresa.contato.email}</p>
            <p><strong>Telefone:</strong> ${empresa.contato.telefone}</p>
            <p><strong>Endereço:</strong> ${empresa.contato.endereco}</p>
        </div>`;

    const secaoSobre = document.createElement('div');
    secaoSobre.className = 'secao';
    secaoSobre.innerHTML = `
        <h3>Sobre a Empresa</h3>
        <p class="empresa-historico">${empresa.historico}</p>`;

    const infoPrincipal = document.createElement('div');
    infoPrincipal.className = 'empresa-info-principal';
    infoPrincipal.innerHTML = `
        <img src="${empresa.imagem}" alt="${empresa.nome}" class="empresa-logo-grande">
        <div class="empresa-resumo">
            <p class="empresa-descricao-completa">${empresa.descricao}</p>
            <div class="empresa-metricas">
                <div class="metrica">
                    <span class="metrica-numero">${empresa.avaliacao}</span>
                    <span class="metrica-label">Avaliação</span>
                </div>
                <div class="metrica">
                    <span class="metrica-numero">${empresa.projetos.toLocaleString()}</span>
                    <span class="metrica-label">Projetos</span>
                </div>
                <div class="metrica">
                    <span class="metrica-numero">${empresa.economia_media}</span>
                    <span class="metrica-label">Economia Média</span>
                </div>
            </div>
        </div>`;
    
    const empresaSeccao = document.createElement('div');
    empresaSeccao.className = 'empresa-secoes';
    empresaSeccao.append(secaoServicos, secaoContato, secaoSobre);

    const detalhesCompletos = document.createElement('div');
    detalhesCompletos.className = 'empresa-detalhes-completos';
    detalhesCompletos.append(infoPrincipal, empresaSeccao);
    modalBody.appendChild(detalhesCompletos);

    const modalFooter = document.createElement('div');
    modalFooter.className = 'modal-footer';
    const contatoButtonFooter = document.createElement('button');
    contatoButtonFooter.className = 'btn btn-primary btn-contato-modal';
    contatoButtonFooter.textContent = 'Entrar em Contato';
    
    modalFooter.append(contatoButtonFooter);

    modalContent.append(modalHeader, modalBody, modalFooter);
    modalOverlay.appendChild(modalContent);
    
    document.body.appendChild(modalOverlay);
    document.body.style.overflow = 'hidden';

    contatoButtonFooter.addEventListener('click', () => {
        entrarEmContato(empresa.id);
    });
  
    closeButtonHeader.addEventListener('click', fecharModal);
}

function entrarEmContato(empresaId) {
    let empresasData = companyService.getAll();
    if (empresasData.length === 0) {
        empresasData = empresasDataFicticia;
    }
    const empresa = empresasData.find(e => e.id == empresaId);
    if (!empresa) return;

    const mensagem = `Olá! Gostaria de saber mais sobre os serviços da ${empresa.nome}. Vi vocês no site Favsustein.`;
    const telefone = empresa.contato.telefone.replace(/\D/g, '');
    const whatsappUrl = `https://wa.me/55${telefone}?text=${encodeURIComponent(mensagem)}`;
  
    window.open(whatsappUrl, '_blank');
}

function fecharModal() {
  const modal = document.querySelector('.modal-overlay');
  if (modal) {
    modal.remove();
    document.body.style.overflow = 'auto';
  }
}

function adicionarEventListenersGlobais() {
  document.addEventListener('click', (event) => {
    const card = event.target.closest('.card');
    if (card) {
      if (event.target.closest('.btn-contato')) {
        event.stopPropagation();
        const empresaId = card.dataset.empresaId;
        entrarEmContato(empresaId);
      } else if (event.target.closest('.btn-detalhes') || !event.target.closest('button')) {
        const empresaId = card.dataset.empresaId;
        abrirDetalhesEmpresa(empresaId);
      }
    }
    if (event.target.matches('.modal-close')) {
      fecharModal();
    }
  });
}