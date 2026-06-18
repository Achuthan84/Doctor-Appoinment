import React, { useState } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import PageHeader from "../../components/ui/PageHeader";

const Settings = () => {
    const [appName, setAppName] = useState("");
    const [commissionPercentage, setCommissionPercentage] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const token = localStorage.getItem("token");
            const response = await axios.put(
                "http://localhost:5000/api/admin/settings",
                { appName, commissionPercentage },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            toast.success(response.data.message || "Settings updated!");
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to update settings.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="page-container flex justify-center">
            <ToastContainer position="top-right" autoClose={3000} />
            <div className="w-full max-w-xl">
                <PageHeader title="Platform settings" subtitle="Configure app name and commission rates." />
                <div className="card overflow-hidden">
                    <form onSubmit={handleSubmit} className="card-body space-y-5 sm:p-8">
                        <div>
                            <label className="input-label">Application name</label>
                            <input type="text" required placeholder="DoctorApp" value={appName} onChange={(e) => setAppName(e.target.value)} className="input-field" />
                            <p className="mt-1 text-xs text-slate-400">Shown in navigation and emails.</p>
                        </div>
                        <div>
                            <label className="input-label">Commission percentage</label>
                            <div className="relative">
                                <input type="number" required min="0" max="100" placeholder="15" value={commissionPercentage} onChange={(e) => setCommissionPercentage(e.target.value)} className="input-field pr-10" />
                                <span className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-sm font-semibold text-slate-400">%</span>
                            </div>
                            <p className="mt-1 text-xs text-slate-400">Deducted from each booking transaction.</p>
                        </div>
                        <div className="border-t border-slate-100 pt-4">
                            <button type="submit" disabled={loading} className="btn-primary w-full sm:w-auto">
                                {loading ? "Saving..." : "Save settings"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Settings;
