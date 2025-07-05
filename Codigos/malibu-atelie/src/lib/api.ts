export async function getProdutos() {
  // Detecta se está no servidor ou cliente
  const isServer = typeof window === 'undefined'
  
  // Se estiver no servidor, usa URL absoluta
  const baseUrl = isServer 
    ? (process.env.NEXTAUTH_URL || 'https://malibu-atelie.vercel.app')
    : ''
  
  const res = await fetch(`${baseUrl}/api/products`, { cache: "no-store" });
  if (!res.ok) return [];
  return res.json();
} 