import { companyService } from './db-service.js';
import { exibirMensagem } from './utils.js';

document.addEventListener('DOMContentLoaded', () => {
    carregarMinhasEmpresas();
    setupModalEventListeners();
});

async function carregarMinhasEmpresas() {
    const usuarioLogado = JSON.parse(localStorage.getItem('currentUser'));
    const listaEmpresasDiv = document.getElementById('lista-minhas-empresas');
    const noCompaniesMessage = document.getElementById('no-companies-message');
    const mensagemGeral = document.getElementById('mensagem-geral');
    
    if (!usuarioLogado) {
        listaEmpresasDiv.innerHTML = '';
        mensagemGeral.classList.remove('sucesso', 'erro');
        exibirMensagem(mensagemGeral, 'erro', 'Você precisa estar logado para ver suas empresas.');
        noCompaniesMessage.classList.remove('hidden');
        return;
    }

    try {
        const todasEmpresas = await companyService.getAll();
        const minhasEmpresas = todasEmpresas.filter(emp => emp.usuarioId === usuarioLogado.id); 

        if (minhasEmpresas.length === 0) {
            listaEmpresasDiv.innerHTML = '';
            noCompaniesMessage.classList.remove('hidden');
            return;
        }

        noCompaniesMessage.classList.add('hidden');
        listaEmpresasDiv.innerHTML = minhasEmpresas.map(empresa => criarCardMinhaEmpresa(empresa)).join('');

    } catch (error) {
        exibirMensagem(mensagemGeral, 'erro', `Erro ao carregar empresas: ${error.message}`);
        listaEmpresasDiv.innerHTML = '';
        noCompaniesMessage.classList.remove('hidden');
    }
}

function criarCardMinhaEmpresa(empresa) {
    const imagemSrc = empresa.imagem || `/assets/img/empresa-${empresa.categoria || 'nova'}-1.svg`;
    const avaliacao = empresa.avaliacao || 0;
    const projetos = empresa.projetos || 0;
    const estrelas = '★'.repeat(Math.floor(avaliacao)) + '☆'.repeat(5 - Math.floor(avaliacao));

    return `
        <div class="card" data-empresa-id="${empresa.id}">
            <div class="card-header">
                <img src="${imagemSrc}" alt="Logo ${empresa.nome}" class="empresa-logo">
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
                        <span class="stat-value">${estrelas} ${avaliacao.toFixed(1)}</span>
                    </div>
                    <div class="stat">
                        <span class="stat-label">Projetos:</span>
                        <span class="stat-value">${projetos.toLocaleString('pt-BR')}</span>
                    </div>
                </div>
            </div>
            <div class="card-footer">
                <button class="btn btn-outline btn-small btn-edit" data-id="${empresa.id}">Editar</button>
                <button class="btn btn-primary btn-small btn-delete" data-id="${empresa.id}" style="background-color: #dc3545; border-color: #dc3545;">Excluir</button>
            </div>
        </div>
    `;
}

