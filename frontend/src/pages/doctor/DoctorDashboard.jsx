import React from "react";
import { Link } from "react-router-dom";
import PageHeader from "../../components/ui/PageHeader";

const cards = [
    {
        to: "/doctor/slots",
        title: "Add time slots",
        desc: "Set your availability so patients can book appointments.",
        color: "teal",
        icon: "M12 4v16m8-8H4",
    },
    {
        to: "/doctor/appointments",
        title: "View appointments",
        desc: "Review schedules, complete visits, and write prescriptions.",
        color: "emerald",
        icon: "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z",
    },
    {
        to: "/doctor/profile",
        title: "My profile",
        desc: "Update specialization, fees, and professional details.",
        color: "cyan",
        icon: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z",
    },
];

const colorMap = {
    teal: "bg-teal-50 text-teal-600 group-hover:bg-teal-600 group-hover:text-white",
    emerald: "bg-emerald-50 text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white",
    cyan: "bg-cyan-50 text-cyan-600 group-hover:bg-cyan-600 group-hover:text-white",
};

const DoctorDashboard = () => (
    <div className="page-container page-container-lg">
        <PageHeader
            title="Doctor dashboard"
            subtitle="Manage your practice, availability, and patient care."
        />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
            {cards.map(({ to, title, desc, color, icon }) => (
                <Link key={to} to={to} className="card card-hover card-body group">
                    <div className={`mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl transition duration-200 ${colorMap[color]}`}>
                        <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={icon} />
                        </svg>
                    </div>
                    <h3 className="text-lg font-bold text-slate-900">{title}</h3>
                    <p className="mt-1 text-sm text-slate-500">{desc}</p>
                    <span className="mt-4 inline-flex text-sm font-semibold text-teal-600 group-hover:translate-x-0.5 transition-transform">
                        Open →
                    </span>
                </Link>
            ))}
        </div>
    </div>
);

export default DoctorDashboard;
