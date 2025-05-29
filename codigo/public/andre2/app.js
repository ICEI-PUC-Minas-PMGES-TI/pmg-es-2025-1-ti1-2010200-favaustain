// Preview de serviços
document.getElementById('servicos').addEventListener('input', function() {
    const services = this.value.split(',').map(s => s.trim()).filter(s => s);
    const preview = document.getElementById('servicesPreview');
    
    preview.innerHTML = services.map(service => 
        `<span class="service-tag">${service}</span>`
    ).join('');
});

// Simulação de envio do formulário
document.getElementById('cadastroForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Coleta os dados do formulário
    const formData = new FormData(this);
    const empresa = {
        nome: formData.get('nome'),
        descricao: formData.get('descricao'),
        categoria: formData.get('categoria'),
        site: formData.get('site'),
        servicos: formData.get('servicos').split(',').map(s => s.trim()).filter(s => s),
        contato: {
            email: formData.get('email'),
            telefone: formData.get('telefone'),
            endereco: formData.get('endereco')
        },
        historico: formData.get('historico'),
        imagem: `img/empresa-${formData.get('categoria')}-custom.svg` // Placeholder para imagem
    };

    // Simulação de salvamento
    console.log('Dados da empresa:', empresa);
    alert('Empresa cadastrada com sucesso! (Esta é apenas uma simulação)');
    
    // Resetar formulário
    this.reset();
    document.getElementById('servicesPreview').innerHTML = '';
});

// Formatação automática do telefone
document.getElementById('telefone').addEventListener('input', function() {
    let value = this.value.replace(/\D/g, '');
    if (value.length > 0) {
        value = value.replace(/^(\d{2})(\d{2})(\d{5})(\d{4})$/, '+$1 $2 $3-$4');
        value = value.replace(/^(\d{2})(\d{5})(\d{4})$/, '+55 $1 $2-$3');
    }
    this.value = value;
});