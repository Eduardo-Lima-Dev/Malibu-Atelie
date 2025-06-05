# Documentação da API – Malibu Ateliê

> URL base (ambiente local): `http://localhost:3000`

Todas as rotas autenticadas exigem o cabeçalho `Authorization` com um JWT:

```
Authorization: Bearer <seu-token-aqui>
```

## Auth

### Login

```http
POST http://localhost:3000/api/auth/login
Content-Type: application/json
```

```json
    {
    	"email": "teste@email.com",
      "password": "123456"
    }
```

### Register

```http
POST http://localhost:3000/api/register
Content-Type: application/json
```

```json
    {
      "name": "teste",
      "email": "teste@email.com",
      "password": "123456"
    }
```

## Users

### List Users

```http
GET http://localhost:3000/api/users
Authorization: Bearer <seu-token-aqui>
```

### Search User

```http
GET http://localhost:3000/api/users/1
Authorization: Bearer <seu-token-aqui>
```

### Update User

```http
PATCH http://localhost:3000/api/users/2
Authorization: Bearer <seu-token-aqui>
Content-Type: application/json
```

```json
    {
      "name": "Teste Dev"
    }
```

### Update User

```http
PUT http://localhost:3000/api/users/2
Authorization: Bearer <seu-token-aqui>
Content-Type: application/json
```

```json
    {
      "name": "teste_2",
      "email": "teste@email.com",
      "password": "123456"
    }
```

### Delete User

```http
DELETE http://localhost:3000/api/users/2
Authorization: Bearer <seu-token-aqui>
```

## Products

### Create Category

```http
POST http://localhost:3000/api/categories
Authorization: Bearer <seu-token-aqui>
Content-Type: application/json
```

```json
    {
      "name": "Praia"
    }
```

### Create Product

```http
POST http://localhost:3000/api/products
Authorization: Bearer <seu-token-aqui>
Content-Type: application/json
```

```json
    {
      "name": "Produto Teste Delete",
      "description": "Descrição teste Delete",
      "price": 10.99,
      "image": "https://crocheparavendermais.com/wp-content/uploads/2020/10/coisas-de-croche-para-vender.jpg",
      "categoryId": 1
    }
```

### List Products

```http
GET http://localhost:3000/api/products
```

### Update Product

```http
PUT http://localhost:3000/api/products/8
Authorization: Bearer <seu-token-aqui>
Content-Type: application/json
```

```json
    {
      "name": "Produto Teste Atualização",
      "description": "Descrição teste",
      "price": 99.99,
      "image": "https://crocheparavendermais.com/wp-content/uploads/2020/10/coisas-de-croche-para-vender.jpg",
      "categoryId": 1
    }
```

### Delete Product

```http
DELETE http://localhost:3000/api/products/9
Authorization: Bearer <seu-token-aqui>
```

## Testes

O projeto inclui uma suíte de testes automatizados que cobre as principais funcionalidades do sistema. Os testes são escritos usando Jest e incluem testes para:

- Autenticação (registro e login)
- Produtos (CRUD)
- Categorias (CRUD)

### Pré-requisitos

Antes de executar os testes, certifique-se de:

1. Ter um banco de dados PostgreSQL configurado para testes
2. Configurar as variáveis de ambiente necessárias no arquivo `.env.test`:
   ```
   DATABASE_URL="postgresql://postgres:postgres@localhost:5432/malibu_test"
   NEXTAUTH_SECRET="test-secret-key"
   NEXTAUTH_URL="http://localhost:3000"
   ```

### Executando os Testes

Para executar os testes, use os seguintes comandos:

```bash
# Instalar dependências
npm install

# Executar todos os testes
npm test

# Executar testes em modo watch (útil durante o desenvolvimento)
npm run test:watch

# Executar testes com cobertura
npm run test:coverage
```

### Estrutura dos Testes

Os testes estão organizados na pasta `src/__tests__/` com os seguintes arquivos:

- `auth.test.ts`: Testes de autenticação
- `products.test.ts`: Testes de produtos
- `categories.test.ts`: Testes de categorias

Cada arquivo de teste inclui:
- Configuração do ambiente de teste
- Limpeza do banco de dados antes e depois dos testes
- Testes para diferentes cenários (sucesso e erro)
- Verificações de autenticação
- Validações de dados

### Boas Práticas

1. Sempre execute os testes antes de fazer commit
2. Mantenha a cobertura de testes acima de 80%
3. Adicione novos testes ao implementar novas funcionalidades
4. Use dados de teste isolados para cada teste
5. Limpe o banco de dados após cada teste

## Testes Automatizados

Os testes são executados automaticamente através do GitHub Actions em todas as branches do repositório.