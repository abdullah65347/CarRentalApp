import { useToast as useCtxToast } from "../context/ToastContext";

export default function useToast() {
    return useCtxToast();
}
