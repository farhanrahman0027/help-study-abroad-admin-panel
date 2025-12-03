"use client"

import { SessionProvider } from "next-auth/react"
import { CssBaseline, ThemeProvider, createTheme } from "@mui/material"
import type { ReactNode } from "react"

const theme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#1976d2",
    },
    secondary: {
      main: "#dc004e",
    },
  },
})

export default function Provider({ children }: { children: ReactNode }) {
  return (
    <SessionProvider>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </SessionProvider>
  )
}
