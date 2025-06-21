export interface User {
  id: string
  username: string
  role: string
}

export interface Product {
  id: string
  nama_produk: string
  harga_satuan: number
  quantity: number
  description?: string
  created_at?: string
  updated_at?: string
}
