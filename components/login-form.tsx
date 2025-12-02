"use client"

import type React from "react"
import { useState } from "react"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import {
  Box,
  Card,
  TextField,
  Button,
  Typography,
  Container,
  Alert,
  CircularProgress
} from "@mui/material"
import LockOutlinedIcon from "@mui/icons-material/LockOutlined"

export default function LoginForm() {
  const router = useRouter()

  // FIX: username instead of email
  const [username, setUsername] = useState("admin")
  const [password, setPassword] = useState("admin")

  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsLoading(true)

    try {
      const result = await signIn("credentials", {
        username,   // <-- FIXED
        password,
        redirect: false,
      })

      if (!result?.ok) {
        setError("Invalid credentials. Try admin/admin")
        return
      }

      router.push("/dashboard")
    } catch (err) {
      setError("An error occurred. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Container maxWidth="sm">
      <Card
        sx={{
          p: 4,
          boxShadow: "0 10px 40px rgba(0,0,0,0.1)",
          borderRadius: 2,
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            mb: 3,
          }}
        >
          <Box
            sx={{
              width: 56,
              height: 56,
              borderRadius: "50%",
              backgroundColor: "primary.main",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              mb: 2,
            }}
          >
            <LockOutlinedIcon sx={{ color: "white", fontSize: 32 }} />
          </Box>

          <Typography variant="h5" fontWeight="bold">
            Admin Login
          </Typography>
          <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
            Help Study Abroad Management
          </Typography>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            disabled={isLoading}
            margin="normal"
            autoFocus
            placeholder="admin"
          />

          <TextField
            fullWidth
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={isLoading}
            margin="normal"
            placeholder="admin"
          />

          <Button
            fullWidth
            variant="contained"
            size="large"
            type="submit"
            disabled={isLoading}
            sx={{ mt: 3, mb: 2 }}
          >
            {isLoading ? <CircularProgress size={24} /> : "Sign In"}
          </Button>

          <Typography variant="caption" color="textSecondary" sx={{ display: "block", mt: 2 }}>
            Demo Credentials: Username: <strong>admin</strong>, Password: <strong>admin</strong>
          </Typography>
        </Box>
      </Card>
    </Container>
  )
}
