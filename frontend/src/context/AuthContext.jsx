import { createContext, useContext, useEffect, useState } from "react";
import api from "../api/axios";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem("habitor_token");
        if (!token) {
            setLoading(false);
            return;
        }
        api
            .get("/auth/me")
            .then((res) => setUser(res.data))
            .catch(() => localStorage.removeItem("habitor_token"))
            .finally(() => setLoading(false));
    }, []);

    const login = async (email, password) => {
        const res = await api.post("/auth/login", { email, password });
        localStorage.setItem("habitor_token", res.data.token);
        setUser(res.data.user);
    };

    const register = async (name, email, password) => {
        const res = await api.post("/auth/register", { name, email, password });
        localStorage.setItem("habitor_token", res.data.token);
        setUser(res.data.user);
    };

    const logout = () => {
        localStorage.removeItem("habitor_token");
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}