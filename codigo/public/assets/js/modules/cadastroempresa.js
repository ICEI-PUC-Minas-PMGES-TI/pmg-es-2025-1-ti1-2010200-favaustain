import { companyService } from './db-service.js';
import { exibirMensagem } from './utils.js';

let empresas = [];
let empresaEditandoIndex = null;

// Função para verificar se o usuário está logado
function verificarLogin() {
    const usuario = localStorage.getItem('currentUser');
    if (!usuario) {
        alert('Você precisa estar logado para cadastrar uma empresa.');
        window.location.href = 'login.html';
        return false;
    }
    return true;
}

document.addEventListener('DOMContentLoaded', () => {
    const cadastroForm = document.getElementById('cadastroForm');
    
    if (!cadastroForm) return;

    // Envio do formulário (Cadastrar ou Editar)
    cadastroForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        // Verifica se o usuário está logado
        if (!verificarLogin()) return;
        
        const formData = new FormData(e.target);
        const companyData = {
            nome: formData.get('nome'),
            descricao: formData.get('descricao'),
            categoria: formData.get('categoria'),
            servicos: formData.get('servicos').split(',').map(s => s.trim()).filter(s => s),
            contato: {
                email: formData.get('email'),
                telefone: formData.get('telefone'),
                site: formData.get('site') || ''
            },
            endereco: {
                logradouro: formData.get('endereco'),
                coordenadas: {
                    latitude: 0, // Implementar geocoding futuramente
                    longitude: 0
                }
            },
            historico: formData.get('historico') || ''
        };

        try {
            if (empresaEditandoIndex !== null) {
                // Editar empresa existente
                const empresaId = empresas[empresaEditandoIndex].id;
                companyService.update(empresaId, companyData);
                alert('Empresa atualizada com sucesso!');
                empresaEditandoIndex = null;
            } else {
                // Criar nova empresa
                companyService.create(companyData);
                alert('Empresa cadastrada com sucesso!');
            }
            
            cadastroForm.reset();
            const preview = document.getElementById('servicesPreview');
            if (preview) preview.innerHTML = '';
            
            // Redirecionar para a página de empresas
            setTimeout(() => {
                window.location.href = 'pagina-exposicao-empresas.html';
            }, 1000);
            
        } catch (error) {
            console.error('Erro no cadastro:', error);
            alert(`Erro ao cadastrar empresa: ${error.message}`);
        }
    });

    // Preview de serviços
    const servicosInput = document.getElementById('servicos');
    if (servicosInput) {
        servicosInput.addEventListener('input', function() {
            const services = this.value.split(',').map(s => s.trim()).filter(s => s);
            const preview = document.getElementById('servicesPreview');
            
            if (preview) {
                preview.innerHTML = services.map(service => 
                    `<span class="service-tag" style="background: var(--primary-color); color: white; padding: 0.25rem 0.5rem; border-radius: 4px; margin: 0.25rem; display: inline-block;">${service}</span>`
                ).join('');
            }
        });
    }

    // Formatação automática do telefone
    const telefoneInput = document.getElementById('telefone');
    if (telefoneInput) {
        telefoneInput.addEventListener('input', function() {
            let value = this.value.replace(/\D/g, '');
            if (value.length <= 11) {
                if (value.length > 6) {
                    value = value.replace(/^(\d{2})(\d{5})(\d{4})$/, '($1) $2-$3');
                } else if (value.length > 2) {
                    value = value.replace(/^(\d{2})(\d+)/, '($1) $2');
                }
            }
            this.value = value;
        });
    }

    // Carregar empresas existentes
    carregarEmpresas();
});

// Carregar empresas do localStorage
function carregarEmpresas() {
    try {
        empresas = companyService.getAll();
        renderEmpresas();
    } catch (error) {
        console.error('Erro ao carregar empresas:', error);
    }
}

// Renderizar empresas cadastradas
function renderEmpresas() {
    const lista = document.getElementById('listaEmpresas');
    if (!lista) return;
    
    lista.innerHTML = '';

    if (empresas.length === 0) {
        lista.innerHTML = '<p>Nenhuma empresa cadastrada ainda.</p>';
        return;
    }

    empresas.forEach((empresa, index) => {
        const div = document.createElement('div');
        div.className = 'empresa-card';
        div.style.cssText = 'border: 1px solid #ddd; padding: 1rem; margin: 1rem 0; border-radius: 8px; background: #f9f9f9;';
        div.innerHTML = `
            <h3 style="color: var(--primary-color); margin-bottom: 0.5rem;">${empresa.nome}</h3>
            <p style="margin-bottom: 0.5rem;"><strong>Descrição:</strong> ${empresa.descricao}</p>
            <p style="margin-bottom: 0.5rem;"><strong>Categoria:</strong> ${empresa.categoria}</p>
            <p style="margin-bottom: 0.5rem;"><strong>Serviços:</strong> ${empresa.servicos.join(', ')}</p>
            <p style="margin-bottom: 0.5rem;"><strong>Email:</strong> ${empresa.contato.email}</p>
            <p style="margin-bottom: 0.5rem;"><strong>Telefone:</strong> ${empresa.contato.telefone}</p>
            ${empresa.contato.site ? `<p style="margin-bottom: 0.5rem;"><strong>Site:</strong> <a href="${empresa.contato.site}" target="_blank">${empresa.contato.site}</a></p>` : ''}
            <div style="margin-top: 1rem;">
                <button onclick="editarEmpresa(${index})" style="background: #007bff; color: white; border: none; padding: 0.5rem 1rem; border-radius: 4px; margin-right: 0.5rem; cursor: pointer;">Editar</button>
                <button onclick="excluirEmpresa(${index})" style="background: #dc3545; color: white; border: none; padding: 0.5rem 1rem; border-radius: 4px; cursor: pointer;">Excluir</button>
            </div>
        `;
        lista.appendChild(div);
    });
}

// Tornar funções globais para uso nos botões
window.editarEmpresa = function(index) {
    const empresa = empresas[index];
    empresaEditandoIndex = index;

    document.getElementById('nome').value = empresa.nome;
    document.getElementById('descricao').value = empresa.descricao;
    document.getElementById('categoria').value = empresa.categoria;
    document.getElementById('servicos').value = empresa.servicos.join(', ');
    document.getElementById('email').value = empresa.contato.email;
    document.getElementById('telefone').value = empresa.contato.telefone;
    document.getElementById('site').value = empresa.contato.site || '';
    document.getElementById('endereco').value = empresa.endereco.logradouro;
    document.getElementById('historico').value = empresa.historico || '';

    const preview = document.getElementById('servicesPreview');
    if (preview) {
        preview.innerHTML = empresa.servicos.map(service =>
            `<span class="service-tag" style="background: var(--primary-color); color: white; padding: 0.25rem 0.5rem; border-radius: 4px; margin: 0.25rem; display: inline-block;">${service}</span>`
        ).join('');
    }

    // Scroll para o formulário
    document.getElementById('cadastroForm').scrollIntoView({ behavior: 'smooth' });
};

window.excluirEmpresa = function(index) {
    if (confirm('Deseja realmente excluir esta empresa?')) {
        const empresaId = empresas[index].id;
        try {
            companyService.delete(empresaId);
            empresas.splice(index, 1);
            renderEmpresas();
            alert('Empresa excluída com sucesso!');
        } catch (error) {
            console.error('Erro ao excluir empresa:', error);
            alert('Erro ao excluir empresa.');
        }
    }
};
