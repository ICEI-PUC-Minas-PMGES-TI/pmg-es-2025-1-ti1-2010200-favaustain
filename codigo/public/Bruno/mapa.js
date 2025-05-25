// mapa.js - Versão corrigida e otimizada

// Variáveis globais
let map;
let markers = [];
let directionsService;
let directionsRenderer;
let infoWindows = [];

// Configuração dos ícones
const icons = {
  Solar: {
    url: "https://maps.google.com/mapfiles/ms/icons/green-dot.png",
    scaledSize: new google.maps.Size(32, 32)
  },
  Eólica: {
    url: "https://maps.google.com/mapfiles/ms/icons/blue-dot.png",
    scaledSize: new google.maps.Size(32, 32)
  },
  Híbrida: {
    url: "https://maps.google.com/mapfiles/ms/icons/yellow-dot.png",
    scaledSize: new google.maps.Size(32, 32)
  },
  default: {
    url: "https://maps.google.com/mapfiles/ms/icons/red-dot.png",
    scaledSize: new google.maps.Size(32, 32)
  }
};

// Dados das empresas
const empresas = [
  { 
    nome: 'Eco Minas Energia', 
    lat: -19.905, 
    lng: -43.938, 
    categoria: 'Solar', 
    tipo: 'Instaladora',
    endereco: 'Av. Afonso Pena, 1000, Belo Horizonte - MG',
    telefone: '(31) 9999-9999'
  },
  { 
    nome: 'Vívuz Solar', 
    lat: -19.920, 
    lng: -43.940, 
    categoria: 'Solar', 
    tipo: 'Distribuidora',
    endereco: 'R. da Bahia, 200, Belo Horizonte - MG',
    telefone: '(31) 8888-8888'
  },
  { 
    nome: 'SunTech Solar', 
    lat: -19.910, 
    lng: -43.935, 
    categoria: 'Híbrida', 
    tipo: 'Consultoria',
    endereco: 'Av. do Contorno, 300, Belo Horizonte - MG',
    telefone: '(31) 7777-7777'
  },
  { 
    nome: 'Seg Energy BH', 
    lat: -19.915, 
    lng: -43.930, 
    categoria: 'Eólica', 
    tipo: 'Instaladora',
    endereco: 'R. São Paulo, 400, Belo Horizonte - MG',
    telefone: '(31) 6666-6666'
  },
  { 
    nome: 'Nova Luz Solar', 
    lat: -19.918, 
    lng: -43.928, 
    categoria: 'Solar', 
    tipo: 'Engenharia',
    endereco: 'Av. Amazonas, 500, Belo Horizonte - MG',
    telefone: '(31) 5555-5555'
  },
  { 
    nome: 'BH Sustentável', 
    lat: -19.912, 
    lng: -43.943, 
    categoria: 'Híbrida', 
    tipo: 'Manutenção',
    endereco: 'R. Tamoios, 600, Belo Horizonte - MG',
    telefone: '(31) 4444-4444'
  }
];

// Função principal de inicialização
function initMap() {
  // Verifica se o elemento do mapa existe
  const mapElement = document.getElementById("map");
  if (!mapElement) {
    console.error("Elemento #map não encontrado no DOM");
    return;
  }

  // Cria o mapa
  map = new google.maps.Map(mapElement, {
    center: { lat: -19.9208, lng: -43.9378 },
    zoom: 13,
    styles: [
      {
        "featureType": "all",
        "stylers": [
          { "saturation": -80 },
          { "lightness": 10 }
        ]
      },
      {
        "featureType": "road.highway",
        "elementType": "geometry",
        "stylers": [
          { "color": "#00ff44" }
        ]
      },
      {
        "featureType": "poi.business",
        "stylers": [
          { "visibility": "off" }
        ]
      }
    ]
  });

  // Inicializa serviços de rota
  directionsService = new google.maps.DirectionsService();
  directionsRenderer = new google.maps.DirectionsRenderer({
    map: map,
    panel: document.getElementById("route-panel"),
    suppressMarkers: false
  });

  // Adiciona marcadores e configura eventos
  adicionarMarcadores(empresas);
  atualizarListaParceiros(empresas);
  aplicarEventosDeFiltro();
  aplicarEventoCalculoRota();

  console.log("Mapa inicializado com sucesso");
}

