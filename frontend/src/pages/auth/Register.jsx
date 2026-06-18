import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import AuthLayout from "../../components/ui/AuthLayout";

const Register = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await axios.post(
                "http://localhost:5000/api/auth/register",
                { name, email, password, role: "user" }
            );

            toast.success(response.data.message || "Registration successful!");
            setName("");
            setEmail("");
            setPassword("");
        } catch (error) {
            console.log(error);
            toast.error(error.response?.data?.message || "Registration failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthLayout
            title="Create account"
            subtitle="Join as a patient to book appointments"
            accent="emerald"
            icon={
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                </svg>
            }
        >
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="name" className="input-label">Full name</label>
                    <input id="name" type="text" placeholder="John Doe" value={name} onChange={(e) => setName(e.target.value)} required className="input-field" />
                </div>
                <div>
                    <label htmlFor="email" className="input-label">Email address</label>
                    <input id="email" type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required className="input-field" />
                </div>
                <div>
                    <label htmlFor="password" className="input-label">Password</label>
                    <input id="password" type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} required className="input-field" />
                </div>
                <button type="submit" disabled={loading} className="btn-primary w-full">
                    {loading ? "Creating account..." : "Create account"}
                </button>
            </form>

            <div className="mt-6 space-y-4 text-center text-sm text-slate-500">
                <p>
                    Already have an account?{" "}
                    <Link to="/" className="font-semibold text-teal-600 hover:text-teal-700">Sign in</Link>
                </p>
                <div className="flex items-center gap-3 text-xs uppercase tracking-wider text-slate-400">
                    <span className="h-px flex-1 bg-slate-200" />
                    <span>or</span>
                    <span className="h-px flex-1 bg-slate-200" />
                </div>
                <Link to="/doctor-register" className="btn-secondary inline-flex w-full">
                    Register as a doctor
                </Link>
            </div>
        </AuthLayout>
    );
};

export default Register;
