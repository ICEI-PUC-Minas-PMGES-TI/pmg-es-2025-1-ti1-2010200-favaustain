// mapa.js - Versão completa com balões e ícones personalizados
// Adicione no início do arquivo mapa.js
console.log("Script mapa.js carregado!");

function initMap() {
  console.log("Função initMap chamada");
  
  try {
    map = new google.maps.Map(document.getElementById("map"), {
      center: { lat: -19.9208, lng: -43.9378 },
      zoom: 13,
      styles: [/* seus estilos */]
    });
    console.log("Mapa inicializado com sucesso");

    directionsService = new google.maps.DirectionsService();
    directionsRenderer = new google.maps.DirectionsRenderer({
      map: map,
      panel: document.getElementById("route-panel"),
      suppressMarkers: false
    });

    console.log("Empresas a serem exibidas:", empresas);
    adicionarMarcadores(empresas);
    atualizarListaParceiros(empresas);
    aplicarEventosDeFiltro();
    aplicarEventoCalculoRota();
    
  } catch (error) {
    console.error("Erro ao inicializar mapa:", error);
    alert("Erro ao carregar o mapa. Verifique o console para detalhes.");
  }
}

function adicionarMarcadores(lista) {
  console.log("Adicionando marcadores:", lista.length);
  
  // Limpa marcadores existentes
  markers.forEach(marker => marker.setMap(null));
  markers = [];

  lista.forEach(empresa => {
    console.log("Criando marcador para:", empresa.nome);
    
    const marker = new google.maps.Marker({
      position: { lat: empresa.lat, lng: empresa.lng },
      map: map,
      title: empresa.nome,
      icon: icons[empresa.categoria] || icons.default
    });

    const infowindow = new google.maps.InfoWindow({
      content: `<b>${empresa.nome}</b><br>Categoria: ${empresa.categoria}<br>Tipo: ${empresa.tipo}`
    });

    marker.addListener("click", () => {
      infowindow.open(map, marker);
    });

    markers.push(marker);
  });
}
let map;
let markers = [];
let directionsService;
let directionsRenderer;
let infoWindows = [];

const icons = {
  Solar: {
    url: "https://maps.google.com/mapfiles/ms/icons/green-dot.png",
    scaledSize: new google.maps.Size(40, 40)
  },
  Eólica: {
    url: "https://maps.google.com/mapfiles/ms/icons/blue-dot.png",
    scaledSize: new google.maps.Size(40, 40)
  },
  Híbrida: {
    url: "https://maps.google.com/mapfiles/ms/icons/yellow-dot.png",
    scaledSize: new google.maps.Size(40, 40)
  },
  default: {
    url: "https://maps.google.com/mapfiles/ms/icons/red-dot.png",
    scaledSize: new google.maps.Size(40, 40)
  }
};

const empresas = [
  { 
    nome: 'Eco Minas Energia', 
    lat: -19.905, 
    lng: -43.938, 
    categoria: 'Solar', 
    tipo: 'Instaladora',
    endereco: 'Av. Afonso Pena, 1000',
    telefone: '(31) 9999-9999',
    descricao: 'Especializada em instalações residenciais de energia solar'
  },
  { 
    nome: 'Vívuz Solar', 
    lat: -19.920, 
    lng: -43.940, 
    categoria: 'Solar', 
    tipo: 'Distribuidora',
    endereco: 'R. da Bahia, 200',
    telefone: '(31) 8888-8888',
    descricao: 'Distribuidora de equipamentos para energia solar'
  },
  { 
    nome: 'SunTech Solar', 
    lat: -19.910, 
    lng: -43.935, 
    categoria: 'Híbrida', 
    tipo: 'Consultoria',
    endereco: 'Av. do Contorno, 300',
    telefone: '(31) 7777-7777',
    descricao: 'Consultoria em projetos de energia renovável'
  },
  { 
    nome: 'Seg Energy BH', 
    lat: -19.915, 
    lng: -43.930, 
    categoria: 'Eólica', 
    tipo: 'Instaladora',
    endereco: 'R. São Paulo, 400',
    telefone: '(31) 6666-6666',
    descricao: 'Instalação de turbinas eólicas residenciais'
  },
  { 
    nome: 'Nova Luz Solar', 
    lat: -19.918, 
    lng: -43.928, 
    categoria: 'Solar', 
    tipo: 'Engenharia',
    endereco: 'Av. Amazonas, 500',
    telefone: '(31) 5555-5555',
    descricao: 'Engenharia especializada em energia solar'
  },
  { 
    nome: 'BH Sustentável', 
    lat: -19.912, 
    lng: -43.943, 
    categoria: 'Híbrida', 
    tipo: 'Manutenção',
    endereco: 'R. Tamoios, 600',
    telefone: '(31) 4444-4444',
    descricao: 'Manutenção de sistemas de energia renovável'
  }
];

function initMap() {
  map = new google.maps.Map(document.getElementById("map"), {
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

  directionsService = new google.maps.DirectionsService();
  directionsRenderer = new google.maps.DirectionsRenderer({
    map: map,
    panel: document.getElementById("route-panel"),
    suppressMarkers: false
  });

  adicionarMarcadores(empresas);
  atualizarListaParceiros(empresas);
  aplicarEventosDeFiltro();
  aplicarEventoCalculoRota();
}

function adicionarMarcadores(lista) {
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
      <div style="padding:10px;max-width:250px">
        <h5 style="margin:0 0 10px 0;color:#28a745">${empresa.nome}</h5>
        <p style="margin:5px 0"><strong>Categoria:</strong> ${empresa.categoria}</p>
        <p style="margin:5px 0"><strong>Tipo:</strong> ${empresa.tipo}</p>
        <p style="margin:5px 0"><strong>Endereço:</strong> ${empresa.endereco}</p>
        <p style="margin:5px 0"><strong>Telefone:</strong> ${empresa.telefone}</p>
        <p style="margin:5px 0"><strong>Descrição:</strong> ${empresa.descricao}</p>
        <button onclick="window.calcularRotaParaEmpresa(${empresa.lat},${empresa.lng})" 
                style="background:#28a745;color:white;border:none;padding:5px 10px;border-radius:3px;cursor:pointer;margin-top:5px">
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

window.calcularRotaParaEmpresa = function(lat, lng) {
  const origem = getLocalizacaoAtual();
  const destino = { lat, lng };
  calcularERenderizarRota(origem, destino);
};

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
      map.setCenter({ lat: empresa.lat, lng: empresa.lng });
      map.setZoom(15);
      infoWindows.forEach(iw => iw.close());
      infoWindows[index].open(map, markers[index]);
    });
    
    ul.appendChild(li);
  });
}

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
    (categoria === "" || empresa.categoria === categoria) &&
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

function getLocalizacaoAtual() {
  return { lat: -19.9227, lng: -43.9451 };
}