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
} from "lucide-react";
import { NotaInvoice } from "../../components/NotaInvoice";

// --- IMPORT FOTO TEKNISI (Sama seperti Admin) ---
// Sesuaikan path ../../assets jika perlu
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

  const handleLogout = async () => {
    const result = await Swal.fire({
      title: "Logout?",
      text: "Anda harus login lagi nanti.",
      icon: "question",
      showCancelButton: true,
      background: "#1e293b",
      color: "#fff",
      confirmButtonColor: "#ef4444",
      confirmButtonText: "Ya, Keluar",
    });
    if (result.isConfirmed) {
      await supabase.auth.signOut();
      localStorage.clear();
      navigate("/login");
    }
  };

  // --- LOGIKA SETUJU (Approved) / BATAL ---
  const handleAction = async (id, action) => {
    const confirmTitle =
      action === "Approved" ? "Setujui Biaya?" : "Batalkan Servis?";
    const confirmText =
      action === "Approved"
        ? "Teknisi akan segera memulai perbaikan setelah Anda menyetujui."
        : "Permintaan servis akan dibatalkan.";

    const result = await Swal.fire({
      title: confirmTitle,
      text: confirmText,
      icon: "warning",
      showCancelButton: true,
      background: "#1e293b",
      color: "#fff",
      confirmButtonColor: action === "Approved" ? "#f97316" : "#ef4444",
      confirmButtonText: action === "Approved" ? "Ya, Lanjut!" : "Ya, Batalkan",
    });

    if (result.isConfirmed) {
      try {
        setServices((prev) =>
          prev.map((item) =>
            item.id === id ? { ...item, status: action } : item,
          ),
        );
        const { error } = await supabase
          .from("transactions")
          .update({ status: action })
          .eq("id", id);
        if (error) throw error;

        Swal.fire({
          title: action === "Approved" ? "Disetujui!" : "Dibatalkan",
          text:
            action === "Approved"
              ? "Terima kasih. Teknisi kami akan segera memproses."
              : "Status servis telah diperbarui.",
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

  const getTechPhoto = (name) => {
    const tech = TECHNICIANS_DATA.find((t) => t.name === name);
    return tech ? tech.img : null;
  };

  const handleDownloadPDF = async (item) => {
    setNotaData(item);
    setTimeout(() => {
      const element = document.getElementById("nota-print-area");
      const opt = {
        margin: 0,
        filename: `Nota_Servis_#${item.id}.pdf`,
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

  const formatRupiah = (number) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(number);

  const getStatusBadge = (status) => {
    switch (status) {
      case "Pending":
        return (
          <span className="bg-yellow-500/10 text-yellow-500 border border-yellow-500/20 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
            <Clock size={12} /> Menunggu Cek
          </span>
        );
      case "Approved":
        return (
          <span className="bg-purple-500/10 text-purple-400 border border-purple-500/20 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
            <UserCheck size={12} /> Disetujui
          </span>
        );
      case "Working":
        return (
          <span className="bg-blue-500/10 text-blue-500 border border-blue-500/20 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
            <Wrench size={12} /> Sedang Dikerjakan
          </span>
        );
      case "Selesai":
        return (
          <span className="bg-green-500/10 text-green-500 border border-green-500/20 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
            <CheckCircle size={12} /> Selesai
          </span>
        );
      case "Dibatalkan":
        return (
          <span className="bg-red-500/10 text-red-500 border border-red-500/20 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
            <XCircle size={12} /> Batal
          </span>
        );
      default:
        return null;
    }
  };

  if (loading)
    return (
      <div className="min-h-screen bg-brand-black flex items-center justify-center text-white">
        Memuat Data...
      </div>
    );

  return (
    <div className="min-h-screen bg-brand-black text-white p-6 pb-20">
      <div className="absolute -left-[9999px] top-0">
        <div id="nota-print-area">
          {notaData && <NotaInvoice data={notaData} />}
        </div>
      </div>

      <div className="container mx-auto max-w-5xl">
        <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-4 bg-white/5 p-6 rounded-3xl border border-white/10 shadow-xl">
          <div>
            <h1 className="text-2xl font-bold">Dashboard Pelanggan</h1>
            <p className="text-gray-400 text-sm mt-1">
              Halo,{" "}
              <span className="text-brand-accent font-bold">
                {profile?.full_name}
              </span>
              !
            </p>
          </div>
          <div className="flex gap-3">
            <Link
              to="/daftar-perbaikan"
              className="bg-brand-accent hover:bg-orange-600 text-white px-5 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 transition shadow-lg"
            >
              <Plus size={18} /> Ajukan Servis
            </Link>
            <button
              onClick={handleLogout}
              className="bg-white/10 hover:bg-white/20 border border-white/10 text-white px-5 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 transition"
            >
              <LogOut size={18} /> Logout
            </button>
          </div>
        </div>

        {services.length === 0 ? (
          <div className="text-center py-20 bg-white/5 border border-white/10 border-dashed rounded-3xl">
            <Wrench size={48} className="mx-auto text-gray-600 mb-4" />
            <h3 className="text-xl font-bold text-gray-300">
              Belum ada riwayat servis
            </h3>
          </div>
        ) : (
          <div className="grid gap-6">
            {services.map((item) => {
              const descClean = item.problem_desc
                ?.replace(/^\[.*?\]/, "")
                .trim();

              // LOGIKA TOMBOL USER:
              // User bisa 'Approved' jika status 'Pending' DAN Admin sudah input harga (> 0)
              const showConfirmButtons =
                item.total_cost > 0 && item.status === "Pending";

              const showPdfButton =
                (item.status === "Working" ||
                  item.status === "Selesai" ||
                  item.status === "Approved") &&
                item.total_cost > 0;

              return (
                <div
                  key={item.id}
                  className={`bg-white/5 backdrop-blur-md border p-6 rounded-2xl transition group relative overflow-hidden ${showConfirmButtons ? "border-brand-accent shadow-[0_0_20px_rgba(249,115,22,0.15)]" : "border-white/10 hover:border-brand-accent/30"}`}
                >
                  {showConfirmButtons && (
                    <div className="absolute top-0 left-0 w-1 h-full bg-brand-accent animate-pulse"></div>
                  )}

                  <div className="flex flex-col md:flex-row justify-between gap-6">
                    <div className="flex-grow">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="font-mono text-xs text-gray-500">
                          #{item.id.slice(0, 8)}
                        </span>
                        <span className="text-xs text-gray-400">
                          {new Date(item.created_at).toLocaleDateString(
                            "id-ID",
                          )}
                        </span>
                      </div>
                      <h3 className="text-xl font-bold text-white mb-2">
                        {item.device_name}
                      </h3>
                      <p className="text-sm text-gray-400 line-clamp-2 bg-black/20 p-3 rounded-lg border border-white/5 mb-4">
                        {descClean}
                      </p>

                      {/* --- INFO TEKNISI (DENGAN FOTO) --- */}
                      {item.technician_name && (
                        <div className="inline-flex items-center gap-3 bg-brand-accent/5 px-4 py-2 rounded-xl border border-brand-accent/10">
                          {getTechPhoto(item.technician_name) ? (
                            <img
                              src={getTechPhoto(item.technician_name)}
                              className="w-8 h-8 rounded-full border border-brand-accent object-cover"
                            />
                          ) : (
                            <div className="bg-brand-accent/20 p-2 rounded-full">
                              <User size={14} className="text-brand-accent" />
                            </div>
                          )}
                          <div>
                            <span className="text-[10px] text-gray-400 block uppercase tracking-wider font-bold">
                              Teknisi Anda
                            </span>
                            <span className="text-sm font-bold text-white">
                              {item.technician_name.split(" ")[0]}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="flex flex-col items-end justify-between min-w-[160px]">
                      {getStatusBadge(item.status)}
                      <div className="mt-4 text-right">
                        <p className="text-[10px] text-gray-500 uppercase font-bold tracking-wider mb-1">
                          Total Biaya
                        </p>
                        {item.total_cost > 0 ? (
                          <p className="text-2xl font-extrabold text-brand-cyan">
                            {formatRupiah(item.total_cost)}
                          </p>
                        ) : (
                          <p className="text-sm font-medium text-gray-400 italic">
                            Menunggu Cek Teknisi
                          </p>
                        )}
                        <p className="text-[10px] text-gray-500 mt-1 uppercase">
                          {item.payment_type || "Cash"}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t border-white/10 flex flex-wrap gap-3 justify-end items-center">
                    {showConfirmButtons && (
                      <div className="flex-grow hidden md:flex items-center gap-2 text-brand-accent text-sm font-bold bg-brand-accent/10 px-3 py-2 rounded-lg border border-brand-accent/20">
                        <AlertCircle size={16} className="animate-bounce" />
                        Mohon konfirmasi biaya agar perbaikan dapat dimulai.
                      </div>
                    )}

                    {showConfirmButtons && (
                      <>
                        <button
                          onClick={() => handleAction(item.id, "Dibatalkan")}
                          className="bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/20 px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 transition"
                        >
                          <XCircle size={16} /> Batal
                        </button>
                        <button
                          onClick={() => handleAction(item.id, "Approved")}
                          className="bg-gradient-to-r from-brand-accent to-orange-600 hover:to-orange-700 text-white px-6 py-2 rounded-xl text-sm font-bold flex items-center gap-2 transition shadow-lg transform active:scale-95"
                        >
                          <Check size={16} /> Setuju & Lanjut
                        </button>
                      </>
                    )}

                    {showPdfButton && (
                      <button
                        onClick={() => handleDownloadPDF(item)}
                        className="bg-white/5 hover:bg-white/10 text-white border border-white/10 px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 transition"
                      >
                        <FileDown size={16} /> Invoice
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserDashboard;
