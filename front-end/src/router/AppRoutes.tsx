import { Suspense, ReactNode } from "react";
import { Loading } from "../components/global/Loading/Loading";
import { BrowserRouter, Route, Routes, Navigate } from "react-router";
import { ROUTING } from "../constants/routing";
import PatientProfilePage from "../pages/patient/PatientProfilePage";
import DoctorProfilePage from "../pages/doctor/DoctorProfilePage";
import DoctorAppointmentDetailsPage from "../pages/doctor/DoctorAppointmentDetailsPage";
import PatientAppointmentDetailsPage from "../pages/patient/PatientAppointmentDetailsPage";
import ForgetPasswordPage from "../pages/ForgetPasswordPage";
import BankAccountPage from "../pages/patient/BankAccountPage";

// Import layout components
import AdminLayout from "../layouts/AdminLayout";
import DoctorLayout from "../layouts/DoctorLayout";
import PatientLayout from "../layouts/PatientLayout";
import HomePage from "../pages/HomePage";
import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";
import DoctorDashboard from "../pages/doctor/DoctorDashboard";
import AppointmentPage from "../pages/patient/AppointmentPage";
import DoctorSchedulePage from "../pages/doctor/DoctorSchedulePage";
import DoctorCurrentSchedulePage from "../pages/doctor/DoctorCurrentSchedulePage";
import PatientManagementPage from "../pages/admin/PatientManagementPage";
import PatientMedicalRecord from "../pages/patient/PatientMedicalRecord";
import DrugManagementPage from "../pages/admin/DrugManagementPage";
import DoctorManagementPage from "../pages/admin/DoctorManagementPage";
import ShiftManagementPage from "../pages/admin/ShiftManagementPage";
import AdminDashboardPage from "../pages/admin/AdminDashboardPage";
import DiseasManagementPage from "../pages/admin/DiseasManagementPage";
import CancelAppointmentPage from "../pages/admin/CancelAppointmentPage";
import DoctorRevenueDetailsPage from "../pages/admin/DoctorRevenueDetailsPage";
import PriceManagementPage from "../pages/admin/PriceManagementPage";

// Protected route component to check user role
const ProtectedRoute = ({
  children,
  allowedRoles,
}: {
  children: ReactNode;
  allowedRoles: string[];
}) => {
  const role = localStorage.getItem("type");
  const isAuthenticated = localStorage.getItem("token");

  if (!isAuthenticated) {
    return <Navigate to={ROUTING.HOME} replace />;
  }

  if (!allowedRoles.includes(role || "")) {
    return <Navigate to={ROUTING.HOME} replace />;
  }

  return <>{children}</>;
};

export const AppRoutes = () => {
  // const role = localStorage.getItem("role");

  return (
    <Suspense fallback={<Loading />}>
      <BrowserRouter>
        <Routes>
          {/* Public routes accessible to everyone */}
          <Route path={ROUTING.HOME} element={<HomePage />} />
          <Route path={ROUTING.REGISTER} element={<RegisterPage />} />
          <Route path={ROUTING.LOGIN} element={<LoginPage />} />
          <Route
            path={ROUTING.FORGET_PASSWORD}
            element={<ForgetPasswordPage />}
          />

          {/* Admin routes - with role protection */}
          <Route
            path={ROUTING.ADMIN}
            element={
              <ProtectedRoute allowedRoles={["ADMIN"]}>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route path={ROUTING.DASHBOARD} element={<AdminDashboardPage />} />
            <Route index element={<AdminDashboardPage />} />
            <Route path={ROUTING.USERS} element={<PatientManagementPage />} />
            <Route path={ROUTING.DOCTORS} element={<DoctorManagementPage />} />
            <Route path={ROUTING.DRUG} element={<DrugManagementPage />} />
            <Route path={ROUTING.PRICES} element={<PriceManagementPage />} />
            <Route path={ROUTING.SHIFTS} element={<ShiftManagementPage />} />
            <Route path={ROUTING.DISEASES} element={<DiseasManagementPage />} />
            <Route
              path={ROUTING.CANCEL_APPOINTMENT}
              element={<CancelAppointmentPage />}
            />
            <Route
              path={ROUTING.DOCTOR_REVENUE}
              element={<DoctorRevenueDetailsPage />}
            />
          </Route>

          {/* Doctor routes - with role protection */}
          <Route
            path={ROUTING.FUNCIONARIO}
            element={
              <ProtectedRoute allowedRoles={["FUNCIONARIO"]}>
                <DoctorLayout />
              </ProtectedRoute>
            }
          >
            <Route path={ROUTING.DASHBOARD} element={<DoctorDashboard />} />
            <Route index element={<DoctorDashboard />} />
            <Route path={ROUTING.PROFILE} element={<DoctorProfilePage />} />
            <Route
              path={ROUTING.SCHEDULE_DETAIL}
              element={<DoctorAppointmentDetailsPage />}
            />
            <Route path={ROUTING.SCHEDULE} element={<DoctorSchedulePage />} />
            <Route
              path={ROUTING.CURRENT_SCHEDULE}
              element={<DoctorCurrentSchedulePage />}
            />
            <Route path={ROUTING.PATIENTS} element={<div>Patients</div>} />
            <Route
              path={ROUTING.PRESCRIPTIONS}
              element={<div>Prescriptions</div>}
            />
          </Route>

          {/* Patient routes - with role protection */}
          <Route
            path={ROUTING.PACIENTE}
            element={
              <ProtectedRoute allowedRoles={["PACIENTE"]}>
                <PatientLayout />
              </ProtectedRoute>
            }
          >
            <Route path={ROUTING.PROFILE} element={<PatientProfilePage />} />
            <Route path={ROUTING.APPOINTMENTS} element={<AppointmentPage />} />
            <Route
              path={ROUTING.PATIENT_APPOINTMENT_DETAILS}
              element={<PatientAppointmentDetailsPage />}
            />
            <Route
              path={ROUTING.FIND_DOCTOR}
              element={<div>Find Doctor</div>}
            />
            <Route
              path={ROUTING.MEDICAL_RECORDS}
              element={<PatientMedicalRecord />}
            />
            <Route path={ROUTING.BANK_ACCOUNT} element={<BankAccountPage />} />
          </Route>

          {/* Redirect unauthorized access to home */}
          <Route path="*" element={<Navigate to={ROUTING.HOME} replace />} />
        </Routes>
      </BrowserRouter>
    </Suspense>
  );
};
