import { calculoService } from './db-service.js';

let chart = null;

document.addEventListener('DOMContentLoaded', () => {
  const calcForm = document.getElementById('calc-form');
  
  if (!calcForm) return;

  calcForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const consumoInput = document.getElementById('consumo');
    const tarifaSelect = document.getElementById('tarifa');
    const economiaInput = document.getElementById('economia');
    
    if (!consumoInput || !tarifaSelect || !economiaInput) {
      return;
    }
    
    const consumo = parseFloat(consumoInput.value);
    const tarifa = parseFloat(tarifaSelect.value);
    const economia = parseFloat(economiaInput.value) / 100;
    
    if (isNaN(consumo) || consumo <= 0) {
      alert('Por favor, insira um consumo válido.');
      return;
    }
    
    if (isNaN(tarifa) || tarifa <= 0) {
      alert('Por favor, selecione uma região/tarifa válida.');
      return;
    }
    
    if (isNaN(economia) || economia <= 0 || economia > 1) {
      alert('Por favor, insira um percentual de economia válido (1-100%).');
      return;
    }
    
    const regioes = {
      '0.6': 'Sudeste',
      '0.55': 'Sul',
      '0.65': 'Nordeste',
      '0.7': 'Norte',
      '0.58': 'Centro-Oeste'
    };

    const calculoData = {
      consumo: {
        atual: consumo,
        tarifa: tarifa,
        regiao: regioes[String(tarifa)] || 'Região não identificada',
        economiaEsperada: economia,
        economiaCalculada: consumo * economia
      },
      resultados: {
        gastoAtual: consumo * tarifa,
        gastoComEconomia: (consumo * (1 - economia)) * tarifa,
        economiaMensal: (consumo * economia * tarifa),
        economiaAnual: (consumo * economia * tarifa * 12),
        reducaoCO2: (consumo * economia * 0.0817)
      }
    };

    try {
      const usuario = localStorage.getItem('currentUser');
      if (usuario) {
        const userData = JSON.parse(usuario);
        calculoData.usuarioId = userData.id;
        await calculoService.create(calculoData);
        await atualizarHistorico();
      }
      mostrarResultados(calculoData);
    } catch (error) {
      console.error('Erro ao salvar ou exibir cálculo:', error);
      alert('Ocorreu um erro ao processar o cálculo.');
      mostrarResultados(calculoData);
    }
  });

  const verHistoricoBtn = document.getElementById('verHistorico');
  if (verHistoricoBtn) {
    verHistoricoBtn.addEventListener('click', atualizarHistorico);
  }
});

async function atualizarHistorico() {
  try {
    const usuario = localStorage.getItem('currentUser');
    const historicoElement = document.getElementById('historico');
    if (!historicoElement) return;
    
    if (!usuario) {
      historicoElement.innerHTML = '<p>Faça login para ver seu histórico de cálculos.</p>';
      return;
    }
    
    const userData = JSON.parse(usuario);
    const calculos = await calculoService.getByUserId(userData.id);
    
    if (calculos.length === 0) {
      historicoElement.innerHTML = '<h3>Histórico de Cálculos</h3><p>Nenhum cálculo realizado ainda.</p>';
      return;
    }

    historicoElement.innerHTML = `
      <h3>Histórico de Cálculos</h3>
      ${calculos
        .sort((a, b) => new Date(b.data) - new Date(a.data))
        .map(calculo => `
          <div class="calculo-item" style="background: #f8f9fa; padding: 1rem; margin: 0.5rem 0; border-radius: 8px; border-left: 4px solid var(--primary-color);">
            <p><strong>Data:</strong> ${new Date(calculo.data).toLocaleDateString('pt-BR')}</p>
            <p><strong>Consumo:</strong> ${calculo.consumo.atual} kWh/mês</p>
            <p><strong>Região:</strong> ${calculo.consumo.regiao}</p>
            <p><strong>Economia mensal:</strong> R$ ${calculo.resultados.economiaMensal.toFixed(2)}</p>
            <p><strong>Economia anual:</strong> R$ ${calculo.resultados.economiaAnual.toFixed(2)}</p>
            <p><strong>Redução CO2:</strong> ${calculo.resultados.reducaoCO2.toFixed(2)} kg/mês</p>
          </div>
        `).join('')}
    `;
  } catch (error) {
    console.error('Erro ao carregar histórico:', error);
    const historicoElement = document.getElementById('historico');
    if (historicoElement) {
      historicoElement.innerHTML = '<p>Erro ao carregar histórico. Tente novamente.</p>';
    }
  }
}

function mostrarResultados(calculo) {
  const resultado = document.getElementById('resultado');
  if (!resultado) return;

  // Update the text content of the specific result elements
  document.getElementById('gastoAtual').textContent = `R$ ${calculo.resultados.gastoAtual.toFixed(2)}`;
  document.getElementById('gastoComEconomia').textContent = `R$ ${calculo.resultados.gastoComEconomia.toFixed(2)}`;
  document.getElementById('economiaMensal').textContent = `R$ ${calculo.resultados.economiaMensal.toFixed(2)}`;
  document.getElementById('economiaAnual').textContent = `R$ ${calculo.resultados.economiaAnual.toFixed(2)}`;
  document.getElementById('reducaoCO2').textContent = `-${calculo.resultados.reducaoCO2.toFixed(2)} kg CO2`;

  // Ensure the results section is visible if it was hidden
  resultado.style.display = 'block'; // Or whatever display style is appropriate

  // Update the chart data
  atualizarGrafico(calculo);
}

function atualizarGrafico(calculo) {
  const canvas = document.getElementById('grafico');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  if (chart) {
    // Atualiza os dados do gráfico existente sem destruir/recriar o canvas
    chart.data.datasets[0].data = [
      calculo.resultados.gastoComEconomia,
      calculo.resultados.economiaMensal
    ];
    chart.update();
  } else {
    // Cria o gráfico se ele ainda não existir
    chart = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: ['Gasto com Economia', 'Economia Mensal'],
        datasets: [{
          data: [
            calculo.resultados.gastoComEconomia,
            calculo.resultados.economiaMensal
          ],
          backgroundColor: ['#dc3545', '#28a745'],
          borderColor: ['#ffffff', '#ffffff'],
          borderWidth: 2
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          title: {
            display: true,
            text: 'Distribuição dos Gastos Mensais',
            font: {
              size: 16,
              weight: 'bold'
            }
          },
          legend: {
            position: 'bottom',
            labels: {
              padding: 20,
              font: {
                size: 14
              }
            }
          }
        }
      }
    });
  }
}