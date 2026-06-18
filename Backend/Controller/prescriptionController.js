import Prescription from "../Model/Prescription.js";
import Doctor from "../Model/Doctor.js";
import Appointment from "../Model/Appointment.js";

export const addPrescription = async (req, res) => {

    try {
        const { appointmentId, medicines, notes } = req.body;
        const doctor = await Doctor.findOne({ userId: req.user._id });
        const appointment = await Appointment.findById(appointmentId)

        if (!appointment) {
            return res.status(404).json({
                success: false,
                message: "Appointment not found"
            })
        }
        const prescription = await Prescription.create({
            appointmentId,
            doctorId: doctor._id,
            userId: appointment.userId,
            medicines,
            notes
        });

        res.status(201).json({
            success: true,
            message: "Prescription Added",
            prescription
        })
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

export const getUserPrescriptions = async (req, res) => {

    try {
        const prescriptions = await Prescription.find({ userId: req.user._id }).populate({
            path: "doctorId",
            populate: {
                path: "userId",
                select: "name email"
            }
        }).sort({ createdAt: -1 });
        res.status(200).json({
            success: true,
            prescriptions
        })
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

export const getPrescriptionByAppointment = async (req, res) => {
    try {
        const prescription = await Prescription.findOne({ appointmentId: req.params.id })
            .populate({
                path: "doctorId",
                populate: {
                    path: "userId",
                    select: "name email"
                }
            });
        if (!prescription) {
            return res.status(404).json({
                success: false,
                message: "Prescription Not Found"
            })
        }
        res.status(200).json({
            success: true,
            prescription
        })
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}