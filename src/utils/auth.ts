import type { User } from "@/types"

export const setSession = (user: User): void => {
  if (typeof window !== "undefined") {
    localStorage.setItem("user", JSON.stringify(user))
  }
}

export const getSession = (): User | null => {
  if (typeof window !== "undefined") {
    const userStr = localStorage.getItem("user")
    if (userStr) {
      try {
        return JSON.parse(userStr) as User
      } catch (error) {
        console.error("Error parsing user session:", error)
        return null
      }
    }
  }
  return null
}

export const clearSession = (): void => {
  if (typeof window !== "undefined") {
    localStorage.removeItem("user")
  }
}
