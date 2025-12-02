import { auth } from "@/auth"
import { redirect } from "next/navigation"
import DashboardLayout from "@/components/dashboard-layout"
import { Box, Typography, Grid, Card, CardContent } from "@mui/material"
import PeopleIcon from "@mui/icons-material/People"
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart"

export default async function DashboardPage() {
  const session = await auth()

  if (!session) {
    redirect("/login")
  }

  return (
    <DashboardLayout>
      <Box sx={{ p: 3 }}>
        <Typography variant="h4" fontWeight="bold" sx={{ mb: 4 }}>
          Welcome, {session.user?.name}!
        </Typography>

        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6}>
            <Card>
              <CardContent>
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  <Box
                    sx={{
                      width: 56,
                      height: 56,
                      borderRadius: "50%",
                      backgroundColor: "primary.light",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <PeopleIcon sx={{ color: "primary.main", fontSize: 28 }} />
                  </Box>
                  <Box>
                    <Typography color="textSecondary" variant="body2">
                      Users
                    </Typography>
                    <Typography variant="h6" fontWeight="bold">
                      Manage Users
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6}>
            <Card>
              <CardContent>
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  <Box
                    sx={{
                      width: 56,
                      height: 56,
                      borderRadius: "50%",
                      backgroundColor: "success.light",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <ShoppingCartIcon sx={{ color: "success.main", fontSize: 28 }} />
                  </Box>
                  <Box>
                    <Typography color="textSecondary" variant="body2">
                      Products
                    </Typography>
                    <Typography variant="h6" fontWeight="bold">
                      Manage Products
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        <Card>
          <CardContent>
            <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
              Quick Stats
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Use the navigation menu to access Users and Products sections.
            </Typography>
          </CardContent>
        </Card>
      </Box>
    </DashboardLayout>
  )
}
