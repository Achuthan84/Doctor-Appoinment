import axios from 'axios'
import React, { useState, useContext } from 'react'
import { toast } from 'react-toastify'
import { Link, useNavigate } from "react-router-dom"
import { AuthContext } from '../../context/AuthContext'
import AuthLayout from '../../components/ui/AuthLayout'

export const Login = () => {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [loading, setLoading] = useState(false)
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        try {
            const response = await axios.post("http://localhost:5000/api/auth/login", { email, password })
            if (!response.data?.token || !response.data?.user) {
                throw new Error("Login response missing token or user data")
            }

            login(response.data);
            toast.success("Login successfully")
            const role = response.data.user.role;
            const destination = role === "doctor" ? "/doctor/dashboard" : role === "admin" ? "/admin/dashboard" : "/doctors";
            navigate(destination);
        } catch (error) {
            console.log(error)
            toast.error(error.response?.data?.message || "Invalid credentials")
        } finally {
            setLoading(false)
        }
    }

    return (
        <AuthLayout
            title="Welcome back"
            subtitle="Sign in to manage your healthcare"
            icon={
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
            }
        >
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="email" className="input-label">Email address</label>
                    <input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@example.com"
                        required
                        className="input-field"
                    />
                </div>

                <div>
                    <label htmlFor="password" className="input-label">Password</label>
                    <input
                        id="password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        required
                        className="input-field"
                    />
                </div>

                <button type="submit" disabled={loading} className="btn-primary w-full">
                    {loading ? "Signing in..." : "Sign in"}
                </button>
            </form>

            <p className="mt-5 text-center text-sm text-slate-500">
                Don't have an account?{" "}
                <Link to="/register" className="font-semibold text-teal-600 hover:text-teal-700">
                    Create one
                </Link>
            </p>
        </AuthLayout>
    )
}
