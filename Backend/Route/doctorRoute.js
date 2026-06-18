import express from "express"
import { addSlot, getAllDoctors, getDoctorById, getDoctorByUser, registerDoctor, updateDoctorProfile } from "../Controller/doctorController.js";
import AuthMiddleware from "../middleware/authMiddleware.js";
import roleMiddleware from "../middleware/roleMiddleware.js";
import upload from "../middleware/uploadMiddleware.js";

const router = express.Router();

router.post('/register', upload.single("certificate"), registerDoctor)
router.get('/', getAllDoctors)
router.get('/me', AuthMiddleware, getDoctorByUser)
router.get('/:id', getDoctorById)
router.put('/add-slots', AuthMiddleware, roleMiddleware("doctor"), addSlot)
router.put('/:id', AuthMiddleware, roleMiddleware("doctor"), updateDoctorProfile)

export default router;