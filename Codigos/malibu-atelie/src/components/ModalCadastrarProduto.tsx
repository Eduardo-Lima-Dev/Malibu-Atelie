"use client"

import { useEffect, useState, useRef } from 'react'
import { FiPlus, FiTrash2 } from 'react-icons/fi'
import { toast } from 'react-toastify';

interface Categoria {
  id: number
  name: string
}

interface ProdutoEdicao {
  id: number
  name: string
  description?: string
  price: number | string
  categoryId?: number
  images?: { filename: string, url: string }[] // Adicionado para suportar imagens no produtoEdicao
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
    categoryId: ''
  })
  const [loading, setLoading] = useState(false)
  const [erro, setErro] = useState('')
  const [sucesso, setSucesso] = useState('')
  const [fileName, setFileName] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)
  const [images, setImages] = useState<{ filename: string, url: string }[]>([])
  const inputFileRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (open) {
      buscarCategorias()
      setShowCriarCategoria(false)
      setFileName(null)
      if (produtoEdicao) {
        setForm({
          name: produtoEdicao.name || '',
          description: produtoEdicao.description || '',
          price: String(produtoEdicao.price ?? ''),
          categoryId: produtoEdicao.categoryId ? String(produtoEdicao.categoryId) : ''
        })
        // Carregar imagem existente ao editar
        if ((produtoEdicao as any).images && (produtoEdicao as any).images.length > 0) {
          setImages((produtoEdicao as any).images)
        } else {
        setImages([])
        }
      } else {
        setForm({ name: '', description: '', price: '', categoryId: '' })
        setImages([])
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
    if (images.length === 0) {
      toast.error('Selecione uma imagem para o produto.')
      setLoading(false)
      return
    }
    try {
      let res
      const body = {
        ...form,
        categoryId: form.categoryId ? Number(form.categoryId) : undefined,
        images,
      }
      if (produtoEdicao) {
        // Edição
        res = await fetch(`/api/products/${produtoEdicao.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token') || ''}`
          },
          body: JSON.stringify(body)
        })
      } else {
        // Criação
        res = await fetch('/api/products', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token') || ''}`
          },
          body: JSON.stringify(body)
        })
      }
      if (!res.ok) throw new Error(produtoEdicao ? 'Erro ao editar produto' : 'Erro ao criar produto')
      toast.success(produtoEdicao ? 'Produto editado com sucesso!' : 'Produto cadastrado com sucesso!')
      onClose();
      setForm({ name: '', description: '', price: '', categoryId: '' })
      setImages([])
      onProdutoCriado?.()
    } catch (e) {
      toast.error(produtoEdicao ? 'Erro ao editar produto' : 'Erro ao criar produto')
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
            <input
              type="text"
              inputMode="decimal"
              className="w-full border rounded px-3 py-2"
              value={form.price ? Number(form.price).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) : ''}
              onChange={e => {
                // Remove tudo que não for número
                const raw = e.target.value.replace(/[^\d]/g, '');
                // Divide por 100 para ter centavos
                const valor = raw ? (parseInt(raw, 10) / 100).toFixed(2) : '';
                setForm(f => ({ ...f, price: valor }));
              }}
              required
              placeholder="R$ 0,00"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Imagem</label>
            {images.length > 0 ? (
              <div className="flex flex-col items-center mt-2 relative">
                <img
                  src={images[0].url}
                  alt="Preview"
                  className="w-32 h-32 object-cover rounded border mb-2"
                />
                <button
                  type="button"
                  className="absolute top-0 right-0 bg-white rounded-full p-1 shadow hover:bg-red-100"
                  title="Remover imagem"
                  onClick={() => setImages([])}
                >
                  <FiTrash2 className="text-red-500" size={20} />
                </button>
                {fileName && (
                  <span className="text-xs text-gray-600">{fileName}</span>
                )}
              </div>
            ) : (
            <label
              className="flex flex-col items-center justify-center border-2 border-dashed border-[#3d4fc5] rounded-lg p-4 cursor-pointer hover:bg-[#f5f7ff] transition"
              htmlFor="file-upload"
            >
              <FiPlus size={32} className="text-[#3d4fc5] mb-2" />
              <span className="text-[#3d4fc5] font-medium">
                Clique para selecionar uma imagem
              </span>
              <input
                ref={inputFileRef}
                id="file-upload"
                type="file"
                accept="image/*"
                className="hidden"
                onClick={e => { (e.target as HTMLInputElement).value = ''; }}
                onChange={async (e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  setUploading(true);
                  const formData = new FormData();
                  formData.append('file', file);
                  const res = await fetch('/api/upload', {
                    method: 'POST',
                    body: formData,
                    headers: {
                      'Authorization': `Bearer ${localStorage.getItem('token') || ''}`
                    }
                  });
                  const data = await res.json();
                  if (data.url) {
                    setFileName(file.name);
                      setImages([{ filename: file.name, url: data.url }]); // sobrescreve!
                  } else {
                    setErro('Erro ao fazer upload da imagem.');
                  }
                  setUploading(false);
                }}
              />
              {uploading && <span className="text-xs text-gray-500 mt-2">Enviando imagem...</span>}
            </label>
            )}
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
          <button type="submit" className="w-full bg-[#3d4fc5] text-white py-2 rounded mt-2" disabled={loading}>{loading ? (produtoEdicao ? 'Salvando...' : 'Cadastrando...') : (produtoEdicao ? 'Salvar Alterações' : 'Cadastrar Produto')}</button>
        </form>
      </div>
    </div>
  )
} 