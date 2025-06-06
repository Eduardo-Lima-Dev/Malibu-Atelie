import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { jwtVerify } from 'jose'
import { Prisma } from '@prisma/client'
import { Decimal } from 'decimal.js'

// Função auxiliar para verificar o token
async function verifyToken(token: string) {
  try {
    console.log('Verificando token...')
    if (!process.env.NEXTAUTH_SECRET) {
      console.error('NEXTAUTH_SECRET não está definido')
      return null
    }

    const secret = new TextEncoder().encode(process.env.NEXTAUTH_SECRET)
    const { payload } = await jwtVerify(token, secret)
    console.log('Token verificado com sucesso. Payload:', payload)
    return payload
  } catch (error) {
    console.error('Erro ao verificar token:', error)
    return null
  }
}

// Listar todos os produtos
export async function GET(req: NextRequest) {
  try {
    const products = await prisma.product.findMany({
      include: {
        category: true,
        images: true
      }
    })

    return NextResponse.json(products)
  } catch (error) {
    console.error('Erro ao buscar produtos:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get('authorization')
    console.log('Authorization header:', authHeader)
    
    if (!authHeader) {
      return NextResponse.json(
        { error: 'Token não fornecido' },
        { status: 401 }
      )
    }

    const token = authHeader.split(' ')[1]
    console.log('Token extraído:', token)

    if (!token) {
      return NextResponse.json(
        { error: 'Formato do token inválido' },
        { status: 401 }
      )
    }

    const payload = await verifyToken(token)
    console.log('Payload após verificação:', payload)

    if (!payload || !payload.id) {
      return NextResponse.json(
        { error: 'Token inválido ou expirado' },
        { status: 401 }
      )
    }

    // Verifica se o usuário existe
    const user = await prisma.user.findUnique({
      where: { id: payload.id as number }
    })

    console.log('Usuário encontrado:', user)

    if (!user) {
      return NextResponse.json(
        { error: 'Usuário não encontrado' },
        { status: 404 }
      )
    }

    const body = await req.json()
    const { name, description, price, image, categoryId } = body

    if (!name || !description || !price || !categoryId) {
      return NextResponse.json(
        { error: 'Nome, descrição, preço e categoria são obrigatórios' },
        { status: 400 }
      )
    }

    // Verifica se a categoria existe
    const category = await prisma.category.findUnique({
      where: { id: categoryId }
    })

    console.log('Categoria encontrada:', category)

    if (!category) {
      return NextResponse.json(
        { error: 'Categoria não encontrada' },
        { status: 404 }
      )
    }

    console.log('Criando produto com os dados:', {
      name,
      description,
      price,
      image,
      categoryId,
      userId: payload.id
    })

    const product = await prisma.product.create({
      data: {
        name,
        description,
        price: new Decimal(price),
        image,
        categoryId,
        userId: payload.id as number
      },
      include: {
        category: true
      }
    })

    console.log('Produto criado com sucesso:', product)

    return NextResponse.json(product)
  } catch (error) {
    console.error('Erro ao criar produto:', error)
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2003') {
        return NextResponse.json(
          { error: 'Categoria ou usuário não encontrado' },
          { status: 404 }
        )
      }
    }
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

// Atualizar um produto
export async function PUT(req: NextRequest) {
  try {
    const authHeader = req.headers.get('authorization')
    console.log('Authorization header:', authHeader)
    
    if (!authHeader) {
      return NextResponse.json(
        { error: 'Token não fornecido' },
        { status: 401 }
      )
    }

    const token = authHeader.split(' ')[1]
    console.log('Token extraído:', token)

    if (!token) {
      return NextResponse.json(
        { error: 'Formato do token inválido' },
        { status: 401 }
      )
    }

    const payload = await verifyToken(token)
    console.log('Payload após verificação:', payload)

    if (!payload || !payload.id) {
      return NextResponse.json(
        { error: 'Token inválido ou expirado' },
        { status: 401 }
      )
    }

    // Verifica se o usuário existe
    const user = await prisma.user.findUnique({
      where: { id: payload.id as number }
    })

    console.log('Usuário encontrado:', user)

    if (!user) {
      return NextResponse.json(
        { error: 'Usuário não encontrado' },
        { status: 404 }
      )
    }

    const body = await req.json()
    const { id, name, description, price, image, categoryId } = body

    if (!id) {
      return NextResponse.json(
        { error: 'ID do produto é obrigatório' },
        { status: 400 }
      )
    }

    // Verifica se o produto existe e pertence ao usuário
    const existingProduct = await prisma.product.findFirst({
      where: {
        id,
        userId: payload.id as number
      }
    })

    if (!existingProduct) {
      return NextResponse.json(
        { error: 'Produto não encontrado ou você não tem permissão para editá-lo' },
        { status: 404 }
      )
    }

    // Verifica se a categoria existe (se foi fornecida)
    if (categoryId) {
      const category = await prisma.category.findUnique({
        where: { id: categoryId }
      })

      if (!category) {
        return NextResponse.json(
          { error: 'Categoria não encontrada' },
          { status: 404 }
        )
      }
    }

    // Atualiza o produto
    const updatedProduct = await prisma.product.update({
      where: { id },
      data: {
        name: name || undefined,
        description: description || undefined,
        price: price ? new Decimal(price) : undefined,
        image: image || undefined,
        categoryId: categoryId || undefined
      },
      include: {
        category: true,
        images: true
      }
    })

    return NextResponse.json(updatedProduct)
  } catch (error) {
    console.error('Erro ao atualizar produto:', error)
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2003') {
        return NextResponse.json(
          { error: 'Categoria não encontrada' },
          { status: 404 }
        )
      }
    }
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}


