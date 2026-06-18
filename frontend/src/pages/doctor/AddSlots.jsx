import React, { useState } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import PageHeader from "../../components/ui/PageHeader";

const AddSlots = () => {
    const [date, setDate] = useState("");
    const [startTime, setStartTime] = useState("");
    const [endTime, setEndTime] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (startTime >= endTime) {
            return toast.error("End time must be after the start time.");
        }

        setLoading(true);
        try {
            const token = localStorage.getItem("token");
            const response = await axios.put(
                "http://localhost:5000/api/doctors/add-slots",
                { date, startTime, endTime },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            toast.success(response.data.message || "Slot created successfully!");
            setDate("");
            setStartTime("");
            setEndTime("");
        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.message || "Failed to add slot.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="page-container flex justify-center">
            <ToastContainer position="top-right" autoClose={2500} />
            <div className="w-full max-w-md">
                <PageHeader title="Add availability" subtitle="Create time slots for patient bookings." />

                <div className="card card-body mt-4">
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="input-label">Date</label>
                            <input
                                type="date"
                                value={date}
                                required
                                min={new Date().toISOString().split("T")[0]}
                                onChange={(e) => setDate(e.target.value)}
                                className="input-field"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="input-label">Start time</label>
                                <input
                                    type="time"
                                    value={startTime}
                                    required
                                    onChange={(e) => setStartTime(e.target.value)}
                                    className="input-field"
                                />
                            </div>
                            <div>
                                <label className="input-label">End time</label>
                                <input
                                    type="time"
                                    value={endTime}
                                    required
                                    onChange={(e) => setEndTime(e.target.value)}
                                    className="input-field"
                                />
                            </div>
                        </div>

                        <button type="submit" disabled={loading} className="btn-primary w-full mt-2 cursor-pointer">
                            {loading ? "Creating..." : "Create slot"}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AddSlots;