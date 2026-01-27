import React, { useState, useEffect } from "react";
import { supabase } from "../lib/supabaseClient";
import { useNavigate, Link } from "react-router-dom";
import {
  CheckCircle2,
  Clock,
  UserCog,
  Wrench,
  DollarSign,
  FileSearch,
  Smartphone,
  XCircle,
  LayoutDashboard,
  Plus,
  ArrowRight,
  Loader2,
  Calendar,
  CreditCard,
  MessageSquare, // Icon WA
} from "lucide-react";

// --- IMPORT FOTO TEKNISI ---
import fotoridho from "../assets/fotoprofile/ridho.png";
import fotorafi from "../assets/fotoprofile/rafi.png";
import fotodamtoy from "../assets/fotoprofile/damtoy.png";
import fotoadjie from "../assets/fotoprofile/adjie.png";
import fotofarrel from "../assets/fotoprofile/farrel.jpg";
import fotowildan from "../assets/fotoprofile/wildan.jpg";
import fotoraja from "../assets/fotoprofile/raja.jpg";
import fotojauhan from "../assets/fotoprofile/jauhan.png";

const TECHNICIANS_DATA = [
  { name: "Mohammad Ridho Cahyono", img: fotoridho },
  { name: "Muhammad Rafi Aditya", img: fotorafi },
  { name: "Adam Toyib Nurwahid", img: fotodamtoy },
  { name: "Muhammad Setya Adjie", img: fotoadjie },
  { name: "Farrel Ghozy Afifuddin", img: fotofarrel },
  { name: "Muhammad Wildan", img: fotowildan },
  { name: "Raja Muhammad", img: fotoraja },
  { name: "Jauhan Ahmad", img: fotojauhan },
];

