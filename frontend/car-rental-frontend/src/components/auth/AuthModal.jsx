import { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/apiClient";
import { AuthContext } from "../../context/AuthContext";
import { AuthModalContext } from "../../context/AuthModalContext";

export default function AuthModal() {
    const navigate = useNavigate();

    const {
        open,
        mode,
        close,
        switchToLogin,
        switchToRegister,
    } = useContext(AuthModalContext);

    const { user, login } = useContext(AuthContext);

    const isLogin = mode === "login";

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    /* RESET FORM STATE — MUST BE BEFORE RETURN */
    useEffect(() => {
        if (open) {
            setName("");
            setEmail("");
            setPassword("");
        }
    }, [open, mode]);

    /* SAFE EARLY RETURN */
    if (!open) return null;

    function handleClose() {
        close();

        if (!user) {
            navigate("/");
        }
    }

    async function submit(e) {
        e.preventDefault();
        setLoading(true);

        try {
            if (isLogin) {
                const res = await api.post("/auth/login", {
                    email,
                    password,
                });

                login(res.data.accessToken || res.data.token);
                close(); // let PrivateRoute render page
            } else {
                await api.post("/auth/register", {
                    name,
                    email,
                    password,
                });

                switchToLogin();
            }
        } catch {
            alert(isLogin ? "Login failed" : "Registration failed");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="modal-backdrop flex items-center justify-center">
            <div className="modal-box w-full max-w-md relative">
                <button
                    onClick={handleClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
                >
                    ✕
                </button>

                <h2 className="text-2xl font-bold text-gray-800 mb-1">
                    {isLogin ? "Welcome back" : "Create your account"}
                </h2>

                <p className="text-sm text-gray-500 mb-6">
                    {isLogin
                        ? "Login to manage your bookings"
                        : "Join us and start booking cars"}
                </p>

                <form onSubmit={submit} className="space-y-4">
                    {!isLogin && (
                        <input
                            value={name}
                            onChange={e => setName(e.target.value)}
                            placeholder="Full name"
                            className="auth-input"
                        />
                    )}

                    <input
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        placeholder="Email address"
                        className="auth-input"
                    />

                    <input
                        type="password"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        placeholder="Password"
                        className="auth-input"
                    />

                    <button className="auth-btn bg-blue-700" disabled={loading}>
                        {loading
                            ? "Please wait..."
                            : isLogin
                                ? "Login"
                                : "Create Account"}
                    </button>
                </form>

                <p className="text-sm text-center text-gray-600 mt-6">
                    {isLogin ? (
                        <>
                            Don’t have an account?{" "}
                            <button
                                type="button"
                                onClick={switchToRegister}
                                className="text-indigo-600 font-medium hover:underline"
                            >
                                Register
                            </button>
                        </>
                    ) : (
                        <>
                            Already have an account?{" "}
                            <button
                                type="button"
                                onClick={switchToLogin}
                                className="text-indigo-600 font-medium hover:underline"
                            >
                                Login
                            </button>
                        </>
                    )}
                </p>
            </div>
        </div>
    );
}
