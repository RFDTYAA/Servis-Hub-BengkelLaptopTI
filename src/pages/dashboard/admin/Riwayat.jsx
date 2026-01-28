import React, { useState, useEffect } from "react";
import { supabase } from "../../../lib/supabaseClient";
import {
  Search,
  Trash2,
  CheckCircle,
  XCircle,
  FileText,
  User,
  Smartphone,
  Loader2,
  AlertTriangle,
} from "lucide-react";
import Swal from "sweetalert2";

// --- IMPORT FOTO TEKNISI ---
import fotoridho from "../../../assets/fotoprofile/ridho.png";
import fotorafi from "../../../assets/fotoprofile/rafi.png";
import fotodamtoy from "../../../assets/fotoprofile/damtoy.png";
import fotoadjie from "../../../assets/fotoprofile/adjie.png";
import fotofarrel from "../../../assets/fotoprofile/farrel.jpg";
import fotowildan from "../../../assets/fotoprofile/wildan.jpg";
import fotoraja from "../../../assets/fotoprofile/raja.jpg";
import fotojauhan from "../../../assets/fotoprofile/jauhan.png";

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

const AdminRiwayat = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  // --- 1. FETCH DATA (FILTER STATUS LENGKAP) ---
  const fetchHistory = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("transactions")
        .select(`*, profiles:user_id (full_name, email)`)
        // PERBAIKAN: Memasukkan status Indo & Inggris agar semua data muncul
        .in("status", ["Selesai", "Dibatalkan", "Done", "Cancelled"])
        .order("created_at", { ascending: false });

      if (error) throw error;
      setHistory(data);
    } catch (error) {
      console.error("Error fetching history:", error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  // --- 2. HAPUS PERMANEN ---
  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Hapus Permanen?",
      text: "Data arsip ini akan dihapus selamanya dari database.",
      icon: "warning",
      showCancelButton: true,
      background: "#1e293b",
      color: "#fff",
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#334155",
      confirmButtonText: "Hapus Permanen",
    });

    if (result.isConfirmed) {
      const { error } = await supabase
        .from("transactions")
        .delete()
        .eq("id", id);
      if (error) {
        Swal.fire("Gagal", error.message, "error");
      } else {
        Swal.fire({
          title: "Terhapus!",
          icon: "success",
          background: "#1e293b",
          color: "#fff",
          showConfirmButton: false,
          timer: 1500,
        });
        fetchHistory();
      }
    }
  };

  // Helper Foto Teknisi
  const getTechPhoto = (name) => {
    const tech = TECHNICIANS_DATA.find((t) => t.name === name);
    return tech ? tech.img : null;
  };

  // Helper Warna & Ikon Status
  const renderStatusBadge = (status) => {
    const isDone = status === "Selesai" || status === "Done";
    const isCancelled = status === "Dibatalkan" || status === "Cancelled";

    return (
      <span
        className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wide border flex items-center w-fit gap-1 ${
          isDone
            ? "bg-green-500/10 text-green-500 border-green-500/20"
            : "bg-red-500/10 text-red-500 border-red-500/20"
        }`}
      >
        {isDone ? <CheckCircle size={10} /> : <XCircle size={10} />}
        {isDone ? "Selesai" : "Dibatalkan"}
      </span>
    );
  };

  const filteredData = history.filter(
    (item) =>
      item.profiles?.full_name
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      item.device_name?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="p-6 min-h-screen bg-brand-black text-white">
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-1 flex items-center gap-2 text-white">
            <FileText className="text-gray-400" /> Riwayat & Arsip
          </h1>
          <p className="text-gray-400">
            Data perbaikan yang telah selesai atau dibatalkan.
          </p>
        </div>
        <div className="relative w-full md:w-72">
          <Search className="absolute left-3 top-3 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Cari ID, Nama, Device..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-brand-dark border border-white/10 rounded-full py-2.5 pl-10 pr-4 text-sm focus:outline-none focus:border-white/30 transition shadow-lg"
          />
        </div>
      </div>

      <div className="bg-brand-dark border border-white/10 rounded-xl overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white/5 text-gray-400 text-xs font-bold uppercase tracking-wider border-b border-white/10">
                <th className="p-4">ID & Tgl</th>
                <th className="p-4">Pelanggan</th>
                <th className="p-4">Perangkat</th>
                <th className="p-4">Teknisi</th>
                <th className="p-4">Biaya Akhir</th>
                <th className="p-4">Status Akhir</th>
                <th className="p-4 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {loading ? (
                <tr>
                  <td colSpan="7" className="p-8 text-center animate-pulse">
                    <Loader2 className="animate-spin inline mr-2" /> Memuat
                    arsip...
                  </td>
                </tr>
              ) : filteredData.length === 0 ? (
                <tr>
                  <td colSpan="7" className="p-8 text-center text-gray-500">
                    Belum ada riwayat selesai/batal.
                  </td>
                </tr>
              ) : (
                filteredData.map((item) => (
                  <tr
                    key={item.id}
                    className="hover:bg-white/5 transition-colors duration-200 group"
                  >
                    {/* ID & TANGGAL */}
                    <td className="p-4 align-top">
                      <span className="font-mono text-gray-300 font-bold">
                        #{item.id.slice(0, 6)}
                      </span>
                      <div className="text-xs text-gray-600 mt-1">
                        {new Date(item.created_at).toLocaleDateString("id-ID")}
                      </div>
                    </td>

                    {/* PELANGGAN */}
                    <td className="p-4 align-top">
                      <div className="font-bold text-gray-300 text-sm">
                        {item.profiles?.full_name}
                      </div>
                      <div className="text-[10px] text-gray-600">
                        {item.profiles?.email}
                      </div>
                    </td>

                    {/* PERANGKAT */}
                    <td className="p-4 align-top max-w-[180px]">
                      <div className="font-medium text-gray-300 text-sm flex items-center gap-1">
                        <Smartphone size={14} className="text-gray-500" />{" "}
                        {item.device_name}
                      </div>
                      <div
                        className="text-[10px] text-gray-600 mt-1 truncate"
                        title={item.problem_desc}
                      >
                        {item.problem_desc?.replace(/^\[.*?\]/, "")}
                      </div>
                    </td>

                    {/* TEKNISI */}
                    <td className="p-4 align-top">
                      {item.technician_name ? (
                        <div className="flex items-center gap-2 opacity-70 grayscale group-hover:grayscale-0 transition">
                          <img
                            src={getTechPhoto(item.technician_name)}
                            alt="Tech"
                            className="w-6 h-6 rounded-full border border-gray-600 object-cover"
                          />
                          <span className="text-xs font-bold text-gray-400">
                            {item.technician_name.split(" ")[0]}
                          </span>
                        </div>
                      ) : (
                        <span className="text-xs text-gray-600 italic">-</span>
                      )}
                    </td>

                    {/* BIAYA */}
                    <td className="p-4 align-top font-mono text-sm opacity-80">
                      <span
                        className={
                          item.status === "Dibatalkan" ||
                          item.status === "Cancelled"
                            ? "text-gray-500 line-through"
                            : "text-green-400 font-bold"
                        }
                      >
                        Rp {item.total_cost.toLocaleString("id-ID")}
                      </span>
                      <div className="text-[10px] text-gray-600 mt-0.5 uppercase border border-white/5 px-1 rounded w-fit">
                        {item.payment_type || "Cash"}
                      </div>
                    </td>

                    {/* STATUS */}
                    <td className="p-4 align-top">
                      {renderStatusBadge(item.status)}
                    </td>

                    {/* AKSI */}
                    <td className="p-4 align-top text-center">
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="p-1.5 bg-white/5 text-gray-500 rounded-lg hover:bg-red-500 hover:text-white transition group-hover:opacity-100 opacity-50 shadow-md"
                        title="Hapus Permanen"
                      >
                        <Trash2 size={14} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminRiwayat;
