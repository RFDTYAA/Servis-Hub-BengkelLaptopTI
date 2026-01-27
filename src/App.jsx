import React, { useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";

// --- IMPORT KOMPONEN UI (Layout) ---
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

// --- IMPORT HALAMAN PUBLIK ---
import Home from "./pages/Home";
import About from "./pages/About";
import Pricing from "./pages/Pricing";
import Testimoni from "./pages/Testimoni";
import CekStatus from "./pages/CekStatus"; // <--- TAMBAHAN: Import Halaman Cek Status

// --- IMPORT HALAMAN AUTH ---
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";

// --- IMPORT HALAMAN USER (PELANGGAN) ---
import UserDashboard from "./pages/dashboard/User";
import DaftarPerbaikan from "./pages/DaftarPerbaikan";
import Profile from "./pages/Profile";

// --- IMPORT HALAMAN ADMIN ---
import AdminDashboard from "./pages/dashboard/Admin";
import AdminTransaksi from "./pages/dashboard/admin/Transaksi";
import AdminRiwayat from "./pages/dashboard/admin/Riwayat";

// ==========================================
// 0. KOMPONEN SCROLL TO TOP
// ==========================================
const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    // Geser window ke posisi (0, 0) setiap kali pathname berubah
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

// ==========================================
// 1. KOMPONEN PROTEKSI (GUARD)
// ==========================================
const AdminRoute = ({ children }) => {
  const role = localStorage.getItem("userRole");
  if (role !== "admin") {
    return <Navigate to="/login" replace />;
  }
  return children;
};

// ==========================================
// 2. KOMPONEN LAYOUT UTAMA
// ==========================================
const Layout = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen font-sans antialiased text-slate-200 bg-brand-black">
      <Navbar />
      <main className="flex-grow">{children}</main>
      <Footer />
    </div>
  );
};

// ==========================================
// 3. STRUKTUR ROUTING APLIKASI
// ==========================================
function App() {
  return (
    <Router>
      {/* Pasang ScrollToTop DI DALAM Router tapi DI LUAR Routes */}
      <ScrollToTop />

      <Routes>
        {/* --- A. ROUTE PUBLIK --- */}
        <Route
          path="/"
          element={
            <Layout>
              <Home />
            </Layout>
          }
        />
        <Route
          path="/about"
          element={
            <Layout>
              <About />
            </Layout>
          }
        />
        <Route
          path="/pricing"
          element={
            <Layout>
              <Pricing />
            </Layout>
          }
        />
        <Route
          path="/testimoni"
          element={
            <Layout>
              <Testimoni />
            </Layout>
          }
        />
        {/* TAMBAHAN: Route Cek Status */}
        <Route
          path="/cek-status"
          element={
            <Layout>
              <CekStatus />
            </Layout>
          }
        />

        {/* --- B. ROUTE AUTH --- */}
        <Route
          path="/login"
          element={
            <Layout>
              <Login />
            </Layout>
          }
        />
        <Route
          path="/register"
          element={
            <Layout>
              <Register />
            </Layout>
          }
        />

        {/* --- C. ROUTE PELANGGAN / CUSTOMER --- */}
        <Route
          path="/dashboard/user"
          element={
            <Layout>
              <UserDashboard />
            </Layout>
          }
        />
        <Route
          path="/profile"
          element={
            <Layout>
              <Profile />
            </Layout>
          }
        />
        <Route
          path="/daftar-perbaikan"
          element={
            <Layout>
              <DaftarPerbaikan />
            </Layout>
          }
        />

        {/* --- D. ROUTE KHUSUS ADMIN (DIPROTEKSI) --- */}
        <Route
          path="/dashboard/admin"
          element={
            <AdminRoute>
              <Layout>
                <AdminDashboard />
              </Layout>
            </AdminRoute>
          }
        />
        <Route
          path="/dashboard/admin/transaksi"
          element={
            <AdminRoute>
              <Layout>
                <AdminTransaksi />
              </Layout>
            </AdminRoute>
          }
        />
        <Route
          path="/dashboard/admin/riwayat"
          element={
            <AdminRoute>
              <Layout>
                <AdminRiwayat />
              </Layout>
            </AdminRoute>
          }
        />

        {/* --- E. ROUTE FALLBACK (404) --- */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
