import { useState } from "react";

export default function useLoading() {
    const [loading, setLoading] = useState(false);

    async function wrap(fn) {
        try {
            setLoading(true);
            return await fn();
        } finally {
            setLoading(false);
        }
    }

    return { loading, wrap };
}
