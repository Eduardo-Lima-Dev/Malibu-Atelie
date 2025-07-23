import React from 'react'

interface PaginacaoProps {
  paginaAtual: number
  totalItens: number
  itensPorPagina?: number
  onChange: (pagina: number) => void
}

export default function Paginacao({ paginaAtual, totalItens, itensPorPagina = 10, onChange }: PaginacaoProps) {
  const totalPaginas = Math.ceil(totalItens / itensPorPagina)
  if (totalPaginas <= 1) return null

  // Gera as páginas para exibir (máximo 5 páginas, com ... se necessário)
  let paginas: (number | string)[] = []
  if (totalPaginas <= 5) {
    paginas = Array.from({ length: totalPaginas }, (_, i) => i + 1)
  } else {
    if (paginaAtual <= 3) {
      paginas = [1, 2, 3, 4, '...', totalPaginas]
    } else if (paginaAtual >= totalPaginas - 2) {
      paginas = [1, '...', totalPaginas - 3, totalPaginas - 2, totalPaginas - 1, totalPaginas]
    } else {
      paginas = [1, '...', paginaAtual - 1, paginaAtual, paginaAtual + 1, '...', totalPaginas]
    }
  }

  return (
    <nav className="flex flex-wrap items-center justify-center gap-2 mt-8 select-none">
      <button
        className="px-2 py-1 rounded border border-marrom text-black disabled:opacity-40 bg-[#F4EDE4]"
        onClick={() => onChange(paginaAtual - 1)}
        disabled={paginaAtual === 1}
        aria-label="Página anterior"
      >
        &lt;
      </button>
      {paginas.map((p, i) =>
        typeof p === 'number' ? (
          <button
            key={p}
            className={`px-3 py-1 rounded font-medium border border-marrom transition-colors duration-150 ${paginaAtual === p ? 'bg-black text-[#F4EDE4]' : 'bg-[#F4EDE4] text-marrom hover:bg-marrom hover:text-[#F4EDE4]'}`}
            onClick={() => onChange(p)}
            aria-current={paginaAtual === p ? 'page' : undefined}
          >
            {p}
          </button>
        ) : (
          <span key={i} className="px-2 text-marrom">...</span>
        )
      )}
      <button
        className="px-2 py-1 rounded border border-marrom text-black disabled:opacity-40 bg-[#F4EDE4]"
        onClick={() => onChange(paginaAtual + 1)}
        disabled={paginaAtual === totalPaginas}
        aria-label="Próxima página"
      >
        &gt;
      </button>
    </nav>
  )
} 