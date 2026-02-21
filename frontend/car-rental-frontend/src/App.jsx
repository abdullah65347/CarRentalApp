import React, { useContext } from "react";
import { Routes, Route } from "react-router-dom";

import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";

import HomePage from "./pages/HomePage";

// import LoginPage from "./pages/Auth/LoginPage";
// import RegisterPage from "./pages/Auth/RegisterPage";

import MyBookings from "./pages/Booking/MyBookings";
import Profile from "./pages/Profile";
import OwnerDashboard from "./pages/Owner/OwnerDashboard";

import PrivateRoute from "./routes/PrivateRoute";
import BookingCheckout from "./pages/Booking/BookingCheckout";
import CarCheckoutPage from "./pages/Booking/CarCheckoutPage";
import AdminDashboard from "./pages/Admin/AdminDashboard";
import CarListingsPage from "./pages/CarListingsPage";
import AuthModal from "./components/auth/AuthModal";
import { AuthModalContext } from "./context/AuthModalContext";

export default function App() {
    const { open, mode, close } = useContext(AuthModalContext);
    return (
        <div className="min-h-screen flex flex-col w-full">
            <Header />
            <main className="flex-1 w-full">

                <Routes>
                    {/* Public */}
                    <Route path="/" element={<HomePage />} />
                    <Route path="/cars" element={<CarListingsPage />} />

                    {/* Protected */}
                    <Route
                        path="/cars/:id/checkout"
                        element={
                            <PrivateRoute>
                                <CarCheckoutPage />
                            </PrivateRoute>
                        }
                    />
                    <Route
                        path="/me/bookings"
                        element={
                            <PrivateRoute>
                                <MyBookings />
                            </PrivateRoute>
                        }
                    />

                    <Route
                        path="/profile"
                        element={
                            <PrivateRoute>
                                <Profile />
                            </PrivateRoute>
                        }
                    />

                    <Route
                        path="/owner/dashboard"
                        element={
                            <PrivateRoute>
                                <OwnerDashboard />
                            </PrivateRoute>
                        }
                    />
                    <Route
                        path="/admin/dashboard"
                        element={
                            <PrivateRoute>
                                <AdminDashboard />
                            </PrivateRoute>
                        }
                    />
                </Routes>
            </main>
            <Footer />
            <AuthModal />
        </div>
    );
}
