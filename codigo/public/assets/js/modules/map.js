// mapa.js - Versão corrigida com dados fictícios

// Variáveis globais
let map;
let markers = [];
let directionsService;
let directionsRenderer;

// Dados fictícios de empresas com coordenadas reais
const empresas = [
  {
    id: 1,
    nome: "EcoSolar Brasil",
    tipo: "Instaladora",
    tipoEnergia: "Solar",
    lat: -23.5505,
    lng: -46.6333,
    contato: {
      endereco: "Rua das Palmeiras, 123 - São Paulo, SP",
      telefone: "(11) 3456-7890",
      email: "contato@ecosolarbrasil.com.br"
    },
    imagem: "https://maps.google.com/mapfiles/ms/icons/green-dot.png"
  },
  {
    id: 2,
    nome: "GreenPower Soluções",
    tipo: "Distribuidora",
    tipoEnergia: "Híbrida",
    lat: -22.9068,
    lng: -43.1729,
    contato: {
      endereco: "Av. Atlântica, 456 - Rio de Janeiro, RJ",
      telefone: "(21) 2345-6789",
      email: "info@greenpower.com.br"
    },
    imagem: "https://maps.google.com/mapfiles/ms/icons/blue-dot.png"
  },
  {
    id: 3,
    nome: "SunTech Energia",
    tipo: "Consultoria",
    tipoEnergia: "Solar",
    lat: -19.9167,
    lng: -43.9345,
    contato: {
      endereco: "Rua da Esperança, 789 - Belo Horizonte, MG",
      telefone: "(31) 3456-7890",
      email: "social@suntech.com.br"
    },
    imagem: "https://maps.google.com/mapfiles/ms/icons/yellow-dot.png"
  },
  {
    id: 4,
    nome: "InovaSolar Tech",
    tipo: "Instaladora",
    tipoEnergia: "Solar",
    lat: -23.5629,
    lng: -46.6544,
    contato: {
      endereco: "Hub de Inovação, 321 - São Paulo, SP",
      telefone: "(11) 9876-5432",
      email: "hello@inovasolar.tech"
    },
    imagem: "https://maps.google.com/mapfiles/ms/icons/green-dot.png"
  },
  {
    id: 5,
    nome: "EnergiaPop",
    tipo: "Distribuidora",
    tipoEnergia: "Solar",
    lat: -3.7319,
    lng: -38.5267,
    contato: {
      endereco: "Rua do Futuro, 654 - Fortaleza, CE",
      telefone: "(85) 3210-9876",
      email: "atendimento@energiapop.com.br"
    },
    imagem: "https://maps.google.com/mapfiles/ms/icons/blue-dot.png"
  },
  {
    id: 6,
    nome: "SolarFlex Solutions",
    tipo: "Consultoria",
    tipoEnergia: "Híbrida",
    lat: -27.5954,
    lng: -48.5480,
    contato: {
      endereco: "Av. Inovação, 987 - Florianópolis, SC",
      telefone: "(47) 3456-7890",
      email: "contato@solarflex.com.br"
    },
    imagem: "https://maps.google.com/mapfiles/ms/icons/yellow-dot.png"
  },
  {
    id: 7,
    nome: "Solar Pioneira Ltda",
    tipo: "Instaladora",
    tipoEnergia: "Solar",
    lat: -23.5475,
    lng: -46.6361,
    contato: {
      endereco: "Rua dos Pioneiros, 100 - São Paulo, SP",
      telefone: "(11) 2345-6789",
      email: "institucional@solarpioneira.com.br"
    },
    imagem: "https://maps.google.com/mapfiles/ms/icons/green-dot.png"
  },
  {
    id: 8,
    nome: "BrasilSolar Energia",
    tipo: "Distribuidora",
    tipoEnergia: "Eólica",
    lat: -15.7801,
    lng: -47.9292,
    contato: {
      endereco: "SQN 123, Bloco A - Brasília, DF",
      telefone: "(61) 3456-7890",
      email: "projetos@brasilsolar.com.br"
    },
    imagem: "https://maps.google.com/mapfiles/ms/icons/red-dot.png"
  },
  {
    id: 9,
    nome: "TradSolar Engenharia",
    tipo: "Consultoria",
    tipoEnergia: "Solar",
    lat: -22.9056,
    lng: -47.0608,
    contato: {
      endereco: "Rua da Engenharia, 456 - Campinas, SP",
      telefone: "(19) 3456-7890",
      email: "engenharia@tradsolar.com.br"
    },
    imagem: "https://maps.google.com/mapfiles/ms/icons/yellow-dot.png"
  },
  {
    id: 10,
    nome: "VentoSolar Nordeste",
    tipo: "Instaladora",
    tipoEnergia: "Eólica",
    lat: -8.0476,
    lng: -34.8770,
    contato: {
      endereco: "Av. Boa Viagem, 1500 - Recife, PE",
      telefone: "(81) 3333-4444",
      email: "contato@ventosolar.com.br"
    },
    imagem: "https://maps.google.com/mapfiles/ms/icons/red-dot.png"
  }
];

