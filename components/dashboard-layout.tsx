"use client"

import React from "react"
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
  IconButton,
  useTheme,
  Menu,
  MenuItem,
} from "@mui/material"
import MenuIcon from "@mui/icons-material/Menu"
import AccountCircle from "@mui/icons-material/AccountCircle"
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
  const theme = useTheme()
  const [mobileOpen, setMobileOpen] = React.useState(false)
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleMenuClose = () => {
    setAnchorEl(null)
  }

  const handleDrawerToggle = () => {
    setMobileOpen((prev) => !prev)
  }

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
          {/* Menu button for small screens */}
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { md: "none" } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" fontWeight="bold" sx={{ flexGrow: 1 }}>
            Help Study Abroad
          </Typography>

          {/* On small screens show account icon with menu; on md+ show email and logout button */}
          <Box sx={{ display: { xs: "none", md: "flex" }, alignItems: "center" }}>
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
          </Box>

          <Box sx={{ display: { xs: "flex", md: "none" } }}>
            <IconButton color="inherit" onClick={handleMenuOpen} aria-label="account menu">
              <AccountCircle />
            </IconButton>
            <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose} anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }} transformOrigin={{ vertical: 'top', horizontal: 'right' }}>
              <MenuItem disabled>{session?.user?.email}</MenuItem>
              <MenuItem onClick={() => { handleMenuClose(); handleLogout(); }}>Logout</MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Sidebar Drawer - permanent on md+, temporary on small screens */}
      <Box component="nav" sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }} aria-label="mailbox folders">
        {/* Mobile temporary drawer */}
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: "block", md: "none" },
            "& .MuiDrawer-paper": {
              width: drawerWidth,
            },
          }}
        >
          <Box sx={{ px: 2, py: 1, paddingTop: "16px" }}>
            <Typography variant="caption" sx={{ color: "gray", fontWeight: 600, letterSpacing: 1 }}>
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
                    onClick={() => setMobileOpen(false)}
                    sx={{
                      borderRadius: 1,
                      mx: 1,
                      my: 0.5,
                      backgroundColor: isActive ? "rgba(0,0,0,0.08)" : "transparent",
                      "&:hover": { backgroundColor: "rgba(0,0,0,0.04)" },
                    }}
                  >
                    <ListItemIcon>
                      <item.icon sx={{ color: isActive ? "primary.main" : "inherit" }} />
                    </ListItemIcon>
                    <ListItemText
                      primary={item.label}
                      primaryTypographyProps={{ fontWeight: isActive ? 600 : 400, color: isActive ? "primary.main" : "inherit" }}
                    />
                  </ListItemButton>
                </ListItem>
              )
            })}
          </List>
        </Drawer>

        {/* Permanent drawer for md+ screens */}
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: "none", md: "block" },
            "& .MuiDrawer-paper": {
              width: drawerWidth,
              boxSizing: "border-box",
              borderRight: "1px solid #e0e0e0",
              paddingTop: "64px",
            },
          }}
          open
        >
          <Box sx={{ px: 2, py: 1 }}>
            <Typography variant="caption" sx={{ color: "gray", fontWeight: 600, letterSpacing: 1 }}>
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
                      <item.icon sx={{ color: isActive ? "primary.main" : "inherit" }} />
                    </ListItemIcon>
                    <ListItemText
                      primary={item.label}
                      primaryTypographyProps={{ fontWeight: isActive ? 600 : 400, color: isActive ? "primary.main" : "inherit" }}
                    />
                  </ListItemButton>
                </ListItem>
              )
            })}
          </List>
        </Drawer>
      </Box>

      {/* Main Content Area */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: { xs: 2, md: 3 },
          mt: "64px",
          minHeight: "100vh",
          backgroundColor: "#f6f7fb",
          ml: { md: `${drawerWidth}px` },
        }}
      >
        {children}
      </Box>
    </Box>
  )
}
