'use client'

import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function LoginPage() {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    
    try {
      const res = await signIn('credentials', {
        email: formData.get('email'),
        password: formData.get('password'),
        redirect: false,
      })

      if (res?.error) {
        setError('Email ou senha inválidos')
        return
      }

      router.push('/')
      router.refresh()
    } catch (error) {
      setError('Ocorreu um erro ao fazer login')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#101828]">
      <div className="flex bg-[#1A2233] rounded-xl shadow-lg overflow-hidden max-w-3xl w-full">
        {/* Lado Esquerdo - Ilustração */}
        <div className="hidden md:flex flex-col items-center justify-center bg-white p-8 w-1/2">
          {/* Substitua pelo seu SVG/Imagem */}
          <div className="w-64 h-64 bg-gray-200 rounded-full" />
        </div>
        
        {/* Lado Direito - Formulário */}
        <div className="flex flex-col justify-center p-8 w-full md:w-1/2">
          <div className="flex flex-col items-center mb-6">
            <h2 className="text-2xl font-bold text-white mt-4">Bem Vindo!</h2>
            <p className="text-gray-400 text-sm mt-1">
              Vamos começar acessando sua conta
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="bg-red-500/10 border border-red-500 text-red-500 px-4 py-2 rounded">
                {error}
              </div>
            )}

            <div>
              <label className="block text-gray-300 mb-1">Email</label>
              <input
                type="email"
                name="email"
                placeholder="Digite seu email"
                className="w-full px-4 py-2 rounded bg-[#232D43] text-white border border-[#232D43] focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-gray-300 mb-1">Senha</label>
              <input
                type="password"
                name="password"
                placeholder="Digite sua senha"
                className="w-full px-4 py-2 rounded bg-[#232D43] text-white border border-[#232D43] focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full py-2 rounded bg-blue-500 hover:bg-blue-600 text-white font-semibold transition"
            >
              Login
            </button>
          </form>

          <div className="flex flex-col items-center mt-4">
            <a href="/register" className="text-blue-400 text-sm hover:underline">
              Não tenho cadastro
            </a>
            <a href="#" className="text-gray-400 text-xs mt-1 hover:underline">
              Não consigo realizar o login
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
