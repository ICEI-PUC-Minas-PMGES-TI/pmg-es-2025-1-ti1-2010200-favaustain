// Aguardar o carregamento do DOM
document.addEventListener('DOMContentLoaded', function() {
    // Dados completos das empresas
    const empresasRecomendadas = [
        { 
            nome: "Tech Co", 
            descricao: "Soluções tecnológicas inovadoras", 
            imagem: "img/empresa-recomendada-1.svg",
            site: "https://example.com/techco"
        },
        { 
            nome: "Finance", 
            descricao: "Serviços financeiros de qualidade", 
            imagem: "img/empresa-recomendada-2.svg",
            site: "https://example.com/finance"
        },
        { 
            nome: "Design", 
            descricao: "Criatividade em cada projeto", 
            imagem: "img/empresa-recomendada-3.svg",
            site: "https://example.com/design"
        }
    ];
    
    const empresasNovas = [
        { 
            nome: "Startup Inovadora", 
            descricao: "Revolucionando o mercado", 
            imagem: "img/empresa-nova-1.svg",
            site: "https://example.com/startup"
        },
        { 
            nome: "Eco Tech", 
            descricao: "Tecnologia sustentável", 
            imagem: "img/empresa-nova-2.svg",
            site: "https://example.com/ecotech"
        },
        { 
            nome: "Energia", 
            descricao: "Fontes renováveis para o futuro", 
            imagem: "img/empresa-nova-3.svg",
            site: "https://example.com/energia"
        }
    ];
    
    const empresasPioneiras = [
        { 
            nome: "Indústria", 
            descricao: "Tradição e qualidade desde sempre", 
            imagem: "img/empresa-pioneira-1.svg",
            site: "https://example.com/industria"
        },
        { 
            nome: "Telecom", 
            descricao: "Conectando pessoas desde 1980", 
            imagem: "img/empresa-pioneira-2.svg",
            site: "https://example.com/telecom"
        },
        { 
            nome: "Construtora Tradicional", 
            descricao: "Construindo o futuro com solidez", 
            imagem: "img/empresa-pioneira-3.svg",
            site: "https://example.com/construtora"
        }
    ];

    // Adicionar evento de clique aos logotipos
    const logos = document.querySelectorAll('.logo');
    logos.forEach(logo => {
        logo.addEventListener('click', function() {
            alert('Bem-vindo à plataforma de empresas!');
        });
    });

    // Verificar se estamos na página de informações da empresa
    const isEmpresaInfoPage = window.location.pathname.includes('empresa-info.html');
    
    if (isEmpresaInfoPage) {
        // Carregar os detalhes da empresa
        carregarDetalhesEmpresa();
    }
});

// Função para carregar os detalhes da empresa com base nos parâmetros da URL
function carregarDetalhesEmpresa() {
    // Obter parâmetros da URL
    const urlParams = new URLSearchParams(window.location.search);
    const nomeEmpresa = urlParams.get('nome');
    const categoriaEmpresa = urlParams.get('categoria');
    
    // Verificar se os parâmetros existem
    if (!nomeEmpresa || !categoriaEmpresa) {
        window.location.href = "index.html"; // Redirecionar para a página inicial se os parâmetros não existirem
        return;
    }
    
    // Elementos na página
    const empresaTitulo = document.getElementById('empresa-titulo');
    const empresaCategoria = document.getElementById('empresa-categoria');
    const empresaLogo = document.getElementById('empresa-logo');
    
    // Definir os valores
    if (empresaTitulo) empresaTitulo.textContent = nomeEmpresa;
    
    // Definir a categoria formatada
    if (empresaCategoria) {
        let categoriaFormatada = '';
        
        switch (categoriaEmpresa) {
            case 'recomendada':
                categoriaFormatada = 'Empresa Recomendada';
                break;
            case 'nova':
                categoriaFormatada = 'Nova no Mercado';
                break;
            case 'pioneira':
                categoriaFormatada = 'Empresa Pioneira';
                break;
            default:
                categoriaFormatada = categoriaEmpresa;
        }
        
        empresaCategoria.textContent = categoriaFormatada;
    }
    
    // Aqui você pode adicionar lógica para carregar o SVG específico da empresa
    // com base nas informações da URL
}