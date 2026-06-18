import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

const UpdateProfile = ({ doctorId }) => {
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);

    // Controlled text fields
    const [profile, setProfile] = useState({
        specialization: "",
        experience: "",
        qualification: "",
        fee: ""
    });

    const [resolvedDoctorId, setResolvedDoctorId] = useState(doctorId || "");

    // File uploads state handling
    const [selectedFile, setSelectedFile] = useState(null);
    const [filePreview, setFilePreview] = useState("");

    useEffect(() => {
        const fetchProfileData = async () => {
            try {
                const token = localStorage.getItem("token");
                let response;
                if (doctorId) {
                    response = await axios.get(`http://localhost:5000/api/doctors/${doctorId}`, {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                } else {
                    // Fetch the current logged-in doctor's record
                    response = await axios.get(`http://localhost:5000/api/doctors/me`, {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                    // store the resolved doctor id for update operations
                    if (response.data?.doctor?._id) setResolvedDoctorId(response.data.doctor._id);
                }

                if (response.data?.doctor) {
                    const { specialization, experience, qualification, fee, certificate } = response.data.doctor;
                    setProfile({ specialization, experience, qualification, fee });

                    // If a certificate already exists on the backend, point our preview to it
                    if (certificate) {
                        setFilePreview(`http://localhost:5000/uploads/${certificate}`);
                    }
                }
            } catch (error) {
                console.error(error);
                toast.error("Failed to retrieve profile data.");
            } finally {
                setLoading(false);
            }
        };

        fetchProfileData();
    }, [doctorId]);

    const handleInputChange = (e) => {
        setProfile({ ...profile, [e.target.name]: e.target.value });
    };

    // Handles picking a file local inside the browser window context
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedFile(file);
            setFilePreview(URL.createObjectURL(file)); // Generate temporary blob string for visual preview
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setUpdating(true);

        try {
            const token = localStorage.getItem("token");

            // Use FormData instead of regular JSON when files are attached
            const formData = new FormData();
            formData.append("specialization", profile.specialization);
            formData.append("experience", Number(profile.experience));
            formData.append("qualification", profile.qualification);
            formData.append("fee", Number(profile.fee));

            if (selectedFile) {
                formData.append("certificate", selectedFile);
            }

            const idToUse = doctorId || resolvedDoctorId;
            const response = await axios.put(
                `http://localhost:5000/api/doctors/${idToUse}`,
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            toast.success(response.data?.message || "Profile updated cleanly!");
        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.message || "Something went wrong updating your profile.");
        } finally {
            setUpdating(false);
        }
    };

    if (loading) {
        return (
            <div className="page-container flex min-h-[40vh] items-center justify-center">
                <div className="h-10 w-10 animate-spin rounded-full border-2 border-teal-600 border-t-transparent" />
            </div>
        );
    }

    return (
        <div className="page-container page-container-lg">
            <ToastContainer position="top-right" autoClose={3000} />

            <div className="card overflow-hidden">
                <div className="border-b border-slate-100 bg-gradient-to-r from-teal-700 to-cyan-600 px-6 py-6 text-white sm:px-8">
                    <h1 className="text-xl font-bold sm:text-2xl">Edit profile</h1>
                    <p className="mt-1 text-sm text-teal-100">Update specialization, credentials, and consultation fees.</p>
                </div>

                <form onSubmit={handleSubmit} className="card-body space-y-8 sm:p-8">

                    {/* SECTION 1: CERTIFICATE / PROFILE IMAGE FILE PICKER */}
                    <div>
                        <h2 className="mb-4 border-b border-slate-100 pb-1 text-xs font-bold uppercase tracking-wider text-teal-600">
                            1. Verification Document / Practice Certificate
                        </h2>
                        <div className="flex flex-col sm:flex-row items-center gap-6 bg-slate-50 p-4 rounded-2xl border border-slate-200/60">
                            <div className="w-32 h-32 bg-slate-200 rounded-xl overflow-hidden border border-slate-300 flex items-center justify-center shrink-0">
                                {filePreview ? (
                                    <img src={filePreview} alt="Certificate Preview" className="w-full h-full object-cover" />
                                ) : (
                                    <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                )}
                            </div>
                            <div className="space-y-2 text-center sm:text-left grow">
                                <h3 className="text-sm font-semibold text-gray-800">Upload New Document Copy</h3>
                                <p className="text-xs text-gray-400">Accepts JPG, PNG, or webp formats. Max size limit 5MB.</p>
                                <label className="inline-block cursor-pointer bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 text-xs font-bold px-4 py-2 rounded-lg shadow-sm transition">
                                    Choose Document File
                                    <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
                                </label>
                            </div>
                        </div>
                    </div>

                    {/* SECTION 2: CORE BIOGRAPHICAL METRICS */}
                    <div>
                        <h2 className="mb-4 border-b border-slate-100 pb-1 text-xs font-bold uppercase tracking-wider text-teal-600">
                            2. Clinical Specifications
                        </h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                            <div className="space-y-1">
                                <label className="text-xs font-semibold text-slate-500">Medical Specialty</label>
                                <input
                                    type="text" required name="specialization" value={profile.specialization} onChange={handleInputChange}
                                    placeholder="e.g. Cardiology"
                                    className="input-field"
                                />
                            </div>

                            <div className="space-y-1">
                                <label className="text-xs font-semibold text-slate-500">Years of Experience</label>
                                <input
                                    type="number" required min="0" name="experience" value={profile.experience} onChange={handleInputChange}
                                    className="input-field"
                                />
                            </div>

                            <div className="space-y-1">
                                <label className="text-xs font-semibold text-slate-500">Board Qualifications</label>
                                <input
                                    type="text" required name="qualification" value={profile.qualification} onChange={handleInputChange}
                                    className="input-field"
                                />
                            </div>

                            <div className="space-y-1">
                                <label className="text-xs font-semibold text-slate-500">Consultation Fee (INR)</label>
                                <div className="relative rounded-xl shadow-sm">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-sm text-slate-400 font-medium">₹</div>
                                    <input
                                        type="number" required min="0" name="fee" value={profile.fee} onChange={handleInputChange}
                                        className="input-field pl-8"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="pt-5 border-t border-slate-100 flex justify-end">
                        <button type="submit" disabled={updating} className="btn-primary w-full sm:w-auto sm:min-w-40">
                            {updating ? "Saving Changes..." : "Save Profile Changes"}
                        </button>
                    </div>

                </form>
            </div>
        </div>
    );
};

export default UpdateProfile;