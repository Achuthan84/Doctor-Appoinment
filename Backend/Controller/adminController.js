import User from "../Model/User.js";
import Doctor from "../Model/Doctor.js";
import Appointment from "../Model/Appointment.js";
import Setting from "../Model/Setting.js";

export const approveDoctor = async (req, res) => {
    try {
        const doctor = await Doctor.findById(req.params.id)
        if (!doctor) {
            return res.status(404).json({
                success: false,
                message: "Doctor not Found"
            })
        }

        doctor.approved = true;;
        await doctor.save();

        res.status(200).json({
            success: true,
            message: "Doctor Approved SuccessFully"
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

export const getPendingDoctors = async (req, res) => {
    try {
        const doctor = (await Doctor.find({ approved: false }).populate("userId", "name email"))
        res.status(200).json({
            success: true,
            doctor
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

export const getAllUsers = async (req, res) => {

    try {
        const users = await User.find().select("-password");
        res.status(200).json({
            success: true,
            users
        })
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

export const getAllAppointments = async (req, res) => {
    try {
        const appointments = await Appointment.find().populate("userId", "name email").populate({ path: "doctorId", populate: { path: "userId", select: "name email" } });

        res.status(200).json({
            success: true,
            appointments
        })
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

export const updateSettings = async (req, res) => {

    try {
        const updateData = {
            appName: req.body.appName,
            commissionPercentage: req.body.commissionPercentage
        };

        if (req.file) {
            updateData.logo = req.file.filename;
        }
        const settings = await Setting.findOneAndUpdate(
            {},
            updateData,
            {
                new: true,
                upsert: true
            }
        );
        res.status(200).json({
            success: true,
            message: "Settings updated successfully",
            settings
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

export const getUpdatedSettings = async (req, res) => {
    try {
        const settings = await Setting.findOne()
        res.status(200).json({
            success: true,
            settings
        })
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

export const getDashboard = async (req, res) => {
    try {
        const totalUsers = await User.countDocuments({ role: "user" });
        const totalDoctors = await Doctor.countDocuments();
        const totalAppointments = await Appointment.countDocuments();

        res.status(200).json({
            success: true,
            totalUsers,
            totalDoctors,
            totalAppointments
        })
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}