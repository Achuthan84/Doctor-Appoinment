import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom"
import { Login } from "./pages/auth/Login"
import Register from "./pages/auth/Register"
import Navbar from "./components/Navbar"
import Doctors from "./pages/user/Doctors"
import BookAppointment from "./pages/user/BookAppointment"
import MyAppointments from "./pages/user/MyAppointments"
import DoctorDashboard from "./pages/doctor/DoctorDashboard"
import AddSlots from "./pages/doctor/AddSlots"
import DoctorAppointments from "./pages/doctor/DoctorAppointments"
import AddPrescription from "./pages/doctor/AddPrescription"
import MyPrescriptions from "./pages/user/MyPrescriptions"
import Notifications from "./pages/user/Notifications"
import AdminDashboard from "./pages/admin/AdminDashboard"
import PendingDoctors from "./pages/admin/PendingDoctors"
import Users from "./pages/admin/Users"
import Appointments from "./pages/admin/Appointments"
import Settings from "./pages/admin/Settings"
import DoctorRegister from "./pages/auth/DoctorRegister"
import UpdateProfile from "./pages/doctor/UpdateProfile"


const MainLayout = () => (
  <div className="flex min-h-screen flex-col">
    <Navbar />
    <main className="flex-1 py-6 sm:py-8">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <Outlet />
      </div>
    </main>
  </div>
);

const App = () => {
  return (
    <BrowserRouter>
      <Routes>

        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/doctor-register" element={<DoctorRegister />} />

        <Route element={<MainLayout />}>
          <Route path="/doctors" element={<Doctors />} />
          <Route path="/book/:id" element={<BookAppointment />} />
          <Route path="/appointments" element={<MyAppointments />} />
          <Route path="/doctor/profile" element={<UpdateProfile />} />
          <Route path="/doctor/dashboard" element={<DoctorDashboard />} />
          <Route path="/doctor/slots" element={<AddSlots />} />
          <Route path="/doctor/appointments" element={<DoctorAppointments />} />
          <Route path="/doctor/prescription/:id" element={<AddPrescription />} />
          <Route path="/prescriptions" element={<MyPrescriptions />} />
          <Route path="/notifications" element={<Notifications />} />

          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/pending-doctors" element={<PendingDoctors />} />
          <Route path="/admin/users" element={<Users />} />
          <Route path="/admin/appointments" element={<Appointments />} />
          <Route path="/admin/settings" element={<Settings />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};
export default App
