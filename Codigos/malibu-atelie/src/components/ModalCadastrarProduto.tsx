"use client"

import { useEffect, useState } from 'react'
import { FiPlus } from 'react-icons/fi'

interface Categoria {
  id: number
  name: string
}

interface ProdutoEdicao {
  id: number
  name: string
  description?: string
  price: number | string
  image: string
  categoryId?: number
}

interface ModalCadastrarProdutoProps {
  open: boolean
  onClose: () => void
  onProdutoCriado?: () => void
  produtoEdicao?: ProdutoEdicao | null
}

export default function ModalCadastrarProduto({ open, onClose, onProdutoCriado, produtoEdicao }: ModalCadastrarProdutoProps) {
  const [categorias, setCategorias] = useState<Categoria[]>([])
  const [loadingCategorias, setLoadingCategorias] = useState(false)
  const [criandoCategoria, setCriandoCategoria] = useState(false)
  const [novaCategoria, setNovaCategoria] = useState('')
  const [showCriarCategoria, setShowCriarCategoria] = useState(false)
  const [form, setForm] = useState({
    name: '',
    description: '',
    price: '',
    image: '',
    categoryId: ''
  })
  const [loading, setLoading] = useState(false)
  const [erro, setErro] = useState('')
  const [sucesso, setSucesso] = useState('')

  useEffect(() => {
    if (open) {
      buscarCategorias()
      setShowCriarCategoria(false)
      if (produtoEdicao) {
        setForm({
          name: produtoEdicao.name || '',
          description: produtoEdicao.description || '',
          price: String(produtoEdicao.price ?? ''),
          image: produtoEdicao.image || '',
          categoryId: produtoEdicao.categoryId ? String(produtoEdicao.categoryId) : ''
        })
      } else {
        setForm({ name: '', description: '', price: '', image: '', categoryId: '' })
      }
    }
  }, [open, produtoEdicao])

  async function buscarCategorias() {
    setLoadingCategorias(true)
    setErro('')
    try {
      const res = await fetch('/api/categories', {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token') || ''}` }
      })
      if (!res.ok) throw new Error('Erro ao buscar categorias')
      const data = await res.json()
      setCategorias(data)
    } catch (e) {
      setCategorias([])
    } finally {
      setLoadingCategorias(false)
    }
  }

  async function criarCategoria() {
    if (!novaCategoria.trim()) return
    setCriandoCategoria(true)
    setErro('')
    try {
      const res = await fetch('/api/categories', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token') || ''}`
        },
        body: JSON.stringify({ name: novaCategoria })
      })
      if (!res.ok) throw new Error('Erro ao criar categoria')
      setNovaCategoria('')
      await buscarCategorias()
      setTimeout(() => {
        const nova = categorias.find(cat => cat.name === novaCategoria)
        if (nova) setForm(f => ({ ...f, categoryId: String(nova.id) }))
      }, 300)
      setShowCriarCategoria(false)
    } catch (e) {
      setErro('Erro ao criar categoria')
    } finally {
      setCriandoCategoria(false)
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setErro('')
    setSucesso('')
    try {
      let res
      if (produtoEdicao) {
        // Edição
        res = await fetch(`/api/products/${produtoEdicao.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token') || ''}`
          },
          body: JSON.stringify({
            name: form.name,
            description: form.description,
            price: Number(form.price),
            image: form.image,
            categoryId: Number(form.categoryId)
          })
        })
      } else {
        // Criação
        res = await fetch('/api/products', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token') || ''}`
          },
          body: JSON.stringify({
            name: form.name,
            description: form.description,
            price: Number(form.price),
            image: form.image,
            categoryId: Number(form.categoryId)
          })
        })
      }
      if (!res.ok) throw new Error(produtoEdicao ? 'Erro ao editar produto' : 'Erro ao criar produto')
      setSucesso(produtoEdicao ? 'Produto editado com sucesso!' : 'Produto cadastrado com sucesso!')
      setForm({ name: '', description: '', price: '', image: '', categoryId: '' })
      onProdutoCriado?.()
    } catch (e) {
      setErro(produtoEdicao ? 'Erro ao editar produto' : 'Erro ao criar produto')
    } finally {
      setLoading(false)
    }
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md relative">
        <button className="absolute top-2 right-2 text-gray-400 hover:text-gray-700 text-2xl" onClick={onClose}>&times;</button>
        <h2 className="text-xl font-bold mb-4">{produtoEdicao ? 'Editar Produto' : 'Cadastrar Produto'}</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Nome</label>
            <input type="text" className="w-full border rounded px-3 py-2" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} required />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Descrição</label>
            <textarea className="w-full border rounded px-3 py-2" value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} required />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Preço</label>
            <input type="number" step="0.01" className="w-full border rounded px-3 py-2" value={form.price} onChange={e => setForm(f => ({ ...f, price: e.target.value }))} required />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Imagem (URL)</label>
            <input type="url" className="w-full border rounded px-3 py-2" value={form.image} onChange={e => setForm(f => ({ ...f, image: e.target.value }))} required />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Categoria</label>
            {loadingCategorias ? (
              <div className="text-gray-500 text-sm">Carregando categorias...</div>
            ) : categorias.length > 0 ? (
              <div className="flex items-center gap-2">
                <select className="w-full border rounded px-3 py-2" value={form.categoryId} onChange={e => setForm(f => ({ ...f, categoryId: e.target.value }))} required>
                  <option value="">Selecione uma categoria</option>
                  {categorias.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
                <button type="button" title="Adicionar categoria" className="p-2 rounded bg-[#3d4fc5] text-white hover:bg-[#2c3991] flex items-center justify-center" onClick={() => setShowCriarCategoria(v => !v)}>
                  <FiPlus size={18} />
                </button>
              </div>
            ) : null}
            {(!loadingCategorias && categorias.length === 0) || showCriarCategoria ? (
              <div className="flex flex-col gap-2 mt-2">
                <input type="text" className="w-full border rounded px-3 py-2" placeholder="Nova categoria" value={novaCategoria} onChange={e => setNovaCategoria(e.target.value)} />
                <button type="button" className="bg-[#3d4fc5] text-white rounded px-3 py-2" onClick={criarCategoria} disabled={criandoCategoria}>{criandoCategoria ? 'Criando...' : 'Criar Categoria'}</button>
              </div>
            ) : null}
          </div>
          {erro && <div className="text-red-500 text-sm">{erro}</div>}
          {sucesso && <div className="text-green-600 text-sm">{sucesso}</div>}
          <button type="submit" className="w-full bg-[#3d4fc5] text-white py-2 rounded mt-2" disabled={loading}>{loading ? (produtoEdicao ? 'Salvando...' : 'Cadastrando...') : (produtoEdicao ? 'Salvar Alterações' : 'Cadastrar Produto')}</button>
        </form>
      </div>
    </div>
  )
} 