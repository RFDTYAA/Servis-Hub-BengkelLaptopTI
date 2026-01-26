import React, { useEffect, useState } from "react";
import { supabase } from "../../../lib/supabaseClient";
import {
  Search,
  CheckCircle,
  Clock,
  Wrench,
  XCircle,
  ChevronDown,
  User,
  Calendar,
  UserCog, // Ikon baru untuk teknisi
} from "lucide-react";

// DAFTAR TEKNISI
const TECHNICIANS = [
  "Mohammad Ridho Cahyono",
  "Muhammad Rafi Aditya",
  "Adam Toyib Nurwahid",
  "Muhammad Setya Adjie",
  "Farrel Ghozy Afifuddin",
  "Muhammad Wildan",
  "Raja Muhammad",
];

const AdminTransaksi = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  // 1. FETCH HANYA TRANSAKSI AKTIF (Pending & Working)
  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("transactions")
        .select(`*, profiles:user_id ( full_name, email, avatar_url )`)
        .in("status", ["Pending", "Working"])
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

  // 2. UPDATE STATUS
  const handleStatusChange = async (id, newStatus) => {
    try {
      if (newStatus === "Done" || newStatus === "Cancelled") {
        setTransactions((prev) => prev.filter((item) => item.id !== id));
      } else {
        setTransactions((prev) =>
          prev.map((item) =>
            item.id === id ? { ...item, status: newStatus } : item,
          ),
        );
      }

      const { error } = await supabase
        .from("transactions")
        .update({ status: newStatus })
        .eq("id", id);

      if (error) throw error;
    } catch (error) {
      alert("Gagal update status!");
      fetchTransactions();
    }
  };

  // 3. UPDATE BIAYA
  const handleCostChange = async (id, newCost) => {
    try {
      const { error } = await supabase
        .from("transactions")
        .update({ total_cost: newCost })
        .eq("id", id);
      if (error) throw error;
    } catch (error) {
      alert("Gagal update biaya: " + error.message);
    }
  };

  const onCostInputChange = (id, value) => {
    setTransactions((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, total_cost: value } : item,
      ),
    );
  };

  // 4. UPDATE TEKNISI (FITUR BARU)
  const handleTechnicianChange = async (id, newTech) => {
    try {
      // Optimistic Update
      setTransactions((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, technician_name: newTech } : item,
        ),
      );

      const { error } = await supabase
        .from("transactions")
        .update({ technician_name: newTech })
        .eq("id", id);

      if (error) throw error;
    } catch (error) {
      alert("Gagal update teknisi: " + error.message);
    }
  };

  const parseData = (desc) => {
    const categoryMatch = desc.match(/^\[(.*?)\]/);
    const category = categoryMatch ? categoryMatch[1] : "Umum";
    const cleanDesc = desc.replace(/^\[.*?\]/, "").trim();
    return { category, cleanDesc };
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Pending":
        return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20";
      case "Working":
        return "bg-blue-500/10 text-blue-500 border-blue-500/20";
      default:
        return "bg-gray-500/10 text-gray-500";
    }
  };

  const filteredData = transactions.filter(
    (item) =>
      item.profiles?.full_name
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      item.device_name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="min-h-screen bg-brand-black text-white p-6 pb-20">
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-end mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-brand-accent">
              Transaksi Aktif
            </h1>
            <p className="text-gray-400 mt-1">
              Daftar antrian & proses pengerjaan saat ini.
            </p>
          </div>

          <div className="relative w-full md:w-auto">
            <Search
              className="absolute left-4 top-3.5 text-gray-500"
              size={20}
            />
            <input
              type="text"
              placeholder="Cari pesanan..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full md:w-80 bg-white/5 border border-white/10 rounded-full py-3 pl-12 pr-6 text-white focus:outline-none focus:border-brand-accent transition"
            />
          </div>
        </div>

        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-white/5 text-gray-400 text-sm uppercase tracking-wider border-b border-white/10">
                  <th className="p-6 font-bold">ID</th>
                  <th className="p-6 font-bold">Pelanggan</th>
                  <th className="p-6 font-bold">Perangkat</th>
                  <th className="p-6 font-bold w-48">Teknisi</th>{" "}
                  {/* KOLOM TEKNISI */}
                  <th className="p-6 font-bold w-40">Estimasi Biaya</th>
                  <th className="p-6 font-bold">Status</th>
                  <th className="p-6 font-bold text-center">Action</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-white/5">
                {loading ? (
                  <tr>
                    <td
                      colSpan="7"
                      className="p-10 text-center text-gray-500 animate-pulse"
                    >
                      Memuat data...
                    </td>
                  </tr>
                ) : filteredData.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="p-10 text-center text-gray-500">
                      Tidak ada transaksi aktif.
                    </td>
                  </tr>
                ) : (
                  filteredData.map((item) => {
                    const { category, cleanDesc } = parseData(
                      item.problem_desc,
                    );
                    return (
                      <tr key={item.id} className="hover:bg-white/5 transition">
                        <td className="p-6 font-mono text-brand-accent">
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
                              <div className="font-bold text-white text-sm">
                                {item.profiles?.full_name}
                              </div>
                              <div className="text-xs text-gray-500">
                                {new Date(item.created_at).toLocaleDateString(
                                  "id-ID",
                                )}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="p-6">
                          <div className="font-bold text-white text-sm">
                            {item.device_name}
                          </div>
                          <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-white/10 text-gray-400 border border-white/5">
                            {category}
                          </span>
                          <p
                            className="text-sm text-gray-400 truncate max-w-[150px]"
                            title={cleanDesc}
                          >
                            {cleanDesc}
                          </p>
                        </td>

                        {/* KOLOM PILIH TEKNISI */}
                        <td className="p-6">
                          <div className="relative group/input">
                            <UserCog
                              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
                              size={16}
                            />
                            <select
                              value={item.technician_name || ""}
                              onChange={(e) =>
                                handleTechnicianChange(item.id, e.target.value)
                              }
                              className="w-full bg-black/20 border border-white/10 rounded-lg py-2 pl-9 pr-8 text-white text-sm focus:border-brand-accent focus:outline-none appearance-none cursor-pointer hover:bg-black/30 transition"
                            >
                              <option value="">-- Pilih --</option>
                              {TECHNICIANS.map((tech) => (
                                <option key={tech} value={tech}>
                                  {tech}
                                </option>
                              ))}
                            </select>
                            <ChevronDown
                              size={14}
                              className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500"
                            />
                          </div>
                        </td>

                        <td className="p-6">
                          <div className="relative group/input">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">
                              Rp
                            </span>
                            <input
                              type="number"
                              value={item.total_cost || ""}
                              onChange={(e) =>
                                onCostInputChange(item.id, e.target.value)
                              }
                              onBlur={(e) =>
                                handleCostChange(item.id, e.target.value)
                              }
                              placeholder="0"
                              className="w-full bg-black/20 border border-white/10 rounded-lg py-2 pl-9 pr-2 text-white text-sm focus:border-brand-accent focus:outline-none transition"
                            />
                          </div>
                        </td>

                        <td className="p-6">
                          <span
                            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border ${getStatusColor(
                              item.status,
                            )}`}
                          >
                            {item.status}
                          </span>
                        </td>

                        <td className="p-6 text-center">
                          <div className="relative inline-block">
                            <select
                              value={item.status}
                              onChange={(e) =>
                                handleStatusChange(item.id, e.target.value)
                              }
                              className="appearance-none bg-brand-dark border border-white/20 text-white text-sm pl-4 pr-8 py-2 rounded-lg cursor-pointer focus:border-brand-accent focus:outline-none hover:bg-white/10 transition"
                            >
                              <option value="Pending">Antrian</option>
                              <option value="Working">Proses</option>
                              <option
                                disabled
                                className="bg-gray-800 text-gray-500"
                              >
                                --- Pindahkan ---
                              </option>
                              <option value="Done" className="text-green-400">
                                ✅ Selesai
                              </option>
                              <option
                                value="Cancelled"
                                className="text-red-400"
                              >
                                ❌ Batalkan
                              </option>
                            </select>
                            <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                              <ChevronDown size={14} />
                            </div>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminTransaksi;
