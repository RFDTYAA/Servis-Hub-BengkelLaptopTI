import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  User,
  Mail,
  Lock,
  ArrowLeft,
  ArrowRight,
  Eye,
  EyeOff,
} from "lucide-react";
import { supabase } from "../../lib/supabaseClient";
import Swal from "sweetalert2"; // IMPORT SWEETALERT

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  // --- FUNGSI REGISTER DENGAN SWEETALERT ---
  const handleRegister = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
      });

      if (authError) throw authError;

      if (authData.user) {
        const { error: profileError } = await supabase.from("profiles").insert([
          {
            id: authData.user.id,
            full_name: formData.name,
            email: formData.email,
            role: "customer",
          },
        ]);

        if (profileError) throw profileError;
      }

      // Pop-up Sukses
      await Swal.fire({
        title: "Registrasi Berhasil!",
        text: "Akun Anda telah dibuat. Silakan login sekarang.",
        icon: "success",
        background: "#1e293b",
        color: "#fff",
        confirmButtonColor: "#f97316",
        confirmButtonText: "Lanjut ke Login",
      });

      navigate("/login");
    } catch (error) {
      Swal.fire({
        title: "Gagal Mendaftar",
        text: error.message,
        icon: "error",
        background: "#1e293b",
        color: "#fff",
        confirmButtonColor: "#ef4444",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-brand-black flex items-center justify-center relative overflow-hidden p-6">
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-96 h-96 bg-brand-primary/20 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-96 h-96 bg-brand-accent/10 rounded-full blur-[120px]"></div>
      </div>

      <div className="relative z-10 w-full max-w-md bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl">
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

        <div className="text-center mb-8 mt-6">
          <h2 className="text-3xl font-bold text-white mb-2">Buat Akun Baru</h2>
          <p className="text-gray-400">
            Bergabunglah untuk kemudahan tracking servis
          </p>
        </div>

        <form onSubmit={handleRegister} className="space-y-5">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300">
              Nama Lengkap
            </label>
            <div className="relative group">
              <User
                className="absolute left-4 top-3.5 text-gray-500 group-focus-within:text-brand-accent transition"
                size={20}
              />
              <input
                type="text"
                name="name"
                required
                placeholder="Nama Anda"
                value={formData.name}
                onChange={handleChange}
                className="w-full bg-black/40 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white focus:outline-none focus:border-brand-accent focus:ring-1 focus:ring-brand-accent transition"
              />
            </div>
          </div>

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
                name="email"
                required
                placeholder="nama@email.com"
                value={formData.email}
                onChange={handleChange}
                className="w-full bg-black/40 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white focus:outline-none focus:border-brand-accent focus:ring-1 focus:ring-brand-accent transition"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300">
              Password
            </label>
            <div className="relative group">
              <Lock
                className="absolute left-4 top-3.5 text-gray-500 group-focus-within:text-brand-accent transition"
                size={20}
              />
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                required
                placeholder="Minimal 6 karakter"
                value={formData.password}
                onChange={handleChange}
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

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-brand-accent to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold py-3.5 rounded-xl transition shadow-[0_0_20px_rgba(249,115,22,0.3)] hover:shadow-[0_0_30px_rgba(249,115,22,0.5)] flex items-center justify-center gap-2 mt-4 disabled:opacity-70 disabled:cursor-not-allowed transform active:scale-95 duration-200"
          >
            {isLoading ? (
              "Mendaftarkan..."
            ) : (
              <>
                Daftar Sekarang <ArrowRight size={18} />
              </>
            )}
          </button>
        </form>

        <p className="text-center mt-8 text-gray-400 text-sm">
          Sudah punya akun?{" "}
          <Link
            to="/login"
            className="text-brand-accent font-bold hover:underline"
          >
            Login disini
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
