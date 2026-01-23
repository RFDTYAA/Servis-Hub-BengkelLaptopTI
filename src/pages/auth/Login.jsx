import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Mail,
  Lock,
  ArrowLeft,
  LogIn,
  Eye,
  EyeOff,
  KeyRound,
} from "lucide-react";
import { supabase } from "../../lib/supabaseClient";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // STATE BARU: Mode Lupa Password
  const [isResetMode, setIsResetMode] = useState(false);

  // --- 1. FUNGSI LOGIN ---
  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
      });

      if (error) throw error;

      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", data.user.id)
        .single();

      if (profileError) throw profileError;

      localStorage.setItem("userRole", profile.role);
      localStorage.setItem("userName", profile.full_name);

      alert(`✅ Login Berhasil!`);
      if (profile.role === "admin") window.location.href = "/dashboard/admin";
      else navigate("/dashboard/user");
    } catch (error) {
      alert("❌ Login Gagal: " + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // --- 2. FUNGSI RESET PASSWORD (BARU) ---
  const handleResetPassword = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: "http://localhost:5173/update-password", // Nanti kita buat halaman ini jika perlu
      });

      if (error) throw error;

      alert(
        "📧 Link reset password telah dikirim ke email Anda! Silakan cek inbox/spam."
      );
      setIsResetMode(false); // Balik ke mode login
    } catch (error) {
      alert("❌ Gagal mengirim email: " + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-brand-black flex items-center justify-center relative overflow-hidden p-6">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-brand-accent/20 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-brand-cyan/20 rounded-full blur-[120px]"></div>
      </div>

      <div className="relative z-10 w-full max-w-md bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl transition-all duration-300">
        {/* --- TOMBOL KEMBALI KE HOME (BARU: DI POJOK KIRI ATAS) --- */}
        <Link
          to="/"
          className="absolute top-6 left-6 text-gray-500 hover:text-white transition flex items-center gap-2 text-sm font-medium group"
        >
          <div className="bg-white/5 p-1.5 rounded-full group-hover:bg-brand-accent group-hover:text-white transition">
            <ArrowLeft size={16} />
          </div>
          <span className="opacity-0 group-hover:opacity-100 transition-opacity -ml-2 group-hover:ml-0 duration-300">
            Home
          </span>
        </Link>

        {/* HEADER DINAMIS */}
        <div className="text-center mb-8 mt-6">
          <h2 className="text-3xl font-bold text-white mb-2">
            {isResetMode ? "Reset Password" : "Welcome Back!"}
          </h2>
          <p className="text-gray-400 text-sm">
            {isResetMode
              ? "Masukkan email untuk menerima link reset."
              : "Masuk untuk memantau status servis Anda."}
          </p>
        </div>

        {/* --- FORM UTAMA --- */}
        <form
          onSubmit={isResetMode ? handleResetPassword : handleLogin}
          className="space-y-6"
        >
          {/* EMAIL INPUT (Selalu Muncul) */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300">
              Email Address
            </label>
            <div className="relative group">
              <Mail
                className="absolute left-4 top-3.5 text-gray-500 group-focus-within:text-brand-accent transition"
                size={20}
              />
              <input
                type="email"
                required
                placeholder="nama@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-black/40 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white focus:outline-none focus:border-brand-accent focus:ring-1 focus:ring-brand-accent transition"
              />
            </div>
          </div>

          {/* PASSWORD INPUT (Hanya di Mode Login) */}
          {!isResetMode && (
            <div className="space-y-2 animate-in slide-in-from-top-2 fade-in">
              <div className="flex justify-between">
                <label className="text-sm font-medium text-gray-300">
                  Password
                </label>
                {/* TOMBOL MEMICU MODE RESET */}
                <button
                  type="button"
                  onClick={() => setIsResetMode(true)}
                  className="text-xs text-brand-accent hover:text-orange-400 hover:underline cursor-pointer"
                >
                  Lupa password?
                </button>
              </div>
              <div className="relative group">
                <Lock
                  className="absolute left-4 top-3.5 text-gray-500 group-focus-within:text-brand-accent transition"
                  size={20}
                />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-black/40 border border-white/10 rounded-xl py-3 pl-12 pr-12 text-white focus:outline-none focus:border-brand-accent focus:ring-1 focus:ring-brand-accent transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-3.5 text-gray-500 hover:text-white transition focus:outline-none"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>
          )}

          {/* TOMBOL SUBMIT DINAMIS */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-brand-accent to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold py-3.5 rounded-xl transition shadow-[0_0_20px_rgba(249,115,22,0.3)] hover:shadow-[0_0_30px_rgba(249,115,22,0.5)] flex items-center justify-center gap-2 mt-2 disabled:opacity-70 disabled:cursor-not-allowed transform active:scale-95 duration-200"
          >
            {isLoading ? (
              "Memproses..."
            ) : isResetMode ? (
              <>
                Kirim Link Reset <KeyRound size={18} />
              </>
            ) : (
              <>
                Login Sekarang <LogIn size={18} />
              </>
            )}
          </button>
        </form>

        {/* FOOTER LINK */}
        <div className="text-center mt-8 text-gray-400 text-sm">
          {isResetMode ? (
            <button
              onClick={() => setIsResetMode(false)}
              className="text-brand-accent font-bold hover:underline"
            >
              Kembali ke Login
            </button>
          ) : (
            <>
              Belum punya akun?{" "}
              <Link
                to="/register"
                className="text-brand-accent font-bold hover:underline"
              >
                Daftar sekarang
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;
