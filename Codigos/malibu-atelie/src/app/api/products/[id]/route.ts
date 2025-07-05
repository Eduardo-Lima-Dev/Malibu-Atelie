import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { productSchema } from '@/lib/validation/product'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { jwtVerify } from 'jose'
import { Prisma } from '@prisma/client'
import { Decimal } from 'decimal.js'

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const product = await prisma.product.findUnique({
    where: { id: Number(id) },
  })
  if (!product) {
    return NextResponse.json({ error: 'Produto não encontrado' }, { status: 404 })
  }
  return NextResponse.json(product)
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
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

    const productId = parseInt(id)
    if (isNaN(productId)) {
      return NextResponse.json(
        { error: 'ID do produto inválido' },
        { status: 400 }
      )
    }

    // Verifica se o produto existe e pertence ao usuário
    const existingProduct = await prisma.product.findFirst({
      where: {
        id: productId,
        userId: payload.id as number
      }
    })

    console.log('Produto existente:', existingProduct)

    if (!existingProduct) {
      return NextResponse.json(
        { error: 'Produto não encontrado ou você não tem permissão para excluí-lo' },
        { status: 404 }
      )
    }

    // Deleta o produto
    await prisma.product.delete({
      where: { id: productId }
    })

    return NextResponse.json({ message: 'Produto deletado com sucesso' })
  } catch (error) {
    console.error('Erro ao deletar produto:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

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

// Atualizar um produto
export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
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

    const productId = parseInt(id)
    if (isNaN(productId)) {
      return NextResponse.json(
        { error: 'ID do produto inválido' },
        { status: 400 }
      )
    }

    const body = await req.json()
    console.log('Corpo da requisição:', body)
    
    const { name, description, price, categoryId } = body

    // Verifica se o produto existe e pertence ao usuário
    const existingProduct = await prisma.product.findFirst({
      where: {
        id: productId,
        userId: payload.id as number
      }
    })

    console.log('Produto existente:', existingProduct)

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

      console.log('Categoria encontrada:', category)

      if (!category) {
        return NextResponse.json(
          { error: 'Categoria não encontrada' },
          { status: 404 }
        )
      }
    }

    // Atualiza o produto
    const updatedProduct = await prisma.product.update({
      where: { id: productId },
      data: {
        name: name || undefined,
        description: description || undefined,
        price: price ? new Decimal(price) : undefined,
        categoryId: categoryId || undefined
      },
      include: {
        category: true,
        images: true
      }
    })

    console.log('Produto atualizado:', updatedProduct)

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

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
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

    const productId = parseInt(id)
    if (isNaN(productId)) {
      return NextResponse.json(
        { error: 'ID do produto inválido' },
        { status: 400 }
      )
    }

    const body = await req.json()
    console.log('Corpo da requisição:', body)
    
    const { name, description, price, categoryId } = body

    // Verifica se o produto existe e pertence ao usuário
    const existingProduct = await prisma.product.findFirst({
      where: {
        id: productId,
        userId: payload.id as number
      }
    })

    console.log('Produto existente:', existingProduct)

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
      where: { id: productId },
      data: {
        name: name || undefined,
        description: description || undefined,
        price: price ? new Decimal(price) : undefined,
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