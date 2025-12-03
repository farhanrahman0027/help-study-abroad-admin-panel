"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { useProductsStore } from "@/lib/zustand/products-store"
import DashboardLayout from "@/components/dashboard-layout"
import {
  Box,
  Card,
  CardContent,
  Grid,
  Typography,
  Button,
  CircularProgress,
  Alert,
  Divider,
  ImageList,
  ImageListItem,
} from "@mui/material"
import ArrowBackIcon from "@mui/icons-material/ArrowBack"
import StarIcon from "@mui/icons-material/Star"
import LocalOfferIcon from "@mui/icons-material/LocalOffer"
import StorageIcon from "@mui/icons-material/Storage"
import { useSession } from "next-auth/react"

export default function ProductDetailPage() {
  const router = useRouter()
  const params = useParams()
  const { data: session, status } = useSession()
  const { selectedProduct, fetchProductById, isLoading, error } = useProductsStore()
  const [selectedImage, setSelectedImage] = useState(0)
  const productId = params.id as string

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login")
    }
  }, [status, router])

  useEffect(() => {
    if (productId) {
      fetchProductById(Number.parseInt(productId))
    }
  }, [productId, fetchProductById])

  if (status === "loading" || isLoading) {
    return (
      <DashboardLayout>
        <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "400px" }}>
          <CircularProgress />
        </Box>
      </DashboardLayout>
    )
  }

  if (error) {
    return (
      <DashboardLayout>
        <Box sx={{ p: 3 }}>
          <Alert severity="error">{error}</Alert>
          <Button variant="outlined" startIcon={<ArrowBackIcon />} onClick={() => router.back()} sx={{ mt: 2 }}>
            Back to Products
          </Button>
        </Box>
      </DashboardLayout>
    )
  }

  if (!selectedProduct) {
    return (
      <DashboardLayout>
        <Box sx={{ p: 3 }}>
          <Alert severity="warning">Product not found</Alert>
          <Button variant="outlined" startIcon={<ArrowBackIcon />} onClick={() => router.back()} sx={{ mt: 2 }}>
            Back to Products
          </Button>
        </Box>
      </DashboardLayout>
    )
  }

  const images = selectedProduct.images || []

  return (
    <DashboardLayout>
      <Box sx={{ p: 3 }}>
        <Button variant="text" startIcon={<ArrowBackIcon />} onClick={() => router.push("/products")} sx={{ mb: 3 }}>
          Back to Products
        </Button>

        <Grid container spacing={3}>
          {/* Images Section */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Box
                  component="img"
                  src={images[selectedImage] || "/placeholder.svg?height=400&width=400&query=product"}
                  alt={selectedProduct.title}
                  sx={{
                    width: "100%",
                    height: "auto",
                    maxHeight: 400,
                    objectFit: "contain",
                    mb: 2,
                  }}
                />
                {images.length > 1 && (
                  <ImageList sx={{ width: "100%", height: "auto" }} cols={4} rowHeight={80}>
                    {images.map((image, index) => (
                      <ImageListItem
                        key={index}
                        onClick={() => setSelectedImage(index)}
                        sx={{
                          cursor: "pointer",
                          border: selectedImage === index ? "2px solid primary.main" : "1px solid #eee",
                          borderRadius: 1,
                          overflow: "hidden",
                        }}
                      >
                        <img
                          src={image || "/placeholder.svg"}
                          alt={`${selectedProduct.title} ${index}`}
                          style={{ objectFit: "cover", width: "100%", height: "100%" }}
                        />
                      </ImageListItem>
                    ))}
                  </ImageList>
                )}
              </CardContent>
            </Card>
          </Grid>

          {/* Details Section */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h5" fontWeight="bold" sx={{ mb: 1 }}>
                  {selectedProduct.title}
                </Typography>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
                  <StarIcon sx={{ color: "warning.main" }} />
                  <Typography variant="body2">
                    {selectedProduct.rating} / 5 ({selectedProduct.reviews?.length || 0} reviews)
                  </Typography>
                </Box>

                <Divider sx={{ my: 2 }} />

                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="textSecondary" sx={{ mb: 0.5 }}>
                    Price
                  </Typography>
                  <Typography variant="h4" color="primary" fontWeight="bold">
                    ${selectedProduct.price}
                  </Typography>
                </Box>

                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="textSecondary" sx={{ mb: 0.5 }}>
                    Category
                  </Typography>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <LocalOfferIcon sx={{ color: "info.main" }} />
                    <Typography variant="body1">
                      {selectedProduct.category.charAt(0).toUpperCase() + selectedProduct.category.slice(1)}
                    </Typography>
                  </Box>
                </Box>

                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="textSecondary" sx={{ mb: 0.5 }}>
                    Stock
                  </Typography>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <StorageIcon sx={{ color: selectedProduct.stock > 0 ? "success.main" : "error.main" }} />
                    <Typography
                      variant="body1"
                      sx={{ color: selectedProduct.stock > 0 ? "success.main" : "error.main" }}
                    >
                      {selectedProduct.stock > 0 ? `${selectedProduct.stock} items available` : "Out of stock"}
                    </Typography>
                  </Box>
                </Box>

                <Divider sx={{ my: 2 }} />

                <Typography variant="subtitle2" fontWeight="bold" sx={{ mb: 1 }}>
                  Description
                </Typography>
                <Typography variant="body2" color="textSecondary" sx={{ mb: 2, lineHeight: 1.6 }}>
                  {selectedProduct.description}
                </Typography>

                {selectedProduct.brand && (
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" color="textSecondary">
                      Brand: <strong>{selectedProduct.brand}</strong>
                    </Typography>
                  </Box>
                )}

                {selectedProduct.weight && (
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" color="textSecondary">
                      Weight: <strong>{selectedProduct.weight}</strong>
                    </Typography>
                  </Box>
                )}

                {selectedProduct.dimensions && (
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" color="textSecondary">
                      Dimensions: <strong>{JSON.stringify(selectedProduct.dimensions)}</strong>
                    </Typography>
                  </Box>
                )}
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </DashboardLayout>
  )
}
