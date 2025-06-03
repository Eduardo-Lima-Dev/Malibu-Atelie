import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { productSchema } from '@/lib/validation/product'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const product = await prisma.product.findUnique({
    where: { id: Number(params.id) }
  })
  if (!product) {
    return NextResponse.json({ error: 'Produto não encontrado' }, { status: 404 })
  }
  return NextResponse.json(product)
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)
  if (!session?.user) {
    return NextResponse.json({ error: 'Não autenticado' }, { status: 401 })
  }
  await prisma.product.delete({
    where: { id: Number(params.id) }
  })
  return NextResponse.json({ message: 'Produto deletado' })
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)
  if (!session?.user) {
    return NextResponse.json({ error: 'Não autenticado' }, { status: 401 })
  }
  const body = await req.json()
  const parse = productSchema.safeParse(body)
  if (!parse.success) {
    return NextResponse.json({ errors: parse.error.flatten() }, { status: 400 })
  }
  const { name, value, image } = parse.data
  const product = await prisma.product.update({
    where: { id: Number(params.id) },
    data: { name, value, image }
  })
  return NextResponse.json(product)
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)
  if (!session?.user) {
    return NextResponse.json({ error: 'Não autenticado' }, { status: 401 })
  }
  const body = await req.json()
  const product = await prisma.product.update({
    where: { id: Number(params.id) },
    data: body
  })
  return NextResponse.json(product)
} 