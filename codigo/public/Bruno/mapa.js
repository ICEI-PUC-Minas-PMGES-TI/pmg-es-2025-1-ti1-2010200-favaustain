// mapa.js - Versão atualizada e corrigida

// Variáveis globais
let map;
let markers = [];
let directionsService;
let directionsRenderer;
let empresas = []; // Declarada no topo para evitar ReferenceError

// Função principal assíncrona
async function initMap() {
  try {
    // Mostra spinner de carregamento
    document.getElementById('loading-spinner').style.display = 'block';
    
    // 1. Carrega os dados das empresas
    const response = await fetch('empresas.json');
    if (!response.ok) throw new Error('Falha ao carregar dados das empresas');
    empresas = await response.json();

    // 2. Inicializa o mapa
    map = new google.maps.Map(document.getElementById("map"), {
      center: { lat: -15.788, lng: -47.879 }, // Centro do Brasil
      zoom: 4,
      styles: [{
        featureType: "all",
        stylers: [{ saturation: -80 }, { lightness: 10 }]
      },{
        featureType: "road.highway",
        elementType: "geometry",
        stylers: [{ color: "#00ff44" }]
      }]
    });

    // 3. Inicializa serviços de rota
    directionsService = new google.maps.DirectionsService();
    directionsRenderer = new google.maps.DirectionsRenderer({
      map: map,
      panel: document.getElementById("route-panel"),
      suppressMarkers: false
    });

    // 4. Configurações iniciais
    adicionarMarcadores(empresas);
    atualizarListaParceiros(empresas);
    aplicarEventosDeFiltro();
    aplicarEventoCalculoRota();

  } catch (error) {
    console.error("Erro:", error);
    document.getElementById('loading-spinner').style.display = 'none';
    document.getElementById("map").innerHTML = `
      <div class="alert alert-danger">
        Erro ao carregar o mapa: ${error.message}
      </div>
    `;
  } finally {
    document.getElementById('loading-spinner').style.display = 'none';
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
        scaledSize: new google.maps.Size(40, 40),
        anchor: new google.maps.Point(20, 40)
      }
    });

    const infowindow = new google.maps.InfoWindow({
      content: `
        <div class="map-popup">
          <h5>${empresa.nome}</h5>
          <div class="popup-content">
            <p><strong>Tipo:</strong> ${empresa.tipo || 'Não especificado'}</p>
            <p><strong>Energia:</strong> ${empresa.tipoEnergia || 'Não especificado'}</p>
            <p><strong>Endereço:</strong> ${empresa.contato?.endereco || 'Não disponível'}</p>
            <div class="d-flex justify-content-between mt-2">
              <button class="btn btn-sm btn-success calcular-rota-btn" 
                      data-lat="${empresa.lat}" 
                      data-lng="${empresa.lng}">
                <i class="bi bi-geo-alt"></i> Rota
              </button>
              <a href="empresa-info.html?nome=${encodeURIComponent(empresa.nome)}" 
                 class="btn btn-sm btn-outline-primary">
                <i class="bi bi-info-circle"></i> Detalhes
              </a>
            </div>
          </div>
        </div>
      `
    });

    marker.addListener("click", () => {
      markers.forEach(m => m.infowindow?.close());
      infowindow.open(map, marker);
      marker.infowindow = infowindow;
    });

    markers.push(marker);
  });
}

// Função para atualizar a lista de empresas
function atualizarListaParceiros(lista) {
  const ul = document.getElementById("partner-list");
  ul.innerHTML = lista.length ? "" : '<li class="list-group-item">Nenhuma empresa encontrada</li>';

  lista.forEach(empresa => {
    const li = document.createElement("li");
    li.className = "list-group-item";
    li.innerHTML = `
      <div class="d-flex justify-content-between align-items-center">
        <div>
          <strong>${empresa.nome}</strong>
          <div class="text-muted small">
            ${empresa.tipo || 'Sem tipo'} • ${empresa.tipoEnergia || 'Sem categoria'}
          </div>
        </div>
        <button class="btn btn-sm btn-outline-success" 
                data-lat="${empresa.lat}" 
                data-lng="${empresa.lng}">
          <i class="bi bi-geo-alt"></i>
        </button>
      </div>
    `;

    li.addEventListener("click", (e) => {
      if (!e.target.classList.contains('btn')) {
        window.location.href = `empresa-info.html?nome=${encodeURIComponent(empresa.nome)}`;
      }
    });

    li.querySelector('button').addEventListener('click', (e) => {
      e.stopPropagation();
      calcularERenderizarRota(getLocalizacaoAtual(), { 
        lat: empresa.lat, 
        lng: empresa.lng 
      });
    });

    ul.appendChild(li);
  });
}

// Funções auxiliares
function aplicarEventosDeFiltro() {
  document.getElementById("searchBox").addEventListener("input", aplicarFiltros);
  document.getElementById("filtroCategoria").addEventListener("change", aplicarFiltros);
  document.getElementById("filtroTipo").addEventListener("change", aplicarFiltros);
}

function aplicarFiltros() {
  const busca = document.getElementById("searchBox").value.toLowerCase();
  const categoria = document.getElementById("filtroCategoria").value;
  const tipo = document.getElementById("filtroTipo").value;

  const filtradas = empresas.filter(empresa => 
    empresa.nome.toLowerCase().includes(busca) &&
    (categoria === "" || empresa.tipoEnergia === categoria) &&
    (tipo === "" || empresa.tipo === tipo)
  );

  adicionarMarcadores(filtradas);
  atualizarListaParceiros(filtradas);
}

function calcularERenderizarRota(origem, destino) {
  directionsService.route({
    origin: origem,
    destination: destino,
    travelMode: google.maps.TravelMode.DRIVING,
    unitSystem: google.maps.UnitSystem.METRIC
  }, (response, status) => {
    if (status === "OK") {
      directionsRenderer.setDirections(response);
    } else {
      document.getElementById("route-panel").innerHTML = `
        <div class="alert alert-warning">
          ${status === "ZERO_RESULTS" ? "Nenhuma rota encontrada" : "Erro ao calcular rota"}
        </div>
      `;
    }
  });
}

function aplicarEventoCalculoRota() {
  document.getElementById("calculate-route").addEventListener("click", () => {
    const origem = document.getElementById("origem-input").value;
    const destino = document.getElementById("destino-input").value;

    if (!origem || !destino) {
      document.getElementById("route-panel").innerHTML = `
        <div class="alert alert-warning">
          Preencha origem e destino
        </div>
      `;
      return;
    }

    calcularERenderizarRota(origem, destino);
  });
}

function getLocalizacaoAtual() {
  if (navigator.geolocation) {
    return new Promise((resolve) => {
      navigator.geolocation.getCurrentPosition(
        (position) => resolve({
          lat: position.coords.latitude,
          lng: position.coords.longitude
        }),
        () => resolve({ lat: -15.788, lng: -47.879 }) // Fallback
      );
    });
  }
  return Promise.resolve({ lat: -15.788, lng: -47.879 }); // Fallback
}

// Garante que a função initMap está disponível globalmente
window.initMap = initMap;