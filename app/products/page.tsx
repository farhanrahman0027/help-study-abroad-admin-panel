"use client"

import { useEffect, useState, useCallback, useMemo } from "react"
import { useProductsStore } from "@/lib/zustand/products-store"
import DashboardLayout from "@/components/dashboard-layout"
import {
  Box,
  TextField,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Typography,
  CircularProgress,
  Alert,
  Pagination,
  Chip,
  Stack,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material"
import Link from "next/link"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"

const ITEMS_PER_PAGE = 12

export default function ProductsPage() {
  const router = useRouter()
  const { data: session, status } = useSession()
  const {
    products,
    categories,
    fetchProducts,
    searchProducts,
    filterByCategory,
    fetchCategories,
    isLoading,
    error,
    total,
  } = useProductsStore()

  const [currentPage, setCurrentPage] = useState(1)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("")

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login")
    }
  }, [status, router])

  useEffect(() => {
    fetchCategories()
  }, [fetchCategories])

  useEffect(() => {
    setCurrentPage(1)
    if (searchQuery.trim()) {
      searchProducts(searchQuery)
    } else if (selectedCategory) {
      const skip = 0
      filterByCategory(selectedCategory, ITEMS_PER_PAGE, skip)
    } else {
      const skip = (currentPage - 1) * ITEMS_PER_PAGE
      fetchProducts(ITEMS_PER_PAGE, skip)
    }
  }, [searchQuery, selectedCategory])

  useEffect(() => {
    if (!searchQuery && !selectedCategory) {
      const skip = (currentPage - 1) * ITEMS_PER_PAGE
      fetchProducts(ITEMS_PER_PAGE, skip)
    }
  }, [currentPage, searchQuery, selectedCategory, fetchProducts])

  const handleSearch = useCallback(
    (query: string) => {
      setSearchQuery(query)
      setSelectedCategory("")
      setCurrentPage(1)
      if (query.trim()) {
        searchProducts(query)
      }
    },
    [searchProducts],
  )

  const handleCategoryChange = useCallback((category: string) => {
    setSelectedCategory(category)
    setSearchQuery("")
    setCurrentPage(1)
  }, [])

  const totalPages = useMemo(() => {
    return Math.ceil(total / ITEMS_PER_PAGE)
  }, [total])

  if (status === "loading") {
    return (
      <DashboardLayout>
        <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "400px" }}>
          <CircularProgress />
        </Box>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <Box sx={{ p: 3 }}>
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              disabled={isLoading}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Category</InputLabel>
              <Select
                value={selectedCategory}
                onChange={(e) => handleCategoryChange(e.target.value)}
                label="Category"
                disabled={isLoading}
              >
                <MenuItem value="">All Categories</MenuItem>

                {categories.map((cat) => {
                  const catValue = typeof cat === "string" ? cat : cat.slug
                  const catLabel = typeof cat === "string" ? cat : cat.name
                  return (
                    <MenuItem key={catValue} value={catValue}>
                      {catLabel.charAt(0).toUpperCase() + catLabel.slice(1)}
                    </MenuItem>
                  )
                })}
              </Select>
            </FormControl>
          </Grid>
        </Grid>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {isLoading ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          <>
            {/* PRODUCT GRID */}
            <Grid container spacing={2} sx={{ mb: 3 }}>
              {products.map((product) => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={product.id}>
                  <Link href={`/products/${product.id}`} style={{ textDecoration: "none" }}>
                    <Card
                      sx={{
                        height: "100%",
                        display: "flex",
                        flexDirection: "column",
                        cursor: "pointer",
                        transition: "transform 0.18s ease, box-shadow 0.18s ease",
                        borderRadius: 2,
                        overflow: "hidden",
                        "&:hover": {
                          transform: "translateY(-6px)",
                          boxShadow: 6,
                        },
                      }}
                    >
                      <CardMedia
                        component="img"
                        image={product.images?.[0] || "/diverse-products-still-life.png"}
                        alt={product.title}
                        sx={{
                          width: "100%",
                          height: 160,
                          objectFit: "cover",
                          backgroundColor: "rgba(0,0,0,0.04)",
                        }}
                      />

                      <CardContent sx={{ p: 2, pb: 1, flexGrow: 1, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                        <Box>
                          <Typography
                            variant="subtitle1"
                            fontWeight={700}
                            sx={{
                              mb: 0.5,
                              display: "-webkit-box",
                              WebkitLineClamp: 2,
                              WebkitBoxOrient: "vertical",
                              overflow: "hidden",
                            }}
                          >
                            {product.title}
                          </Typography>

                          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                            {product.description?.slice(0, 80)}{product.description && product.description.length > 80 ? "..." : ""}
                          </Typography>
                        </Box>

                        <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mt: 1 }}>
                          <Typography variant="h6" color="primary" fontWeight={800} sx={{ letterSpacing: "0.2px" }}>
                            ${product.price}
                          </Typography>

                          <Stack direction="row" spacing={1} alignItems="center">
                            <Chip label={`⭐ ${product.rating}`} size="small" color="success" sx={{ fontWeight: 700 }} />
                            <Chip label={product.category} size="small" variant="outlined" />
                          </Stack>
                        </Stack>
                      </CardContent>
                    </Card>
                  </Link>
                </Grid>
              ))}
            </Grid>

            {products.length === 0 && !isLoading && <Alert severity="info">No products found.</Alert>}

            {!searchQuery && totalPages > 1 && (
              <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
                <Pagination
                  count={totalPages}
                  page={currentPage}
                  onChange={(_, value) => setCurrentPage(value)}
                  color="primary"
                />
              </Box>
            )}
          </>
        )}
      </Box>
    </DashboardLayout>
  )
}
