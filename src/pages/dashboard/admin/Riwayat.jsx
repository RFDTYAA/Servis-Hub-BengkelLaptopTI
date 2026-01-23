import React, { useEffect, useState } from "react";
import { supabase } from "../../../lib/supabaseClient";
import {
  Search,
  CheckCircle,
  XCircle,
  ChevronDown,
  User,
  Calendar,
} from "lucide-react";

const AdminRiwayat = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  // 1. FETCH HANYA TRANSAKSI SELESAI (Done & Cancelled)
  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("transactions")
        .select(`*, profiles:user_id ( full_name, email, avatar_url )`)
        .in("status", ["Done", "Cancelled"]) // <--- FILTER KUNCI
        .order("created_at", { ascending: false });

      if (error) throw error;
      setTransactions(data);
    } catch (error) {
      alert("Gagal mengambil data: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  // 2. KEMBALIKAN STATUS (Jika salah pencet selesai)
  const handleStatusChange = async (id, newStatus) => {
    try {
      // Jika diubah jadi Pending/Working, buang dari halaman Riwayat
      if (newStatus === "Pending" || newStatus === "Working") {
        setTransactions((prev) => prev.filter((item) => item.id !== id));
      } else {
        setTransactions((prev) =>
          prev.map((item) =>
            item.id === id ? { ...item, status: newStatus } : item
          )
        );
      }

      await supabase
        .from("transactions")
        .update({ status: newStatus })
        .eq("id", id);
    } catch (error) {
      alert("Gagal update status!");
      fetchTransactions();
    }
  };

  // Format Rupiah
  const formatRupiah = (num) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(num);

  const getStatusColor = (status) => {
    if (status === "Done")
      return "bg-green-500/10 text-green-500 border-green-500/20";
    if (status === "Cancelled")
      return "bg-red-500/10 text-red-500 border-red-500/20";
    return "bg-gray-500";
  };

  const filteredData = transactions.filter(
    (item) =>
      item.profiles?.full_name
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      item.device_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-brand-black text-white p-6 pb-20">
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-end mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-gray-400">
              Riwayat Selesai
            </h1>
            <p className="text-gray-500 mt-1">
              Arsip transaksi yang sudah lunas atau dibatalkan.
            </p>
          </div>

          <div className="relative w-full md:w-auto">
            <Search
              className="absolute left-4 top-3.5 text-gray-500"
              size={20}
            />
            <input
              type="text"
              placeholder="Cari arsip..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full md:w-80 bg-white/5 border border-white/10 rounded-full py-3 pl-12 pr-6 text-white focus:outline-none focus:border-brand-accent transition"
            />
          </div>
        </div>

        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden shadow-2xl opacity-90">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-white/5 text-gray-400 text-sm uppercase tracking-wider border-b border-white/10">
                  <th className="p-6 font-bold">ID</th>
                  <th className="p-6 font-bold">Pelanggan</th>
                  <th className="p-6 font-bold">Perangkat</th>
                  <th className="p-6 font-bold">Total Biaya</th>
                  <th className="p-6 font-bold">Status Akhir</th>
                  <th className="p-6 font-bold text-center">Action</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-white/5">
                {loading ? (
                  <tr>
                    <td
                      colSpan="6"
                      className="p-10 text-center text-gray-500 animate-pulse"
                    >
                      Memuat arsip...
                    </td>
                  </tr>
                ) : filteredData.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="p-10 text-center text-gray-500">
                      Belum ada riwayat selesai.
                    </td>
                  </tr>
                ) : (
                  filteredData.map((item) => (
                    <tr
                      key={item.id}
                      className="hover:bg-white/5 transition grayscale hover:grayscale-0"
                    >
                      <td className="p-6 font-mono text-gray-500">
                        #{item.id}
                      </td>
                      <td className="p-6">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-gray-400 overflow-hidden">
                            {item.profiles?.avatar_url ? (
                              <img
                                src={item.profiles.avatar_url}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <User size={18} />
                            )}
                          </div>
                          <div>
                            <div className="font-bold text-gray-300 text-sm">
                              {item.profiles?.full_name}
                            </div>
                            <div className="text-xs text-gray-500">
                              {new Date(item.created_at).toLocaleDateString(
                                "id-ID"
                              )}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="p-6 text-gray-400">{item.device_name}</td>
                      <td className="p-6 font-bold text-white">
                        {formatRupiah(item.total_cost)}
                      </td>

                      <td className="p-6">
                        <span
                          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border ${getStatusColor(
                            item.status
                          )}`}
                        >
                          {item.status === "Done" ? (
                            <>
                              <CheckCircle size={12} /> Selesai
                            </>
                          ) : (
                            <>
                              <XCircle size={12} /> Batal
                            </>
                          )}
                        </span>
                      </td>

                      <td className="p-6 text-center">
                        <div className="relative inline-block">
                          <select
                            value={item.status}
                            onChange={(e) =>
                              handleStatusChange(item.id, e.target.value)
                            }
                            className="appearance-none bg-black/40 border border-white/10 text-gray-400 text-sm pl-4 pr-8 py-2 rounded-lg cursor-pointer focus:border-brand-accent focus:outline-none hover:bg-white/10 transition"
                          >
                            <option value="Done">Selesai</option>
                            <option value="Cancelled">Batal</option>
                            <option disabled>--- Kembalikan ---</option>
                            <option value="Working">Proses</option>
                          </select>
                          <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500">
                            <ChevronDown size={14} />
                          </div>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminRiwayat;
