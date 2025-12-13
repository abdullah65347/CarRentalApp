import { createContext, useContext, useState } from "react";

const ToastContext = createContext();

export function ToastProvider({ children }) {
    const [toast, setToast] = useState(null);

    function show(message, type = "info") {
        setToast({ message, type });
        setTimeout(() => setToast(null), 3000);
    }

    return (
        <ToastContext.Provider value={{ show }}>
            {children}
            {toast && (
                <div className="fixed bottom-4 right-4 bg-black text-white px-4 py-2 rounded">
                    {toast.message}
                </div>
            )}
        </ToastContext.Provider>
    );
}

export function useToast() {
    return useContext(ToastContext);
}
