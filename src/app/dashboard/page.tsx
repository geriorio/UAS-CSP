"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Navbar from "@/components/Navbar"
import ProductTable from "@/components/ProductTable"
import { supabase } from "@/lib/supabase"
import type { User, Product } from "@/types"
import { getSession } from "@/utils/auth"

export default function DashboardPage() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [products, setProducts] = useState<Product[]>([])
  const [loadingProducts, setLoadingProducts] = useState(true)
  const [loadingUser, setLoadingUser] = useState(true)

  useEffect(() => {
    const sessionUser = getSession()
    if (!sessionUser) {
      router.push("/signin")
    } else {
      setUser(sessionUser)
    }
    setLoadingUser(false)
  }, [router]) // Added router to dependency array

  useEffect(() => {
    if (user) fetchProducts()
  }, [user])

  const fetchProducts = async () => {
    setLoadingProducts(true)
    const { data, error } = await supabase.from("products").select("*")
    if (error) {
      console.error("❌ Gagal fetch products:", error.message)
    } else {
      setProducts(data as Product[])
    }
    setLoadingProducts(false)
  }

  if (loadingUser) return <p>Loading user...</p>
  if (!user) return null

  return (
    <div className="p-6">
      <Navbar username={user.username} />
      <h2 className="text-xl font-semibold mt-4 mb-2">Welcome, {user.username}</h2>

      {loadingProducts ? (
        <p>Loading produk...</p>
      ) : (
        <ProductTable products={products} role={user.role} onRefresh={fetchProducts} />
      )}
    </div>
  )
}
