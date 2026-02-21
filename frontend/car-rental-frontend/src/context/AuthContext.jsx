import { createContext, useEffect, useState } from "react";
import api from "../api/apiClient";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    /* ---------- LOAD USER ON REFRESH ---------- */
    useEffect(() => {
        const token = localStorage.getItem("access_token");

        if (!token) {
            setLoading(false);
            return;
        }

        api.get("/auth/me")
            .then(res => setUser(res.data))
            .catch(() => {
                localStorage.removeItem("access_token");
                setUser(null);
            })
            .finally(() => setLoading(false));
    }, []);

    /* ---------- LOGIN ---------- */
    function login(token) {
        localStorage.setItem("access_token", token);

        // Fetch user after login
        api.get("/auth/me")
            .then(res => setUser(res.data))
            .catch(() => {
                localStorage.removeItem("access_token");
                setUser(null);
            });
    }

    /* ---------- LOGOUT (THIS IS REQUIRED) ---------- */
    function logout() {
        localStorage.removeItem("access_token");
        setUser(null);
    }

    return (
        <AuthContext.Provider
            value={{
                user,
                loading,
                login,
                logout,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}
