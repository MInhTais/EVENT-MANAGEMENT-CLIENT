'use client'

import { createContext, type ReactNode, useState, useContext, useCallback } from 'react'
import type { User } from '../types/auth.type'
import { getAccessTokenFromLocalStorage, getProfileFromLocalStorage } from '../utils/auth'

interface AppContextInterface {
  isAuthenticated: boolean
  setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>
  profile: User | null
  setProfile: React.Dispatch<React.SetStateAction<User | null>>
  logout: () => void
}

const initialContext: AppContextInterface = {
  isAuthenticated: Boolean(getAccessTokenFromLocalStorage()),
  setIsAuthenticated: () => null,
  profile: getProfileFromLocalStorage(),
  setProfile: () => null,
  logout: () => null
}

const MyContext = createContext<AppContextInterface>(initialContext)

const MyProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [profile, setProfile] = useState<User | null>(initialContext.profile)
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(initialContext.isAuthenticated)

  const logout = useCallback(() => {
    localStorage.removeItem('access_token')
    localStorage.removeItem('refresh_token')

    localStorage.removeItem('profile')

    setIsAuthenticated(false)
    setProfile(null)
  }, [])

  return (
    <MyContext.Provider
      value={{
        isAuthenticated,
        setIsAuthenticated,
        profile,
        setProfile,
        logout
      }}
    >
      {children}
    </MyContext.Provider>
  )
}

const useMyContext = () => {
  const context = useContext(MyContext)
  if (context === undefined) {
    throw new Error('useMyContext must be used within a MyProvider')
  }
  return context
}

export { MyProvider, useMyContext }
