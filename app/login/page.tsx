import { Box } from "@mui/material"
import LoginForm from "@/components/login-form"

export default function LoginPage() {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#f5f5f5",
        padding: "20px",
      }}
    >
      <LoginForm />
    </Box>
  )
}
