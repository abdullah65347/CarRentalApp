import React, { createContext, useState, useEffect } from 'react'
import api from '../api/apiClient'


export const AuthContext = createContext()


export function AuthProvider({ children }) {
    const [user, setUser] = useState(null)
    const [token, setToken] = useState(localStorage.getItem('access_token') || null)


    useEffect(() => {
        if (token) {
            // optional: fetch profile
            api.get('/auth/me').then(res => setUser(res.data)).catch(() => { setUser(null) })
        }
    }, [token])


    function login(tokenValue) {
        localStorage.setItem('access_token', tokenValue)
        setToken(tokenValue)
    }


    function logout() {
        localStorage.removeItem('access_token')
        setToken(null)
        setUser(null)
    }


    return (
        <AuthContext.Provider value={{ user, setUser, token, login, logout }}>
            {children}
        </AuthContext.Provider>
    )
}