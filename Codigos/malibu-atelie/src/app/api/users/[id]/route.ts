import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { userRegisterSchema } from '@/lib/validation/user'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import bcrypt from 'bcryptjs'

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)
  if (!session?.user) {
    return NextResponse.json({ error: 'Não autenticado' }, { status: 401 })
  }

  const user = await prisma.user.findUnique({
    where: { id: Number(params.id) },
    select: {
      id: true,
      name: true,
      email: true,
      createdAt: true,
      updatedAt: true
    }
  })

  if (!user) {
    return NextResponse.json({ error: 'Usuário não encontrado' }, { status: 404 })
  }

  return NextResponse.json(user)
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)
  if (!session?.user) {
    return NextResponse.json({ error: 'Não autenticado' }, { status: 401 })
  }

  // Verifica se o usuário está tentando deletar seu próprio perfil
  if (Number(session.user.id) !== Number(params.id)) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 403 })
  }

  await prisma.user.delete({
    where: { id: Number(params.id) }
  })

  return NextResponse.json({ message: 'Usuário deletado' })
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)
  if (!session?.user) {
    return NextResponse.json({ error: 'Não autenticado' }, { status: 401 })
  }

  // Verifica se o usuário está tentando atualizar seu próprio perfil
  if (Number(session.user.id) !== Number(params.id)) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 403 })
  }

  const body = await req.json()
  const parse = userRegisterSchema.safeParse(body)
  if (!parse.success) {
    return NextResponse.json({ errors: parse.error.flatten() }, { status: 400 })
  }

  const { name, email, password } = parse.data

  // Verifica se o novo email já existe (exceto para o próprio usuário)
  const emailExists = await prisma.user.findFirst({
    where: {
      email,
      id: { not: Number(params.id) }
    }
  })

  if (emailExists) {
    return NextResponse.json({ error: 'E-mail já cadastrado' }, { status: 409 })
  }

  const hashed = await bcrypt.hash(password, 10)
  const user = await prisma.user.update({
    where: { id: Number(params.id) },
    data: { name, email, password: hashed },
    select: {
      id: true,
      name: true,
      email: true,
      createdAt: true,
      updatedAt: true
    }
  })

  return NextResponse.json(user)
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)
  if (!session?.user) {
    return NextResponse.json({ error: 'Não autenticado' }, { status: 401 })
  }

  // Verifica se o usuário está tentando atualizar seu próprio perfil
  if (Number(session.user.id) !== Number(params.id)) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 403 })
  }

  const body = await req.json()
  
  // Se houver senha, faz o hash
  if (body.password) {
    body.password = await bcrypt.hash(body.password, 10)
  }

  // Se houver email, verifica se já existe
  if (body.email) {
    const emailExists = await prisma.user.findFirst({
      where: {
        email: body.email,
        id: { not: Number(params.id) }
      }
    })

    if (emailExists) {
      return NextResponse.json({ error: 'E-mail já cadastrado' }, { status: 409 })
    }
  }

  const user = await prisma.user.update({
    where: { id: Number(params.id) },
    data: body,
    select: {
      id: true,
      name: true,
      email: true,
      createdAt: true,
      updatedAt: true
    }
  })

  return NextResponse.json(user)
} 