// Adiciona marcadores no mapa
function adicionarMarcadores(lista) {
  // Limpa marcadores e infoWindows existentes
  markers.forEach(marker => marker.setMap(null));
  infoWindows.forEach(iw => iw.close());
  markers = [];
  infoWindows = [];

  lista.forEach(empresa => {
    const marker = new google.maps.Marker({
      position: { lat: empresa.lat, lng: empresa.lng },
      map: map,
      title: empresa.nome,
      icon: icons[empresa.categoria] || icons.default
    });

    const contentString = `
      <div style="padding: 10px; max-width: 250px;">
        <h5 style="margin-top: 0; color: #28a745;">${empresa.nome}</h5>
        <p><strong>Categoria:</strong> ${empresa.categoria}</p>
        <p><strong>Tipo:</strong> ${empresa.tipo}</p>
        <p><strong>Endereço:</strong> ${empresa.endereco}</p>
        <p><strong>Telefone:</strong> ${empresa.telefone}</p>
        <button onclick="window.calcularRotaParaEmpresa(${empresa.lat}, ${empresa.lng})" 
                style="background: #28a745; color: white; border: none; padding: 5px 10px; border-radius: 3px; cursor: pointer; margin-top: 8px;">
          <i class="bi bi-geo-alt"></i> Traçar rota
        </button>
      </div>
    `;

    const infowindow = new google.maps.InfoWindow({
      content: contentString
    });

    marker.addListener("click", () => {
      infoWindows.forEach(iw => iw.close());
      infowindow.open(map, marker);
    });

    markers.push(marker);
    infoWindows.push(infowindow);
  });
}

// Função global para cálculo de rota
window.calcularRotaParaEmpresa = function(lat, lng) {
  const origem = getLocalizacaoAtual();
  const destino = { lat, lng };
  calcularERenderizarRota(origem, destino);
};

// Atualiza a lista de empresas no painel lateral
function atualizarListaParceiros(lista) {
  const ul = document.getElementById("partner-list");
  ul.innerHTML = "";
  
  lista.forEach((empresa, index) => {
    const li = document.createElement("li");
    li.className = "list-group-item d-flex justify-content-between align-items-center";
    li.innerHTML = `
      <div>
        <strong>${empresa.nome}</strong>
        <div class="small text-muted">${empresa.tipo} • ${empresa.categoria}</div>
      </div>
      <i class="bi bi-chevron-right"></i>
    `;
    
    li.addEventListener("click", () => {
      // Centraliza o mapa no marcador
      map.setCenter({ lat: empresa.lat, lng: empresa.lng });
      map.setZoom(15);
      
      // Abre o infoWindow correspondente
      infoWindows.forEach(iw => iw.close());
      infoWindows[index].open(map, markers[index]);
    });
    
    ul.appendChild(li);
  });
}

// Configura eventos de filtro
function aplicarEventosDeFiltro() {
  document.getElementById("searchBox").addEventListener("input", aplicarFiltros);
  document.getElementById("filtroCategoria").addEventListener("change", aplicarFiltros);
  document.getElementById("filtroTipo").addEventListener("change", aplicarFiltros);
}

// Aplica os filtros na lista de empresas
function aplicarFiltros() {
  const busca = document.getElementById("searchBox").value.toLowerCase();
  const categoria = document.getElementById("filtroCategoria").value;
  const tipo = document.getElementById("filtroTipo").value;

  const filtradas = empresas.filter(empresa =>
    empresa.nome.toLowerCase().includes(busca) &&
    (categoria === "" || empresa.categoria === categoria) &&
    (tipo === "" || empresa.tipo === tipo)
  );

  adicionarMarcadores(filtradas);
  atualizarListaParceiros(filtradas);
}

// Calcula e exibe uma rota
function calcularERenderizarRota(origem, destino) {
  directionsService.route({
    origin: origem,
    destination: destino,
    travelMode: google.maps.TravelMode.DRIVING,
    unitSystem: google.maps.UnitSystem.METRIC
  }, (result, status) => {
    if (status === "OK") {
      directionsRenderer.setDirections(result);
    } else {
      document.getElementById("route-panel").innerHTML = `
        <div class="alert alert-warning">Não foi possível calcular a rota: ${status}</div>
      `;
    }
  });
}

// Configura evento para cálculo de rota manual
function aplicarEventoCalculoRota() {
  document.getElementById("calculate-route").addEventListener("click", () => {
    const origemInput = document.getElementById("origem-input").value;
    const destinoInput = document.getElementById("destino-input").value;

    if (!origemInput || !destinoInput) {
      alert("Por favor, preencha os campos de origem e destino.");
      return;
    }

    calcularERenderizarRota(origemInput, destinoInput);
  });
}

// Retorna a localização atual (simulada)
function getLocalizacaoAtual() {
  return { lat: -19.9227, lng: -43.9451 }; // Pode ser substituído por geolocalização real
}

// Inicializa o mapa quando a API do Google Maps estiver carregada
if (typeof google !== 'undefined') {
  initMap();
} else {
  console.error("API do Google Maps não carregada");
}