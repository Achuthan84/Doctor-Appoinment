import React, { useEffect, useState } from "react";
import axios from "axios";
import { assets } from "../../assets/assets";
import PageHeader from "../../components/ui/PageHeader";
import EmptyState from "../../components/ui/EmptyState";

const Notifications = () => {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchNotifications = async () => {
        try {
            const token = localStorage.getItem("token");
            const response = await axios.get("http://localhost:5000/api/notifications", {
                headers: { Authorization: `Bearer ${token}` }
            });
            setNotifications(response.data.notifications);
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchNotifications(); }, []);

    const markAsRead = async (id) => {
        try {
            const token = localStorage.getItem("token");
            await axios.put(`http://localhost:5000/api/notifications/${id}`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchNotifications();
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <div className="page-container page-container-md">
            <PageHeader title="Notifications" subtitle="Stay updated on appointments and activity." />

            {loading ? (
                <div className="space-y-3">{[1, 2, 3].map((n) => <div key={n} className="skeleton h-20" />)}</div>
            ) : notifications.length === 0 ? (
                <EmptyState
                    icon={
                        <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                        </svg>
                    }
                    title="All caught up"
                    description="You have no new notifications."
                />
            ) : (
                <div className="space-y-3">
                    {notifications.map((item) => (
                        <div
                            key={item._id}
                            className={`card card-body flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between ${!item.isRead ? "border-l-4 border-l-teal-500 bg-teal-50/30" : "opacity-80"}`}
                        >
                            <div className="flex items-start gap-3">
                                <div className={`hidden shrink-0 rounded-lg p-2 sm:block ${item.isRead ? "bg-slate-100" : "bg-teal-100"}`}>
                                    <img src={assets.notification} className="h-7 w-7" alt="" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-slate-900">{item.title}</h3>
                                    <p className="mt-0.5 text-sm text-slate-600">{item.message}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 border-t border-slate-100 pt-3 sm:border-0 sm:pt-0">
                                <span className={item.isRead ? "badge-neutral" : "badge-info"}>
                                    {item.isRead ? "Read" : "New"}
                                </span>
                                {!item.isRead && (
                                    <button onClick={() => markAsRead(item._id)} className="btn-ghost text-xs">
                                        Mark read
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Notifications;
