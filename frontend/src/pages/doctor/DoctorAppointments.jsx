import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import PageHeader from "../../components/ui/PageHeader";
import EmptyState from "../../components/ui/EmptyState";

const DoctorAppointments = () => {
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchAppointments = async () => {
        try {
            const token = localStorage.getItem("token");
            const response = await axios.get("http://localhost:5000/api/appointments/doctor", {
                headers: { Authorization: `Bearer ${token}` }
            });
            setAppointments(response.data.appointments);
        } catch (error) {
            toast.error("Failed to load appointments");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchAppointments(); }, []);

    const completeAppointment = async (id) => {
        try {
            const token = localStorage.getItem("token");
            await axios.put(`http://localhost:5000/api/appointments/complete/${id}`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            toast.success("Marked as completed");
            fetchAppointments();
        } catch (error) {
            toast.error("Failed to update status");
        }
    };

    return (
        <div className="page-container page-container-lg">
            <ToastContainer position="top-right" autoClose={3000} />
            <PageHeader title="Patient appointments" subtitle="Manage schedules and issue prescriptions." />

            {loading ? (
                <div className="space-y-4">{[1, 2].map((n) => <div key={n} className="skeleton h-32" />)}</div>
            ) : appointments.length === 0 ? (
                <EmptyState title="No appointments" description="Patient bookings will appear here." />
            ) : (
                <div className="space-y-4">
                    {appointments.map((item) => (
                        <div key={item._id} className="card card-hover card-body flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                            <div>
                                <div className="mb-2 flex items-center gap-2">
                                    <span className="badge-info">Patient</span>
                                    <h3 className="font-bold text-slate-900">{item.userId?.name || "Patient"}</h3>
                                </div>
                                <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-slate-500">
                                    <span>{item.slotDate}</span>
                                    <span>{item.slotTime}</span>
                                    <span className={item.status === "booked" ? "badge-success" : "badge-neutral"}>{item.status}</span>
                                </div>
                            </div>
                            <div className="flex flex-col gap-2 sm:flex-row">
                                {item.status === "booked" && (
                                    <button onClick={() => completeAppointment(item._id)} className="btn-success">
                                        Complete
                                    </button>
                                )}
                                <Link to={`/doctor/prescription/${item._id}`} className="btn-secondary text-center">
                                    Add prescription
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default DoctorAppointments;