// Função principal
function initMap() {
  try {
    // Esconde spinner de carregamento
    const spinner = document.getElementById('loading-spinner');
    if (spinner) spinner.style.display = 'none';
    
    // Inicializa o mapa
    map = new google.maps.Map(document.getElementById("map"), {
      center: { lat: -15.788, lng: -47.879 }, // Centro do Brasil
      zoom: 5,
      styles: [
        {
          featureType: "all",
          stylers: [{ saturation: -20 }, { lightness: 10 }]
        },
        {
          featureType: "road.highway",
          elementType: "geometry",
          stylers: [{ color: "#2563eb" }]
        }
      ]
    });

    // Inicializa serviços de rota
    directionsService = new google.maps.DirectionsService();
    directionsRenderer = new google.maps.DirectionsRenderer({
      map: map,
      panel: document.getElementById("route-panel"),
      suppressMarkers: false,
      polylineOptions: {
        strokeColor: "#2563eb",
        strokeWeight: 4
      }
    });

    // Configurações iniciais
    adicionarMarcadores(empresas);
    atualizarListaParceiros(empresas);
    aplicarEventosDeFiltro();
    aplicarEventoCalculoRota();

    console.log("Mapa inicializado com sucesso!");

  } catch (error) {
    console.error("Erro ao inicializar mapa:", error);
    const mapElement = document.getElementById("map");
    if (mapElement) {
      mapElement.innerHTML = `
        <div class="alert alert-danger m-3">
          <h5>Erro ao carregar o mapa</h5>
          <p>Não foi possível carregar o Google Maps. Verifique sua conexão com a internet.</p>
        </div>
      `;
    }
  }
}

