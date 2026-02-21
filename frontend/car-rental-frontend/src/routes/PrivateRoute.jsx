import { useContext, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import { AuthModalContext } from "../context/AuthModalContext";

export default function PrivateRoute({ children }) {
    const { user, loading } = useContext(AuthContext);
    const { openLogin } = useContext(AuthModalContext);

    useEffect(() => {
        if (!loading && !user) {
            openLogin();
        }
    }, [loading, user, openLogin]);

    // ⛔ Wait until auth check completes
    if (loading) {
        return null; // or a loader spinner
    }

    // ⛔ If not logged in after loading, block route
    if (!user) {
        return null;
    }

    return children;
}
