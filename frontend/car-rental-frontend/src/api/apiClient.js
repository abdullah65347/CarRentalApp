import axios from "axios";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/api";

const api = axios.create({
    baseURL: API_BASE,
    headers: { "Content-Type": "application/json" }
});

// Token attach
api.interceptors.request.use(config => {
    const token = localStorage.getItem("access_token");
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
});

// Error handling
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (!error.response) {
            return Promise.reject({ message: "Network error" });
        }

        const { status, data } = error.response;

        if (status === 401) {
            localStorage.removeItem("access_token");
            window.location.href = "/auth/login";
        }

        return Promise.reject({
            status,
            message: data?.message || "Something went wrong",
            errors: data?.validationErrors || null,
        });
    }
);

export default api;
