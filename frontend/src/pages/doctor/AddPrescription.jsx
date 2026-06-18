import React, { useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import PageHeader from "../../components/ui/PageHeader";

const AddPrescription = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [name, setName] = useState("");
    const [dosage, setDosage] = useState("");
    const [duration, setDuration] = useState("");
    const [notes, setNotes] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const token = localStorage.getItem("token");
            const response = await axios.post(
                "http://localhost:5000/api/prescriptions",
                { appointmentId: id, medicines: [{ name, dosage, duration }], notes },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            toast.success(response.data.message || "Prescription saved!");
            setName(""); setDosage(""); setDuration(""); setNotes("");
            setTimeout(() => navigate("/doctor/appointments"), 2000);
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to save prescription.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="page-container flex justify-center">
            <ToastContainer position="top-right" autoClose={2500} />
            <div className="w-full max-w-2xl">
                <PageHeader
                    title="Issue prescription"
                    subtitle={`Appointment #${id?.slice(-6).toUpperCase()}`}
                />
                <div className="card overflow-hidden">
                    <form onSubmit={handleSubmit} className="card-body space-y-6 sm:p-8">
                        <div>
                            <h3 className="mb-4 text-xs font-bold uppercase tracking-wider text-teal-600">Medication</h3>
                            <div className="space-y-4">
                                <div>
                                    <label className="input-label">Medicine name</label>
                                    <input type="text" required placeholder="e.g. Amoxicillin 500mg" value={name} onChange={(e) => setName(e.target.value)} className="input-field" />
                                </div>
                                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                    <div>
                                        <label className="input-label">Dosage</label>
                                        <input type="text" required placeholder="1-0-1 after meals" value={dosage} onChange={(e) => setDosage(e.target.value)} className="input-field" />
                                    </div>
                                    <div>
                                        <label className="input-label">Duration</label>
                                        <input type="text" required placeholder="5 days" value={duration} onChange={(e) => setDuration(e.target.value)} className="input-field" />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div>
                            <label className="input-label">Doctor's notes</label>
                            <textarea rows={4} placeholder="Additional advice for the patient..." value={notes} onChange={(e) => setNotes(e.target.value)} className="input-field resize-none" />
                        </div>
                        <div className="flex flex-col-reverse gap-3 border-t border-slate-100 pt-4 sm:flex-row sm:justify-end">
                            <button type="button" onClick={() => navigate(-1)} className="btn-secondary">Cancel</button>
                            <button type="submit" disabled={loading} className="btn-primary">
                                {loading ? "Saving..." : "Save prescription"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AddPrescription;
