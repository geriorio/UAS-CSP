export interface User {
  id: string
  username: string
  role: string
}

export interface Product {
  id: string
  name: string
  price: number
  description?: string
  created_at?: string
  updated_at?: string
}
