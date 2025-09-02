import { createContext, useContext, createSignal, onMount, JSX } from "solid-js";

const AuthContext = createContext()

export const AuthProvider = (props) => {
    const [isAuthenticated, setIsAuthenticated] = createSignal(false)
    const [loading, setLoading] = createSignal(true)
    const [isAdmin, setIsAdmin] = createSignal(false)

    const checkAuth = async () => {
        setLoading(true)
        try {
            const apiUrl = import.meta.env.VITE_API_URL || ''
            const res = await fetch(`${apiUrl}/auth/validate`, { credentials: 'include' })
            res.ok ? setIsAuthenticated(true) : setIsAuthenticated(false)
        } catch (error) {
            setIsAuthenticated(false)
        } finally {
            setLoading(false)
        }
    }

    const login = async (credentials) => {
        if (!credentials.email || !credentials.password || credentials.email?.trim() === '' || credentials.password?.trim() === '') {
            throw new Error('Email and password are required')
        }
        const apiUrl = import.meta.env.VITE_API_URL || ''
        const response = await fetch(`${apiUrl}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify(credentials)
        })
        if (!response.ok) {
            throw new Error('Login failed')
        }
        setIsAuthenticated(true)
        return true
    }

    const logout = async () => {
        const apiUrl = import.meta.env.VITE_API_URL || ''
        await fetch(`${apiUrl}/auth/logout`, {
            method: 'POST',
            credentials: 'include'
        })
        setIsAuthenticated(false)
    }

    const isAdminUser = async () => {
        const apiUrl = import.meta.env.VITE_API_URL || ''
        const response = await fetch(`${apiUrl}/auth/is-admin`, { credentials: 'include' })
        if (response.ok) {
            const data = await response.json()
            setIsAdmin(data)
            return data
        }
    }

    onMount(() => {
        checkAuth()
    })
    

    return (
        <AuthContext.Provider value={{ isAuthenticated, loading, isAdmin, login, logout, checkAuth }}>
            {props.children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => {
    const context = useContext(AuthContext)
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider")
    }
    return context
}