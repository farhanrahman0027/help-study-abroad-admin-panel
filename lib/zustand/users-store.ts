import { create } from "zustand"

interface User {
  id: number
  firstName: string
  lastName: string
  email: string
  gender: string
  phone: string
  company: {
    name: string
  }
  [key: string]: any
}

interface UsersState {
  users: User[]
  selectedUser: User | null
  isLoading: boolean
  error: string | null
  total: number
  fetchUsers: (limit: number, skip: number) => Promise<void>
  searchUsers: (query: string) => Promise<void>
  fetchUserById: (id: number) => Promise<void>
  setError: (error: string | null) => void
}

export const useUsersStore = create<UsersState>((set) => ({
  users: [],
  selectedUser: null,
  isLoading: false,
  error: null,
  total: 0,

  fetchUsers: async (limit = 10, skip = 0) => {
    set({ isLoading: true, error: null })
    try {
      const response = await fetch(`https://dummyjson.com/users?limit=${limit}&skip=${skip}`)
      const data = await response.json()
      set({ users: data.users || [], total: data.total || 0 })
    } catch (error) {
      set({ error: "Failed to fetch users" })
    } finally {
      set({ isLoading: false })
    }
  },

  searchUsers: async (query: string) => {
    set({ isLoading: true, error: null })
    try {
      const response = await fetch(`https://dummyjson.com/users/search?q=${encodeURIComponent(query)}`)
      const data = await response.json()
      set({ users: data.users || [], total: data.total || 0 })
    } catch (error) {
      set({ error: "Failed to search users" })
    } finally {
      set({ isLoading: false })
    }
  },

  fetchUserById: async (id: number) => {
    set({ isLoading: true, error: null })
    try {
      const response = await fetch(`https://dummyjson.com/users/${id}`)
      const data = await response.json()
      set({ selectedUser: data })
    } catch (error) {
      set({ error: "Failed to fetch user details" })
    } finally {
      set({ isLoading: false })
    }
  },

  setError: (error) => set({ error }),
}))
