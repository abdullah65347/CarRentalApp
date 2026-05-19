import { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, Car, X, ArrowRight, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import api from "../../api/apiClient";
import { AuthContext } from "../../context/AuthContext";
import { AuthModalContext } from "../../context/AuthModalContext";

/* ── tiny helpers ── */
function validate(fields, isLogin) {
    const errs = {};
    if (!isLogin && !fields.name.trim()) errs.name = "Full name is required";
    if (!fields.email.trim()) {
        errs.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email)) {
        errs.email = "Enter a valid email address";
    }
    if (!fields.password) {
        errs.password = "Password is required";
    } else if (fields.password.length < 6) {
        errs.password = "Password must be at least 6 characters";
    }
    if (!isLogin) {
        if (!fields.confirm) errs.confirm = "Please confirm your password";
        else if (fields.confirm !== fields.password) errs.confirm = "Passwords don't match";
    }
    return errs;
}

function PasswordStrength({ password }) {
    if (!password) return null;
    const score =
        (password.length >= 8 ? 1 : 0) +
        (/[A-Z]/.test(password) ? 1 : 0) +
        (/[0-9]/.test(password) ? 1 : 0) +
        (/[^A-Za-z0-9]/.test(password) ? 1 : 0);
    const levels = [
        { label: "Weak", color: "bg-red-500", width: "w-1/4" },
        { label: "Fair", color: "bg-orange-400", width: "w-2/4" },
        { label: "Good", color: "bg-yellow-400", width: "w-3/4" },
        { label: "Strong", color: "bg-green-500", width: "w-full" },
    ];
    const { label, color, width } = levels[Math.max(0, score - 1)];
    return (
        <div className="mt-1.5">
            <div className="h-1 w-full bg-gray-100 rounded-full overflow-hidden">
                <div className={`h-full rounded-full transition-all duration-300 ${color} ${width}`} />
            </div>
            <p className={`text-xs mt-1 font-medium ${color.replace("bg-", "text-")}`}>{label}</p>
        </div>
    );
}

function Field({ label, error, children }) {
    return (
        <div className="space-y-1">
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">{label}</label>
            {children}
            <AnimatePresence>
                {error && (
                    <motion.p
                        initial={{ opacity: 0, y: -4 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -4 }}
                        className="text-xs text-red-500 font-medium"
                    >
                        {error}
                    </motion.p>
                )}
            </AnimatePresence>
        </div>
    );
}

function TextInput({ error, ...props }) {
    return (
        <input
            {...props}
            className={`w-full px-4 py-3 rounded-xl text-sm bg-gray-50 border transition-colors outline-none
                focus:bg-white focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/20
                ${error ? "border-red-400 bg-red-50" : "border-gray-200"}`}
        />
    );
}

