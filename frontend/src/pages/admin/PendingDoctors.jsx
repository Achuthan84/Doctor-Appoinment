import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import PageHeader from "../../components/ui/PageHeader";
import EmptyState from "../../components/ui/EmptyState";

const PendingDoctors = () => {
    const [doctors, setDoctors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [expandedDoctorId, setExpandedDoctorId] = useState(null);

    // CONFIGURATION: Set this to match your Express backend upload path configuration
    const BACKEND_STATIC_URL = "http://localhost:5000/uploads";

    const fetchPendingDoctors = async () => {
        try {
            const token = localStorage.getItem("token");
            const response = await axios.get(
                "http://localhost:5000/api/admin/pending-doctors",
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );
            setDoctors(response.data?.doctors || response.data?.doctor || []);
        } catch (error) {
            console.log(error);
            toast.error("Failed to load applicant verification profiles.");
            setDoctors([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPendingDoctors();
    }, []);

    const approveDoctor = async (id) => {
        try {
            const token = localStorage.getItem("token");
            await axios.patch(
                `http://localhost:5000/api/admin/approve-doctor/${id}`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            toast.success("Medical Professional Credentials Approved!");
            setExpandedDoctorId(null);
            fetchPendingDoctors();
        } catch (error) {
            console.log(error);
            toast.error("Failed to process credentials validation request.");
        }
    };

    const toggleExpand = (id) => {
        setExpandedDoctorId(expandedDoctorId === id ? null : id);
    };

    return (
        <div className="page-container page-container-lg">
            <ToastContainer position="top-right" autoClose={3000} />

            <PageHeader
                title="Pending verifications"
                subtitle="Review doctor applications before approval."
                badge={
                    <span className="badge-warning flex items-center gap-1.5">
                        <span className="h-2 w-2 animate-pulse rounded-full bg-amber-500" />
                        {doctors?.length || 0} pending
                    </span>
                }
            />

                {/* Main Content Layout Pipeline */}
                {loading ? (
                    <div className="space-y-4">
                        {[1, 2].map((n) => (
                            <div key={n} className="animate-pulse bg-white rounded-2xl p-6 h-44 border border-slate-100 shadow-sm" />
                        ))}
                    </div>
                ) : doctors.length === 0 ? (
                    <EmptyState
                        icon={
                            <svg className="h-6 w-6 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        }
                        title="Queue is clear"
                        description="All doctor applications have been reviewed."
                    />
                ) : (
                    <div className="space-y-4">
                        {doctors.map((doctor) => {
                            const isExpanded = expandedDoctorId === doctor._id;

                            // FIXED: Dynamically map the correct full backend address URL string
                            const fullCertificateUrl = doctor.certificate
                                ? `${BACKEND_STATIC_URL}/${doctor.certificate}`
                                : null;

                            return (
                                <div
                                    key={doctor._id}
                                    className={`card overflow-hidden transition-all ${isExpanded ? "ring-2 ring-teal-200" : ""}`}
                                >
                                    {/* CARD SUMMARY ROW */}
                                    <div className="p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white">
                                        <div className="space-y-2 grow">
                                            <div className="flex flex-wrap items-center gap-2">
                                                <h3 className="text-xl font-bold text-gray-900 tracking-tight">
                                                    Dr. {doctor.userId?.name || "Medical Practitioner"}
                                                </h3>
                                                <span className="bg-blue-50 text-blue-700 text-xs font-semibold px-2.5 py-0.5 rounded-md border border-blue-100">
                                                    {doctor.specialization || "General Medicine"}
                                                </span>
                                            </div>

                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1 text-sm text-gray-500">
                                                <div><span className="font-medium text-gray-700">Email:</span> {doctor.userId?.email}</div>
                                                <div><span className="font-medium text-gray-700">Experience:</span> {doctor.experience || 0} Years</div>
                                            </div>
                                        </div>

                                        {/* Action Trigger Buttons */}
                                        <div className="flex items-center gap-2 pt-3 sm:pt-0 border-t sm:border-t-0 border-gray-50">
                                            <button onClick={() => toggleExpand(doctor._id)} className="btn-secondary w-full sm:w-auto">
                                                {isExpanded ? "Hide File" : "Review Details"}
                                                <svg className={`w-4 h-4 transform transition-transform ${isExpanded ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                                </svg>
                                            </button>
                                            <button onClick={() => approveDoctor(doctor._id)} className="btn-success w-full sm:w-auto">
                                                Approve
                                            </button>
                                        </div>
                                    </div>

                                    {/* COLLAPSIBLE DOSSIER PANEL */}
                                    {isExpanded && (
                                        <div className="bg-slate-50/70 border-t border-gray-100 p-6 space-y-6">

                                            {/* Sub-grid Details */}
                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                                                <div>
                                                    <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-400">Qualifications & Boards</label>
                                                    <p className="text-sm font-semibold text-gray-800 mt-0.5">{doctor.qualification || "Not specified"}</p>
                                                </div>
                                                <div>
                                                    <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-400">Base Consultation Fee</label>
                                                    <p className="text-sm font-semibold text-gray-800 mt-0.5">₹{doctor.fee || "0"}</p>
                                                </div>
                                                <div>
                                                    <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-400">Database Reference Key</label>
                                                    <p className="text-xs font-mono text-gray-500 mt-1 select-all">{doctor._id}</p>
                                                </div>
                                            </div>

                                            {/* Attachment Verification Preview Box */}
                                            <div className="space-y-2">
                                                <div className="flex items-center justify-between">
                                                    <label className="text-xs font-bold uppercase tracking-wider text-gray-500 flex items-center gap-1.5">
                                                        <svg className="w-4 h-4 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                                        </svg>
                                                        Medical Practice Certificate & Licensing Document
                                                    </label>

                                                    {fullCertificateUrl && (
                                                        <a
                                                            href={fullCertificateUrl}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="text-xs text-indigo-600 hover:text-indigo-800 font-semibold flex items-center gap-1 underline"
                                                        >
                                                            Open File in New Tab
                                                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                                            </svg>
                                                        </a>
                                                    )}
                                                </div>

                                                {fullCertificateUrl ? (
                                                    <div className="w-full bg-white rounded-xl border border-slate-200 overflow-hidden shadow-inner min-h-[400px] flex items-center justify-center">
                                                        {doctor.certificate.toLowerCase().endsWith('.pdf') ? (
                                                            <iframe
                                                                src={`${fullCertificateUrl}#view=FitH`}
                                                                title={`Certificate - ${doctor._id}`}
                                                                className="w-full h-[500px] border-none"
                                                            />
                                                        ) : (
                                                            <img
                                                                src={fullCertificateUrl}
                                                                alt="Medical Practitioner Document Upload"
                                                                className="max-w-full max-h-[500px] object-contain p-2 rounded-xl"
                                                                onError={(e) => {
                                                                    e.target.onerror = null;
                                                                    e.target.src = "https://placehold.co/600x400?text=Error+Loading+Image+Asset";
                                                                    toast.error(`Could not reach file at backend destination folder structure.`);
                                                                }}
                                                            />
                                                        )}
                                                    </div>
                                                ) : (
                                                    <div className="w-full bg-slate-100 rounded-xl border border-dashed border-slate-300 p-8 text-center">
                                                        <p className="text-sm text-slate-400 italic">No verification document has been uploaded by this applicant.</p>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Bottom Decision Actions */}
                                            <div className="flex justify-end pt-2">
                                                <button
                                                    onClick={() => approveDoctor(doctor._id)}
                                                    className="w-full sm:w-auto cursor-pointer bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold py-2.5 px-8 rounded-xl shadow transition"
                                                >
                                                    Confirm Verification & Approve Profile
                                                </button>
                                            </div>

                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                )}

        </div>
    );
};

export default PendingDoctors;