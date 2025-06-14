const form = document.getElementById("calc-form");
const resultado = document.getElementById("resultado");
const ctx = document.getElementById("grafico").getContext("2d");
let chart;

function salvarRegistro(dados) {
  const registros = JSON.parse(localStorage.getItem("registrosEnergia")) || [];
  registros.push(dados);
  localStorage.setItem("registrosEnergia", JSON.stringify(registros));
}


form.addEventListener("submit", (e) => {
  e.preventDefault();

  const consumo = parseFloat(document.getElementById("consumo").value);
  const tarifa = parseFloat(document.getElementById("tarifa").value);
  const economiaPercent = parseFloat(document.getElementById("economia").value) / 100;

  const custoAtual = consumo * tarifa;
  const novoConsumo = consumo * (1 - economiaPercent);
  const novoCusto = novoConsumo * tarifa;
  const economiaReais = custoAtual - novoCusto;

  resultado.textContent =
    `Você economizará aproximadamente R$ ${economiaReais.toFixed(2)} por mês, reduzindo seu consumo para ${novoConsumo.toFixed(2)} kWh.`;
  // Criar objeto de registro
  const registro = {
    data: new Date().toISOString().split("T")[0],
    consumo,
    tarifa,
    percentualEconomia: economiaPercent,
    custoAtual: parseFloat(custoAtual.toFixed(2)),
    novoCusto: parseFloat(novoCusto.toFixed(2)),
    economiaReais: parseFloat(economiaReais.toFixed(2))
  };

  // Salvar no localStorage
  salvarRegistro(registro);

  if (chart) chart.destroy();

  chart = new Chart(ctx, {
    type: "bar",
    data: {
      labels: ["Custo Atual", "Custo Após Economia"],
      datasets: [
        {
          label: "R$",
          data: [custoAtual.toFixed(2), novoCusto.toFixed(2)],
          backgroundColor: ["#111", "var(--primary)"],
        },
      ],
    },
    options: {
      responsive: true,
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: (context) => `R$ ${context.parsed.y}`,
          },
        },
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            callback: (val) => `R$ ${val}`,
          },
        },
      },
    },
  });
});

function mostrarHistorico() {
  const registros = JSON.parse(localStorage.getItem("registrosEnergia")) || [];
  const container = document.getElementById("historico");
  container.innerHTML = "<h2>Histórico de Simulações</h2>";

  if (registros.length === 0) {
    container.innerHTML += "<p>Nenhum registro salvo.</p>";
    return;
  }

  const lista = document.createElement("ul");

  registros.forEach((r) => {
    const item = document.createElement("li");
    item.textContent = `📅 ${r.data} | Consumo: ${r.consumo} kWh | Economia: R$ ${r.economiaReais}`;
    lista.appendChild(item);
  });

  container.appendChild(lista);
}
document.getElementById("verHistorico").addEventListener("click", mostrarHistorico);