const CekStatus = () => {
  const navigate = useNavigate();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserTransactions = async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (!user) {
          navigate("/login");
          return;
        }

        const { data, error } = await supabase
          .from("transactions")
          .select(`*, profiles:user_id(full_name)`)
          .eq("user_id", user.id)
          .order("created_at", { ascending: false });

        if (error) throw error;
        setTransactions(data || []);
      } catch (err) {
        console.error("Gagal memuat data:", err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchUserTransactions();
  }, [navigate]);

  const getProgressSteps = (item) => {
    const steps = [
      {
        id: 1,
        title: "Pengajuan",
        desc: "Data diterima",
        icon: FileSearch,
        active: true,
      },
      {
        id: 2,
        title: "Pemeriksaan",
        desc: item.total_cost > 0 ? "Biaya dikonfirmasi" : "Cek kerusakan",
        icon: DollarSign,
        active: item.total_cost > 0,
      },
      {
        id: 3,
        title: "Persetujuan",
        desc: ["Approved", "Working", "Selesai", "Done"].includes(item.status)
          ? "Disetujui"
          : "Menunggu Anda",
        icon: Smartphone,
        active: ["Approved", "Working", "Selesai", "Done"].includes(
          item.status,
        ),
      },
      {
        id: 4,
        title: "Pengerjaan",
        desc: "Sedang diperbaiki",
        icon: Wrench,
        active: ["Working", "Selesai", "Done"].includes(item.status),
      },
      {
        id: 5,
        title: "Selesai",
        desc: "Siap diambil",
        icon: CheckCircle2,
        active: ["Selesai", "Done"].includes(item.status),
      },
    ];
    return steps;
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

  // --- LOGIC PESAN WA OTOMATIS ---
  const handleContactAdmin = (item) => {
    const phoneNumber = "6282125548653"; // Ganti Nomor Admin
    const message = `Halo Admin Bengkel TI, saya ingin menanyakan status perbaikan untuk perangkat:
    
📱 *${item.device_name}*
🆔 ID Servis: ${item.id.slice(0, 8)}
    
Mohon informasinya. Terima kasih!`;

    const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(url, "_blank");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-brand-black flex flex-col items-center justify-center text-white">
        <Loader2 size={48} className="text-brand-accent animate-spin mb-4" />
        <p className="text-gray-400 font-mono animate-pulse">Memuat Data...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-brand-black text-white p-6 pb-24 relative overflow-hidden">
      <div className="fixed top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-brand-accent/10 via-brand-black to-brand-black pointer-events-none -z-10"></div>

      <div className="container mx-auto max-w-7xl relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-end mb-10 pb-6 border-b border-white/10 gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-extrabold mb-2">
              Status <span className="text-brand-accent">Perbaikan</span>
            </h1>
            <p className="text-gray-400">
              Pantau progres pengerjaan perangkat Anda secara realtime.
            </p>
          </div>
          <Link
            to="/daftar-perbaikan"
            className="bg-white/5 hover:bg-brand-accent border border-white/10 text-white px-6 py-3 rounded-full font-bold transition flex items-center gap-2 group"
          >
            <Plus size={18} className="group-hover:rotate-90 transition" />{" "}
            Servis Baru
          </Link>
        </div>

        {transactions.length === 0 ? (
          <div className="bg-white/5 border border-white/10 border-dashed rounded-3xl p-16 text-center max-w-2xl mx-auto">
            <LayoutDashboard size={48} className="mx-auto text-gray-600 mb-4" />
            <h3 className="text-xl font-bold text-gray-300 mb-2">
              Belum Ada Riwayat
            </h3>
            <p className="text-gray-500">
              Anda belum mengajukan perbaikan apapun.
            </p>
          </div>
        ) : (
          <div className="grid gap-8">
            {transactions.map((item) => {
              const isCancelled =
                item.status === "Dibatalkan" || item.status === "Cancelled";
              const isDone =
                item.status === "Selesai" || item.status === "Done";
              const steps = getProgressSteps(item);

              return (
                <div
                  key={item.id}
                  className="bg-brand-dark/60 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden shadow-2xl hover:border-brand-accent/30 transition duration-500 group"
                >
                  <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[300px]">
                    {/* BAGIAN KIRI */}
                    <div className="lg:col-span-5 p-8 border-b lg:border-b-0 lg:border-r border-white/5 flex flex-col justify-between bg-white/[0.02]">
                      <div>
                        <div className="mb-6">
                          {isCancelled ? (
                            <span className="inline-flex items-center gap-2 px-4 py-2 bg-red-500/10 text-red-500 border border-red-500/20 rounded-xl font-bold text-sm tracking-wider uppercase">
                              <XCircle size={18} /> Dibatalkan
                            </span>
                          ) : isDone ? (
                            <span className="inline-flex items-center gap-2 px-4 py-2 bg-green-500/10 text-green-500 border border-green-500/20 rounded-xl font-bold text-sm tracking-wider uppercase shadow-[0_0_15px_rgba(34,197,94,0.3)]">
                              <CheckCircle2 size={18} /> Selesai
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-xl font-bold text-sm tracking-wider uppercase animate-pulse">
                              <Clock size={18} /> Sedang Diproses
                            </span>
                          )}
                        </div>

                        <h2 className="text-3xl font-bold text-white mb-2 leading-tight">
                          {item.device_name}
                        </h2>
                        <div className="flex items-center gap-4 text-sm text-gray-400 mb-6">
                          <span className="bg-white/10 px-2 py-1 rounded text-xs font-mono">
                            ID: {item.id.slice(0, 8)}
                          </span>
                          <span className="flex items-center gap-1">
                            <Calendar size={14} />{" "}
                            {new Date(item.created_at).toLocaleDateString(
                              "id-ID",
                            )}
                          </span>
                        </div>

                        <div className="bg-black/30 p-5 rounded-2xl border border-white/5 mb-6">
                          <p className="text-xs text-gray-500 uppercase tracking-wider font-bold mb-1">
                            Total Biaya
                          </p>
                          <div className="flex justify-between items-end">
                            <p className="text-2xl font-mono font-bold text-brand-cyan">
                              {item.total_cost > 0
                                ? formatRupiah(item.total_cost)
                                : "Menunggu"}
                            </p>
                            <span className="text-xs flex items-center gap-1 text-gray-400 border border-white/10 px-2 py-1 rounded bg-white/5">
                              <CreditCard size={12} />{" "}
                              {item.payment_type || "Cash"}
                            </span>
                          </div>
                        </div>
                      </div>

                      {item.technician_name ? (
                        <div className="flex items-center gap-4 pt-4 border-t border-white/5">
                          <div className="relative">
                            {getTechPhoto(item.technician_name) ? (
                              <img
                                src={getTechPhoto(item.technician_name)}
                                className="w-12 h-12 rounded-full border-2 border-brand-accent object-cover shadow-lg"
                                alt="Tech"
                              />
                            ) : (
                              <div className="w-12 h-12 bg-brand-accent/20 rounded-full flex items-center justify-center text-brand-accent">
                                <UserCog size={24} />
                              </div>
                            )}
                            <div className="absolute -bottom-1 -right-1 bg-brand-dark p-0.5 rounded-full border border-gray-700">
                              <CheckCircle2
                                size={12}
                                className="text-brand-cyan fill-brand-cyan text-brand-dark"
                              />
                            </div>
                          </div>
                          <div>
                            <p className="text-[10px] text-gray-500 uppercase tracking-wider font-bold">
                              Ditangani Oleh
                            </p>
                            <p className="text-base font-bold text-white">
                              {item.technician_name}
                            </p>
                          </div>
                        </div>
                      ) : (
                        <div className="pt-4 border-t border-white/5 text-gray-500 text-sm flex items-center gap-2">
                          <UserCog size={16} /> Menunggu penetapan teknisi...
                        </div>
                      )}
                    </div>

                    {/* BAGIAN KANAN: TIMELINE */}
                    <div className="lg:col-span-7 p-8 relative flex flex-col justify-between">
                      {isCancelled ? (
                        <div className="h-full flex flex-col items-center justify-center text-center opacity-50 my-auto">
                          <XCircle size={64} className="text-red-500 mb-4" />
                          <h3 className="text-2xl font-bold text-white">
                            Transaksi Dibatalkan
                          </h3>
                          <p className="text-gray-400">Proses dihentikan.</p>
                        </div>
                      ) : (
                        <div className="h-full flex flex-col justify-center my-auto">
                          <div className="hidden lg:block absolute top-1/2 left-8 right-8 h-1 bg-white/5 -translate-y-1/2 z-0"></div>
                          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 lg:gap-2 relative z-10">
                            {steps.map((step) => (
                              <div
                                key={step.id}
                                className="flex lg:flex-col items-center gap-4 lg:gap-0 lg:text-center group/step"
                              >
                                <div
                                  className={`w-12 h-12 rounded-full border-4 flex items-center justify-center transition-all duration-500 shrink-0 lg:mb-4 bg-brand-dark ${
                                    step.active
                                      ? "border-brand-accent text-brand-accent shadow-[0_0_20px_rgba(249,115,22,0.4)] scale-110"
                                      : "border-white/10 text-gray-600"
                                  }`}
                                >
                                  <step.icon size={20} />
                                </div>
                                <div className="text-left lg:text-center">
                                  <h4
                                    className={`font-bold text-sm lg:text-base ${step.active ? "text-white" : "text-gray-500"}`}
                                  >
                                    {step.title}
                                  </h4>
                                  <p className="text-xs text-gray-500 hidden lg:block mt-1">
                                    {step.desc}
                                  </p>
                                  <p className="text-xs text-gray-500 lg:hidden">
                                    {step.desc}
                                  </p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Footer Timeline: Tombol WA */}
                      <div className="mt-8 pt-6 border-t border-white/5 flex justify-end">
                        <button
                          onClick={() => handleContactAdmin(item)}
                          className="flex items-center gap-2 text-sm font-bold text-brand-accent hover:text-white transition bg-brand-accent/10 hover:bg-brand-accent px-4 py-2 rounded-lg border border-brand-accent/20"
                        >
                          <MessageSquare size={16} /> Hubungi Admin via WA
                        </button>
                      </div>
                    </div>
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

export default CekStatus;
