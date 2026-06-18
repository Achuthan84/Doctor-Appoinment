import Appointment from "../Model/Appointment.js";
import Doctor from "../Model/Doctor.js";
import Setting from "../Model/Setting.js";
import Notification from "../Model/Notification.js";


export const bookAppointment = async (req, res) => {

    try {
        const userId = req.user._id;
        const { doctorId, slotDate, slotTime } = req.body;
        const doctor = await Doctor.findById(doctorId);

        if (!doctor) {
            return res.status(404).json({
                success: false,
                message: "Doctor not found"
            });
        }

        if (!doctor.approved) {
            return res.status(400).json({
                success: false,
                message: "Doctor not approved"
            });
        }
        const existingAppointment =
            await Appointment.findOne({
                doctorId,
                slotDate,
                slotTime,
                status: "booked"
            });
        if (existingAppointment) {
            return res.status(400).json({
                success: false,
                message: "Slot already booked"
            });

        }
        const userAppointment = await Appointment.findOne({
            userId,
            slotDate,
            slotTime,
            status: "booked"
        });

        if (userAppointment) {
            return res.status(400).json({
                success: false,
                message: "You already have an appointment at this time"
            });
        }

        const setting = await Setting.findOne();
        const commissionPercentage = setting?.commissionPercentage || 10;
        const commission = (doctor.fee * commissionPercentage) / 100;
        const totalFee = doctor.fee + commission;

        const appointment = await Appointment.create({
            userId,
            doctorId,
            slotDate,
            slotTime,
            doctorFee: doctor.fee,
            commission,
            totalFee,
            status: "booked"
        });

        await Notification.create({
            userId,
            title: "Appointment Booked",
            message: `Your appointment booked successfully on ${slotDate} at ${slotTime}`

        });
        res.status(201).json({
            success: true,
            message: "Appointment Booked Successfully",
            appointment
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


export const getUserAppointments = async (req, res) => {
    try {
        const appointments = await Appointment.find({ userId: req.user._id })
            .populate({
                path: "doctorId",
                populate: {
                    path: "userId",
                    select: "name email"
                }
            });

        res.status(200).json({
            success: true,
            appointments
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

export const getDoctorAppointments = async (req, res) => {

    try {

        const doctor = await Doctor.findOne({ userId: req.user._id });
        const appointments = await Appointment.find({ doctorId: doctor._id }).populate("userId", "name email");

        res.status(200).json({
            success: true,
            appointments
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


export const cancelAppointment = async (req, res) => {

    try {

        const appointment = await Appointment.findById(req.params.id);

        if (!appointment) {
            return res.status(404).json({
                success: false,
                message: "Appointment not found"
            });
        }
        appointment.status = "cancelled";
        await appointment.save();

        res.status(200).json({
            success: true,
            message: "Appointment Cancelled"
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

export const rescheduleAppointment = async (req, res) => {
    try {

        const { slotDate, slotTime } = req.body;

        const appointment = await Appointment.findById(req.params.id);

        if (!appointment) {
            return res.status(404).json({
                success: false,
                message: "Appointment not found"
            });
        }

        // Old appointment datetime
        const appointmentDateTime = new Date(
            `${appointment.slotDate} ${appointment.slotTime}`
        );

        const now = new Date();

        const diffInHours =
            (appointmentDateTime - now) / (1000 * 60 * 60);

        if (diffInHours > 24) {
            return res.status(400).json({
                success: false,
                message: "You can reschedule only before 24 hours."
            });
        }

        // Check slot already booked
        const existingAppointment = await Appointment.findOne({
            doctorId: appointment.doctorId,
            slotDate,
            slotTime,
            status: "booked"
        });

        if (existingAppointment) {
            return res.status(400).json({
                success: false,
                message: "Slot already booked"
            });
        }

        appointment.slotDate = slotDate;
        appointment.slotTime = slotTime;
        appointment.status = "rescheduled";

        await appointment.save();

        res.status(200).json({
            success: true,
            message: "Appointment Rescheduled Successfully",
            appointment
        });

    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
}

export const completeAppointment = async (req, res) => {

    try {

        const appointment = await Appointment.findById(req.params.id);

        if (!appointment) {
            return res.status(404).json({
                success: false,
                message: "Appointment not found"
            });
        }
        appointment.status = "completed";
        await appointment.save();

        await Notification.create({
            userId: appointment.userId,
            title: "Appointment Completed",
            message: "Your appointment has been completed."

        });

        res.status(200).json({
            success: true,
            message: "Appointment Completed"
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};