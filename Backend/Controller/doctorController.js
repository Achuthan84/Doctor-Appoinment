import Doctor from "../Model/Doctor.js"
import User from "../Model/User.js"
import bcrypt from "bcryptjs";

export const registerDoctor = async (req, res) => {
    try {
        const { name, email, password, specialization, experience, qualification, fee } = req.body;

        const existingUser = await User.findOne({ email })
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: "Doctor already exists"
            })
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            role: "doctor"
        })
        const doctor = await Doctor.create({
            userId: user._id,
            specialization,
            experience,
            qualification,
            fee,
            certificate: req.file.filename,
            approved: false
        });
        res.status(201).json({
            success: true,
            message: "Doctor Registered Successfully. Waiting For Admin Approval.",
            doctor
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });

    }
}


export const getAllDoctors = async (req, res) => {

    try {
        const doctors = await Doctor.find({ approved: true }).populate("userId", "name email")
        res.status(200).json({
            success: true,
            doctors
        })

    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

export const getDoctorById = async (req, res) => {

    try {
        const doctor = await Doctor.findById(req.params.id).populate("userId", "name email")
        if (!doctor) {
            return res.status(404).json({
                success: false,
                message: "Doctor not found"
            })
        }
        res.status(200).json({
            success: true,
            doctor
        })
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}
export const addSlot = async (req, res) => {

    try {
        const { date, startTime, endTime } = req.body;
        const doctor = await Doctor.findOne({ userId: req.user._id });
        doctor.availableSlots.push({
            date,
            startTime,
            endTime
        });
        await doctor.save();
        res.status(200).json({
            success: true,
            message: "Slot Added",
            doctor
        })
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

export const updateDoctorProfile = async (req, res) => {
    try {
        const doctor = await Doctor.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.status(200).json({
            success: true,
            message: "Profile Updated",
            doctor
        })
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}
export const getDoctorByUser = async (req, res) => {
    try {
        const doctor = await Doctor.findOne({ userId: req.user._id }).populate("userId", "name email");
        if (!doctor) {
            return res.status(404).json({
                success: false,
                message: "Doctor not found for this user"
            })
        }
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