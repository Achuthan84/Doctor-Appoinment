import React, { useEffect, useState } from "react";
import axios from "axios";
import PageHeader from "../../components/ui/PageHeader";
import EmptyState from "../../components/ui/EmptyState";

const getStatusBadge = (status) => {
    const s = status?.toLowerCase();
    if (s === "completed") return "badge-success";
    if (s === "cancelled" || s === "rejected") return "badge-warning";
    if (s === "pending") return "badge-warning";
    return "badge-info";
};

const Appointments = () => {
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem("token");
        axios.get("http://localhost:5000/api/admin/appointments", {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then((res) => setAppointments(res.data?.appointments || []))
            .catch(() => setAppointments([]))
            .finally(() => setLoading(false));
    }, []);

    return (
        <div className="page-container page-container-xl">
            <PageHeader
                title="Appointments log"
                subtitle="All bookings across the platform."
                badge={!loading && appointments.length > 0 && (
                    <span className="badge-neutral">{appointments.length} total</span>
                )}
            />

            {loading ? (
                <div className="space-y-3">
                    <div className="skeleton h-12" />
                    <div className="skeleton h-16" />
                </div>
            ) : appointments.length === 0 ? (
                <EmptyState title="No appointments" description="Booking records will appear here." />
            ) : (
                <div className="table-wrapper">
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>Patient</th>
                                <th>Doctor</th>
                                <th>Date</th>
                                <th>Time</th>
                                <th>Fee</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {appointments.map((item) => (
                                <tr key={item._id}>
                                    <td className="font-semibold text-slate-900">{item.userId?.name || "Patient"}</td>
                                    <td>Dr. {item.doctorId?.userId?.name || "Doctor"}</td>
                                    <td>{item.slotDate}</td>
                                    <td><span className="badge-neutral">{item.slotTime}</span></td>
                                    <td className="font-bold">₹{item.totalFee ?? "0"}</td>
                                    <td><span className={getStatusBadge(item.status)}>{item.status || "Unknown"}</span></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default Appointments;
