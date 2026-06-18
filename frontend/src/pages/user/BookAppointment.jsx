import React, { useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { assets } from "../../assets/assets";
import PageHeader from "../../components/ui/PageHeader";

const BookAppointment = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [slotDate, setSlotDate] = useState("");
    const [slotTime, setSlotTime] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const token = localStorage.getItem("token");
            const response = await axios.post(
                "http://localhost:5000/api/appointments/book",
                { doctorId: id, slotDate, slotTime },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            toast.success(response.data.message || "Appointment booked!");
            setTimeout(() => navigate("/appointments"), 2000);
        } catch (error) {
            toast.error(error.response?.data?.message || "Booking failed. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="page-container flex justify-center">
            <ToastContainer position="top-right" autoClose={3000} />
            <div className="w-full max-w-md">
                <PageHeader title="Book appointment" subtitle="Choose your preferred date and time." />
                <div className="card overflow-hidden">
                    <div className="border-b border-slate-100 bg-gradient-to-r from-teal-50 to-cyan-50 px-6 py-5 text-center">
                        <img src={assets.appointmentBook} className="mx-auto h-10 w-10" alt="" />
                    </div>
                    <form onSubmit={handleSubmit} className="card-body space-y-4">
                        <div>
                            <label className="input-label">Date</label>
                            <input type="date" value={slotDate} required onChange={(e) => setSlotDate(e.target.value)} className="input-field" />
                        </div>
                        <div>
                            <label className="input-label">Time slot</label>
                            <input type="text" placeholder="e.g. 10:00 AM" value={slotTime} required onChange={(e) => setSlotTime(e.target.value)} className="input-field" />
                        </div>
                        <button type="submit" disabled={loading} className="btn-primary w-full">
                            {loading ? "Booking..." : "Confirm appointment"}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default BookAppointment;
