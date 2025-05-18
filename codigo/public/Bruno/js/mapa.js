// script.js - Versão aprimorada e profissional

let map;
let markers = [];
let directionsService;
let directionsRenderer;

const empresas = [
  { nome: 'Eco Minas Energia', lat: -19.905, lng: -43.938, categoria: 'Solar', tipo: 'Instaladora' },
  { nome: 'Vívuz Solar', lat: -19.920, lng: -43.940, categoria: 'Solar', tipo: 'Distribuidora' },
  { nome: 'SunTech Solar', lat: -19.910, lng: -43.935, categoria: 'Híbrida', tipo: 'Consultoria' },
  { nome: 'Seg Energy BH', lat: -19.915, lng: -43.930, categoria: 'Eólica', tipo: 'Instaladora' },
  { nome: 'Nova Luz Solar', lat: -19.918, lng: -43.928, categoria: 'Solar', tipo: 'Engenharia' },
  { nome: 'BH Sustentável', lat: -19.912, lng: -43.943, categoria: 'Híbrida', tipo: 'Manutenção' }
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
  markers = [];

  lista.forEach(empresa => {
    const marker = new google.maps.Marker({
      position: { lat: empresa.lat, lng: empresa.lng },
      map: map,
      title: empresa.nome,
      icon: {
        url: "fav.jpeg",
        scaledSize: new google.maps.Size(40, 40),
        origin: new google.maps.Point(0, 0),
        anchor: new google.maps.Point(20, 40)
      }
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

function atualizarListaParceiros(lista) {
  const ul = document.getElementById("partner-list");
  ul.innerHTML = "";
  lista.forEach(empresa => {
    const li = document.createElement("li");
    li.className = "list-group-item";
    li.textContent = `${empresa.nome} (${empresa.tipo})`;
    li.addEventListener("click", () => {
      const origem = getLocalizacaoAtual();
      const destino = { lat: empresa.lat, lng: empresa.lng };
      calcularERenderizarRota(origem, destino);
    });
    ul.appendChild(li);
  });
}

function aplicarEventosDeFiltro() {
  document.getElementById("searchBox").addEventListener("input", aplicarFiltros);
  document.getElementById("filtroCategoria").addEventListener("input", aplicarFiltros);
  document.getElementById("filtroTipo").addEventListener("input", aplicarFiltros);
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
    travelMode: google.maps.TravelMode.DRIVING
  }, (result, status) => {
    if (status === "OK") {
      directionsRenderer.setDirections(result);
    } else {
      document.getElementById("route-panel").innerHTML = `<p>Rota não encontrada: ${status}</p>`;
    }
  });
}

function aplicarEventoCalculoRota() {
  document.getElementById("calculate-route").addEventListener("click", () => {
    const origemInput = document.getElementById("origem-input").value;
    const destinoInput = document.getElementById("destino-input").value;

    if (!origemInput || !destinoInput) {
      alert("Preencha os campos de origem e destino.");
      return;
    }

    directionsService.route({
      origin: origemInput,
      destination: destinoInput,
      travelMode: google.maps.TravelMode.DRIVING
    }, (result, status) => {
      if (status === "OK") {
        directionsRenderer.setDirections(result);
      } else {
        document.getElementById("route-panel").innerHTML = `<p>Erro ao calcular a rota: ${status}</p>`;
      }
    });
  });
}

function getLocalizacaoAtual() {
  return { lat: -19.9227, lng: -43.9451 }; // Valor fixo como exemplo; usar geolocalização real se quiser
}

// Certifique-se de que initMap é chamado no carregamento do Google Maps (via callback)
function initMapCallback() {
  initMap();
}