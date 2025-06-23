import { companyService } from './db-service.js';
import { exibirMensagem } from './utils.js';

document.addEventListener('DOMContentLoaded', () => {
    const cadastroForm = document.getElementById('cadastroForm');
    
    if (!cadastroForm) return;

    function verificarLogin() {
        const usuario = localStorage.getItem('currentUser');
        if (!usuario) {
            alert('Você precisa estar logado para cadastrar uma empresa.');
            window.location.href = '/pages/login.html';
            return false;
        }
        return JSON.parse(usuario); 
    }

    cadastroForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const usuarioLogado = verificarLogin();
        if (!usuarioLogado) return;
        
        const formData = new FormData(e.target);
        const companyData = {
            usuarioId: usuarioLogado.id, 
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
                    latitude: 0, 
                    longitude: 0
                }
            },
            historico: formData.get('historico') || '',
            avaliacao: 0,
            projetos: 0,
            economia_media: "N/A",
            imagem: `/assets/img/empresa-${formData.get('categoria') || 'nova'}-1.svg`
        };

        try {
            await companyService.create(companyData);
            alert('Empresa cadastrada com sucesso!');
            
            cadastroForm.reset();
            const preview = document.getElementById('servicesPreview');
            if (preview) preview.innerHTML = '';
            
            setTimeout(() => {
                window.location.href = '/pages/minhas-empresas.html'; 
            }, 1000);
            
        } catch (error) {
            alert(`Erro ao cadastrar empresa: ${error.message}`);
        }
    });

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
});