"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { FiMail, FiLock, FiEye, FiEyeOff } from 'react-icons/fi'

export default function LoginForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    })

    const data = await res.json()
    setLoading(false)

    if (!res.ok) {
      setError(data.error || 'Erro ao fazer login')
      return
    }

    // Salva o token JWT para uso nas requisições autenticadas
    localStorage.setItem('token', data.token)

    router.push('/dashboard')
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f5efe7]">
      <div className="bg-white p-10 rounded shadow-md w-full max-w-md">
        <h1 className="text-3xl font-medium text-center mb-8">Entrar</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block mb-1 font-medium">Usuário</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                <FiMail size={20} />
              </span>
              <input
                type="email"
                className="w-full border rounded px-10 py-2 focus:outline-none"
                placeholder="email@gmail.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
              />
            </div>
          </div>
          <div>
            <label className="block mb-1 font-medium">Senha</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                <FiLock size={20} />
              </span>
              <input
                type={showPassword ? 'text' : 'password'}
                className="w-full border rounded px-10 py-2 focus:outline-none"
                placeholder="••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-500 flex items-center gap-1"
                onClick={() => setShowPassword(!showPassword)}
                tabIndex={-1}
                aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
              >
                {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                <span className="hidden sm:inline text-xs">{showPassword ? 'Ocultar' : 'Mostrar'} Senha</span>
              </button>
            </div>
          </div>
          {error && <div className="text-red-500 text-sm">{error}</div>}
          <button
            type="submit"
            className="w-full bg-[#3d4fc5] text-white py-2 rounded mt-2 flex items-center justify-center gap-2"
            disabled={loading}
          >
            {loading ? 'Entrando...' : 'Entrar'}
            <svg width="20" height="20" fill="none" viewBox="0 0 24 24"><path d="M5 12h14m-7-7 7 7-7 7" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </button>
        </form>
      </div>
    </div>
  )
} 