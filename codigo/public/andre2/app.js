let empresas = [];
let empresaEditandoIndex = null;

// Preview de serviços
document.getElementById('servicos').addEventListener('input', function() {
    const services = this.value.split(',').map(s => s.trim()).filter(s => s);
    const preview = document.getElementById('servicesPreview');

    preview.innerHTML = services.map(service => 
        `<span class="service-tag">${service}</span>`
    ).join('');
});

// Envio do formulário (Cadastrar ou Editar)
document.getElementById('cadastroForm').addEventListener('submit', function(e) {
    e.preventDefault();

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
        imagem: `img/empresa-${formData.get('categoria')}-custom.svg`
    };

    if (empresaEditandoIndex !== null) {
        empresas[empresaEditandoIndex] = empresa;
        empresaEditandoIndex = null;
    } else {
        empresas.push(empresa);
    }

    renderEmpresas();
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

// Renderizar empresas cadastradas
function renderEmpresas() {
    const lista = document.getElementById('listaEmpresas');
    lista.innerHTML = '';

    empresas.forEach((empresa, index) => {
        const div = document.createElement('div');
        div.className = 'empresa-card';
        div.innerHTML = `
            <h3>${empresa.nome}</h3>
            <p>${empresa.descricao}</p>
            <p><strong>Categoria:</strong> ${empresa.categoria}</p>
            <p><strong>Serviços:</strong> ${empresa.servicos.join(', ')}</p>
            <p><strong>Contato:</strong> ${empresa.contato.email}, ${empresa.contato.telefone}</p>
            <button onclick="editarEmpresa(${index})">Editar</button>
            <button onclick="excluirEmpresa(${index})">Excluir</button>
        `;
        lista.appendChild(div);
    });
}

function editarEmpresa(index) {
    const empresa = empresas[index];
    empresaEditandoIndex = index;

    document.getElementById('nome').value = empresa.nome;
    document.getElementById('descricao').value = empresa.descricao;
    document.getElementById('categoria').value = empresa.categoria;
    document.getElementById('site').value = empresa.site;
    document.getElementById('servicos').value = empresa.servicos.join(', ');
    document.getElementById('email').value = empresa.contato.email;
    document.getElementById('telefone').value = empresa.contato.telefone;
    document.getElementById('endereco').value = empresa.contato.endereco;
    document.getElementById('historico').value = empresa.historico;

    const preview = document.getElementById('servicesPreview');
    preview.innerHTML = empresa.servicos.map(service =>
        `<span class="service-tag">${service}</span>`
    ).join('');
}

function excluirEmpresa(index) {
    if (confirm('Deseja realmente excluir esta empresa?')) {
        empresas.splice(index, 1);
        renderEmpresas();
    }
}
