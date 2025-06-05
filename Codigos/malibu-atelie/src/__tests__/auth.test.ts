import { describe, it, expect, beforeAll, afterAll } from '@jest/globals';
import { prisma } from '@/lib/prisma';
import { hash } from 'bcryptjs';

describe('Autenticação', () => {
  let testUser: any;

  beforeAll(async () => {
    // Limpa o banco de dados antes dos testes
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
  });

  afterAll(async () => {
    // Limpa o banco de dados após os testes
    await prisma.user.deleteMany();
    await prisma.$disconnect();
  });

  describe('POST /api/auth/register', () => {
    it('deve registrar um novo usuário com sucesso', async () => {
      const response = await fetch('http://localhost:3000/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: 'Novo Usuário',
          email: 'novo@exemplo.com',
          password: 'senha123',
        }),
      });

      expect(response.status).toBe(200);
      const data = await response.json();
      expect(data).toHaveProperty('id');
      expect(data).toHaveProperty('name', 'Novo Usuário');
      expect(data).toHaveProperty('email', 'novo@exemplo.com');
      expect(data).not.toHaveProperty('password');
    });

    it('deve retornar erro ao tentar registrar com email já existente', async () => {
      const response = await fetch('http://localhost:3000/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: 'Usuário Duplicado',
          email: 'teste@exemplo.com',
          password: 'senha123',
        }),
      });

      expect(response.status).toBe(400);
      const data = await response.json();
      expect(data).toHaveProperty('error', 'Email já cadastrado');
    });
  });

  describe('POST /api/auth/login', () => {
    it('deve fazer login com sucesso', async () => {
      const response = await fetch('http://localhost:3000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: 'teste@exemplo.com',
          password: 'senha123',
        }),
      });

      expect(response.status).toBe(200);
      const data = await response.json();
      expect(data).toHaveProperty('token');
      expect(data).toHaveProperty('user');
      expect(data.user).toHaveProperty('id');
      expect(data.user).toHaveProperty('name', 'Usuário Teste');
      expect(data.user).toHaveProperty('email', 'teste@exemplo.com');
      expect(data.user).not.toHaveProperty('password');
    });

    it('deve retornar erro com credenciais inválidas', async () => {
      const response = await fetch('http://localhost:3000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: 'teste@exemplo.com',
          password: 'senha_errada',
        }),
      });

      expect(response.status).toBe(401);
      const data = await response.json();
      expect(data).toHaveProperty('error', 'Senha incorreta');
    });
  });
}); 