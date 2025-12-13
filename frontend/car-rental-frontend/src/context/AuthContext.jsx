import React, { createContext, useState, useEffect } from "react";
import api from "../api/apiClient";
import { ENDPOINTS } from "../api/endpoints";

export const AuthContext = createContext(null);

function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem("access_token") || null);

    useEffect(() => {
        if (!token) {
            setUser(null);
            return;
        }

        api.get(ENDPOINTS.AUTH.ME)
            .then(res => setUser(res.data))
            .catch(() => setUser(null));
    }, [token]);

    const login = (tokenValue) => {
        localStorage.setItem("access_token", tokenValue);
        setToken(tokenValue);
    };

    const logout = () => {
        localStorage.removeItem("access_token");
        setToken(null);
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, setUser, token, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export default AuthProvider;
