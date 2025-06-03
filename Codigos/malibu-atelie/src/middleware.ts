import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { jwtVerify } from 'jose'

export async function middleware(request: NextRequest) {
  // Lista de rotas que precisam de autenticação
  const protectedRoutes = ['/api/users', '/api/products']
  
  // Verifica se a rota atual precisa de autenticação
  const isProtectedRoute = protectedRoutes.some(route => 
    request.nextUrl.pathname.startsWith(route)
  )

  if (isProtectedRoute) {
    const authHeader = request.headers.get('authorization')
    
    if (!authHeader) {
      return NextResponse.json(
        { error: 'Token não fornecido' },
        { status: 401 }
      )
    }

    const token = authHeader.split(' ')[1]
    
    if (!token) {
      return NextResponse.json(
        { error: 'Formato do token inválido' },
        { status: 401 }
      )
    }

    try {
      // Verifica o token usando jose
      const secret = new TextEncoder().encode(
        process.env.NEXTAUTH_SECRET || 'fallback_secret'
      )
      
      const { payload } = await jwtVerify(token, secret)
      
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