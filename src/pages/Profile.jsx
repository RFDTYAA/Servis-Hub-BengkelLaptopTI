import React, { useState, useEffect } from "react";
import { supabase } from "../lib/supabaseClient";
import {
  User,
  Mail,
  Shield,
  Camera,
  Save,
  Loader2,
  LogOut,
  Phone,
} from "lucide-react"; // Import Phone
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const Profile = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  // State Data User
  const [session, setSession] = useState(null);
  const [avatarUrl, setAvatarUrl] = useState(null);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");
  const [phoneNumber, setPhoneNumber] = useState(""); // State baru untuk No HP

  // 1. FETCH DATA USER
  useEffect(() => {
    const getProfile = async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
          navigate("/login");
          return;
        }

        setSession(user);
        setEmail(user.email);

        // Ambil detail dari tabel profiles
        const { data, error } = await supabase
          .from("profiles")
          .select("full_name, role, avatar_url, phone_number") // Tambahkan phone_number
          .eq("id", user.id)
          .single();

        if (error && status !== 406) {
          throw error;
        }

        if (data) {
          setFullName(data.full_name || "");
          setRole(data.role || "");
          setAvatarUrl(data.avatar_url || null);
          setPhoneNumber(data.phone_number || ""); // Set phone_number
        }
      } catch (error) {
        Swal.fire("Error", "Gagal memuat data profil!", "error");
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    getProfile();
  }, [navigate]);

  // 2. FUNGSI UPLOAD FOTO
  const uploadAvatar = async (event) => {
    try {
      setUpdating(true);

      if (!event.target.files || event.target.files.length === 0) {
        throw new Error("Pilih gambar dulu!");
      }

      const file = event.target.files[0];
      const fileExt = file.name.split(".").pop();
      const fileName = `${session.id}/${Math.random()}.${fileExt}`;
      const filePath = `${fileName}`;

      // Upload ke Supabase Storage bucket 'avatars'
      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }

      // Ambil URL Publik
      const {
        data: { publicUrl },
      } = supabase.storage.from("avatars").getPublicUrl(filePath);

      // Update Database dengan URL baru
      const { error: updateError } = await supabase
        .from("profiles")
        .update({ avatar_url: publicUrl })
        .eq("id", session.id);

      if (updateError) {
        throw updateError;
      }

      // Update State Lokal & LocalStorage agar Navbar berubah
      setAvatarUrl(publicUrl);
      localStorage.setItem("userAvatar", publicUrl); // Simpan sementara
      Swal.fire({
        title: "Berhasil!",
        text: "Foto profil berhasil diperbarui.",
        icon: "success",
        background: "#1e293b",
        color: "#fff",
        showConfirmButton: false,
        timer: 1500,
      });
    } catch (error) {
      Swal.fire("Gagal", error.message, "error");
    } finally {
      setUpdating(false);
    }
  };

  // 3. FUNGSI UPDATE DATA PROFIL (Nama & No HP)
  const updateProfile = async (e) => {
    e.preventDefault();
    try {
      setUpdating(true);

      const updates = {
        full_name: fullName,
        phone_number: phoneNumber, // Update phone_number
        updated_at: new Date(),
      };

      const { error } = await supabase
        .from("profiles")
        .update(updates)
        .eq("id", session.id);

      if (error) throw error;

      // Update LocalStorage agar Navbar berubah
      localStorage.setItem("userName", fullName);

      Swal.fire({
        title: "Berhasil!",
        text: "Profil berhasil disimpan.",
        icon: "success",
        background: "#1e293b",
        color: "#fff",
        showConfirmButton: false,
        timer: 1500,
      });
    } catch (error) {
      Swal.fire("Gagal", error.message, "error");
    } finally {
      setUpdating(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    localStorage.clear();
    navigate("/login");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-brand-black flex items-center justify-center text-white">
        <Loader2 size={48} className="text-brand-accent animate-spin mb-4" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-brand-black text-white relative py-12 px-4 flex justify-center items-center">
      {/* Background Glow */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-brand-accent/10 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-blue-500/10 rounded-full blur-[120px]"></div>
      </div>

      {/* CARD PROFILE */}
      <div className="relative z-10 w-full max-w-lg bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold">Edit Profile</h1>
          <p className="text-gray-400 text-sm">Perbarui informasi akun Anda</p>
        </div>

        {/* --- AVATAR SECTION --- */}
        <div className="flex flex-col items-center mb-8">
          <div className="relative group">
            {/* Lingkaran Foto */}
            <div className="w-32 h-32 rounded-full p-1 border-2 border-dashed border-brand-accent/50 group-hover:border-brand-accent transition cursor-pointer">
              {avatarUrl ? (
                <img
                  src={avatarUrl}
                  alt="Avatar"
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                <div className="w-full h-full rounded-full bg-white/10 flex items-center justify-center text-gray-400">
                  <User size={48} />
                </div>
              )}
            </div>

            {/* Tombol Kamera (Input File Tersembunyi) */}
            <label className="absolute bottom-0 right-0 bg-brand-accent hover:bg-orange-600 text-white p-2.5 rounded-full shadow-lg cursor-pointer transition transform group-hover:scale-110">
              {updating ? (
                <Loader2 size={18} className="animate-spin" />
              ) : (
                <Camera size={18} />
              )}
              <input
                type="file"
                accept="image/*"
                onChange={uploadAvatar}
                disabled={updating}
                className="hidden"
              />
            </label>
          </div>
          <p className="text-xs text-gray-500 mt-3">
            Klik ikon kamera untuk ganti foto
          </p>
        </div>

        {/* --- FORM SECTION --- */}
        <form onSubmit={updateProfile} className="space-y-5">
          {/* NAMA LENGKAP */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">
              Nama Lengkap
            </label>
            <div className="relative">
              <User
                className="absolute left-4 top-3.5 text-gray-500"
                size={18}
              />
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full bg-black/40 border border-white/10 rounded-xl py-3 pl-11 pr-4 text-white focus:outline-none focus:border-brand-accent focus:ring-1 focus:ring-brand-accent transition"
                placeholder="Nama Lengkap Anda"
              />
            </div>
          </div>

          {/* NOMOR WHATSAPP (BARU) */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-brand-accent uppercase tracking-wider ml-1">
              Nomor WhatsApp
            </label>
            <div className="relative">
              <Phone
                className="absolute left-4 top-3.5 text-brand-accent"
                size={18}
              />
              <input
                type="text"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="08xxxxxxxxxx"
                className="w-full bg-black/40 border border-brand-accent/30 rounded-xl py-3 pl-11 pr-4 text-white focus:outline-none focus:border-brand-accent focus:ring-1 focus:ring-brand-accent transition"
              />
            </div>
            <p className="text-[10px] text-gray-500 ml-1">
              *Penting untuk notifikasi status servis.
            </p>
          </div>

          {/* EMAIL (Read Only) */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">
              Email Address
            </label>
            <div className="relative opacity-70">
              <Mail
                className="absolute left-4 top-3.5 text-gray-500"
                size={18}
              />
              <input
                type="email"
                value={email}
                disabled
                className="w-full bg-white/5 border border-white/5 rounded-xl py-3 pl-11 pr-4 text-gray-400 cursor-not-allowed"
              />
              <span className="absolute right-4 top-3.5 text-xs text-gray-600 font-mono">
                Locked
              </span>
            </div>
          </div>

          {/* ROLE (Read Only) */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">
              Role / Jabatan
            </label>
            <div className="relative">
              <Shield
                className="absolute left-4 top-3.5 text-gray-500"
                size={18}
              />
              <input
                type="text"
                value={role.toUpperCase()}
                disabled
                className="w-full bg-white/5 border border-white/5 rounded-xl py-3 pl-11 pr-4 text-brand-accent font-bold cursor-not-allowed tracking-widest"
              />
            </div>
          </div>

          {/* TOMBOL SAVE */}
          <button
            type="submit"
            disabled={updating}
            className="w-full mt-6 bg-white text-brand-black hover:bg-gray-200 font-bold py-3.5 rounded-xl transition shadow-lg flex justify-center items-center gap-2"
          >
            {updating ? (
              <>
                <Loader2 size={18} className="animate-spin" /> Menyimpan...
              </>
            ) : (
              <>
                Simpan Perubahan <Save size={18} />
              </>
            )}
          </button>
        </form>

        {/* TOMBOL LOGOUT (Terpisah) */}
        <button
          onClick={handleLogout}
          className="w-full mt-4 bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/20 font-bold py-3.5 rounded-xl transition flex justify-center items-center gap-2"
        >
          Logout <LogOut size={18} />
        </button>
      </div>
    </div>
  );
};

export default Profile;
