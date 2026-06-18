import React, { useEffect, useState } from "react";
import axios from "axios";
import { assets } from "../../assets/assets";
import PageHeader from "../../components/ui/PageHeader";
import EmptyState from "../../components/ui/EmptyState";

const MyPrescriptions = () => {
    const [prescriptions, setPrescriptions] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem("token");
        axios.get("http://localhost:5000/api/prescriptions/user", {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then((res) => setPrescriptions(res.data.prescriptions))
            .catch(console.log)
            .finally(() => setLoading(false));
    }, []);

    return (
        <div className="page-container page-container-lg">
            <PageHeader title="My prescriptions" subtitle="View medications and dosage instructions from your doctors." />

            {loading ? (
                <div className="space-y-4">{[1, 2].map((n) => <div key={n} className="skeleton h-48" />)}</div>
            ) : prescriptions.length === 0 ? (
                <EmptyState title="No prescriptions" description="Prescriptions from completed visits will appear here." />
            ) : (
                <div className="space-y-4 sm:space-y-6">
                    {prescriptions.map((item) => (
                        <article key={item._id} className="card overflow-hidden">
                            <div className="flex flex-col gap-2 border-b border-slate-100 bg-slate-50 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
                                <div className="flex items-center gap-3">
                                    <div className="rounded-lg bg-teal-100 p-2">
                                        <img src={assets.report} className="h-7 w-7" alt="" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-slate-900">Dr. {item.doctorId?.userId?.name || "Specialist"}</h3>
                                        <p className="text-xs text-slate-400">ID: {item._id.slice(-6).toUpperCase()}</p>
                                    </div>
                                </div>
                            </div>
                            <div className="card-body space-y-4">
                                <div className="table-wrapper">
                                    <table className="data-table min-w-[480px]">
                                        <thead>
                                            <tr>
                                                <th>Medicine</th>
                                                <th>Dosage</th>
                                                <th>Duration</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {item.medicines.map((med, i) => (
                                                <tr key={i}>
                                                    <td className="font-medium text-slate-900">{med.name}</td>
                                                    <td>{med.dosage}</td>
                                                    <td className="text-slate-500">{med.duration}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                                {item.notes && (
                                    <div className="rounded-xl border border-amber-100 bg-amber-50/60 p-4">
                                        <p className="text-xs font-bold uppercase tracking-wider text-amber-800">Doctor's notes</p>
                                        <p className="mt-1 text-sm text-amber-900/80">{item.notes}</p>
                                    </div>
                                )}
                            </div>
                        </article>
                    ))}
                </div>
            )}
        </div>
    );
};

export default MyPrescriptions;
