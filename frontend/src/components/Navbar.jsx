import React, { useContext, useState } from "react";
import { NavLink, Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const navLinks = {
    guest: [
        { to: "/", label: "Login" },
        { to: "/register", label: "Register" },
    ],
    user: [
        { to: "/doctors", label: "Doctors" },
        { to: "/appointments", label: "Appointments" },
        { to: "/prescriptions", label: "Prescriptions" },
        { to: "/notifications", label: "Notifications" },
    ],
    doctor: [
        { to: "/doctor/dashboard", label: "Dashboard" },
        { to: "/doctor/slots", label: "Add Slots" },
        { to: "/doctor/appointments", label: "Appointments" },
        { to: "/doctor/profile", label: "Profile" },
    ],
    admin: [
        { to: "/admin/dashboard", label: "Dashboard" },
        { to: "/admin/users", label: "Users" },
        { to: "/admin/pending-doctors", label: "Pending" },
        { to: "/admin/appointments", label: "Appointments" },
        { to: "/admin/settings", label: "Settings" },
    ],
};

const Navbar = () => {
    const navigate = useNavigate();
    const { user, logout } = useContext(AuthContext);
    const [menuOpen, setMenuOpen] = useState(false);

    const role = user?.role;
    const links = !user ? navLinks.guest : navLinks[role] || [];

    const handleLogout = () => {
        logout();
        navigate("/");
        setMenuOpen(false);
    };

    const linkClass = ({ isActive }) => (isActive ? "nav-link-active" : "nav-link");

    const closeMenu = () => setMenuOpen(false);

    return (
        <nav className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/90 backdrop-blur-xl">
            <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3 sm:px-6 lg:px-8">
                <Link to={user ? (role === "doctor" ? "/doctor/dashboard" : role === "admin" ? "/admin/dashboard" : "/doctors") : "/"} className="flex min-w-0 items-center gap-2.5 sm:gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-teal-600 to-cyan-500 text-white shadow-md shadow-teal-500/25 sm:h-11 sm:w-11 sm:rounded-2xl">
                        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                    </div>
                    <div className="min-w-0 leading-tight">
                        <span className="block truncate text-base font-bold text-slate-900 sm:text-lg">DoctorApp</span>
                        <span className="hidden text-xs text-slate-500 sm:block">Healthcare made simple</span>
                    </div>
                </Link>

                <div className="hidden items-center gap-1 lg:flex">
                    {links.map(({ to, label }) => (
                        <NavLink key={to} to={to} className={linkClass}>
                            {label}
                        </NavLink>
                    ))}
                </div>

                <div className="flex items-center gap-2 sm:gap-3">
                    {user && (
                        <span className="hidden max-w-[140px] truncate rounded-full bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-700 md:inline-block lg:max-w-[180px] lg:text-sm">
                            {user.name || user.email}
                        </span>
                    )}
                    {user && (
                        <button type="button" onClick={handleLogout} className="btn-danger hidden px-3 py-2 text-xs sm:inline-flex sm:px-4 sm:text-sm">
                            Logout
                        </button>
                    )}
                    <button
                        type="button"
                        className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 transition hover:bg-slate-50 lg:hidden"
                        onClick={() => setMenuOpen(!menuOpen)}
                        aria-label={menuOpen ? "Close menu" : "Open menu"}
                        aria-expanded={menuOpen}
                    >
                        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={menuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
                        </svg>
                    </button>
                </div>
            </div>

            {menuOpen && (
                <div className="border-t border-slate-100 bg-white px-4 py-4 lg:hidden">
                    <div className="space-y-1">
                        {links.map(({ to, label }) => (
                            <Link key={to} to={to} className="block rounded-xl px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50" onClick={closeMenu}>
                                {label}
                            </Link>
                        ))}
                        {user && (
                            <>
                                <div className="my-2 border-t border-slate-100 pt-2">
                                    <p className="truncate px-4 py-2 text-xs text-slate-500">{user.name || user.email}</p>
                                </div>
                                <button type="button" onClick={handleLogout} className="btn-danger mt-1 w-full">
                                    Logout
                                </button>
                            </>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
