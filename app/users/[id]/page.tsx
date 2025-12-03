"use client"

import { useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { useUsersStore } from "@/lib/zustand/users-store"
import DashboardLayout from "@/components/dashboard-layout"
import { Box, Card, CardContent, Grid, Typography, Button, CircularProgress, Alert, Divider } from "@mui/material"
import ArrowBackIcon from "@mui/icons-material/ArrowBack"
import EmailIcon from "@mui/icons-material/Email"
import PhoneIcon from "@mui/icons-material/Phone"
import BusinessIcon from "@mui/icons-material/Business"
import { useSession } from "next-auth/react"

export default function UserDetailPage() {
  const router = useRouter()
  const params = useParams()
  const { data: session, status } = useSession()
  const { selectedUser, fetchUserById, isLoading, error } = useUsersStore()
  const userId = params.id as string

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login")
    }
  }, [status, router])

  useEffect(() => {
    if (userId) {
      fetchUserById(Number.parseInt(userId))
    }
  }, [userId, fetchUserById])

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
            Back to Users
          </Button>
        </Box>
      </DashboardLayout>
    )
  }

  if (!selectedUser) {
    return (
      <DashboardLayout>
        <Box sx={{ p: 3 }}>
          <Alert severity="warning">User not found</Alert>
          <Button variant="outlined" startIcon={<ArrowBackIcon />} onClick={() => router.back()} sx={{ mt: 2 }}>
            Back to Users
          </Button>
        </Box>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <Box sx={{ p: 3 }}>
        <Button variant="text" startIcon={<ArrowBackIcon />} onClick={() => router.push("/users")} sx={{ mb: 3 }}>
          Back to Users
        </Button>

        <Grid container spacing={3}>
          {/* Profile Card */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", mb: 2 }}>
                  <Box
                    sx={{
                      width: 100,
                      height: 100,
                      borderRadius: "50%",
                      backgroundColor: "primary.light",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "2.5rem",
                      color: "primary.main",
                      mb: 2,
                      fontWeight: "bold",
                    }}
                  >
                    {selectedUser.firstName.charAt(0)}
                  </Box>
                  <Typography variant="h5" fontWeight="bold">
                    {selectedUser.firstName} {selectedUser.lastName}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    ID: {selectedUser.id}
                  </Typography>
                </Box>
                <Divider sx={{ my: 2 }} />
                <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1.5 }}>
                  <EmailIcon sx={{ color: "primary.main" }} />
                  <Typography variant="body2">{selectedUser.email}</Typography>
                </Box>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1.5 }}>
                  <PhoneIcon sx={{ color: "primary.main" }} />
                  <Typography variant="body2">{selectedUser.phone}</Typography>
                </Box>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <BusinessIcon sx={{ color: "primary.main" }} />
                  <Typography variant="body2">{selectedUser.company.name}</Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Details Card */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
                  Additional Information
                </Typography>
                <Divider sx={{ mb: 2 }} />
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="textSecondary">
                    Gender
                  </Typography>
                  <Typography variant="body1">{selectedUser.gender}</Typography>
                </Box>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="textSecondary">
                    Age
                  </Typography>
                  <Typography variant="body1">{selectedUser.age}</Typography>
                </Box>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="textSecondary">
                    Blood Group
                  </Typography>
                  <Typography variant="body1">{selectedUser.bloodGroup}</Typography>
                </Box>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="textSecondary">
                    User Agent
                  </Typography>
                  <Typography variant="body2" sx={{ wordBreak: "break-word" }}>
                    {selectedUser.userAgent}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </DashboardLayout>
  )
}
