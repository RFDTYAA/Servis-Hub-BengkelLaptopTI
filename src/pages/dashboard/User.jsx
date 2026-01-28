import React, { useEffect, useState } from "react";
import { supabase } from "../../lib/supabaseClient";
import { Link, useNavigate } from "react-router-dom";
import html2pdf from "html2pdf.js";
import Swal from "sweetalert2";
import {
  CheckCircle,
  AlertCircle,
  Plus,
  LogOut,
  FileDown,
  User,
  LayoutDashboard,
  Smartphone,
  History,
  Clock,
  Wrench,
  XCircle,
  Loader2,
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

  // --- WA NOTIFIKASI ---
  const sendWANotificationToAdmin = (item, action) => {
    const adminPhone = "6282125548653";
    const statusText =
      action === "Working"
        ? "MENYETUJUI (SIAP DIKERJAKAN) ✅"
        : "MEMBATALKAN ❌";

    const message = `Halo Admin Bengkel TI,
    
Saya *${profile?.full_name}* ingin konfirmasi bahwa saya telah *${statusText}* servis berikut:

📱 Perangkat: ${item.device_name}
🆔 ID: ${item.id.slice(0, 8)}
💰 Biaya: Rp ${parseInt(item.total_cost).toLocaleString("id-ID")}

Mohon diproses. Terima kasih.`;

    const url = `https://wa.me/${adminPhone}?text=${encodeURIComponent(message)}`;
    window.open(url, "_blank");
  };

  // --- ACTION HANDLER (PERBAIKAN LOGIKA SAVE) ---
  const handleAction = async (id, action, item) => {
    const isWorking = action === "Working";

    // 1. Konfirmasi User
    const result = await Swal.fire({
      title: isWorking ? "Setujui Biaya?" : "Batalkan Servis?",
      text: isWorking
        ? `Biaya Rp ${parseInt(item.total_cost).toLocaleString("id-ID")} disetujui. Teknisi akan langsung mengerjakan.`
        : "Yakin membatalkan? Proses tidak bisa dikembalikan.",
      icon: isWorking ? "question" : "warning",
      showCancelButton: true,
      background: "#1e293b",
      color: "#fff",
      confirmButtonColor: isWorking ? "#22c55e" : "#ef4444",
      confirmButtonText: isWorking ? "Ya, Kerjakan!" : "Ya, Batalkan",
      showLoaderOnConfirm: true, // Tampilkan loading saat proses database
      preConfirm: async () => {
        // 2. PROSES DATABASE DI DALAM PRE-CONFIRM (Agar User Menunggu)
        try {
          const { error } = await supabase
            .from("transactions")
            .update({ status: action })
            .eq("id", id);

          if (error) throw error;
          return true;
        } catch (error) {
          Swal.showValidationMessage(`Gagal menyimpan: ${error.message}`);
        }
      },
    });

    // 3. JIKA SUKSES
    if (result.isConfirmed) {
      setServices((prev) =>
        prev.map((it) => (it.id === id ? { ...it, status: action } : it)),
      );

      // Tawarkan WA (Opsional)
      if (isWorking) {
        Swal.fire({
          title: "Sedang Dikerjakan!",
          text: "Status berhasil disimpan. Ingin kabari admin via WA biar lebih cepat?",
          icon: "success",
          showCancelButton: true,
          background: "#1e293b",
          color: "#fff",
          confirmButtonColor: "#25D366",
          cancelButtonColor: "#334155",
          confirmButtonText: "Chat WA",
          cancelButtonText: "Tutup",
        }).then((res) => {
          if (res.isConfirmed) sendWANotificationToAdmin(item, action);
        });
      } else {
        Swal.fire({
          title: "Dibatalkan",
          text: "Servis telah dibatalkan.",
          icon: "error",
          background: "#1e293b",
          color: "#fff",
          timer: 1500,
          showConfirmButton: false,
        });
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
      Working: "bg-blue-500/10 text-blue-400 border-blue-500/20",
      Selesai: "bg-green-500/10 text-green-500 border-green-500/20",
      Dibatalkan: "bg-red-500/10 text-red-500 border-red-500/20",
    };

    let label = status;
    let icon = <Clock size={10} />;

    if (status === "Pending") {
      label = "Menunggu Cek";
      icon = <Clock size={10} />;
    }
    if (status === "Working") {
      label = "Sedang Dikerjakan";
      icon = <Wrench size={10} className="animate-spin-slow" />;
    }
    if (status === "Selesai" || status === "Done") {
      label = "Selesai";
      icon = <CheckCircle size={10} />;
    }
    if (status === "Dibatalkan" || status === "Cancelled") {
      label = "Dibatalkan";
      icon = <XCircle size={10} />;
    }

    return (
      <span
        className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border flex items-center gap-1.5 ${styles[status] || styles.Pending}`}
      >
        {icon} {label}
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
          {/* SIDEBAR */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 text-center shadow-2xl">
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
                    Total
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

            <Link
              to="/daftar-perbaikan"
              className="block w-full bg-gradient-to-r from-brand-accent to-orange-600 rounded-3xl shadow-xl p-6 text-center hover:-translate-y-1 transition duration-300 group"
            >
              <div className="bg-white/20 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition">
                <Plus size={24} className="text-white" />
              </div>
              <h3 className="text-lg font-bold text-white">Ajukan Servis</h3>
              <p className="text-xs text-white/80">Buat pesanan baru disini</p>
            </Link>
          </div>

          {/* MAIN CONTENT */}
          <div className="lg:col-span-3">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold flex items-center gap-2">
                <History className="text-brand-accent" /> Riwayat Perbaikan
              </h2>
            </div>

            {services.length === 0 ? (
              <div className="bg-white/5 border border-white/10 border-dashed rounded-3xl p-12 text-center">
                <LayoutDashboard
                  size={48}
                  className="mx-auto text-gray-500 mb-4"
                />
                <h3 className="text-lg font-bold text-gray-300 mb-2">
                  Belum Ada Riwayat
                </h3>
                <Link
                  to="/daftar-perbaikan"
                  className="text-brand-accent hover:text-white font-bold text-sm"
                >
                  Buat Pesanan Baru &rarr;
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {services.map((item) => {
                  const descClean = item.problem_desc
                    ?.replace(/^\[.*?\]/, "")
                    .trim();

                  // LOGIKA TAMPIL TOMBOL:
                  const showConfirm =
                    item.total_cost > 0 && item.status === "Pending";
                  const showPdf =
                    ["Working", "Selesai", "Done"].includes(item.status) &&
                    item.total_cost > 0;

                  return (
                    <div
                      key={item.id}
                      className="bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-6 hover:border-brand-accent/30 transition duration-300 flex flex-col justify-between"
                    >
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
                                    className="w-10 h-10 rounded-full border border-brand-cyan object-cover"
                                    alt="Tech"
                                  />
                                ) : (
                                  <div className="w-10 h-10 bg-brand-cyan/20 rounded-full flex items-center justify-center text-brand-cyan">
                                    <User size={18} />
                                  </div>
                                )}
                              </div>
                              <div>
                                <p className="text-[10px] text-gray-500 uppercase font-bold">
                                  Teknisi
                                </p>
                                <p className="text-sm font-bold text-white">
                                  {item.technician_name.split(" ")[0]}
                                </p>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="border-t border-white/5 pt-4 mt-auto">
                        <div className="flex justify-between items-end mb-4">
                          <div>
                            <span className="text-[10px] text-gray-500 uppercase block mb-0.5">
                              Estimasi Biaya
                            </span>
                            <span className="text-xl font-bold text-white font-mono">
                              {item.total_cost > 0 ? (
                                formatRupiah(item.total_cost)
                              ) : (
                                <span className="text-gray-500 text-sm">
                                  Menunggu Cek...
                                </span>
                              )}
                            </span>
                          </div>

                          {showPdf && (
                            <button
                              onClick={() => handleDownloadPDF(item)}
                              className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg text-xs font-bold text-gray-300 hover:text-white transition border border-white/5"
                            >
                              <FileDown size={14} /> Cetak Nota
                            </button>
                          )}
                        </div>

                        {showConfirm && (
                          <div className="space-y-3">
                            <div className="grid grid-cols-2 gap-3">
                              <button
                                onClick={() =>
                                  handleAction(item.id, "Dibatalkan", item)
                                }
                                className="py-2.5 rounded-xl bg-red-500/10 text-red-400 border border-red-500/20 text-xs font-bold hover:bg-red-500 hover:text-white transition"
                              >
                                Batalkan
                              </button>
                              <button
                                onClick={() =>
                                  handleAction(item.id, "Working", item)
                                }
                                className="py-2.5 rounded-xl bg-brand-accent text-white text-xs font-bold hover:bg-orange-600 transition shadow-lg shadow-orange-500/20"
                              >
                                Setuju & Kerjakan
                              </button>
                            </div>
                            <div className="flex items-center gap-2 text-[10px] text-brand-accent bg-brand-accent/5 p-2 rounded-lg border border-brand-accent/10">
                              <AlertCircle
                                size={12}
                                className="shrink-0 animate-pulse"
                              />
                              Konfirmasi diperlukan agar teknisi mulai bekerja.
                            </div>
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
