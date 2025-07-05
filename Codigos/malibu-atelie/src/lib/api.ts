export async function getProdutos() {
  const res = await fetch(`/api/products`, { cache: "no-store" });
  if (!res.ok) return [];
  return res.json();
} 