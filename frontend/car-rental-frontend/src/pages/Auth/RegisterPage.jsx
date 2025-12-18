import { useState } from "react";
import api from "../../api/apiClient";
import { useNavigate, Link } from "react-router-dom";

export default function RegisterPage() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    async function submit(e) {
        e.preventDefault();
        try {
            await api.post("/auth/register", { name, email, password });
            navigate("/auth/login");
        } catch {
            alert("Registration failed");
        }
    }

    return (
        <div className="min-h-[calc(100vh-64px)] flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 px-4">
            <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
                <h1 className="text-2xl font-bold text-gray-800 mb-1">
                    Create account
                </h1>
                <p className="text-sm text-gray-500 mb-6">
                    Join us and start booking cars easily
                </p>

                <form onSubmit={submit} className="space-y-4">
                    <input
                        value={name}
                        onChange={e => setName(e.target.value)}
                        placeholder="Full name"
                        className="w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />

                    <input
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        placeholder="Email address"
                        className="w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />

                    <input
                        type="password"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        placeholder="Password"
                        className="w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />

                    <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-lg font-medium transition">
                        Create Account
                    </button>
                </form>

                <p className="text-sm text-center text-gray-600 mt-6">
                    Already have an account?{" "}
                    <Link to="/auth/login" className="text-blue-600 font-medium hover:underline">
                        Login
                    </Link>
                </p>
            </div>
        </div>
    );
}
