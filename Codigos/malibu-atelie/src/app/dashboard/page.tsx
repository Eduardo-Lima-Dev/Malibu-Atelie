"use client"

import { FiHome, FiBox, FiPlusCircle, FiEdit, FiTrash2, FiLogOut } from 'react-icons/fi'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Paginacao from '@/components/Paginacao'
import ModalCadastrarProduto from '@/components/ModalCadastrarProduto'

interface Produto {
  id: number
  name: string
  price: number | string
  description?: string
  categoryId?: number
  images: { url: string, filename: string }[]
}

// Modal de confirmação simples
function ModalConfirmarExclusao({ open, onClose, onConfirm, produto }: { open: boolean, onClose: () => void, onConfirm: () => void, produto?: Produto | null }) {
  if (!open || !produto) return null
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-sm relative">
        <h2 className="text-lg font-bold mb-4">Confirmar exclusão</h2>
        <p className="mb-6">Deseja realmente excluir o produto <span className="font-semibold">{produto.name}</span>?</p>
        <div className="flex justify-end gap-2">
          <button className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300" onClick={onClose}>Cancelar</button>
          <button className="px-4 py-2 rounded bg-red-500 text-white hover:bg-red-600" onClick={onConfirm}>Excluir</button>
        </div>
      </div>
    </div>
  )
}

export default function DashboardPage() {
  const [pagina, setPagina] = useState(1)
  const itensPorPagina = 10
  const [produtos, setProdutos] = useState<Produto[]>([])
  const [modalOpen, setModalOpen] = useState(false)
  const [produtoEdicao, setProdutoEdicao] = useState<Produto | null>(null)
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [modalConfirmOpen, setModalConfirmOpen] = useState(false)
  const [produtoExcluir, setProdutoExcluir] = useState<Produto | null>(null)

  async function fetchProdutos() {
    setLoading(true)
    try {
      const res = await fetch('/api/products', {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token') || ''}` }
      })
      if (!res.ok) throw new Error('Erro ao buscar produtos')
      const data = await res.json()
      setProdutos(data)
    } catch (e) {
      setProdutos([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProdutos()
  }, [])

  function handleLogout() {
    localStorage.removeItem('token')
    router.push('/login')
  }

  // Paginação
  const totalProdutos = produtos.length
  const produtosPagina = produtos.slice((pagina - 1) * itensPorPagina, pagina * itensPorPagina)

  function handleEditar(produto: Produto) {
    setProdutoEdicao(produto)
    setModalOpen(true)
  }

  function handleFecharModal() {
    setModalOpen(false)
    setProdutoEdicao(null)
    fetchProdutos()
  }

  async function handleExcluirProduto() {
    if (!produtoExcluir) return
    try {
      const res = await fetch(`/api/products/${produtoExcluir.id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token') || ''}` }
      })
      if (!res.ok) throw new Error('Erro ao excluir produto')
      setModalConfirmOpen(false)
      setProdutoExcluir(null)
      fetchProdutos()
    } catch (e) {
      alert('Erro ao excluir produto')
    }
  }

  return (
    <div className="min-h-screen bg-[#f8fafd] flex flex-col md:flex-row">
      <aside className="bg-white border-b md:border-b-0 md:border-r w-full md:w-64 flex flex-row md:flex-col gap-4 md:gap-8 p-4 md:p-8 items-center md:items-start justify-between md:justify-start">
        <div className="text-2xl font-bold mb-0 md:mb-8">Malibu Ateliê</div>
        <nav className="flex flex-row md:flex-col gap-4 w-full md:w-auto justify-end md:justify-start">
          <a href="/" className="flex items-center gap-2 text-marrom py-2 hover:bg-caramelo rounded transition px-2 md:px-0">
            <FiHome size={20} /> <span className="hidden sm:inline">Dashboard</span>
          </a>
          <button type="button" onClick={() => { setProdutoEdicao(null); setModalOpen(true); }} className="flex items-center gap-2 text-marrom py-2 hover:bg-caramelo rounded transition px-2 md:px-0 w-full md:w-auto">
            <FiPlusCircle size={20} /> <span className="hidden sm:inline">Cadastrar Produto</span>
          </button>
          <button type="button" onClick={handleLogout} className="flex items-center gap-2 text-marrom py-2 hover:bg-red-100 rounded transition px-2 md:px-0 w-full md:w-auto">
            <FiLogOut size={20} /> <span className="hidden sm:inline">Logout</span>
          </button>
        </nav>
      </aside>
      <main className="flex-1 p-4 md:p-8">
        <div className="bg-white rounded-xl shadow p-4 md:p-8 overflow-x-auto">
          <h2 className="text-2xl font-bold mb-4">Lista de Produtos</h2>
          {loading ? (
            <div className="text-center text-gray-500 py-8">Carregando produtos...</div>
          ) : (
            <>
              <table className="w-full text-left mb-4">
                <thead>
                  <tr className="border-b">
                    <th className="py-2 px-2">Imagem</th>
                    <th className="py-2 px-2">Nome</th>
                    <th className="py-2 px-2">Editar</th>
                    <th className="py-2 px-2">Excluir</th>
                    <th className="py-2 px-2">Valor</th>
                  </tr>
                </thead>
                <tbody>
                  {produtosPagina.map(produto => (
                    <tr key={produto.id} className="border-b last:border-0">
                      <td className="py-2 px-2">
                        {produto.images && produto.images.length > 0 ? (
                          <img
                            src={produto.images[0].url}
                            alt={produto.name}
                            className="w-16 h-20 object-cover rounded"
                            style={{ aspectRatio: '1080/1350' }}
                          />
                        ) : (
                          <span className="text-gray-400 italic">Sem imagem</span>
                        )}
                      </td>
                      <td className="py-2 px-2">{produto.name}</td>
                      <td className="py-2 px-2">
                        <button className="text-blue-600 hover:text-blue-800" title="Editar" onClick={() => handleEditar(produto)}>
                          <FiEdit size={20} />
                        </button>
                      </td>
                      <td className="py-2 px-2">
                        <button className="text-red-500 hover:text-red-700" title="Excluir" onClick={() => { setProdutoExcluir(produto); setModalConfirmOpen(true); }}>
                          <FiTrash2 size={20} />
                        </button>
                      </td>
                      <td className="py-2 px-2">R$ {Number(produto.price).toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <Paginacao
                paginaAtual={pagina}
                totalItens={totalProdutos}
                itensPorPagina={itensPorPagina}
                onChange={setPagina}
              />
            </>
          )}
        </div>
        <ModalCadastrarProduto open={modalOpen} onClose={handleFecharModal} onProdutoCriado={fetchProdutos} produtoEdicao={produtoEdicao} />
        <ModalConfirmarExclusao open={modalConfirmOpen} onClose={() => { setModalConfirmOpen(false); setProdutoExcluir(null); }} onConfirm={handleExcluirProduto} produto={produtoExcluir} />
      </main>
    </div>
  )
}
