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

  // Fetch categories on mount
  useEffect(() => {
    fetchCategories()
  }, [fetchCategories])

  // Fetch products when page, search, or category changes
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

  // Fetch products on page change
  useEffect(() => {
    if (!searchQuery && !selectedCategory) {
      const skip = (currentPage - 1) * ITEMS_PER_PAGE
      fetchProducts(ITEMS_PER_PAGE, skip)
    }
  }, [currentPage, searchQuery, selectedCategory, fetchProducts])

  // useCallback for search handler
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

  // useCallback for category filter
  const handleCategoryChange = useCallback((category: string) => {
    setSelectedCategory(category)
    setSearchQuery("")
    setCurrentPage(1)
  }, [])

  // useMemo to calculate total pages
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
        {/* Filters */}
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
            <Grid container spacing={2} sx={{ mb: 3 }}>
              {products.map((product) => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={product.id}>
                  <Link href={`/products/${product.id}`}>
                    <Card
                      sx={{
                        height: "100%",
                        cursor: "pointer",
                        transition: "transform 0.2s, box-shadow 0.2s",
                        "&:hover": {
                          transform: "translateY(-4px)",
                          boxShadow: 3,
                        },
                      }}
                    >
                      <CardMedia
                        component="img"
                        height="200"
                        image={product.images[0] || "/diverse-products-still-life.png"}
                        alt={product.title}
                        sx={{ objectFit: "cover" }}
                      />
                      <CardContent>
                        <Typography
                          variant="subtitle2"
                          fontWeight="bold"
                          sx={{
                            mb: 1,
                            display: "-webkit-box",
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: "vertical",
                            overflow: "hidden",
                          }}
                        >
                          {product.title}
                        </Typography>
                        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                          <Typography variant="h6" fontWeight="bold" color="primary">
                            ${product.price}
                          </Typography>
                          <Box
                            sx={{
                              backgroundColor: "success.light",
                              color: "success.main",
                              px: 1,
                              py: 0.5,
                              borderRadius: 1,
                              fontSize: "0.75rem",
                              fontWeight: "bold",
                            }}
                          >
                            ⭐ {product.rating}
                          </Box>
                        </Box>
                        <Typography variant="caption" color="textSecondary" sx={{ mt: 1, display: "block" }}>
                          {product.category}
                        </Typography>
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
