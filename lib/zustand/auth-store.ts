import { create } from "zustand"
import { persist } from "zustand/middleware"

interface AuthState {
  token: string | null
  user: {
    id: string
    email: string
    name: string
  } | null
  isLoading: boolean
  error: string | null
  setAuth: (token: string, user: any) => void
  logout: () => void
  setError: (error: string | null) => void
}

// Zustand was chosen for this project because:
// 1. Minimal boilerplate - no actions/reducers needed
// 2. Small footprint - perfect for small-medium apps
// 3. Built-in async action support
// 4. Built-in persistence middleware for localStorage
// 5. Better DX compared to Redux without the complexity

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      isLoading: false,
      error: null,
      setAuth: (token, user) => set({ token, user, error: null }),
      logout: () => set({ token: null, user: null }),
      setError: (error) => set({ error }),
    }),
    {
      name: "auth-storage",
    },
  ),
)
