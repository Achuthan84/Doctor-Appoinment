import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import AuthLayout from "../../components/ui/AuthLayout";

const DoctorRegister = () => {
    const [form, setForm] = useState({
        name: "", email: "", password: "",
        specialization: "", experience: "", qualification: "", fee: ""
    });
    const [certificate, setCertificate] = useState(null);
    const [loading, setLoading] = useState(false);

    const changeHandler = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const submitHandler = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const formData = new FormData();
            Object.entries(form).forEach(([k, v]) => formData.append(k, v));
            formData.append("certificate", certificate);

            const response = await axios.post("http://localhost:5000/api/doctors/register", formData, {
                headers: { "Content-Type": "multipart/form-data" }
            });
            toast.success(response.data.message);
        } catch (error) {
            toast.error(error.response?.data?.message || "Registration failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthLayout
            title="Doctor registration"
            subtitle="Apply to join as a medical practitioner"
            accent="cyan"
            icon={
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                </svg>
            }
        >
            <form onSubmit={submitHandler} className="space-y-4">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="sm:col-span-2">
                        <label className="input-label">Full name</label>
                        <input type="text" name="name" required onChange={changeHandler} className="input-field" placeholder="Dr. Jane Smith" />
                    </div>
                    <div>
                        <label className="input-label">Email</label>
                        <input type="email" name="email" required onChange={changeHandler} className="input-field" />
                    </div>
                    <div>
                        <label className="input-label">Password</label>
                        <input type="password" name="password" required onChange={changeHandler} className="input-field" />
                    </div>
                    <div>
                        <label className="input-label">Specialization</label>
                        <input type="text" name="specialization" required onChange={changeHandler} className="input-field" placeholder="Cardiology" />
                    </div>
                    <div>
                        <label className="input-label">Experience (years)</label>
                        <input type="number" name="experience" required onChange={changeHandler} className="input-field" />
                    </div>
                    <div>
                        <label className="input-label">Qualification</label>
                        <input type="text" name="qualification" required onChange={changeHandler} className="input-field" />
                    </div>
                    <div>
                        <label className="input-label">Consultation fee (₹)</label>
                        <input type="number" name="fee" required onChange={changeHandler} className="input-field" />
                    </div>
                    <div className="sm:col-span-2">
                        <label className="input-label">Medical certificate</label>
                        <input type="file" required onChange={(e) => setCertificate(e.target.files[0])} className="input-field file:mr-3 file:rounded-lg file:border-0 file:bg-teal-50 file:px-3 file:py-1 file:text-sm file:font-medium file:text-teal-700" />
                    </div>
                </div>
                <button type="submit" disabled={loading} className="btn-primary w-full">
                    {loading ? "Submitting..." : "Submit application"}
                </button>
            </form>
            <p className="mt-4 text-center text-sm text-slate-500">
                <Link to="/register" className="font-semibold text-teal-600 hover:text-teal-700">← Back to patient registration</Link>
            </p>
        </AuthLayout>
    );
};

export default DoctorRegister;
