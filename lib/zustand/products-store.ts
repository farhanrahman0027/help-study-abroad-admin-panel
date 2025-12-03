import { create } from "zustand"

interface Product {
  id: number
  title: string
  description: string
  price: number
  rating: number
  stock: number
  category: string
  images: string[]
  [key: string]: any
}

interface ProductsState {
  products: Product[]
  selectedProduct: Product | null
  categories: (string | { name: string; slug: string })[]
  isLoading: boolean
  error: string | null
  total: number
  fetchProducts: (limit: number, skip: number) => Promise<void>
  searchProducts: (query: string) => Promise<void>
  filterByCategory: (category: string, limit: number, skip: number) => Promise<void>
  fetchProductById: (id: number) => Promise<void>
  fetchCategories: () => Promise<void>
  setError: (error: string | null) => void
}

export const useProductsStore = create<ProductsState>((set) => ({
  products: [],
  selectedProduct: null,
  categories: [],
  isLoading: false,
  error: null,
  total: 0,

  fetchProducts: async (limit = 10, skip = 0) => {
    set({ isLoading: true, error: null })
    try {
      const response = await fetch(`https://dummyjson.com/products?limit=${limit}&skip=${skip}`)
      const data = await response.json()
      set({ products: data.products || [], total: data.total || 0 })
    } catch (error) {
      set({ error: "Failed to fetch products" })
    } finally {
      set({ isLoading: false })
    }
  },

  searchProducts: async (query: string) => {
    set({ isLoading: true, error: null })
    try {
      const response = await fetch(`https://dummyjson.com/products/search?q=${encodeURIComponent(query)}`)
      const data = await response.json()
      set({ products: data.products || [], total: data.total || 0 })
    } catch (error) {
      set({ error: "Failed to search products" })
    } finally {
      set({ isLoading: false })
    }
  },

  filterByCategory: async (category: string, limit = 10, skip = 0) => {
    set({ isLoading: true, error: null })
    try {
      const response = await fetch(`https://dummyjson.com/products/category/${category}?limit=${limit}&skip=${skip}`)
      const data = await response.json()
      set({ products: data.products || [], total: data.total || 0 })
    } catch (error) {
      set({ error: "Failed to filter products" })
    } finally {
      set({ isLoading: false })
    }
  },

  fetchProductById: async (id: number) => {
    set({ isLoading: true, error: null })
    try {
      const response = await fetch(`https://dummyjson.com/products/${id}`)
      const data = await response.json()
      set({ selectedProduct: data })
    } catch (error) {
      set({ error: "Failed to fetch product details" })
    } finally {
      set({ isLoading: false })
    }
  },

  fetchCategories: async () => {
    try {
      const response = await fetch("https://dummyjson.com/products/categories")
      const data = await response.json()
      set({ categories: data || [] })
    } catch (error) {
      console.error("Failed to fetch categories")
    }
  },

  setError: (error) => set({ error }),
}))
