const API_URL = 'http://localhost:3000';

async function handleResponse(response) {
    if (!response.ok) {
        const error = await response.json().catch(() => ({ message: 'Erro desconhecido no servidor.' }));
        throw new Error(error.message || 'Ocorreu um erro na comunicação com o servidor.');
    }
    return response.json();
}

export const userService = {
    async getAll() {
        const response = await fetch(`${API_URL}/usuarios`);
        return handleResponse(response);
    },

    async getById(id) {
        const response = await fetch(`${API_URL}/usuarios/${id}`);
        return handleResponse(response);
    },

    async getByEmail(email) {
        const response = await fetch(`${API_URL}/usuarios?email=${encodeURIComponent(email)}`);
        const results = await handleResponse(response);
        return results.length > 0 ? results[0] : null;
    },

    async create(userData) {
        const existingUser = await this.getByEmail(userData.email);
        if (existingUser) {
            throw new Error('Email já cadastrado');
        }

        const newUser = {
            ...userData,
            dataCadastro: new Date().toISOString(),
            ultimoAcesso: new Date().toISOString()
        };

        const response = await fetch(`${API_URL}/usuarios`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newUser)
        });
        return handleResponse(response);
    },

    async update(id, userData) {
        const response = await fetch(`${API_URL}/usuarios/${id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(userData)
        });
        return handleResponse(response);
    },

    async delete(id) {
        const response = await fetch(`${API_URL}/usuarios/${id}`, {
            method: 'DELETE'
        });
        if (!response.ok) {
           throw new Error('Erro ao excluir usuário.');
        }
        return true;
    },

    async authenticate(email, senha) {
        const user = await this.getByEmail(email);
        if (user && user.senha === senha) {
            await this.update(user.id, { ultimoAcesso: new Date().toISOString() });
            return user;
        }
        return null;
    }
};

export const companyService = {
    async getAll() {
        const response = await fetch(`${API_URL}/empresas`);
        return handleResponse(response);
    },

    async getById(id) {
        const response = await fetch(`${API_URL}/empresas/${id}`);
        return handleResponse(response);
    },

    async create(companyData) {
        const newCompany = {
            ...companyData,
            id: 'db_' + Date.now(), 
            dataCadastro: new Date().toISOString(),
            status: 'ativo'
        };
        const response = await fetch(`${API_URL}/empresas`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newCompany)
        });
        return handleResponse(response);
    },

    async update(id, companyData) {
        const response = await fetch(`${API_URL}/empresas/${id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(companyData)
        });
        return handleResponse(response);
    },

    async delete(id) {
        const response = await fetch(`${API_URL}/empresas/${id}`, {
            method: 'DELETE'
        });
        if (!response.ok) {
           throw new Error('Erro ao excluir empresa.');
        }
        return true;
    }
};

export const calculoService = {
     async create(calculoData) {
        const newCalculo = {
            ...calculoData,
            id: 'calc_' + Date.now(),
            data: new Date().toISOString()
        };
        const response = await fetch(`${API_URL}/calculos`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newCalculo)
        });
        return handleResponse(response);
    },

    async getByUserId(userId) {
        const response = await fetch(`${API_URL}/calculos?usuarioId=${userId}`);
        return handleResponse(response);
    }
};