import React, { useEffect, useState, useRef } from "react";
import { supabase } from "../../lib/supabaseClient";
import { Link, useNavigate } from "react-router-dom";
import html2pdf from "html2pdf.js"; // IMPORT LIBRARY PDF
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
  User, // Import icon User untuk Teknisi
} from "lucide-react";
import { NotaInvoice } from "../../components/NotaInvoice";

const UserDashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);
  const [services, setServices] = useState([]);

  // State untuk Data Nota yang akan di-download
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

      // Ambil Profil
      const { data: userProfile } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();
      setProfile(userProfile);

      // Ambil Data Servis
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
    await supabase.auth.signOut();
    localStorage.clear();
    navigate("/login");
  };

  // --- LOGIKA UPDATE STATUS (LANJUT / BATAL) ---
  const handleAction = async (id, action) => {
    const confirmMsg =
      action === "Working"
        ? "Setujui biaya ini dan lanjut ke proses perbaikan?"
        : "Yakin ingin membatalkan servis ini?";

    if (window.confirm(confirmMsg)) {
      try {
        // Optimistic Update (Biar UI berubah instan)
        setServices((prev) =>
          prev.map((item) =>
            item.id === id ? { ...item, status: action } : item,
          ),
        );

        // Update Database
        const { error } = await supabase
          .from("transactions")
          .update({ status: action })
          .eq("id", id);

        if (error) throw error;

        // Refresh data untuk memastikan
        setTimeout(getData, 500);
      } catch (error) {
        alert("Gagal update status: " + error.message);
        getData(); // Revert jika gagal
      }
    }
  };

  // --- FUNGSI DOWNLOAD PDF ---
  const handleDownloadPDF = async (item) => {
    // 1. Set data nota agar komponen NotaInvoice ter-render
    setNotaData(item);

    // Tunggu sebentar agar React selesai merender NotaInvoice di layar (walaupun tersembunyi)
    setTimeout(() => {
      const element = document.getElementById("nota-print-area");

      const opt = {
        margin: 0,
        filename: `Nota_Servis_#${item.id}.pdf`,
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
      };

      // Generate PDF
      html2pdf()
        .set(opt)
        .from(element)
        .save()
        .then(() => {
          // Setelah selesai download, kosongkan data nota
          setNotaData(null);
        });
    }, 500);
  };

  // Format Rupiah
  const formatRupiah = (number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(number);
  };

  // Badge Status (Disesuaikan Text-nya)
  const getStatusBadge = (status) => {
    switch (status) {
      case "Pending":
        return (
          <span className="bg-yellow-500/10 text-yellow-500 border border-yellow-500/20 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
            <Clock size={12} /> Menunggu
          </span>
        );
      case "Working":
        return (
          <span className="bg-blue-500/10 text-blue-500 border border-blue-500/20 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
            <Wrench size={12} /> Proses
          </span>
        ); // UBAH JADI PROSES
      case "Done":
        return (
          <span className="bg-green-500/10 text-green-500 border border-green-500/20 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
            <CheckCircle size={12} /> Selesai
          </span>
        );
      case "Cancelled":
        return (
          <span className="bg-red-500/10 text-red-500 border border-red-500/20 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
            <XCircle size={12} /> Batal
          </span>
        ); // UBAH JADI BATAL
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
      {/* --- AREA RENDER NOTA (OFF-SCREEN / TERSEMBUNYI) --- */}
      <div className="absolute -left-[9999px] top-0">
        <div id="nota-print-area">
          {notaData && <NotaInvoice data={notaData} />}
        </div>
      </div>

      <div className="container mx-auto max-w-5xl">
        {/* HEADER */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-4 bg-white/5 p-6 rounded-3xl border border-white/10">
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

        {/* LIST SERVIS */}
        {services.length === 0 ? (
          <div className="text-center py-20 bg-white/5 border border-white/10 border-dashed rounded-3xl">
            <Wrench size={48} className="mx-auto text-gray-600 mb-4" />
            <h3 className="text-xl font-bold text-gray-300">
              Belum ada riwayat servis
            </h3>
          </div>
        ) : (
          <div className="grid gap-4">
            {services.map((item) => {
              const match = item.problem_desc.match(/^\[(.*?)\]/);
              const category = match ? match[1] : "Umum";
              const descClean = item.problem_desc
                .replace(/^\[.*?\]/, "")
                .trim();

              const showConfirmButtons =
                item.total_cost > 0 && item.status === "Pending";

              const showPdfButton =
                (item.status === "Working" || item.status === "Done") &&
                item.total_cost > 0;

              return (
                <div
                  key={item.id}
                  className={`bg-white/5 backdrop-blur-md border p-6 rounded-2xl transition group relative overflow-hidden ${
                    showConfirmButtons
                      ? "border-brand-accent shadow-[0_0_15px_rgba(249,115,22,0.15)]"
                      : "border-white/10 hover:border-brand-accent/30"
                  }`}
                >
                  {showConfirmButtons && (
                    <div className="absolute top-0 left-0 w-1 h-full bg-brand-accent animate-pulse"></div>
                  )}

                  <div className="flex flex-col md:flex-row justify-between md:items-center gap-6">
                    <div className="flex-grow">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="font-mono text-xs text-gray-500">
                          #{item.id}
                        </span>
                        <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-white/10 text-brand-accent border border-brand-accent/20">
                          {category}
                        </span>
                        <span className="text-xs text-gray-400">
                          {new Date(item.created_at).toLocaleDateString(
                            "id-ID",
                          )}
                        </span>
                      </div>
                      <h3 className="text-lg font-bold text-white mb-1">
                        {item.device_name}
                      </h3>
                      <p className="text-sm text-gray-400 line-clamp-2 max-w-2xl">
                        {descClean}
                      </p>

                      {/* TAMPILKAN TEKNISI (FITUR BARU) */}
                      {item.technician_name && (
                        <div className="mt-3 inline-flex items-center gap-2 bg-brand-accent/5 px-3 py-1.5 rounded-lg border border-brand-accent/10">
                          <div className="bg-brand-accent/20 p-1 rounded-full">
                            <User size={12} className="text-brand-accent" />
                          </div>
                          <span className="text-xs text-gray-300">
                            Teknisi:{" "}
                            <span className="font-bold text-white">
                              {item.technician_name}
                            </span>
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="flex flex-col items-end gap-1 min-w-[140px]">
                      {getStatusBadge(item.status)}
                      <div className="mt-2 text-right">
                        <p className="text-[10px] text-gray-500 uppercase font-bold tracking-wider">
                          Biaya Servis
                        </p>
                        {item.total_cost > 0 ? (
                          <p className="text-xl font-extrabold text-brand-accent">
                            {formatRupiah(item.total_cost)}
                          </p>
                        ) : (
                          <p className="text-sm font-medium text-gray-400 italic">
                            Menunggu Cek
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* --- FOOTER TOMBOL --- */}
                  <div className="mt-6 pt-4 border-t border-white/10 flex flex-wrap gap-3 justify-end items-center">
                    {showConfirmButtons && (
                      <div className="flex-grow flex items-center gap-2 text-brand-accent text-sm font-bold bg-brand-accent/10 px-3 py-2 rounded-lg">
                        <AlertCircle size={16} className="animate-bounce" />
                        Mohon konfirmasi biaya servis.
                      </div>
                    )}

                    {showConfirmButtons && (
                      <>
                        <button
                          onClick={() => handleAction(item.id, "Cancelled")}
                          className="bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/20 px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 transition"
                        >
                          <XCircle size={16} /> Batal
                        </button>
                        <button
                          onClick={() => handleAction(item.id, "Working")}
                          className="bg-brand-accent hover:bg-orange-600 text-white px-6 py-2 rounded-lg text-sm font-bold flex items-center gap-2 transition shadow-lg"
                        >
                          <Check size={16} /> Lanjut (Proses)
                        </button>
                      </>
                    )}

                    {showPdfButton && (
                      <button
                        onClick={() => handleDownloadPDF(item)}
                        className="bg-white/10 hover:bg-white/20 text-white border border-white/10 px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 transition"
                      >
                        <FileDown size={16} /> Cetak Nota (PDF)
                      </button>
                    )}

                    {item.status === "Cancelled" && (
                      <span className="text-sm text-red-500 font-bold italic">
                        Pesanan telah dibatalkan.
                      </span>
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
