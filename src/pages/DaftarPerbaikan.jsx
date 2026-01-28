import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";
import Swal from "sweetalert2";
import {
  Wrench,
  Calendar,
  Laptop,
  AlignLeft,
  Send,
  AlertCircle,
  Briefcase,
  CheckCircle2,
} from "lucide-react";

const DaftarPerbaikan = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    deviceName: "",
    category: "Hardware",
    description: "",
    date: new Date().toISOString().split("T")[0],
    hasCharger: false,
    hasTas: false,
    hasOther: false,
    otherDesc: "",
  });

  useEffect(() => {
    const checkUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        // Warning jika belum login
        Swal.fire({
          title: "Akses Ditolak",
          text: "Anda harus login untuk mendaftar servis!",
          icon: "warning",
          background: "#1e293b",
          color: "#fff",
          confirmButtonColor: "#f97316",
        }).then(() => navigate("/login"));
      }
    };
    checkUser();
  }, [navigate]);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });
  const handleCheckbox = (field) =>
    setFormData((prev) => ({ ...prev, [field]: !prev[field] }));

  // --- FUNGSI SUBMIT DENGAN SWEETALERT ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("Sesi habis, silakan login ulang.");

      let accessories = [];
      if (formData.hasCharger) accessories.push("Charger");
      if (formData.hasTas) accessories.push("Tas");
      if (formData.hasOther && formData.otherDesc)
        accessories.push(formData.otherDesc);

      const accessoriesString =
        accessories.length > 0
          ? `\n\n[Kelengkapan: ${accessories.join(", ")}]`
          : `\n\n[Kelengkapan: Unit Only]`;

      const fullProblemDesc = `[${formData.category}] ${formData.description} ${accessoriesString}`;

      const { error } = await supabase.from("transactions").insert([
        {
          user_id: user.id,
          device_name: formData.deviceName,
          problem_desc: fullProblemDesc,
          status: "Pending",
          total_cost: 0,
        },
      ]);

      if (error) throw error;

      // Pop-up Sukses
      Swal.fire({
        title: "Permintaan Terkirim!",
        text: "Teknisi kami akan segera memproses. Pantau status di Dashboard.",
        icon: "success",
        background: "#1e293b",
        color: "#fff",
        confirmButtonColor: "#f97316",
        confirmButtonText: "Oke, Mengerti",
      }).then(() => {
        navigate("/dashboard/user");
      });
    } catch (error) {
      Swal.fire({
        title: "Terjadi Kesalahan",
        text: error.message,
        icon: "error",
        background: "#1e293b",
        color: "#fff",
        confirmButtonColor: "#ef4444",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-brand-black text-white relative overflow-hidden py-10 px-4">
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
        <div className="absolute top-10 right-[-100px] w-96 h-96 bg-brand-accent/20 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-10 left-[-100px] w-96 h-96 bg-blue-500/10 rounded-full blur-[120px]"></div>
      </div>

      <div className="container mx-auto max-w-3xl relative z-10">
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-extrabold mb-3">
            Formulir <span className="text-brand-accent">Daftar Perbaikan</span>
          </h1>
          <p className="text-gray-400">
            Isi detail kerusakan perangkat Anda di bawah ini.
          </p>
        </div>

        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-bold text-gray-300">
                <Laptop size={16} className="text-brand-accent" /> Nama
                Perangkat
              </label>
              <input
                type="text"
                name="deviceName"
                required
                placeholder="Contoh: Asus ROG Strix G512"
                value={formData.deviceName}
                onChange={handleChange}
                className="w-full bg-black/40 border border-white/10 rounded-xl px-5 py-3 text-white focus:outline-none focus:border-brand-accent focus:ring-1 focus:ring-brand-accent transition"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-bold text-gray-300">
                  <Wrench size={16} className="text-brand-accent" /> Kategori
                  Masalah
                </label>
                <div className="relative">
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-5 py-3 text-white appearance-none focus:outline-none focus:border-brand-accent cursor-pointer"
                  >
                    <option value="Hardware">Hardware</option>
                    <option value="Software">Software</option>
                    <option value="Maintenance">Maintenance</option>
                    <option value="Upgrade">Upgrade</option>
                  </select>
                  <div className="absolute right-4 top-3.5 pointer-events-none text-gray-400">
                    ▼
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-bold text-gray-300">
                  <Calendar size={16} className="text-brand-accent" /> Tanggal
                  Datang
                </label>
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  className="w-full bg-black/40 border border-white/10 rounded-xl px-5 py-3 text-white focus:outline-none focus:border-brand-accent cursor-pointer text-gray-400"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-bold text-gray-300">
                <AlignLeft size={16} className="text-brand-accent" /> Detail
                Kerusakan
              </label>
              <textarea
                name="description"
                required
                rows="4"
                placeholder="Jelaskan kendala yang dialami..."
                value={formData.description}
                onChange={handleChange}
                className="w-full bg-black/40 border border-white/10 rounded-xl px-5 py-3 text-white focus:outline-none focus:border-brand-accent transition resize-none"
              ></textarea>
            </div>

            <div className="space-y-3 pt-2">
              <label className="flex items-center gap-2 text-sm font-bold text-gray-300 mb-2">
                <Briefcase size={16} className="text-brand-accent" />{" "}
                Kelengkapan (Yang Dibawa)
              </label>
              <div className="flex flex-wrap gap-4">
                <div
                  onClick={() => handleCheckbox("hasCharger")}
                  className={`flex items-center gap-3 px-4 py-2 rounded-full border cursor-pointer transition select-none ${formData.hasCharger ? "bg-brand-accent/20 border-brand-accent text-white" : "bg-black/40 border-white/10 text-gray-400 hover:border-white/30"}`}
                >
                  <div
                    className={`w-5 h-5 rounded-full border flex items-center justify-center ${formData.hasCharger ? "bg-brand-accent border-brand-accent" : "border-gray-500"}`}
                  >
                    {formData.hasCharger && (
                      <CheckCircle2 size={14} className="text-white" />
                    )}
                  </div>
                  <span className="text-sm font-medium">Charger</span>
                </div>
                <div
                  onClick={() => handleCheckbox("hasTas")}
                  className={`flex items-center gap-3 px-4 py-2 rounded-full border cursor-pointer transition select-none ${formData.hasTas ? "bg-brand-accent/20 border-brand-accent text-white" : "bg-black/40 border-white/10 text-gray-400 hover:border-white/30"}`}
                >
                  <div
                    className={`w-5 h-5 rounded-full border flex items-center justify-center ${formData.hasTas ? "bg-brand-accent border-brand-accent" : "border-gray-500"}`}
                  >
                    {formData.hasTas && (
                      <CheckCircle2 size={14} className="text-white" />
                    )}
                  </div>
                  <span className="text-sm font-medium">Tas</span>
                </div>
                <div
                  onClick={() => handleCheckbox("hasOther")}
                  className={`flex items-center gap-3 px-4 py-2 rounded-full border cursor-pointer transition select-none ${formData.hasOther ? "bg-brand-accent/20 border-brand-accent text-white" : "bg-black/40 border-white/10 text-gray-400 hover:border-white/30"}`}
                >
                  <div
                    className={`w-5 h-5 rounded-full border flex items-center justify-center ${formData.hasOther ? "bg-brand-accent border-brand-accent" : "border-gray-500"}`}
                  >
                    {formData.hasOther && (
                      <CheckCircle2 size={14} className="text-white" />
                    )}
                  </div>
                  <span className="text-sm font-medium">Lainnya</span>
                </div>
              </div>
              {formData.hasOther && (
                <div className="mt-3 animate-in slide-in-from-top-2 fade-in">
                  <input
                    type="text"
                    name="otherDesc"
                    value={formData.otherDesc}
                    onChange={handleChange}
                    placeholder="Sebutkan kelengkapan lainnya (contoh: Mouse, Dus)"
                    className="w-full bg-black/40 border border-brand-accent/50 rounded-xl px-5 py-3 text-white focus:outline-none focus:border-brand-accent placeholder-gray-500 text-sm"
                    autoFocus
                  />
                </div>
              )}
            </div>

            <div className="bg-blue-500/10 border border-blue-500/20 p-4 rounded-xl flex gap-3 items-start mt-4">
              <AlertCircle
                size={20}
                className="text-blue-400 shrink-0 mt-0.5"
              />
              <p className="text-xs text-gray-300 leading-relaxed">
                Pastikan data kelengkapan sesuai dengan barang yang Anda
                serahkan ke teknisi.
              </p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-brand-accent to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold py-4 rounded-xl shadow-lg transition transform active:scale-95 flex justify-center items-center gap-2 mt-6 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                "Mengirim Data..."
              ) : (
                <>
                  <Send size={18} /> Kirim Pengajuan Servis
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default DaftarPerbaikan;
