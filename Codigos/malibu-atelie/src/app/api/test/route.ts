import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    // Teste simples de conexão
    const result = await prisma.$queryRaw`SELECT 1 as test`
    
    return NextResponse.json({
      status: 'success',
      message: 'Prisma está funcionando',
      test: result
    })
  } catch (error) {
    console.error('Erro no teste do Prisma:', error)
    
    return NextResponse.json({
      status: 'error',
      message: 'Erro no Prisma',
      error: error instanceof Error ? error.message : 'Erro desconhecido'
    }, { status: 500 })
  }
} 