// Função para adicionar marcadores
function adicionarMarcadores(lista) {
  // Limpa marcadores existentes
  markers.forEach(marker => marker.setMap(null));
  markers = [];

  lista.forEach(empresa => {
    if (!empresa.lat || !empresa.lng) {
      console.warn(`Empresa ${empresa.nome} sem coordenadas válidas`);
      return;
    }

    const marker = new google.maps.Marker({
      position: { lat: empresa.lat, lng: empresa.lng },
      map: map,
      title: empresa.nome,
      icon: {
        url: empresa.imagem || "https://maps.google.com/mapfiles/ms/icons/green-dot.png",
        scaledSize: new google.maps.Size(32, 32),
        anchor: new google.maps.Point(16, 32)
      }
    });

    const infowindow = new google.maps.InfoWindow({
      content: `
        <div class="map-popup" style="min-width: 250px;">
          <h6 style="color: #2563eb; margin-bottom: 10px;">${empresa.nome}</h6>
          <div class="popup-content">
            <p style="margin: 5px 0;"><strong>Tipo:</strong> ${empresa.tipo}</p>
            <p style="margin: 5px 0;"><strong>Energia:</strong> ${empresa.tipoEnergia}</p>
            <p style="margin: 5px 0;"><strong>Telefone:</strong> ${empresa.contato.telefone}</p>
            <p style="margin: 5px 0; font-size: 0.9em;">${empresa.contato.endereco}</p>
            <div style="margin-top: 10px; display: flex; gap: 5px;">
              <button class="btn btn-sm btn-primary calcular-rota-btn" 
                      data-lat="${empresa.lat}" 
                      data-lng="${empresa.lng}"
                      style="font-size: 0.8em;">
                📍 Rota
              </button>
              <button class="btn btn-sm btn-outline-success contato-btn" 
                      data-telefone="${empresa.contato.telefone}"
                      style="font-size: 0.8em;">
                📞 Contato
              </button>
            </div>
          </div>
        </div>
      `
    });

    marker.addListener("click", () => {
      // Fecha outras infowindows
      markers.forEach(m => {
        if (m.infowindow) m.infowindow.close();
      });
      infowindow.open(map, marker);
      marker.infowindow = infowindow;
      
      // Adiciona event listeners aos botões do popup
      setTimeout(() => {
        const rotaBtn = document.querySelector('.calcular-rota-btn');
        const contatoBtn = document.querySelector('.contato-btn');
        
        if (rotaBtn) {
          rotaBtn.addEventListener('click', () => {
            calcularRotaParaEmpresa(empresa.lat, empresa.lng);
          });
        }
        
        if (contatoBtn) {
          contatoBtn.addEventListener('click', () => {
            const telefone = empresa.contato.telefone.replace(/\D/g, '');
            const mensagem = `Olá! Vi vocês no mapa do Favsustein e gostaria de saber mais sobre os serviços da ${empresa.nome}.`;
            const whatsappUrl = `https://wa.me/55${telefone}?text=${encodeURIComponent(mensagem)}`;
            window.open(whatsappUrl, '_blank');
          });
        }
      }, 100);
    });

    markers.push(marker);
  });
}

// Função para atualizar a lista de empresas
function atualizarListaParceiros(lista) {
  const ul = document.getElementById("partner-list");
  if (!ul) return;
  
  ul.innerHTML = lista.length ? "" : '<li class="list-group-item">Nenhuma empresa encontrada</li>';

  lista.forEach(empresa => {
    const li = document.createElement("li");
    li.className = "list-group-item list-group-item-action";
    li.style.cursor = "pointer";
    li.innerHTML = `
      <div class="d-flex justify-content-between align-items-center">
        <div>
          <strong style="color: #2563eb;">${empresa.nome}</strong>
          <div class="text-muted small">
            ${empresa.tipo} • ${empresa.tipoEnergia}
          </div>
          <div class="text-muted" style="font-size: 0.8em;">
            ${empresa.contato.telefone}
          </div>
        </div>
        <button class="btn btn-sm btn-outline-primary ver-no-mapa-btn" 
                data-lat="${empresa.lat}" 
                data-lng="${empresa.lng}"
                data-nome="${empresa.nome}">
          📍 Ver
        </button>
      </div>
    `;

    // Event listener para o botão "Ver no Mapa"
    li.querySelector('.ver-no-mapa-btn').addEventListener('click', (e) => {
      e.stopPropagation();
      map.setCenter({ lat: empresa.lat, lng: empresa.lng });
      map.setZoom(15);
      
      // Encontra e clica no marcador correspondente
      const marker = markers.find(m => 
        m.getPosition().lat() === empresa.lat && 
        m.getPosition().lng() === empresa.lng
      );
      if (marker) {
        google.maps.event.trigger(marker, 'click');
      }
    });

    ul.appendChild(li);
  });
}

