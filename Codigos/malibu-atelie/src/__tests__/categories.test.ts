import { describe, it, expect, beforeAll, afterAll } from '@jest/globals';
import { prisma } from '@/lib/prisma';
import { hash } from 'bcryptjs';

describe('Categorias', () => {
  let testUser: any;
  let testCategory: any;
  let authToken: string;

  beforeAll(async () => {
    // Limpa o banco de dados antes dos testes
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
  });

  afterAll(async () => {
    // Limpa o banco de dados após os testes
    await prisma.category.deleteMany();
    await prisma.user.deleteMany();
    await prisma.$disconnect();
  });

  describe('POST /api/categories', () => {
    it('deve criar uma nova categoria com sucesso', async () => {
      const response = await fetch('http://localhost:3000/api/categories', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`,
        },
        body: JSON.stringify({
          name: 'Categoria Teste',
        }),
      });

      expect(response.status).toBe(200);
      const data = await response.json();
      expect(data).toHaveProperty('id');
      expect(data).toHaveProperty('name', 'Categoria Teste');
      
      testCategory = data;
    });

    it('deve retornar erro ao tentar criar categoria sem autenticação', async () => {
      const response = await fetch('http://localhost:3000/api/categories', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: 'Categoria Teste',
        }),
      });

      expect(response.status).toBe(401);
      const data = await response.json();
      expect(data).toHaveProperty('error', 'Token não fornecido');
    });
  });

  describe('GET /api/categories', () => {
    it('deve listar todas as categorias', async () => {
      const response = await fetch('http://localhost:3000/api/categories', {
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
    });
  });
}); 