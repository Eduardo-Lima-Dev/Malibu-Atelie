"use client"

import { FiHome, FiBox, FiPlusCircle, FiEdit, FiTrash2, FiLogOut, FiMenu } from 'react-icons/fi'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Paginacao from '@/components/Paginacao'
import ModalCadastrarProduto from '@/components/ModalCadastrarProduto'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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
  const [sidebarOpen, setSidebarOpen] = useState(false)

  async function fetchProdutos() {
    setLoading(true)
    try {
      const res = await fetch('/api/products', {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token') || ''}` }
      })
      if (res.status === 401 || res.status === 403) {
        toast.error('Sua sessão expirou. Faça login novamente.')
        setProdutos([])
        setLoading(false)
        setTimeout(() => router.push('/login'), 2000)
        return
      }
      if (!res.ok) throw new Error('Erro ao buscar produtos')
      const data = await res.json()
      setProdutos(data)
    } catch (e) {
      toast.error('Erro ao buscar produtos. Tente novamente.')
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
      if (res.status === 401 || res.status === 403) {
        toast.error('Sua sessão expirou. Faça login novamente.')
        setModalConfirmOpen(false)
        setProdutoExcluir(null)
        setTimeout(() => router.push('/login'), 2000)
        return
      }
      if (!res.ok) throw new Error('Erro ao excluir produto')
      toast.success('Produto excluído com sucesso!')
      setModalConfirmOpen(false)
      setProdutoExcluir(null)
      fetchProdutos()
    } catch (e) {
      toast.error('Erro ao excluir produto. Tente novamente.')
    }
  }

  return (
    <div className="min-h-screen bg-[#f8fafd] flex flex-col md:flex-row">
      {/* Header fixo mobile */}
      <header className="fixed top-0 left-0 right-0 z-30 bg-white shadow-sm md:hidden px-2">
        <div className="flex items-center justify-between p-4">
          <h1 className="text-xl font-bold text-marrom">Malibu Ateliê</h1>
          <button
            className="bg-gray-200 p-2 rounded-full"
            onClick={() => setSidebarOpen(true)}
            aria-label="Abrir menu"
          >
            <FiMenu size={24} className="text-marrom" />
          </button>
        </div>
      </header>
      {/* Sidebar drawer mobile */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          {/* Overlay */}
          <div className="flex-1 bg-black/40" onClick={() => setSidebarOpen(false)} />
          {/* Sidebar */}
          <aside className="w-64 bg-white h-full flex flex-col items-center py-6 shadow-2xl">
            <div className="text-2xl font-bold mb-8">Malibu Ateliê</div>
            <nav className="flex flex-col gap-4 w-full px-6">
              <a href="/" className="flex items-center gap-3 text-marrom py-2 hover:bg-caramelo rounded transition text-left w-full px-4 text-base" onClick={() => setSidebarOpen(false)}>
                <FiHome size={20} /> <span>Home</span>
              </a>
              <button type="button" onClick={() => { setProdutoEdicao(null); setModalOpen(true); setSidebarOpen(false); }} className="flex items-center gap-3 text-marrom py-2 hover:bg-caramelo rounded transition text-left w-full px-4 text-base">
                <FiPlusCircle size={20} /> <span>Cadastrar Produto</span>
              </button>
              <button type="button" onClick={() => { handleLogout(); setSidebarOpen(false); }} className="flex items-center gap-3 text-marrom py-2 hover:bg-red-100 rounded transition text-left w-full px-4 text-base">
                <FiLogOut size={20} /> <span>Logout</span>
              </button>
            </nav>
          </aside>
        </div>
      )}
      {/* Sidebar desktop sempre visível e igual ao layout original */}
      <aside className="hidden md:flex bg-white border-b md:border-b-0 md:border-r w-64 flex-col gap-8 p-8 items-start justify-start">
        <div className="text-2xl font-bold mb-8">Malibu Ateliê</div>
        <nav className="flex flex-col gap-4 w-full">
          <a href="/" className="flex items-center gap-3 text-marrom py-2 hover:bg-caramelo rounded transition text-left w-full px-4 text-base">
            <FiHome size={20} /> <span>Home</span>
          </a>
          <button type="button" onClick={() => { setProdutoEdicao(null); setModalOpen(true); }} className="flex items-center gap-3 text-marrom py-2 hover:bg-caramelo rounded transition text-left w-full px-4 text-base">
            <FiPlusCircle size={20} /> <span>Cadastrar Produto</span>
          </button>
          <button type="button" onClick={handleLogout} className="flex items-center gap-3 text-marrom py-2 hover:bg-red-100 rounded transition text-left w-full px-4 text-base">
            <FiLogOut size={20} /> <span>Logout</span>
          </button>
        </nav>
      </aside>
      {/* Conteúdo principal */}
      <main className="flex-1 p-4 md:p-8 pt-24">
        <div className="bg-white rounded-xl shadow p-2 md:p-8 overflow-x-auto">
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
        <ToastContainer position="top-center" autoClose={4000} hideProgressBar={false} newestOnTop closeOnClick pauseOnFocusLoss draggable pauseOnHover />
      </main>
    </div>
  )
}
