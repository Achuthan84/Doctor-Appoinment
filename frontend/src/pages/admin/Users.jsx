import React, { useEffect, useState } from "react";
import axios from "axios";
import PageHeader from "../../components/ui/PageHeader";
import EmptyState from "../../components/ui/EmptyState";

const Users = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem("token");
        axios.get("http://localhost:5000/api/admin/users", {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then((res) => setUsers(res.data.users))
       
            .catch(console.log)
            .finally(() => setLoading(false));
             console.log(users)
    }, []);

    const roleBadge = (role) => {
        if (role === "admin") return "badge-warning";
        if (role === "doctor") return "badge-info";
        return "badge-neutral";
    };

    return (
        <div className="page-container page-container-xl">
            <PageHeader title="Users" subtitle="All registered accounts on the platform." />

            {loading ? (
                <div className="space-y-3">
                    <div className="skeleton h-12" />
                    <div className="skeleton h-16" />
                    <div className="skeleton h-16" />
                </div>
            ) : users.length === 0 ? (
                <EmptyState title="No users found" description="Registered users will appear here." />
            ) : (
                <div className="table-wrapper">
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Role</th>
                                {/* <th>Joined</th> */}
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((user) => (
                                <tr key={user._id}>
                                    <td>
                                        <div className="flex items-center gap-3">
                                            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-teal-100 text-xs font-bold text-teal-700">
                                                {(user.name || "U").slice(0, 2).toUpperCase()}
                                            </div>
                                            <span className="font-semibold text-slate-900">{user.name}</span>
                                        </div>
                                    </td>
                                    <td className="text-slate-600">{user.email}</td>
                                    <td><span className={roleBadge(user.role)}>{user.role}</span></td>
                                    {/* <td className="text-slate-500">
                                        {user.createdAt ? new Date(user.createdAt).toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" }) : "N/A"}
                                    </td> */}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default Users;
