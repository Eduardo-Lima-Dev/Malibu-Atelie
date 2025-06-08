const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

export async function getProdutos() {
  const res = await fetch(`${baseUrl}/api/products`, { cache: "no-store" });
  if (!res.ok) return [];
  return res.json();
} 