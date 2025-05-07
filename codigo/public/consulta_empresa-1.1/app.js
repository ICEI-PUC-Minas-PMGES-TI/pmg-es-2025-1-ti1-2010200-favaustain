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

    // Adicionar evento de clique aos cards
    const adicionarEventosCards = (sectionIndex, dados) => {
        const cards = document.querySelectorAll('.empresas-section')[sectionIndex].querySelectorAll('.card');
        
        cards.forEach((card, index) => {
            if (dados[index]) {
                card.addEventListener('click', function() {
                    // Aqui você pode redirecionar para uma página de detalhes ou mostrar um modal
                    alert(`Você selecionou: ${dados[index].nome}\nSaiba mais em: ${dados[index].site}`);
                });
            }
        });
    };

    // Adicionar eventos de clique aos cards
    adicionarEventosCards(0, empresasRecomendadas);
    adicionarEventosCards(1, empresasNovas);
    adicionarEventosCards(2, empresasPioneiras);

    // Adicionar efeito de destaque ao passar o mouse sobre os logotipos
    const logos = document.querySelectorAll('.logo');
    logos.forEach(logo => {
        logo.addEventListener('click', function() {
            // Você pode adicionar ações para quando os logotipos forem clicados
            alert('Bem-vindo à plataforma de empresas!');
        });
    });
});