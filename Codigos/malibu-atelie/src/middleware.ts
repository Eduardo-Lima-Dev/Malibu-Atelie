import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { jwtVerify } from 'jose'

export async function middleware(request: NextRequest) {
  // Lista de rotas que precisam de autenticação
  const protectedRoutes = ['/api/users']
  
  // Rotas de produtos que precisam de autenticação (exceto GET)
  const isProductRoute = request.nextUrl.pathname.startsWith('/api/products')
  const isProductGet = isProductRoute && request.method === 'GET'
  
  // Verifica se a rota atual precisa de autenticação
  const isProtectedRoute = protectedRoutes.some(route => 
    request.nextUrl.pathname.startsWith(route)
  ) || (isProductRoute && !isProductGet)

  console.log('Rota:', request.nextUrl.pathname)
  console.log('Método:', request.method)
  console.log('Protegida:', isProtectedRoute)

  if (isProtectedRoute) {
    const authHeader = request.headers.get('authorization')
    console.log('Authorization header:', authHeader)
    
    if (!authHeader) {
      console.log('Token não fornecido')
      return NextResponse.json(
        { error: 'Token não fornecido' },
        { status: 401 }
      )
    }

    const token = authHeader.split(' ')[1]
    console.log('Token extraído:', token)
    
    if (!token) {
      console.log('Formato do token inválido')
      return NextResponse.json(
        { error: 'Formato do token inválido' },
        { status: 401 }
      )
    }

    try {
      if (!process.env.NEXTAUTH_SECRET) {
        console.error('NEXTAUTH_SECRET não está definido')
        return NextResponse.json(
          { error: 'Erro de configuração do servidor' },
          { status: 500 }
        )
      }

      // Verifica o token usando jose
      const secret = new TextEncoder().encode(process.env.NEXTAUTH_SECRET)
      const { payload } = await jwtVerify(token, secret)
      console.log('Token verificado com sucesso. Payload:', payload)
      
      if (!payload || !payload.id) {
        console.log('Token inválido: payload ou id não encontrado')
        return NextResponse.json(
          { error: 'Token inválido ou expirado' },
          { status: 401 }
        )
      }
      
      // Adiciona o usuário decodificado ao request
      const requestHeaders = new Headers(request.headers)
      requestHeaders.set('x-user-id', payload.id as string)
      
      return NextResponse.next({
        request: {
          headers: requestHeaders,
        },
      })
    } catch (error) {
      console.error('Erro ao verificar token:', error)
      return NextResponse.json(
        { error: 'Token inválido ou expirado' },
        { status: 401 }
      )
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: '/api/:path*'
} 