function setupModalEventListeners() {
    const modal = document.getElementById('editCompanyModal');
    const closeButton = modal.querySelector('.modal-close');
    const editForm = document.getElementById('editCompanyForm');
    const servicosInput = document.getElementById('edit-servicos');
    const servicesPreview = document.getElementById('editServicesPreview');
    const mensagemGeral = document.getElementById('mensagem-geral');

    if (closeButton) {
        closeButton.addEventListener('click', () => {
            modal.classList.add('hidden');
            document.body.style.overflow = 'auto';
            mensagemGeral.classList.remove('sucesso', 'erro');
        });
    }

    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.add('hidden');
                document.body.style.overflow = 'auto';
                mensagemGeral.classList.remove('sucesso', 'erro');
            }
        });
    }

    document.getElementById('lista-minhas-empresas').addEventListener('click', async (e) => {
        if (e.target.classList.contains('btn-edit')) {
            const companyId = e.target.dataset.id;
            await preencherModalEdicao(companyId);
            modal.classList.remove('hidden');
            document.body.style.overflow = 'hidden';
        } else if (e.target.classList.contains('btn-delete')) {
            const companyId = e.target.dataset.id;
            await excluirEmpresa(companyId);
        }
    });

    if (servicosInput) {
        servicosInput.addEventListener('input', function() {
            const services = this.value.split(',').map(s => s.trim()).filter(s => s);
            servicesPreview.innerHTML = services.map(service => 
                `<span class="service-tag" style="background: var(--primary-color); color: white; padding: 0.25rem 0.5rem; border-radius: 4px; margin: 0.25rem; display: inline-block;">${service}</span>`
            ).join('');
        });
    }

    if (editForm) {
        editForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const empresaId = document.getElementById('edit-company-id').value;
            
            const updatedData = {
                nome: document.getElementById('edit-nome').value,
                descricao: document.getElementById('edit-descricao').value,
                categoria: document.getElementById('edit-categoria').value,
                servicos: document.getElementById('edit-servicos').value.split(',').map(s => s.trim()).filter(s => s),
                contato: {
                    email: document.getElementById('edit-email').value,
                    telefone: document.getElementById('edit-telefone').value,
                    site: document.getElementById('edit-site').value
                },
                endereco: {
                    logradouro: document.getElementById('edit-endereco').value,
                    coordenadas: { latitude: 0, longitude: 0 } 
                },
                historico: document.getElementById('edit-historico').value,
                avaliacao: 0, 
                projetos: 0,
                economia_media: "N/A"
            };

            try {
                const usuarioLogado = JSON.parse(localStorage.getItem('currentUser'));
                if (usuarioLogado && usuarioLogado.id) {
                    updatedData.usuarioId = usuarioLogado.id;
                }

                await companyService.update(empresaId, updatedData);
                exibirMensagem(mensagemGeral, 'sucesso', 'Empresa atualizada com sucesso!');
                modal.classList.add('hidden');
                document.body.style.overflow = 'auto';
                carregarMinhasEmpresas();
            } catch (error) {
                exibirMensagem(mensagemGeral, 'erro', `Erro ao atualizar empresa: ${error.message}`);
            }
        });
    }
}

async function preencherModalEdicao(companyId) {
    const mensagemGeral = document.getElementById('mensagem-geral');
    try {
        const empresa = await companyService.getById(companyId);
        if (!empresa) {
            exibirMensagem(mensagemGeral, 'erro', 'Empresa não encontrada para edição.');
            return;
        }

        document.getElementById('edit-company-id').value = empresa.id;
        document.getElementById('edit-nome').value = empresa.nome;
        document.getElementById('edit-descricao').value = empresa.descricao;
        document.getElementById('edit-categoria').value = empresa.categoria;
        document.getElementById('edit-site').value = empresa.contato.site || '';
        document.getElementById('edit-servicos').value = (empresa.servicos || []).join(', ');
        document.getElementById('edit-email').value = empresa.contato.email;
        document.getElementById('edit-telefone').value = empresa.contato.telefone;
        document.getElementById('edit-endereco').value = empresa.endereco.logradouro || '';
        document.getElementById('edit-historico').value = empresa.historico || '';

        const servicesPreview = document.getElementById('editServicesPreview');
        if (servicesPreview) {
            servicesPreview.innerHTML = (empresa.servicos || []).map(service => 
                `<span class="service-tag" style="background: var(--primary-color); color: white; padding: 0.25rem 0.5rem; border-radius: 4px; margin: 0.25rem; display: inline-block;">${service}</span>`
            ).join('');
        }

    } catch (error) {
        exibirMensagem(mensagemGeral, 'erro', `Erro ao carregar dados da empresa para edição: ${error.message}`);
    }
}

async function excluirEmpresa(companyId) {
    const mensagemGeral = document.getElementById('mensagem-geral');
    if (!confirm('Tem certeza que deseja excluir esta empresa?')) {
        return;
    }
    try {
        await companyService.delete(companyId);
        exibirMensagem(mensagemGeral, 'sucesso', 'Empresa excluída com sucesso!');
        carregarMinhasEmpresas(); 
    } catch (error) {
        exibirMensagem(mensagemGeral, 'erro', `Erro ao excluir empresa: ${error.message}`);
    }
}