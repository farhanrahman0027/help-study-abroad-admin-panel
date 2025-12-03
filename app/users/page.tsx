"use client"

import { useEffect, useState, useCallback, useMemo } from "react"
import { useUsersStore } from "@/lib/zustand/users-store"
import DashboardLayout from "@/components/dashboard-layout"
import {
  Box,
  TextField,
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Paper,
  CircularProgress,
  Alert,
  Pagination,
  Grid,
} from "@mui/material"
import Link from "next/link"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"

const ITEMS_PER_PAGE = 10

export default function UsersPage() {
  const router = useRouter()
  const { data: session, status } = useSession()
  const { users, fetchUsers, searchUsers, isLoading, error, total } = useUsersStore()
  const [currentPage, setCurrentPage] = useState(1)
  const [searchQuery, setSearchQuery] = useState("")

  // Redirect to login if not authenticated
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login")
    }
  }, [status, router])

  // Fetch users on page change or search clear
  useEffect(() => {
    if (!searchQuery) {
      const skip = (currentPage - 1) * ITEMS_PER_PAGE
      fetchUsers(ITEMS_PER_PAGE, skip)
    }
  }, [currentPage, searchQuery, fetchUsers])

  // useCallback for search handler - memoize to prevent unnecessary re-renders
  const handleSearch = useCallback(
    (query: string) => {
      setSearchQuery(query)
      setCurrentPage(1)
      if (query.trim()) {
        searchUsers(query)
      } else {
        fetchUsers(ITEMS_PER_PAGE, 0)
      }
    },
    [searchUsers, fetchUsers],
  )

  // useMemo to calculate total pages - prevents recalculation on every render
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
        <Grid container spacing={3} sx={{ mb: 3 }}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              placeholder="Search users by name, email..."
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              disabled={isLoading}
            />
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
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
                    <TableCell>
                      <strong>Name</strong>
                    </TableCell>
                    <TableCell>
                      <strong>Email</strong>
                    </TableCell>
                    <TableCell>
                      <strong>Gender</strong>
                    </TableCell>
                    <TableCell>
                      <strong>Phone</strong>
                    </TableCell>
                    <TableCell>
                      <strong>Company</strong>
                    </TableCell>
                    <TableCell align="center">
                      <strong>Action</strong>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {users.map((user) => (
                    <TableRow key={user.id} hover>
                      <TableCell>{`${user.firstName} ${user.lastName}`}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>{user.gender}</TableCell>
                      <TableCell>{user.phone}</TableCell>
                      <TableCell>{user.company.name}</TableCell>
                      <TableCell align="center">
                        <Link href={`/users/${user.id}`}>
                          <Box
                            component="span"
                            sx={{
                              color: "primary.main",
                              cursor: "pointer",
                              "&:hover": { textDecoration: "underline" },
                            }}
                          >
                            View
                          </Box>
                        </Link>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

            {users.length === 0 && !isLoading && (
              <Alert severity="info" sx={{ mt: 2 }}>
                No users found.
              </Alert>
            )}

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
