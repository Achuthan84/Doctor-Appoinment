import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { assets } from "../../assets/assets";
import PageHeader from "../../components/ui/PageHeader";
import EmptyState from "../../components/ui/EmptyState";

const Doctors = () => {
    const [doctors, setDoctors] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axios.get("http://localhost:5000/api/doctors")
            .then((res) => setDoctors(res.data.doctors))
            .catch(console.log)
            .finally(() => setLoading(false));
    }, []);

    return (
        <div className="page-container">
            <PageHeader
                title="Find a Doctor"
                subtitle="Browse certified specialists and book your next consultation."
            />

            {loading ? (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
                    {[1, 2, 3].map((n) => (
                        <div key={n} className="skeleton h-56" />
                    ))}
                </div>
            ) : doctors.length === 0 ? (
                <EmptyState
                    title="No doctors available"
                    description="Check back later — new specialists are added regularly."
                />
            ) : (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
                    {doctors.map((doctor) => (
                        <article key={doctor._id} className="card card-hover card-body flex flex-col">
                            <div className="mb-4 flex items-start justify-between gap-3">
                                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-teal-50">
                                    <img src={assets.doctorImg} className="h-8 w-8" alt="" />
                                </div>
                                <span className="badge-success">{doctor.experience} yrs exp</span>
                            </div>

                            <h3 className="text-lg font-bold text-slate-900">
                                Dr. {doctor.userId?.name || "Specialist"}
                            </h3>
                            <p className="mt-0.5 text-sm font-medium text-teal-600">{doctor.specialization}</p>

                            <div className="mt-4 flex items-baseline justify-between border-t border-slate-100 pt-4">
                                <span className="text-xs font-medium uppercase tracking-wider text-slate-400">Consultation</span>
                                <span className="text-xl font-bold text-slate-900">₹{doctor.fee}</span>
                            </div>

                            <Link to={`/book/${doctor._id}`} className="btn-primary mt-5 w-full">
                                Book appointment
                            </Link>
                        </article>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Doctors;
