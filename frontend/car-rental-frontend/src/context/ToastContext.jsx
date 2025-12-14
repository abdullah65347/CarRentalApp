import { createContext, useContext, useState } from "react";

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
    const [toast, setToast] = useState(null);

    function show(message, type = "info") {
        setToast({ message, type });
        setTimeout(() => setToast(null), 3500);
    }

    function hide() {
        setToast(null);
    }

    const typeStyles = {
        success: "toast-success",
        error: "toast-error",
        warning: "toast-warning",
        info: "toast-info",
    };


    return (
        <ToastContext.Provider value={{ show }}>
            {children}

            {toast && (
                <div className="fixed top-20 right-4 z-[9999] toast-wrapper">
                    <div className={`toast-card ${typeStyles[toast.type]}`}>
                        <span className="toast-icon">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 16 16"
                                width="18"
                                height="18"
                                fill="currentColor"
                                aria-hidden="true"
                            >
                                <path d="M8 2a6 6 0 1 0 6 6A6 6 0 0 0 8 2Zm-.697 2.281a.951.951 0 0 1 1.35 0 .928.928 0 0 1 .276.674.952.952 0 0 1-1.905 0 .924.924 0 0 1 .279-.674ZM9.7 12H6.3v-1.264h.833V7.777H6.3V6.513h2.584v4.223h.816Z" />
                            </svg>
                        </span>
                        <span className="flex-1">{toast.message}</span>
                        <button
                            onClick={hide}
                            className="ml-2 text-current opacity-60 hover:opacity-100"
                        >
                            ✕
                        </button>
                    </div>
                </div>
            )
            }
        </ToastContext.Provider >
    );
}

export function useToast() {
    const ctx = useContext(ToastContext);
    if (!ctx) {
        throw new Error("useToast must be used inside ToastProvider");
    }
    return ctx;
}
