# Favsustein - Projeto Unificado

## Sobre o Projeto

O Favsustein é uma plataforma web desenvolvida para conectar moradores de periferia com empresas especializadas em economia de energia, oferecendo soluções acessíveis para reduzir custos e promover sustentabilidade.

## Estrutura do Projeto

O projeto foi completamente unificado e profissionalizado, consolidando o trabalho de 4 desenvolvedores em uma estrutura coesa:

### Estrutura de Diretórios
```
favsustein/
├── index.html                 # Página inicial
├── assets/
│   ├── css/
│   │   └── main.css          # CSS unificado e profissional
│   ├── js/
│   │   ├── main.js           # JavaScript principal
│   │   └── modules/          # Módulos JavaScript específicos
│   └── img/                  # Imagens e ícones
├── pages/                    # Páginas internas
│   ├── cadastro.html         # Cadastro de usuário (Marco)
│   ├── login.html            # Login de usuário (Marco)
│   ├── perfil.html           # Perfil de usuário (Marco)
│   ├── cadastro-empresas.html # Cadastro de empresas (André)
│   ├── pagina-exposicao-empresas.html # Lista de empresas (André)
│   ├── calculo-gastos.html   # Calculadora de economia (Ricardo)
│   └── mapa.html             # Mapa georreferenciado (Bruno)
└── db/
    └── db.json               # Base de dados unificada
```

## Funcionalidades Implementadas

### 1. Sistema de Autenticação (Marco)
- **Cadastro de usuário** com validação completa
- **Login** com autenticação
- **Área de perfil** para gerenciamento de dados pessoais
- Validação de CPF, CEP e outros campos
- Integração com API de CEP para preenchimento automático

### 2. Gestão de Empresas (André)
- **Cadastro de empresas** especializadas em energia
- **Página de exposição** com categorização:
  - Empresas Recomendadas
  - Novas no Mercado
  - Empresas Pioneiras
- Sistema de cards responsivo para exibição

### 3. Calculadora de Economia (Ricardo)
- **Cálculo de gastos** de energia por região
- Seleção de tarifas regionais (Sudeste, Sul, Nordeste, Norte, Centro-Oeste)
- Cálculo de percentual de economia esperada
- **Histórico de cálculos** salvos
- Gráficos visuais para apresentação dos resultados

### 4. Mapa Georreferenciado (Bruno)
- **Localização de empresas** próximas
- Filtros por tipo de energia (Solar, Eólica, Híbrida)
- Filtros por tipo de empresa (Instaladora, Distribuidora, Consultoria)
- **Cálculo de rotas** entre endereços
- Integração com Google Maps API

## Melhorias Implementadas

### Design e UX
- **Design profissional** com paleta de cores consistente
- **Layout responsivo** para desktop e mobile
- **Navegação unificada** em todas as páginas
- **Animações suaves** e transições
- **Tipografia moderna** e hierarquia visual clara

### Estrutura Técnica
- **CSS unificado** com variáveis CSS para consistência
- **JavaScript modular** com classe principal de aplicação
- **HTML semântico** com estrutura padronizada
- **Base de dados JSON** estruturada e organizada

### Funcionalidades Globais
- **Sistema de mensagens** unificado para feedback
- **Validação de formulários** consistente
- **Gerenciamento de estado** de autenticação
- **Utilitários globais** para formatação e validação

## Como Executar o Projeto

### Pré-requisitos
- Navegador web moderno (Chrome, Firefox, Safari, Edge)
- Servidor web local (opcional, mas recomendado)

### Execução Local

#### Opção 1: Servidor HTTP Simples (Recomendado)
```bash
# Navegue até o diretório do projeto
cd favsustein

# Inicie um servidor HTTP simples com Python
python3 -m http.server 8000

# Ou com Node.js (se instalado)
npx serve .

# Acesse no navegador: http://localhost:8000
```

#### Opção 2: Abertura Direta
- Abra o arquivo `index.html` diretamente no navegador
- **Nota**: Algumas funcionalidades podem não funcionar corretamente devido a restrições de CORS

### Configuração da API do Google Maps
Para o mapa funcionar completamente, você precisa:
1. Obter uma chave da API do Google Maps
2. Substituir a chave no arquivo `pages/mapa.html`
3. Habilitar as APIs necessárias no Google Cloud Console

## Tecnologias Utilizadas

- **HTML5** - Estrutura semântica
- **CSS3** - Estilização moderna com Flexbox e Grid
- **JavaScript ES6+** - Funcionalidades interativas
- **Google Maps API** - Mapa georreferenciado
- **Chart.js** - Gráficos para a calculadora
- **Bootstrap** - Componentes do mapa (parcial)

## Estrutura de Dados

O arquivo `db/db.json` contém a estrutura de dados para:
- **Usuários** - Dados de cadastro e autenticação
- **Empresas** - Informações das empresas parceiras
- **Cálculos** - Histórico de cálculos de economia
- **Metadados** - Informações de versão e atualização

## Próximos Passos Recomendados

### Para Desenvolvimento Futuro
1. **Backend Real** - Implementar API REST com Node.js/Express ou Python/Flask
2. **Banco de Dados** - Migrar de JSON para PostgreSQL ou MongoDB
3. **Autenticação JWT** - Sistema de tokens para segurança
4. **Upload de Imagens** - Para logos das empresas
5. **Sistema de Avaliações** - Feedback dos usuários sobre empresas
6. **Notificações** - Sistema de alertas e comunicação

### Para Produção
1. **Hospedagem** - Deploy em Vercel, Netlify ou AWS
2. **CDN** - Para otimização de assets
3. **SSL** - Certificado de segurança
4. **Analytics** - Google Analytics para métricas
5. **SEO** - Otimização para motores de busca

## Contribuidores

- **Marco** - Sistema de autenticação e perfil de usuário
- **André** - Gestão e exposição de empresas
- **Ricardo** - Calculadora de economia de energia
- **Bruno** - Mapa georreferenciado e localização

## Licença

Este projeto foi desenvolvido para fins educacionais como parte de um projeto acadêmico.

---

**Favsustein** - Conectando periferia com economia de energia 🌱⚡

