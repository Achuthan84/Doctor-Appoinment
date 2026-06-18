import { createContext, useState } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(() => {
        
        const storedUser = localStorage.getItem("user");
        if (!storedUser || storedUser === "undefined" || storedUser === "null") {
            return null;
        }

        try {
            return JSON.parse(storedUser);
        } catch (error) {
            console.warn("Invalid stored user JSON, clearing localStorage user.", error);
            localStorage.removeItem("user");
            return null;
        }
    });

    const login = (data) => {
        localStorage.setItem(
            "token",
            data.token
        );

        localStorage.setItem(
            "user",
            JSON.stringify(data.user)
        );
        setUser(data.user);
    };


    const logout = () => {
        localStorage.removeItem(
            "token"
        );
        localStorage.removeItem(
            "user"
        );
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>

    )

}