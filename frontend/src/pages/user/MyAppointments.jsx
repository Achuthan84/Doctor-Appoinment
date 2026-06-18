import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { assets } from "../../assets/assets";
import PageHeader from "../../components/ui/PageHeader";
import EmptyState from "../../components/ui/EmptyState";

const MyAppointments = () => {
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    
    const [showModal, setShowModal] = useState(false);
    const [selectedId, setSelectedId] = useState(null);
    const [slotDate, setSlotDate] = useState("");
    const [slotTime, setSlotTime] = useState("");

    // Fetch Appointments
    const fetchAppointments = async () => {
        try {
            const token = localStorage.getItem("token");
            const response = await axios.get("http://localhost:5000/api/appointments/user", {
                headers: { Authorization: `Bearer ${token}` },
            });

            const list = response.data?.appointments || [];
            setAppointments([...list].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
        } catch (error) {
            toast.error("Failed to load appointments");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAppointments();
    }, []);

    // Open Modal
    const openRescheduleModal = (id) => {
        setSelectedId(id);
        setShowModal(true);
    };

    // Reschedule
    const handleReschedule = async () => {
        if (!slotDate || !slotTime) {
            toast.warning("Select date and time");
            return;
        }
        try {
            const token = localStorage.getItem("token");
            const response = await axios.put(
                `http://localhost:5000/api/appointments/reschedule/${selectedId}`,
                { slotDate, slotTime },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            toast.success(response.data.message);
            setShowModal(false);
            setSlotDate("");
            setSlotTime("");
            setSelectedId(null);
            fetchAppointments();
        } catch (error) {
            toast.error(error.response?.data?.message || "Reschedule Failed");
        }
    };

    // Status badge style helper
    const getStatusClass = (status) => {
        if (status === "booked") return "badge-success";
        if (status === "rescheduled") return "rounded-full bg-amber-100 px-3 py-1 text-sm font-medium text-amber-700";
        return "badge-neutral";
    };

    return (
        <div className="page-container page-container-lg">
            <ToastContainer position="top-right" autoClose={3000} />

            <PageHeader
                title="My Appointments"
                subtitle="Track your scheduled visits and consultations."
            />

            {/* Loading Skeleton */}
            {loading ? (
                <div className="space-y-4">
                    {[1, 2].map((n) => (
                        <div key={n} className="skeleton h-28" />
                    ))}
                </div>

            ) : appointments.length === 0 ? (
                /* Empty State */
                <EmptyState
                    icon={<img src={assets.doctorImg} className="h-7 w-7 opacity-60" alt="" />}
                    title="No appointments yet"
                    description="Browse doctors and book your first consultation."
                />

            ) : (
                /* Appointment List */
                <div className="space-y-4">
                    {appointments.map((item) => (
                        <div
                            key={item._id}
                            className="card card-hover card-body flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
                        >
                            {/* Left — Doctor Info */}
                            <div className="flex items-start gap-4">
                                <div className="hidden h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-teal-50 sm:flex">
                                    <img src={assets.doctorImg} className="h-7 w-7" alt="" />
                                </div>

                                <div>
                                    <h3 className="font-bold text-slate-900">
                                        Dr. {item.doctorId?.userId?.name || "Specialist"}
                                    </h3>
                                    <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-sm text-slate-500">
                                        <span>{item.slotDate}</span>
                                        <span>{item.slotTime}</span>
                                        <span className="font-medium text-slate-700">
                                            ₹{item.totalFee || item.fee}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Right — Status + Action */}
                            <div className="flex items-center gap-3">
                                <span className={getStatusClass(item.status)}>
                                    {item.status}
                                </span>

                                {item.status === "booked" && (
                                    <button
                                        onClick={() => openRescheduleModal(item._id)}
                                        className="cursor-pointer rounded-lg bg-teal-600 px-3 py-2 text-xs font-medium text-white transition hover:bg-teal-700"
                                    >
                                        Reschedule
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Reschedule Modal */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm">
                    <div className="card card-body w-full max-w-md">

                        <h2 className="text-xl font-bold text-slate-900">Reschedule Appointment</h2>
                        <p className="mt-1 text-sm text-slate-500">
                            Choose a new date and time for your consultation.
                        </p>

                        <div className="mt-6 space-y-4">
                            {/* Date */}
                            <div>
                                <label className="mb-2 block text-sm font-medium text-slate-700">
                                    Select Date
                                </label>
                                <input
                                    type="date"
                                    value={slotDate}
                                    onChange={(e) => setSlotDate(e.target.value)}
                                    className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-teal-500"
                                />
                            </div>

                            {/* Time */}
                            <div>
                                <label className="mb-2 block text-sm font-medium text-slate-700">
                                    Select Time
                                </label>
                                <input
                                    type="time"
                                    value={slotTime}
                                    onChange={(e) => setSlotTime(e.target.value)}
                                    className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-teal-500"
                                />
                            </div>
                        </div>

                        {/* Modal Actions */}
                        <div className="mt-6 flex justify-end gap-3">
                            <button
                                onClick={() => setShowModal(false)}
                                className="cursor-pointer rounded-xl border border-slate-200 px-5 py-2.5 text-slate-600 hover:bg-slate-50"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleReschedule}
                                className="cursor-pointer rounded-xl bg-teal-600 px-5 py-2.5 font-medium text-white hover:bg-teal-700"
                            >
                                Confirm Reschedule
                            </button>
                        </div>

                    </div>
                </div>
            )}
        </div>
    );
};

export default MyAppointments;