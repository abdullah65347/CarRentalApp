import { createContext, useState } from "react";

export const AuthModalContext = createContext();

export function AuthModalProvider({ children }) {
    const [open, setOpen] = useState(false);
    const [mode, setMode] = useState("login");

    function openLogin() {
        setMode("login");
        setOpen(true);
    }

    function openRegister() {
        setMode("register");
        setOpen(true);
    }

    function switchToLogin() {
        setMode("login");
    }

    function switchToRegister() {
        setMode("register");
    }

    function close() {
        setOpen(false);
    }

    return (
        <AuthModalContext.Provider
            value={{
                open,
                mode,
                openLogin,
                openRegister,
                switchToLogin,
                switchToRegister,
                close
            }}
        >
            {children}
        </AuthModalContext.Provider>
    );
}
