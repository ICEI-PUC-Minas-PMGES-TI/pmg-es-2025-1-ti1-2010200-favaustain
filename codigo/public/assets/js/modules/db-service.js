// Simulação de banco de dados usando localStorage
// Como não podemos escrever arquivos JSON diretamente no navegador,
// vamos usar localStorage para persistir os dados

// Função para ler o banco de dados
function readDB() {
    try {
        const data = localStorage.getItem('favsustein_db');
        if (data) {
            return JSON.parse(data);
        } else {
            // Inicializar com estrutura padrão
            const defaultDB = {
                usuarios: [],
                empresas: [],
                calculos: []
            };
            localStorage.setItem('favsustein_db', JSON.stringify(defaultDB));
            return defaultDB;
        }
    } catch (error) {
        console.error('Erro ao ler o banco de dados:', error);
        return {
            usuarios: [],
            empresas: [],
            calculos: []
        };
    }
}

// Função para salvar o banco de dados
function writeDB(data) {
    try {
        localStorage.setItem('favsustein_db', JSON.stringify(data, null, 2));
        return true;
    } catch (error) {
        console.error('Erro ao salvar o banco de dados:', error);
        return false;
    }
}

// Serviços de Usuário
export const userService = {
    getAll() {
        const db = readDB();
        return db?.usuarios || [];
    },

    getById(id) {
        const db = readDB();
        return db?.usuarios.find(user => user.id === id);
    },

    getByEmail(email) {
        const db = readDB();
        return db?.usuarios.find(user => user.email === email);
    },

    create(userData) {
        const db = readDB();
        
        // Verificar se email já existe
        if (this.getByEmail(userData.email)) {
            throw new Error('Email já cadastrado');
        }

        const newUser = {
            ...userData,
            id: this.generateId(),
            dataCadastro: new Date().toISOString(),
            ultimoAcesso: new Date().toISOString()
        };
        
        db.usuarios.push(newUser);
        writeDB(db);
        return newUser;
    },

    update(id, userData) {
        const db = readDB();
        const index = db.usuarios.findIndex(user => user.id === id);
        if (index >= 0) {
            db.usuarios[index] = { ...db.usuarios[index], ...userData };
            writeDB(db);
            return db.usuarios[index];
        }
        return null;
    },

    delete(id) {
        const db = readDB();
        const index = db.usuarios.findIndex(user => user.id === id);
        if (index >= 0) {
            db.usuarios.splice(index, 1);
            writeDB(db);
            return true;
        }
        return false;
    },

    authenticate(email, senha) {
        const user = this.getByEmail(email);
        if (user && user.senha === senha) {
            // Atualizar último acesso
            this.update(user.id, { ultimoAcesso: new Date().toISOString() });
            return user;
        }
        return null;
    },

    generateId() {
        return 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }
};

// Serviços de Empresa
export const companyService = {
    getAll() {
        const db = readDB();
        return db?.empresas || [];
    },

    getById(id) {
        const db = readDB();
        return db?.empresas.find(company => company.id === id);
    },

    create(companyData) {
        const db = readDB();
        const newCompany = {
            ...companyData,
            id: this.generateId(),
            dataCadastro: new Date().toISOString(),
            status: 'ativo'
        };
        
        db.empresas.push(newCompany);
        writeDB(db);
        return newCompany;
    },

    update(id, companyData) {
        const db = readDB();
        const index = db.empresas.findIndex(company => company.id === id);
        if (index >= 0) {
            db.empresas[index] = { ...db.empresas[index], ...companyData };
            writeDB(db);
            return db.empresas[index];
        }
        return null;
    },

    delete(id) {
        const db = readDB();
        const index = db.empresas.findIndex(company => company.id === id);
        if (index >= 0) {
            db.empresas.splice(index, 1);
            writeDB(db);
            return true;
        }
        return false;
    },

    generateId() {
        return 'company_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }
};

// Serviços de Cálculo
export const calculoService = {
    getAll() {
        const db = readDB();
        return db?.calculos || [];
    },

    getByUserId(userId) {
        const db = readDB();
        return db?.calculos.filter(calc => calc.usuarioId === userId) || [];
    },

    create(calculoData) {
        const db = readDB();
        const newCalculo = {
            ...calculoData,
            id: this.generateId(),
            data: new Date().toISOString()
        };
        
        db.calculos.push(newCalculo);
        writeDB(db);
        return newCalculo;
    },

    generateId() {
        return 'calc_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }
};

// Função utilitária para limpar o banco de dados (para desenvolvimento)
export function clearDB() {
    localStorage.removeItem('favsustein_db');
    console.log('Banco de dados limpo');
}

// Função para exportar dados (para backup)
export function exportDB() {
    const db = readDB();
    const dataStr = JSON.stringify(db, null, 2);
    const dataBlob = new Blob([dataStr], {type: 'application/json'});
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'favsustein_backup.json';
    link.click();
    URL.revokeObjectURL(url);
}
