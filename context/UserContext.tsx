"use client"

import { createContext, useState, useEffect } from "react"

export const UserContext = createContext<any>(null)

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState(null)

  const logout = () => {
    setUser(null)
    localStorage.removeItem("token")
  }

  const getUser = async () => {
    const token = localStorage.getItem("token")
    if (!token) return

    try {
      const res = await fetch("http://localhost:9000/api/auth/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      const data = await res.json()

      if (res.ok) {
        setUser(data)
      } else {
        logout()
      }
    } catch (error) {
      console.error(error)
      logout()
    }
  }

  useEffect(() => {
    getUser()
  }, [])

  return (
    <UserContext.Provider value={{ user, setUser, logout }}>
      {children}
    </UserContext.Provider>
  )
}
