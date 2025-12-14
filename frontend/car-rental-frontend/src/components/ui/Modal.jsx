import Button from "./Button";

export default function Modal({
    open,
    title,
    children,
    onClose,
    onConfirm,
    confirmText = "Confirm",
    cancelText = "Cancel",
    variant = "primary", // primary | danger
    loading = false,
    size = "md",
    hideFooter = false,
}) {
    if (!open) return null;

    const width = {
        sm: "max-w-sm",
        md: "max-w-md",
        lg: "max-w-2xl",
        xl: "max-w-4xl",
    }[size];

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* BACKDROP */}
            <div
                className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* MODAL */}
            <div
                className={`relative bg-white rounded-xl shadow-xl w-full ${width} mx-4 max-h-[90vh] flex flex-col animate-fade-in`}
            >
                {/* HEADER */}
                <div className="flex items-center justify-between px-6 py-4">
                    <h3 className="text-lg font-semibold text-gray-900">
                        {title}
                    </h3>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 text-xl"
                    >
                        ✕
                    </button>
                </div>

                {/* BODY */}
                <div className="px-6 py-4 overflow-y-auto modal-scroll">{children}</div>

                {/* FOOTER */}
                {!hideFooter && (
                    <div className="flex justify-end gap-3 px-6 py-4 rounded-b-xl">
                        <Button
                            variant="secondary"
                            onClick={onClose}
                            disabled={loading}
                        >
                            {cancelText}
                        </Button>

                        {onConfirm && (
                            <Button
                                variant={variant}
                                loading={loading}
                                onClick={onConfirm}
                            >
                                {confirmText}
                            </Button>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
