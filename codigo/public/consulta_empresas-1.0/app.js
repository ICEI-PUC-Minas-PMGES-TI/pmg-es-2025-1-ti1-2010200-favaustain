// Aguardar o carregamento do DOM
document.addEventListener('DOMContentLoaded', function() {
    // Dados de exemplo para as empresas
    const empresasRecomendadas = [
        { nome: "Empresa A", descricao: "Descrição da empresa A", imagem: "img/empresa-a.jpg" },
        { nome: "Empresa B", descricao: "Descrição da empresa B", imagem: "img/empresa-b.jpg" },
        { nome: "Empresa C", descricao: "Descrição da empresa C", imagem: "img/empresa-c.jpg" }
    ];
    
    const empresasNovas = [
        { nome: "Empresa D", descricao: "Descrição da empresa D", imagem: "img/empresa-d.jpg" },
        { nome: "Empresa E", descricao: "Descrição da empresa E", imagem: "img/empresa-e.jpg" },
        { nome: "Empresa F", descricao: "Descrição da empresa F", imagem: "img/empresa-f.jpg" }
    ];
    
    const empresasPioneiras = [
        { nome: "Empresa G", descricao: "Descrição da empresa G", imagem: "img/empresa-g.jpg" },
        { nome: "Empresa H", descricao: "Descrição da empresa H", imagem: "img/empresa-h.jpg" },
        { nome: "Empresa I", descricao: "Descrição da empresa I", imagem: "img/empresa-i.jpg" }
    ];

    // Função para preencher os cards com os dados
    function preencherCards(sectionIndex, dados) {
        const cards = document.querySelectorAll('.empresas-section')[sectionIndex].querySelectorAll('.card');
        
        cards.forEach((card, index) => {
            if (dados[index]) {
                // Criação dos elementos internos do card
                card.innerHTML = `
                    <div class="card-content">
                        <h3>${dados[index].nome}</h3>
                        <p>${dados[index].descricao}</p>
                    </div>
                `;
                
                // Adicionando evento de clique
                card.addEventListener('click', function() {
                    alert(`Você selecionou: ${dados[index].nome}`);
                    // Aqui você poderia redirecionar para uma página de detalhes
                    // window.location.href = `detalhes.html?empresa=${dados[index].nome}`;
                });
            }
        });
    }

    // Preencher os cards com os dados de exemplo
    preencherCards(0, empresasRecomendadas);
    preencherCards(1, empresasNovas);
    preencherCards(2, empresasPioneiras);

    // Adicionar efeito de destaque ao passar o mouse sobre os logotipos
    const logos = document.querySelectorAll('.logo');
    logos.forEach(logo => {
        logo.addEventListener('mouseover', function() {
            this.style.transform = 'scale(1.1)';
        });
        
        logo.addEventListener('mouseout', function() {
            this.style.transform = 'scale(1)';
        });
    });
});