import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

// --- IMPORT KOMPONEN UI (Layout) ---
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

// --- IMPORT HALAMAN PUBLIK ---
import Home from "./pages/Home";
import About from "./pages/About";
import Pricing from "./pages/Pricing";
import Testimoni from "./pages/Testimoni";

// --- IMPORT HALAMAN AUTH ---
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";

// --- IMPORT HALAMAN USER (PELANGGAN) ---
import UserDashboard from "./pages/dashboard/User";
import DaftarPerbaikan from "./pages/DaftarPerbaikan"; // Halaman Form Servis
import Profile from "./pages/Profile"; // Halaman Kelola Akun

// --- IMPORT HALAMAN ADMIN ---
import AdminDashboard from "./pages/dashboard/Admin"; // Halaman Utama (Grafik)
import AdminTransaksi from "./pages/dashboard/admin/Transaksi"; // Tabel Transaksi Aktif (Pending/Working)
import AdminRiwayat from "./pages/dashboard/admin/Riwayat"; // Tabel Riwayat Selesai (Done/Cancelled)

// ==========================================
// 1. KOMPONEN PROTEKSI (GUARD)
// ==========================================
const AdminRoute = ({ children }) => {
  const role = localStorage.getItem("userRole");

  // Jika role bukan admin, tendang ke login
  if (role !== "admin") {
    return <Navigate to="/login" replace />;
  }
  return children;
};

// ==========================================
// 2. KOMPONEN LAYOUT UTAMA
// (Membungkus halaman agar selalu ada Navbar & Footer)
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

        {/* 1. Dashboard Utama (Grafik & Statistik) */}
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

        {/* 2. Halaman Transaksi Aktif (Pending & Proses) */}
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

        {/* 3. Halaman Riwayat Selesai (Done & Cancelled) */}
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
  