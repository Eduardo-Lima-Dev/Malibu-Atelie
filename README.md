<div align="center">
<h1>🧶 Malibu Ateliê</h1>

![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=next.js&logoColor=white)
![Firebase](https://img.shields.io/badge/Firebase-FFCA28?style=for-the-badge&logo=firebase&logoColor=black)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)

</div>

## 📑 Sumário

- [🎯 Introdução](#-introdução)
- [💫 Descrição do Projeto](#-descrição-do-projeto)
- [⭐ Objetivos](#-objetivos)
- [🛠️ Funcionalidades](#️-funcionalidades)
- [💻 Tecnologias](#-tecnologias)
- [📁 Estrutura do Projeto](#-estrutura-do-projeto)
- [👥 Time](#-time)
- [🤝 Comunicação](#-comunicação)
- [🚀 Setup](#-setup)
- [📚 Documentação da API](#-documentação-da-api)
- [📝 Commits](#-commits)
- [🌲 Branches](#-branches)
- [📞 Contato](#-contato)

## 🎯 Introdução

Este repositório reúne o desenvolvimento do projeto integrado da disciplina **Projeto Integrado II**, modernizando a presença digital do **Malibu Ateliê**. Nossa missão é criar um hub digital que centraliza catálogo, redes sociais e portfólio, com uma identidade visual sofisticada e humanizada.

## 💫 Descrição do Projeto

**Nome:** Malibu Ateliê  
**Cliente:** Pricila  
**Localização:** 📍 Floriano, PI

O Malibu Ateliê é especializado em crochê de moda sob medida, transformando fios em arte através de peças exclusivas. 

## ⭐ Objetivos

- 🔄 **Modernização Digital:** Interface moderna e responsiva
- 🔗 **Hub Digital:** Link único para todas as informações da marca
- 📱 **UX/UI:** Experiência fluida em dispositivos móveis e desktop

## 🛠️ Funcionalidades

### Gerenciamento de Produtos
- ✨ **Cadastro:** Produtos com imagens e descrições detalhadas
- 🔍 **Visualização:** Listagem e busca intuitiva
- 📝 **Atualização:** Edição simplificada
- 🗑️ **Exclusão:** Remoção segura

### Interface Pública
- 🎨 Link personalizado com design exclusivo
- 📱 Layout responsivo e moderno

### Painel Admin
- 🔐 Sistema de autenticação
- 📊 Dashboard completo

## 💻 Tecnologias

<div align="center">

### Core

![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=next.js&logoColor=white)
![Firebase](https://img.shields.io/badge/Firebase-FFCA28?style=for-the-badge&logo=firebase&logoColor=black)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)

### Ferramentas

![Figma](https://img.shields.io/badge/Figma-F24E1E?style=for-the-badge&logo=figma&logoColor=white)
![Trello](https://img.shields.io/badge/Trello-0052CC?style=for-the-badge&logo=trello&logoColor=white)
![WhatsApp](https://img.shields.io/badge/WhatsApp-25D366?style=for-the-badge&logo=whatsapp&logoColor=white)

</div>

## 📁 Estrutura do Projeto

```plaintext
Malibu-Atelie/
│
├── 📚 Documentação/
│   ├── 📋 Briefing.pdf
│   ├── 👥 Divisão_de_Equipe.pdf
│   └── 📑 Outros_Documentos.pdf
│
├── 💻 Codigos/
│   ├── 🎨 frontend/
│   └── ⚙️ backend/
│
├── 🎯 Protótipos/
│   ├── 📝 baixa_fidelidade/
│   └── 🎨 alta_fidelidade/
│
└── 📖 README.md
```

## 👥 Time

### 👨‍💻 Eduardo
- **Papel:** Tech Lead / Product Owner (PO)
- **Responsabilidades:** Organização geral e direção técnica

### 🎨 José Zildemar
- **Papel:** Designer UI/UX
- **Responsabilidades:** Prototipação e design de interface

### ⚡ Kendriks
- **Papel:** Desenvolvedor Full-Stack
- **Responsabilidades:** Requisitos e implementação

## 🤝 Comunicação

- 💬 **WhatsApp:** Comunicação diária
- 🎥 **Google Meet:** Reuniões e apresentações
- 📋 **Trello:** Gestão de tarefas

## 🚀 Setup

### Pré-requisitos

* ✨ Node.js
* 📦 Git
* 🐘 PostgreSQL
* 🔧 Prisma CLI

### Instalação

1. **Clone o repositório:**
```bash
git clone https://github.com/Eduardo-Lima-Dev/Malibu-Atelie.git
cd Malibu-Atelie/Codigos/malibu-atelie
```

2. **Instale as dependências:**
```bash
npm install
```

3. **Configure as variáveis de ambiente:**

```bash
# Edite o arquivo .env com suas configurações
DATABASE_URL="postgresql://seu_usuario:sua_senha@localhost:5432/malibu_atelie"
NEXTAUTH_SECRET="sua_chave_secreta_aqui"
NEXTAUTH_URL="http://localhost:3000"
```

4. **Configure o banco de dados:**

#### Crie o banco de dados PostgreSQL
```bash
createdb malibu_atelie
```
##### Execute as migrações do Prisma
```bash
npx prisma migrate dev
```
##### Gere o cliente Prisma
```bash
npx prisma generate
```

5. **Inicie o servidor de desenvolvimento:**
```bash
npm run dev
```

O projeto estará disponível em `http://localhost:3000`

### Comandos Úteis

```bash
# Visualizar o banco de dados com Prisma Studio
npx prisma studio
```

```bash
# Criar uma nova migração
npx prisma migrate dev --name nome_da_migracao
```
```bash
# Resetar o banco de dados
npx prisma migrate reset
```

## 📚 Documentação da API

A documentação completa da API pode ser encontrada em [`/Codigos/malibu-atelie/README.md`](/Codigos/malibu-atelie/README.md). Ela contém todos os detalhes sobre os endpoints disponíveis, autenticação e exemplos de uso.

## 📝 Commits

### Estrutura do Commit

```bash
<emoji> <tipo>(<escopo>): <descrição>
```
#### Exemplo:
```bash
✨ feat(auth): implementar autenticação com Firebase
```

- **emoji:** Identificador visual do tipo de mudança
- **tipo:** Identifica a natureza da mudança (feat, fix, etc)
- **escopo:** Indica a parte do projeto afetada (opcional)
- **descrição:** Mensagem clara e direta no infinitivo

### Prefixos (tipos)
- ✨ `feat:` Nova funcionalidade
- 🔨 `refac:` Refatoração
- 🐛 `fix:` Correção de bugs
- 📚 `docs:` Documentação
- 💅 `style:` Estilo e formatação

### Escopos Comuns
- `auth` - Autenticação
- `admin` - Painel administrativo
- `products` - Gerenciamento de produtos
- `ui` - Interface do usuário
- `api` - Endpoints da API
- `db` - Banco de dados
- `tests` - Testes

### 📋 Exemplos de Commits

#### ✨ Nova Funcionalidade
```bash
git commit -m "✨ feat(auth): implementar login com Google"
```

#### 🔨 Refatoração
```bash
git commit -m "🔨 refac(api): reorganizar estrutura de rotas"
```

#### 🐛 Correção de Bug
```bash
git commit -m "🐛 fix(ui): corrigir responsividade do menu"
```

#### 📚 Documentação
```bash
git commit -m "📚 docs(api): atualizar documentação dos endpoints"
```

#### 💅 Estilo
```bash
git commit -m "💅 style(ui): ajustar padrões de cores e tipografia"
```

## 🌲 Branches

### Padrão de Nomenclatura

- ✨ `Feature` - Para novas funcionalidades
- 🐛 `Bugfix` - Para correção de bugs
- 🚨 `Hotfix` - Para correções urgentes
- 🚀 `Release` - Para novas versões
- 📚 `Docs` - Para documentação

### 📋 Exemplos de Branches

#### Nova Funcionalidade
```bash
git checkout -b Feature-Criacao-Tela-de-Login
```

#### Correção de Bug
```bash
git checkout -b Bugfix-Erro-Upload-Imagem
```

#### Correção Urgente
```bash
git checkout -b Hotfix-Falha-Seguranca-Login
```

#### Nova Versão
```bash
git checkout -b Release-v1.0.0
```

#### Documentação
```bash
git checkout -b Docs-Atualizacao-README
```

### 🔄 Fluxo de Trabalho

1. **Crie uma nova branch:**
```bash
git checkout main
git pull origin main
git checkout -b Feature-Nova-Funcionalidade
```

2. **Faça seus commits seguindo o padrão estabelecido**
3. **Envie para o repositório:**
```bash
git push origin Feature-Nova-Funcionalidade
```

4. **Abra um Pull Request para a `main`**


---

<div align="center">
Made with 💖 by Time Malibu Ateliê
</div>
