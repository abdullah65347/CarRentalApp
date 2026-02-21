import Spinner from "./Spinner";

export default function Button({
    children,
    variant = "primary",
    size = "md",
    loading = false,
    disabled = false,
    className = "",
    ...props
}) {
    const base =
        "inline-flex items-center justify-center gap-2 transition " +
        "disabled:opacity-50 disabled:cursor-not-allowed";

    const sizes = {
        sm: "px-3 py-1.5 text-sm",
        md: "px-4 py-2 text-sm",
        lg: "px-6 py-3 text-base",
    };

    const variants = {
        primary: "bg-blue-600 text-white hover:bg-blue-700 rounded",
        secondary: "bg-gray-200 text-gray-800 hover:bg-gray-300 rounded",
        danger: "bg-red-600 text-white hover:bg-red-700 rounded",
        custom: "", //  no predefined styles for cutom buttons
    };

    return (
        <button
            className={`
                ${base}
                ${variant !== "custom" ? sizes[size] : ""}
                ${variants[variant]}
                ${className}
            `}
            disabled={disabled || loading}
            {...props}
        >
            {loading ? (
                <>
                    <Spinner size="sm" />
                    <span>Loading</span>
                </>
            ) : (
                children
            )}
        </button>
    );
}
