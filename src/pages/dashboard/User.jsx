import React, { useEffect, useState } from "react";
import { supabase } from "../../lib/supabaseClient";
import { Link, useNavigate } from "react-router-dom";
import html2pdf from "html2pdf.js";
import Swal from "sweetalert2";
import {
  Wrench,
  Clock,
  CheckCircle,
  AlertCircle,
  Plus,
  LogOut,
  FileDown,
  XCircle,
  Check,
  User,
  UserCheck,
  LayoutDashboard,
  Smartphone,
  History,
} from "lucide-react";
import { NotaInvoice } from "../../components/NotaInvoice";

// --- IMPORT FOTO TEKNISI ---
import fotoridho from "../../assets/fotoprofile/ridho.png";
import fotorafi from "../../assets/fotoprofile/rafi.png";
import fotodamtoy from "../../assets/fotoprofile/damtoy.png";
import fotoadjie from "../../assets/fotoprofile/adjie.png";
import fotofarrel from "../../assets/fotoprofile/farrel.jpg";
import fotowildan from "../../assets/fotoprofile/wildan.jpg";
import fotoraja from "../../assets/fotoprofile/raja.jpg";
import fotojauhan from "../../assets/fotoprofile/jauhan.png";

const TECHNICIANS_DATA = [
  { name: "Mohammad Ridho Cahyono", img: fotoridho },
  { name: "Muhammad Rafi Aditya", img: fotorafi },
  { name: "Adam Toyib Nurwahid", img: fotodamtoy },
  { name: "Muhammad Setya Adjie", img: fotoadjie },
  { name: "Farrel Ghozy Afifuddin", img: fotofarrel },
  { name: "Muhammad Wildan", img: fotowildan },
  { name: "Raja Muhammad", img: fotoraja },
];

const UserDashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);
  const [services, setServices] = useState([]);
  const [notaData, setNotaData] = useState(null);

  // --- FETCH DATA ---
  const getData = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        navigate("/login");
        return;
      }

      const { data: userProfile } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();
      setProfile(userProfile);

      const { data: userServices } = await supabase
        .from("transactions")
        .select(`*, profiles:user_id(*)`)
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      setServices(userServices || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getData();
  }, [navigate]);

  // --- LOGOUT ---
  const handleLogout = async () => {
    const result = await Swal.fire({
      title: "Keluar?",
      text: "Anda harus login kembali nanti.",
      icon: "question",
      showCancelButton: true,
      background: "#1e293b",
      color: "#fff",
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#334155",
      confirmButtonText: "Ya, Keluar",
    });
    if (result.isConfirmed) {
      await supabase.auth.signOut();
      localStorage.clear();
      navigate("/login");
    }
  };

  // --- ACTION HANDLER ---
  const handleAction = async (id, action) => {
    const isApprove = action === "Approved";
    const result = await Swal.fire({
      title: isApprove ? "Setujui Biaya?" : "Batalkan Servis?",
      text: isApprove
        ? "Teknisi akan segera memproses perangkat Anda."
        : "Permintaan servis akan dibatalkan.",
      icon: "warning",
      showCancelButton: true,
      background: "#1e293b",
      color: "#fff",
      confirmButtonColor: isApprove ? "#f97316" : "#ef4444",
      confirmButtonText: isApprove ? "Ya, Lanjut!" : "Batalkan",
    });

    if (result.isConfirmed) {
      try {
        setServices((prev) =>
          prev.map((item) =>
            item.id === id ? { ...item, status: action } : item,
          ),
        );
        await supabase
          .from("transactions")
          .update({ status: action })
          .eq("id", id);
        Swal.fire({
          title: "Berhasil!",
          icon: "success",
          background: "#1e293b",
          color: "#fff",
          showConfirmButton: false,
          timer: 1500,
        });
        setTimeout(getData, 1000);
      } catch (error) {
        Swal.fire("Gagal", error.message, "error");
        getData();
      }
    }
  };

  // --- PDF & UTILS ---
  const handleDownloadPDF = async (item) => {
    setNotaData(item);
    setTimeout(() => {
      const element = document.getElementById("nota-print-area");
      const opt = {
        margin: 0,
        filename: `Nota_Servis_${item.id}.pdf`,
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
      };
      html2pdf()
        .set(opt)
        .from(element)
        .save()
        .then(() => setNotaData(null));
    }, 500);
  };

  const getTechPhoto = (name) => {
    const tech = TECHNICIANS_DATA.find((t) => t.name === name);
    return tech ? tech.img : null;
  };

  const formatRupiah = (n) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(n);

  const getStatusBadge = (status) => {
    const styles = {
      Pending: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
      Approved: "bg-purple-500/10 text-purple-400 border-purple-500/20",
      Working: "bg-blue-500/10 text-blue-400 border-blue-500/20",
      Selesai: "bg-green-500/10 text-green-500 border-green-500/20",
      Dibatalkan: "bg-red-500/10 text-red-500 border-red-500/20",
      Cancelled: "bg-red-500/10 text-red-500 border-red-500/20",
      Done: "bg-green-500/10 text-green-500 border-green-500/20",
    };
    const labels = {
      Pending: "Menunggu Cek",
      Approved: "Disetujui",
      Working: "Diproses",
      Selesai: "Selesai",
      Dibatalkan: "Batal",
      Cancelled: "Batal",
      Done: "Selesai",
    };
    return (
      <span
        className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border flex items-center gap-1.5 ${styles[status] || styles.Pending}`}
      >
        <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse"></span>
        {labels[status] || status}
      </span>
    );
  };

  if (loading)
    return (
      <div className="min-h-screen bg-brand-black flex items-center justify-center text-white font-mono animate-pulse">
        Memuat Data...
      </div>
    );

  return (
    <div className="min-h-screen bg-brand-black text-white p-6 md:p-8 font-sans">
      <div className="absolute -left-[9999px] top-0">
        <div id="nota-print-area">
          {notaData && <NotaInvoice data={notaData} />}
        </div>
      </div>

      <div className="container mx-auto max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* --- SIDEBAR: PROFIL & INFO --- */}
          <div className="lg:col-span-1 space-y-6">
            {/* Kartu Profil */}
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 text-center shadow-2xl relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-b from-brand-accent/10 to-transparent opacity-0 group-hover:opacity-100 transition duration-500"></div>

              <div className="relative z-10">
                <div className="w-24 h-24 mx-auto bg-brand-dark rounded-full p-1 border-2 border-brand-accent shadow-lg mb-4">
                  {profile?.avatar_url ? (
                    <img
                      src={profile.avatar_url}
                      alt="Profile"
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-white/10 rounded-full flex items-center justify-center text-gray-400">
                      <User size={40} />
                    </div>
                  )}
                </div>
                <h2 className="text-xl font-bold text-white mb-1">
                  {profile?.full_name || "Pelanggan"}
                </h2>
                <p className="text-xs text-gray-400 font-mono mb-6">
                  {profile?.email}
                </p>

                <div className="grid grid-cols-2 gap-3 mb-6">
                  <div className="bg-black/20 rounded-xl p-3">
                    <span className="block text-2xl font-bold text-brand-cyan">
                      {services.length}
                    </span>
                    <span className="text-[10px] text-gray-500 uppercase tracking-wider">
                      Total Servis
                    </span>
                  </div>
                  <div className="bg-black/20 rounded-xl p-3">
                    <span className="block text-2xl font-bold text-green-400">
                      {
                        services.filter(
                          (s) => s.status === "Selesai" || s.status === "Done",
                        ).length
                      }
                    </span>
                    <span className="text-[10px] text-gray-500 uppercase tracking-wider">
                      Selesai
                    </span>
                  </div>
                </div>

                <button
                  onClick={handleLogout}
                  className="w-full py-2.5 rounded-xl border border-white/10 hover:bg-white/5 text-sm font-medium text-gray-300 hover:text-white transition flex items-center justify-center gap-2"
                >
                  <LogOut size={16} /> Keluar Akun
                </button>
              </div>
            </div>

            {/* Tombol Ajukan Servis (CTA) */}
            <Link
              to="/daftar-perbaikan"
              className="block w-full group relative overflow-hidden rounded-3xl shadow-xl transform hover:-translate-y-1 transition duration-300"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-brand-accent to-orange-600"></div>
              <div className="relative p-6 flex flex-col items-center text-center">
                <div className="bg-white/20 p-3 rounded-full mb-3 group-hover:scale-110 transition duration-300">
                  <Plus size={32} className="text-white" />
                </div>
                <h3 className="text-lg font-bold text-white mb-1">
                  Ajukan Servis Baru
                </h3>
                <p className="text-xs text-white/80">
                  Klik di sini untuk mendaftarkan perangkat rusak Anda.
                </p>
              </div>
            </Link>
          </div>

          {/* --- MAIN CONTENT: RIWAYAT SERVIS --- */}
          <div className="lg:col-span-3">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold flex items-center gap-2">
                <History className="text-brand-accent" /> Riwayat Perbaikan
              </h2>
              <div className="hidden md:flex gap-2">
                <span className="text-xs px-3 py-1 bg-white/5 rounded-full text-gray-400 border border-white/5">
                  Semua: {services.length}
                </span>
              </div>
            </div>

            {services.length === 0 ? (
              <div className="bg-white/5 border border-white/10 border-dashed rounded-3xl p-12 text-center">
                <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-500">
                  <LayoutDashboard size={32} />
                </div>
                <h3 className="text-lg font-bold text-gray-300 mb-2">
                  Belum Ada Riwayat
                </h3>
                <p className="text-gray-500 text-sm mb-6">
                  Mulai perbaikan pertamamu sekarang.
                </p>
                <Link
                  to="/daftar-perbaikan"
                  className="inline-flex items-center gap-2 text-brand-accent hover:text-white font-bold text-sm transition"
                >
                  Buat Pesanan Baru <Plus size={16} />
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {services.map((item) => {
                  const descClean = item.problem_desc
                    ?.replace(/^\[.*?\]/, "")
                    .trim();
                  const showConfirm =
                    item.total_cost > 0 && item.status === "Pending";
                  const showPdf =
                    ["Working", "Selesai", "Approved", "Done"].includes(
                      item.status,
                    ) && item.total_cost > 0;

                  return (
                    <div
                      key={item.id}
                      className="bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-6 hover:border-brand-accent/30 transition duration-300 flex flex-col justify-between group relative overflow-hidden"
                    >
                      {/* Glow Effect */}
                      <div className="absolute top-0 right-0 w-32 h-32 bg-brand-accent/5 rounded-full blur-[50px] -z-10 group-hover:bg-brand-accent/10 transition"></div>

                      {/* Header Kartu */}
                      <div>
                        <div className="flex justify-between items-start mb-4">
                          <div className="flex items-center gap-3">
                            <div className="p-2.5 bg-black/30 rounded-xl text-brand-accent border border-white/5">
                              <Smartphone size={20} />
                            </div>
                            <div>
                              <h3 className="font-bold text-white text-lg leading-tight">
                                {item.device_name}
                              </h3>
                              <span className="text-[10px] text-gray-500 font-mono">
                                #{item.id.slice(0, 8)}
                              </span>
                            </div>
                          </div>
                          {getStatusBadge(item.status)}
                        </div>

                        {/* Deskripsi & Teknisi */}
                        <div className="space-y-4 mb-6">
                          <div className="bg-black/20 p-3 rounded-xl border border-white/5">
                            <p className="text-xs text-gray-400 line-clamp-2">
                              {descClean}
                            </p>
                          </div>

                          {item.technician_name && (
                            <div className="flex items-center gap-3">
                              <div className="relative">
                                {getTechPhoto(item.technician_name) ? (
                                  <img
                                    src={getTechPhoto(item.technician_name)}
                                    className="w-10 h-10 rounded-full border border-brand-cyan object-cover shadow-lg"
                                    alt="Tech"
                                  />
                                ) : (
                                  <div className="w-10 h-10 bg-brand-cyan/20 rounded-full flex items-center justify-center text-brand-cyan border border-brand-cyan/30">
                                    <User size={18} />
                                  </div>
                                )}
                                <div className="absolute -bottom-1 -right-1 bg-brand-dark p-0.5 rounded-full border border-gray-700">
                                  <CheckCircle
                                    size={10}
                                    className="text-brand-cyan fill-brand-cyan text-brand-dark"
                                  />
                                </div>
                              </div>
                              <div>
                                <p className="text-[10px] text-gray-500 uppercase tracking-wider font-bold">
                                  Dikerjakan Oleh
                                </p>
                                {/* PERBAIKAN: Menampilkan Nama Lengkap */}
                                <p className="text-sm font-bold text-white leading-tight">
                                  {item.technician_name}
                                </p>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Footer: Harga & Aksi */}
                      <div className="border-t border-white/5 pt-4 mt-auto">
                        <div className="flex justify-between items-end mb-4">
                          <div>
                            <span className="text-[10px] text-gray-500 uppercase block mb-0.5">
                              Biaya Servis
                            </span>
                            <span className="text-xl font-bold text-white font-mono">
                              {item.total_cost > 0 ? (
                                formatRupiah(item.total_cost)
                              ) : (
                                <span className="text-gray-500 text-sm">
                                  Menunggu...
                                </span>
                              )}
                            </span>
                          </div>

                          {/* TOMBOL CETAK NOTA DENGAN TULISAN */}
                          {showPdf && (
                            <button
                              onClick={() => handleDownloadPDF(item)}
                              className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg text-sm font-bold text-gray-300 hover:text-white transition border border-white/5 shadow-md"
                            >
                              <FileDown size={16} /> Cetak Nota
                            </button>
                          )}
                        </div>

                        {/* Tombol Aksi Penting (Setuju / Batal) */}
                        {showConfirm && (
                          <div className="grid grid-cols-2 gap-3">
                            <button
                              onClick={() =>
                                handleAction(item.id, "Dibatalkan")
                              }
                              className="py-2 rounded-xl bg-red-500/10 text-red-400 border border-red-500/20 text-xs font-bold hover:bg-red-500 hover:text-white transition"
                            >
                              Batalkan
                            </button>
                            <button
                              onClick={() => handleAction(item.id, "Approved")}
                              className="py-2 rounded-xl bg-brand-accent text-white text-xs font-bold hover:bg-orange-600 transition shadow-lg shadow-orange-500/20"
                            >
                              Setuju & Lanjut
                            </button>
                          </div>
                        )}

                        {/* Alert jika butuh konfirmasi */}
                        {showConfirm && (
                          <div className="mt-3 flex items-center gap-2 text-[10px] text-brand-accent bg-brand-accent/5 p-2 rounded-lg border border-brand-accent/10">
                            <AlertCircle
                              size={12}
                              className="shrink-0 animate-pulse"
                            />{" "}
                            Konfirmasi biaya agar pengerjaan dimulai.
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
