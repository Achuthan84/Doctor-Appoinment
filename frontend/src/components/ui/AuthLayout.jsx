import { ToastContainer } from "react-toastify";
import { assets } from "../../assets/assets";

const AuthLayout = ({ children, title, subtitle, icon, accent = "teal" }) => {
    const accentClasses = {
        teal: "bg-teal-100 text-teal-600",
        cyan: "bg-cyan-100 text-cyan-600",
        emerald: "bg-emerald-100 text-emerald-600",
    };

    return (
        <div className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-8 sm:px-6">
            <div
                style={{ backgroundImage: `url(${assets.bgImg})` }}
                className="absolute inset-0 z-0 scale-105 bg-cover bg-center blur-sm"
            />
            <div className="absolute inset-0 z-0 bg-gradient-to-br from-teal-950/70 via-slate-900/60 to-cyan-950/50" />

            <ToastContainer
                position="top-right"
                autoClose={3000}
                hideProgressBar={false}
                closeOnClick
                pauseOnHover
            />

            <div className="relative z-10 w-full max-w-md">
                <div className="card overflow-hidden shadow-2xl shadow-teal-900/20">
                    <div className="border-b border-slate-100 bg-gradient-to-r from-teal-50 to-cyan-50 px-6 py-8 text-center sm:px-8">
                        {icon && (
                            <div className={`mx-auto mb-4 inline-flex rounded-2xl p-3 ${accentClasses[accent]}`}>
                                {icon}
                            </div>
                        )}
                        <h1 className="text-2xl font-bold text-slate-900">{title}</h1>
                        {subtitle && (
                            <p className="mt-1 text-sm text-slate-500">{subtitle}</p>
                        )}
                    </div>
                    <div className="card-body sm:p-8">{children}</div>
                </div>
            </div>
        </div>
    );
};

export default AuthLayout;