function PasswordInput({ value, onChange, placeholder, error, showStrength }) {
    const [show, setShow] = useState(false);
    return (
        <div>
            <div className="relative">
                <input
                    type={show ? "text" : "password"}
                    value={value}
                    onChange={onChange}
                    placeholder={placeholder}
                    className={`w-full px-4 py-3 pr-11 rounded-xl text-sm bg-gray-50 border transition-colors outline-none
                        focus:bg-white focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/20
                        ${error ? "border-red-400 bg-red-50" : "border-gray-200"}`}
                />
                <button
                    type="button"
                    onClick={() => setShow((s) => !s)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                    {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
            </div>
            {showStrength && <PasswordStrength password={value} />}
        </div>
    );
}

export default function AuthModal() {
    const navigate = useNavigate();
    const { open, mode, close, switchToLogin, switchToRegister } = useContext(AuthModalContext);
    const { user, login } = useContext(AuthContext);
    const isLogin = mode === "login";

    const empty = { name: "", email: "", password: "", confirm: "" };
    const [fields, setFields] = useState(empty);
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        if (open) {
            setFields(empty);
            setErrors({});
            setSuccess(false);
        }
    }, [open, mode]);

    if (!open) return null;

    function set(key) {
        return (e) => {
            setFields((f) => ({ ...f, [key]: e.target.value }));
            if (errors[key]) setErrors((er) => ({ ...er, [key]: undefined }));
        };
    }

    function handleClose() {
        close();
        if (!user) navigate("/");
    }

    async function submit(e) {
        e.preventDefault();
        const errs = validate(fields, isLogin);
        if (Object.keys(errs).length) { setErrors(errs); return; }

        setLoading(true);
        try {
            if (isLogin) {
                const res = await api.post("/auth/login", {
                    email: fields.email,
                    password: fields.password,
                });
                login(res.data.accessToken || res.data.token);
                close();
            } else {
                await api.post("/auth/register", {
                    name: fields.name,
                    email: fields.email,
                    password: fields.password,
                });
                setSuccess(true);
                setTimeout(() => switchToLogin(), 1800);
            }
        } catch {
            setErrors({ form: isLogin ? "Invalid email or password." : "Registration failed. Try again." });
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={handleClose}
                className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            />

            {/* Modal */}
            <motion.div
                key={mode}
                initial={{ opacity: 0, scale: 0.97, y: 12 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.97, y: 12 }}
                transition={{ duration: 0.25 }}
                className={`relative w-full bg-white rounded-3xl shadow-2xl overflow-hidden transition-all duration-300 ${isLogin ? "max-w-md" : "max-w-xl"}`}
            >
                {/* Top accent bar */}
                <div className="h-1.5 w-full bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-300" />

                <div className="p-8">
                    {/* Header */}
                    <div className="flex items-start justify-between mb-7">
                        <div className="flex items-center gap-2.5">
                            <div className="bg-yellow-500 rounded-xl p-2">
                                <Car className="h-4 w-4 text-gray-900" />
                            </div>
                            <span className="font-black text-gray-900 tracking-tight">CarRental</span>
                        </div>
                        <button
                            onClick={handleClose}
                            className="w-8 h-8 rounded-xl bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors text-gray-500"
                        >
                            <X className="h-4 w-4" />
                        </button>
                    </div>

                    <h2 className="text-2xl font-bold text-gray-900 mb-1">
                        {isLogin ? "Welcome back" : "Create account"}
                    </h2>
                    <p className="text-sm text-gray-400 mb-7">
                        {isLogin ? "Sign in to manage your bookings." : "Join us and start booking cars instantly."}
                    </p>

                    {/* Success state */}
                    <AnimatePresence>
                        {success && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="flex flex-col items-center py-8 gap-3"
                            >
                                <div className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center">
                                    <Check className="h-7 w-7 text-green-600" />
                                </div>
                                <p className="font-semibold text-gray-800">Account created!</p>
                                <p className="text-sm text-gray-400">Redirecting to login…</p>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {!success && (
                        <form onSubmit={submit} noValidate className="space-y-4">
                            {/* Form-level error */}
                            <AnimatePresence>
                                {errors.form && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -4 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0 }}
                                        className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl px-4 py-3"
                                    >
                                        {errors.form}
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {/* Row 1 — Full Name (register only) */}
                            {!isLogin && (
                                <Field label="Full Name" error={errors.name}>
                                    <TextInput
                                        value={fields.name}
                                        onChange={set("name")}
                                        placeholder="John Doe"
                                        error={errors.name}
                                    />
                                </Field>
                            )}

                            {/* Row 2 — Email */}
                            <Field label="Email Address" error={errors.email}>
                                <TextInput
                                    type="email"
                                    value={fields.email}
                                    onChange={set("email")}
                                    placeholder="you@example.com"
                                    error={errors.email}
                                />
                            </Field>

                            {/* Row 3 — Password (full width login) / Password + Confirm side-by-side (register) */}
                            {isLogin ? (
                                <Field label="Password" error={errors.password}>
                                    <PasswordInput
                                        value={fields.password}
                                        onChange={set("password")}
                                        placeholder="••••••••"
                                        error={errors.password}
                                    />
                                </Field>
                            ) : (
                                <div className="grid grid-cols-2 gap-4">
                                    <Field label="Password" error={errors.password}>
                                        <PasswordInput
                                            value={fields.password}
                                            onChange={set("password")}
                                            placeholder="••••••••"
                                            error={errors.password}
                                            showStrength
                                        />
                                    </Field>
                                    <Field label="Confirm Password" error={errors.confirm}>
                                        <PasswordInput
                                            value={fields.confirm}
                                            onChange={set("confirm")}
                                            placeholder="••••••••"
                                            error={errors.confirm}
                                        />
                                    </Field>
                                </div>
                            )}

                            {/* Submit button */}
                            <button
                                type="submit"
                                disabled={loading}
                                className="group relative w-full mt-2 flex items-center justify-center gap-2
                                    bg-gray-900 hover:bg-gray-800 active:scale-[0.98]
                                    text-white font-semibold text-sm
                                    py-3.5 rounded-xl
                                    transition-all duration-200
                                    disabled:opacity-60 disabled:cursor-not-allowed"
                            >
                                {loading ? (
                                    <span className="flex items-center gap-2">
                                        <span className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                                        Please wait…
                                    </span>
                                ) : (
                                    <>
                                        {isLogin ? "Sign In" : "Create Account"}
                                        <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
                                    </>
                                )}
                                {/* Yellow underline accent on hover */}
                                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 group-hover:w-3/4 h-0.5 bg-yellow-400 rounded-full transition-all duration-300" />
                            </button>
                        </form>
                    )}

                    {/* Switch mode */}
                    {!success && (
                        <p className="text-sm text-center text-gray-400 mt-6">
                            {isLogin ? "Don't have an account? " : "Already have an account? "}
                            <button
                                type="button"
                                onClick={isLogin ? switchToRegister : switchToLogin}
                                className="font-semibold text-yellow-600 hover:text-yellow-500 transition-colors"
                            >
                                {isLogin ? "Register" : "Sign in"}
                            </button>
                        </p>
                    )}
                </div>
            </motion.div>
        </div>
    );
}