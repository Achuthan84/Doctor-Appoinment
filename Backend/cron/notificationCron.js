import cron from "node-cron";
import Appointment from "../Model/Appointment.js";
import Notification from "../Model/Notification.js";


cron.schedule("* * * * *", async () => {

    const now = new Date();

    const appointments = await Appointment.find({
        status: "booked"
    });

    for (const appointment of appointments) {

        const appointmentTime = new Date(
            `${appointment.slotDate} ${appointment.slotTime}`
        );

        const diffMinutes =
            (appointmentTime - now) / (1000 * 60);

        // 1 Day Reminder
        if (diffMinutes <= 1440 && diffMinutes > 1439) {

            await Notification.create({
                userId: appointment.userId,
                title: "Appointment Reminder",
                message: "Your appointment is tomorrow."
            });

        }

        // 1 Hour Reminder
        if (diffMinutes <= 60 && diffMinutes > 59) {

            await Notification.create({
                userId: appointment.userId,
                title: "Appointment Reminder",
                message: "Your appointment starts in 1 hour."
            });

        }

        // 15 Minutes Reminder
        if (diffMinutes <= 15 && diffMinutes > 14) {

            await Notification.create({
                userId: appointment.userId,
                title: "Appointment Reminder",
                message: "Your appointment starts in 15 minutes."
            });

        }

        // Completion Notification
        if (diffMinutes < 0 && appointment.status === "booked") {

            appointment.status = "completed";
            await appointment.save();

            await Notification.create({
                userId: appointment.userId,
                title: "Appointment Completed",
                message: "Your appointment has been completed."
            });

        }

    }

});