import { describe, it, expect, beforeAll, afterAll } from '@jest/globals';
import { prisma } from '@/lib/prisma';
import { hash } from 'bcryptjs';

describe('Produtos', () => {
  let testUser: any;
  let testCategory: any;
  let testProduct: any;
  let authToken: string;

  beforeAll(async () => {
    // Limpa o banco de dados antes dos testes
    await prisma.product.deleteMany();
    await prisma.category.deleteMany();
    await prisma.user.deleteMany();
    
    // Cria um usuário de teste
    const hashedPassword = await hash('senha123', 10);
    testUser = await prisma.user.create({
      data: {
        name: 'Usuário Teste',
        email: 'teste@exemplo.com',
        password: hashedPassword,
      },
    });

    // Faz login para obter o token
    const loginResponse = await fetch('http://localhost:3000/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'teste@exemplo.com',
        password: 'senha123',
      }),
    });

    const loginData = await loginResponse.json();
    authToken = loginData.token;

    // Cria uma categoria de teste
    testCategory = await prisma.category.create({
      data: {
        name: 'Categoria Teste',
      },
    });
  });

  afterAll(async () => {
    // Limpa o banco de dados após os testes
    await prisma.product.deleteMany();
    await prisma.category.deleteMany();
    await prisma.user.deleteMany();
    await prisma.$disconnect();
  });

  describe('POST /api/products', () => {
    it('deve criar um novo produto com sucesso', async () => {
      const response = await fetch('http://localhost:3000/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`,
        },
        body: JSON.stringify({
          name: 'Produto Teste',
          description: 'Descrição do produto teste',
          price: 99.99,
          categoryId: testCategory.id,
        }),
      });

      expect(response.status).toBe(200);
      const data = await response.json();
      expect(data).toHaveProperty('id');
      expect(data).toHaveProperty('name', 'Produto Teste');
      expect(data).toHaveProperty('description', 'Descrição do produto teste');
      expect(data).toHaveProperty('price', '99.99');
      expect(data).toHaveProperty('categoryId', testCategory.id);
      
      testProduct = data;
    });

    it('deve retornar erro ao tentar criar produto sem autenticação', async () => {
      const response = await fetch('http://localhost:3000/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: 'Produto Teste',
          description: 'Descrição do produto teste',
          price: 99.99,
          categoryId: testCategory.id,
        }),
      });

      expect(response.status).toBe(401);
      const data = await response.json();
      expect(data).toHaveProperty('error', 'Token não fornecido');
    });
  });

  describe('GET /api/products', () => {
    it('deve listar todos os produtos', async () => {
      const response = await fetch('http://localhost:3000/api/products', {
        headers: {
          'Authorization': `Bearer ${authToken}`,
        },
      });

      expect(response.status).toBe(200);
      const data = await response.json();
      expect(Array.isArray(data)).toBe(true);
      expect(data.length).toBeGreaterThan(0);
      expect(data[0]).toHaveProperty('id');
      expect(data[0]).toHaveProperty('name');
      expect(data[0]).toHaveProperty('description');
      expect(data[0]).toHaveProperty('price');
    });
  });

  describe('PUT /api/products/[id]', () => {
    it('deve atualizar um produto com sucesso', async () => {
      const response = await fetch(`http://localhost:3000/api/products/${testProduct.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`,
        },
        body: JSON.stringify({
          name: 'Produto Atualizado',
          description: 'Nova descrição',
          price: 149.99,
        }),
      });

      expect(response.status).toBe(200);
      const data = await response.json();
      expect(data).toHaveProperty('name', 'Produto Atualizado');
      expect(data).toHaveProperty('description', 'Nova descrição');
      expect(data).toHaveProperty('price', '149.99');
    });
  });

  describe('DELETE /api/products/[id]', () => {
    it('deve deletar um produto com sucesso', async () => {
      const response = await fetch(`http://localhost:3000/api/products/${testProduct.id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${authToken}`,
        },
      });

      expect(response.status).toBe(200);
      const data = await response.json();
      expect(data).toHaveProperty('message', 'Produto deletado com sucesso');
    });
  });
}); 