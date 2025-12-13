export default function Modal({ open, onClose, title, children, size = "md" }) {
    if (!open) return null;

    const width = {
        sm: "max-w-sm",
        md: "max-w-md",
        lg: "max-w-2xl",
        xl: "max-w-4xl"
    }[size];

    return (
        <div
            className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
            onClick={onClose}
        >
            <div
                className={`bg-white rounded shadow-lg w-full ${width} p-4 animate-fade`}
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex justify-between items-center mb-3">
                    <h3 className="font-semibold text-lg">{title}</h3>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-700">✕</button>
                </div>

                {children}
            </div>
        </div>
    );
}
