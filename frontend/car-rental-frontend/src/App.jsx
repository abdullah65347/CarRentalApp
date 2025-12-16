import React from "react";
import { Routes, Route } from "react-router-dom";

import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";

import HomePage from "./pages/HomePage";
import ListingsPage from "./pages/ListingsPage";
import CarDetailPage from "./pages/CarDetailPage";

import LoginPage from "./pages/Auth/LoginPage";
import RegisterPage from "./pages/Auth/RegisterPage";

import MyBookings from "./pages/Booking/MyBookings";
import Profile from "./pages/Profile";
import OwnerDashboard from "./pages/Owner/OwnerDashboard";

import PrivateRoute from "./routes/PrivateRoute";
import BookingCheckout from "./pages/Booking/BookingCheckout";
import CarCheckoutPage from "./pages/Booking/CarCheckoutPage";
import AdminDashboard from "./pages/Admin/AdminDashboard";

export default function App() {
    return (
        <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-1 container mx-auto px-4 py-6">

                <Routes>
                    {/* Public */}
                    <Route path="/" element={<HomePage />} />
                    <Route path="/cars" element={<ListingsPage />} />
                    <Route path="/cars/:id" element={<CarDetailPage />} />
                    <Route path="/auth/login" element={<LoginPage />} />
                    <Route path="/auth/register" element={<RegisterPage />} />

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
        </div>
    );
}