// Funções auxiliares
function aplicarEventosDeFiltro() {
  const searchBox = document.getElementById("searchBox");
  const filtroCategoria = document.getElementById("filtroCategoria");
  const filtroTipo = document.getElementById("filtroTipo");

  if (searchBox) searchBox.addEventListener("input", aplicarFiltros);
  if (filtroCategoria) filtroCategoria.addEventListener("change", aplicarFiltros);
  if (filtroTipo) filtroTipo.addEventListener("change", aplicarFiltros);
}

function aplicarFiltros() {
  const searchBox = document.getElementById("searchBox");
  const filtroCategoria = document.getElementById("filtroCategoria");
  const filtroTipo = document.getElementById("filtroTipo");

  const busca = searchBox ? searchBox.value.toLowerCase() : "";
  const categoria = filtroCategoria ? filtroCategoria.value : "";
  const tipo = filtroTipo ? filtroTipo.value : "";

  const filtradas = empresas.filter(empresa => 
    empresa.nome.toLowerCase().includes(busca) &&
    (categoria === "" || empresa.tipoEnergia === categoria) &&
    (tipo === "" || empresa.tipo === tipo)
  );

  adicionarMarcadores(filtradas);
  atualizarListaParceiros(filtradas);
}

function calcularRotaParaEmpresa(lat, lng) {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const origem = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };
        calcularERenderizarRota(origem, { lat, lng });
      },
      () => {
        // Fallback para São Paulo se não conseguir localização
        const origem = { lat: -23.5505, lng: -46.6333 };
        calcularERenderizarRota(origem, { lat, lng });
      }
    );
  } else {
    // Fallback para São Paulo
    const origem = { lat: -23.5505, lng: -46.6333 };
    calcularERenderizarRota(origem, { lat, lng });
  }
}

function calcularERenderizarRota(origem, destino) {
  if (!directionsService || !directionsRenderer) {
    console.error("Serviços de direção não inicializados");
    return;
  }

  directionsService.route({
    origin: origem,
    destination: destino,
    travelMode: google.maps.TravelMode.DRIVING,
    unitSystem: google.maps.UnitSystem.METRIC
  }, (response, status) => {
    const routePanel = document.getElementById("route-panel");
    if (status === "OK") {
      directionsRenderer.setDirections(response);
      if (routePanel) {
        routePanel.innerHTML = '<div class="alert alert-success">Rota calculada com sucesso!</div>';
      }
    } else {
      console.error("Erro ao calcular rota:", status);
      if (routePanel) {
        routePanel.innerHTML = `
          <div class="alert alert-warning">
            ${status === "ZERO_RESULTS" ? "Nenhuma rota encontrada" : "Erro ao calcular rota"}
          </div>
        `;
      }
    }
  });
}

function aplicarEventoCalculoRota() {
  const calculateBtn = document.getElementById("calculate-route");
  if (!calculateBtn) return;

  calculateBtn.addEventListener("click", () => {
    const origemInput = document.getElementById("origem-input");
    const destinoInput = document.getElementById("destino-input");
    const routePanel = document.getElementById("route-panel");

    if (!origemInput || !destinoInput) return;

    const origem = origemInput.value.trim();
    const destino = destinoInput.value.trim();

    if (!origem || !destino) {
      if (routePanel) {
        routePanel.innerHTML = `
          <div class="alert alert-warning">
            Por favor, preencha tanto a origem quanto o destino
          </div>
        `;
      }
      return;
    }

    calcularERenderizarRota(origem, destino);
  });
}

// Garante que a função initMap está disponível globalmente
window.initMap = initMap;

// Inicialização alternativa caso o callback do Google Maps falhe
document.addEventListener('DOMContentLoaded', () => {
  // Aguarda um pouco para o Google Maps carregar
  setTimeout(() => {
    if (typeof google !== 'undefined' && google.maps && !map) {
      initMap();
    }
  }, 1000);
});