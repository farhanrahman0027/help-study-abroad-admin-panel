// auth.ts
import { authConfig } from "./auth.config"
import { getServerSession } from "next-auth/next"

export const auth = getServerSession

export function getAuthSession() {
  return getServerSession(authConfig)
}
