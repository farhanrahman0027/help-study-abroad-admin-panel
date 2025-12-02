"use client"

import type { ReactNode } from "react"
import { useSession, signOut } from "next-auth/react"
import { useRouter, usePathname } from "next/navigation"
import {
  Box,
  AppBar,
  Toolbar,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  Button,
  Divider,
} from "@mui/material"
import DashboardIcon from "@mui/icons-material/Dashboard"
import PeopleIcon from "@mui/icons-material/People"
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart"
import LogoutIcon from "@mui/icons-material/Logout"
import Link from "next/link"

const drawerWidth = 240

interface DashboardLayoutProps {
  children: ReactNode
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const { data: session } = useSession()
  const router = useRouter()
  const pathname = usePathname()

  const menuItems = [
    { label: "Dashboard", icon: DashboardIcon, href: "/dashboard" },
    { label: "Users", icon: PeopleIcon, href: "/users" },
    { label: "Products", icon: ShoppingCartIcon, href: "/products" },
  ]

  const handleLogout = async () => {
    await signOut({ redirect: false })
    router.push("/login")
  }

  return (
    <Box sx={{ display: "flex", backgroundColor: "#f6f7fb" }}>
      {/* Top AppBar */}
      <AppBar
        position="fixed"
        elevation={1}
        sx={{
          zIndex: (theme) => theme.zIndex.drawer + 1,
          backgroundColor: "white",
          color: "black",
        }}
      >
        <Toolbar sx={{ px: 3 }}>
          <Typography variant="h6" fontWeight="bold" sx={{ flexGrow: 1 }}>
            Help Study Abroad
          </Typography>

          <Typography variant="body2" sx={{ mr: 2 }}>
            {session?.user?.email}
          </Typography>

          <Button
            variant="outlined"
            color="inherit"
            onClick={handleLogout}
            startIcon={<LogoutIcon />}
            sx={{ textTransform: "none" }}
          >
            Logout
          </Button>
        </Toolbar>
      </AppBar>

      {/* Sidebar Drawer */}
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
            borderRight: "1px solid #e0e0e0",
            paddingTop: "64px", // Push down below AppBar
          },
        }}
      >
        <Box sx={{ px: 2, py: 1 }}>
          <Typography
            variant="caption"
            sx={{ color: "gray", fontWeight: 600, letterSpacing: 1 }}
          >
            MENU
          </Typography>
        </Box>
        <Divider />

        <List>
          {menuItems.map((item) => {
            const isActive = pathname.startsWith(item.href)

            return (
              <ListItem key={item.label} disablePadding>
                <ListItemButton
                  component={Link}
                  href={item.href}
                  sx={{
                    borderRadius: 1,
                    mx: 1,
                    my: 0.5,
                    backgroundColor: isActive ? "rgba(0,0,0,0.08)" : "transparent",
                    "&:hover": { backgroundColor: "rgba(0,0,0,0.04)" },
                  }}
                >
                  <ListItemIcon>
                    <item.icon
                      sx={{ color: isActive ? "primary.main" : "inherit" }}
                    />
                  </ListItemIcon>
                  <ListItemText
                    primary={item.label}
                    primaryTypographyProps={{
                      fontWeight: isActive ? 600 : 400,
                      color: isActive ? "primary.main" : "inherit",
                    }}
                  />
                </ListItemButton>
              </ListItem>
            )
          })}
        </List>
      </Drawer>

      {/* Main Content Area */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          mt: "64px",
          minHeight: "100vh",
          backgroundColor: "#f6f7fb",
        }}
      >
        {children}
      </Box>
    </Box>
  )
}
