import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";
import { Menu, X, User, LogOut, ChevronDown, Settings } from "lucide-react";

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // --- STATE USER (Ambil langsung dari Storage biar cepat) ---
  const [userRole, setUserRole] = useState(() =>
    localStorage.getItem("userRole"),
  );
  const [userName, setUserName] = useState(() =>
    localStorage.getItem("userName"),
  );
  const [userEmail, setUserEmail] = useState(null);
  const [userAvatar, setUserAvatar] = useState(null);

  // State UI
  const [isOpen, setIsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  // --- 1. FUNGSI CEK USER (JALAN OTOMATIS) ---
  const checkUser = async () => {
    // Cek Sesi Auth Supabase
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user) {
      setUserEmail(user.email);

      // Ambil detail Role dari tabel 'profiles'
      const { data: profile } = await supabase
        .from("profiles")
        .select("role, full_name, avatar_url")
        .eq("id", user.id)
        .single();

      if (profile) {
        // UPDATE STATE & STORAGE (PENTING!)
        setUserRole(profile.role);
        setUserName(profile.full_name);
        setUserAvatar(profile.avatar_url);

        localStorage.setItem("userRole", profile.role);
        localStorage.setItem("userName", profile.full_name);
      }
    } else {
      // Jika tidak ada user (Guest), bersihkan data
      localStorage.removeItem("userRole");
      localStorage.removeItem("userName");
      setUserRole(null);
    }
  };

  // Jalankan Cek User saat halaman dimuat
  useEffect(() => {
    checkUser();

    // Listener jika user login/logout di tab lain
    const { data: authListener } = supabase.auth.onAuthStateChange(() => {
      checkUser();
    });

    return () => authListener.subscription.unsubscribe();
  }, [location.pathname]); // Cek ulang setiap ganti halaman

  const handleLogout = async () => {
    await supabase.auth.signOut();
    localStorage.clear();
    setUserRole(null);
    setUserName(null);
    setIsProfileOpen(false);
    navigate("/login");
  };

  const isActive = (path) => {
    return location.pathname === path
      ? "text-brand-accent font-bold"
      : "text-gray-300 hover:text-white transition-colors";
  };

  return (
    // FIX UKURAN: h-24 (Tinggi Navbar Dikunci)
    <nav className="bg-brand-black/95 backdrop-blur-md text-white h-24 flex items-center sticky top-0 z-50 border-b border-white/10 shadow-xl transition-all">
      <div className="container mx-auto px-6 flex justify-between items-center h-full">
        {/* LOGO */}
        <Link
          to="/"
          className="text-2xl font-extrabold tracking-tighter flex items-center gap-1 group shrink-0"
        >
          <span className="text-white group-hover:text-brand-accent transition">
            #
          </span>
          BengkelLaptop<span className="text-brand-accent">TI.</span>
        </Link>

        {/* --- MENU TENGAH (BERUBAH SESUAI ROLE) --- */}
        <div className="hidden md:flex gap-8 text-base font-medium items-center h-full">
          {/* A. JIKA BELUM LOGIN (TAMU) */}
          {!userRole && (
            <>
              <Link to="/" className={isActive("/")}>
                Home
              </Link>
              <Link to="/about" className={isActive("/about")}>
                Tentang Kami
              </Link>
              <Link to="/pricing" className={isActive("/pricing")}>
                Katalog Harga
              </Link>
              <Link to="/testimoni" className={isActive("/testimoni")}>
                Testimoni
              </Link>
            </>
          )}

          {/* B. JIKA ADMIN */}
          {userRole === "admin" && (
            <>
              <Link
                to="/dashboard/admin"
                className={isActive("/dashboard/admin")}
              >
                Dashboard (Admin)
              </Link>
              <Link
                to="/dashboard/admin/transaksi"
                className={isActive("/dashboard/admin/transaksi")}
              >
                Transaksi
              </Link>
              <Link
                to="/dashboard/admin/riwayat"
                className={isActive("/dashboard/admin/riwayat")}
              >
                Riwayat
              </Link>
            </>
          )}

          {/* C. JIKA PELANGGAN (YANG ANDA MINTA) */}
          {userRole === "customer" && (
            <>
              <Link
                to="/dashboard/user"
                className={isActive("/dashboard/user")}
              >
                Dashboard (Pelanggan)
              </Link>

              {/* PERBAIKAN DISINI: Ubah /pricing menjadi /daftar-perbaikan */}
              <Link
                to="/daftar-perbaikan"
                className={isActive("/daftar-perbaikan")}
              >
                Daftar Perbaikan
              </Link>

              <Link
                to="/dashboard/user"
                className={isActive("/dashboard/user")}
              >
                Cek Status
              </Link>
            </>
          )}
        </div>

        {/* --- POJOK KANAN (PROFIL / LOGIN) --- */}
        <div className="hidden md:flex items-center h-full relative">
          {!userRole ? (
            <Link
              to="/login"
              className="bg-brand-accent hover:bg-orange-600 text-white px-7 py-3 rounded-full text-base font-bold transition shadow-[0_0_15px_rgba(249,115,22,0.4)] hover:shadow-[0_0_25px_rgba(249,115,22,0.6)]"
            >
              Login
            </Link>
          ) : (
            /* DROPDOWN PROFIL */
            <div className="relative z-50">
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center gap-3 bg-white/5 hover:bg-white/10 border border-white/10 px-5 py-2 rounded-full transition focus:outline-none h-14"
              >
                {/* Logic Foto Profil */}
                {userAvatar ? (
                  <img
                    src={userAvatar}
                    alt="Profile"
                    className="w-9 h-9 rounded-full object-cover border border-brand-accent"
                  />
                ) : (
                  <div className="bg-brand-accent/20 p-2 rounded-full text-brand-accent">
                    <User size={20} />
                  </div>
                )}

                {/* Nama User */}
                <span className="font-bold text-base max-w-[150px] truncate">
                  {userName || (userRole === "admin" ? "Admin" : "Pelanggan")}
                </span>
                <ChevronDown
                  size={18}
                  className={`text-gray-400 transition transform ${
                    isProfileOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {/* ISI MENU DROPDOWN */}
              {isProfileOpen && (
                <div className="absolute right-0 mt-4 w-96 bg-brand-dark border border-white/10 rounded-xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-2">
                  <div className="p-5 border-b border-white/5 bg-black/30">
                    <p className="text-xs text-gray-500 uppercase tracking-widest mb-2">
                      Signed in as
                    </p>

                    <div className="flex flex-wrap items-baseline gap-2 mb-1">
                      <span className="text-white font-bold text-lg">
                        {userName}
                      </span>
                      <span className="text-gray-400 text-sm font-normal">
                        ({userEmail || "..."})
                      </span>
                    </div>

                    <span className="inline-block bg-brand-accent/20 text-brand-accent border border-brand-accent/20 px-2 py-0.5 rounded text-xs font-bold uppercase tracking-wider mt-1">
                      {userRole}
                    </span>
                  </div>

                  <div className="p-2">
                    <Link
                      to="/profile"
                      className="flex items-center gap-3 px-4 py-3 text-sm text-gray-300 hover:text-white hover:bg-white/5 rounded-lg transition"
                      onClick={() => setIsProfileOpen(false)}
                    >
                      <Settings size={18} /> Kelola Akun
                    </Link>

                    <div className="h-px bg-white/5 my-1 mx-2"></div>

                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition text-left"
                    >
                      <LogOut size={18} /> Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* MOBILE MENU TOGGLE */}
        <div className="md:hidden flex items-center">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="text-white focus:outline-none"
          >
            {isOpen ? <X size={32} /> : <Menu size={32} />}
          </button>
        </div>
      </div>

      {/* MOBILE MENU (Disesuaikan juga) */}
      {isOpen && (
        <div className="md:hidden bg-brand-dark border-t border-white/10 p-6 absolute w-full left-0 top-full shadow-2xl z-40">
          <div className="flex flex-col gap-6 font-medium text-lg">
            <Link to="/" onClick={() => setIsOpen(false)}>
              Home
            </Link>

            {!userRole && (
              <>
                <Link to="/about" onClick={() => setIsOpen(false)}>
                  Tentang Kami
                </Link>
                <Link to="/pricing" onClick={() => setIsOpen(false)}>
                  Katalog Harga
                </Link>
                <Link to="/testimoni" onClick={() => setIsOpen(false)}>
                  Testimoni
                </Link>
                <Link
                  to="/login"
                  className="text-brand-accent font-bold"
                  onClick={() => setIsOpen(false)}
                >
                  Login
                </Link>
              </>
            )}

            {userRole === "admin" && (
              <>
                <Link to="/dashboard/admin" onClick={() => setIsOpen(false)}>
                  Dashboard (Admin)
                </Link>
                <Link
                  to="/dashboard/admin/transaksi"
                  onClick={() => setIsOpen(false)}
                >
                  Transaksi
                </Link>
                <Link
                  to="/dashboard/admin/riwayat"
                  onClick={() => setIsOpen(false)}
                >
                  Riwayat
                </Link>
              </>
            )}

            {userRole === "customer" && (
              <>
                <Link to="/dashboard/user" onClick={() => setIsOpen(false)}>
                  Dashboard (Pelanggan)
                </Link>
                <Link to="/pricing" onClick={() => setIsOpen(false)}>
                  Daftar Perbaikan
                </Link>
                <Link to="/dashboard/user" onClick={() => setIsOpen(false)}>
                  Cek Status
                </Link>
              </>
            )}

            {userRole && (
              <div className="border-t border-white/10 pt-4 mt-2">
                <div className="mb-4">
                  <p className="font-bold text-base">{userName}</p>
                  <button
                    onClick={handleLogout}
                    className="text-red-400 font-bold block py-2 mt-2"
                  >
                    Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
