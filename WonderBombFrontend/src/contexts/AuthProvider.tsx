import { createContext, useContext, useState } from "react"
import { getTokens, saveTokens } from "../utils/storage"

interface AuthContextType {
    accessToken: string | null
    login: (tokens: { accessToken: string }) => void
}

const AuthContext = createContext<AuthContextType>(null)

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [accessToken, setAccessToken] = useState<string | null>(() => {
        const tokens = getTokens()
        return tokens.accessToken ?? null
    })

    const login = (tokens: { accessToken: string }) => {
        setAccessToken(tokens.accessToken)
        saveTokens(tokens)
    }

    return (
        <AuthContext.Provider value={{ accessToken, login }}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => useContext(AuthContext)
