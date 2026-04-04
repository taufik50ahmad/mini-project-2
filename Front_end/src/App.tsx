import EventDetail from "./pages/eventDetailPage.tsx";
import "./App.css"; // keep or remove default styles
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/loginPage";
import RegisterPage from "./pages/registerPage";
import ForgotPasswordPage from "./pages/forgotPassPage";
import ResetPasswordPage from "./pages/resetPassPage";
import HomePage from "./pages/homePage";
import ProfilePage from "./pages/profilePage";
import Layout from "./pages/layout";
import TransactionPage from "./pages/transactionPage";
import MyTransactions from "./pages/transactionHistory";
import OrganizerApprove from "./pages/organizerApprove.tsx";
import UploadPayment from "./pages/paymentProof.tsx";
import OrganizerEventsPage from "./pages/organizerEventPage.tsx";
import CreateEventPage from "./pages/createEventPage.tsx";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* AUTH */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />

        {/* EVENTS */}
        <Route element={<Layout />}>
          {/* 💳 TRANSACTION */}
          <Route path="/transaction/:eventId" element={<TransactionPage />} />
          <Route path="/my-transactions" element={<MyTransactions />} />
          <Route
            path="/upload-payment/:transactionId"
            element={<UploadPayment />}
          />

          {/* 🧑‍💼 ORGANIZER */}
          <Route
            path="/organizer/transactions"
            element={<OrganizerApprove />}
          />
          <Route path="/organizer/create" element={<CreateEventPage />} />
          <Route path="/organizer/events" element={<OrganizerEventsPage />} />

          <Route path="/homepage" element={<HomePage />} />
          <Route path="/events/:id" element={<EventDetail />} />
          <Route path="/profile" element={<ProfilePage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
