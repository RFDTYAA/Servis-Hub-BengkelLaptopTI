import React, { useState, useEffect } from "react";
import { supabase } from "../../../lib/supabaseClient";
import {
  Search,
  Edit,
  Trash2,
  CheckCircle,
  XCircle,
  Clock,
  Save,
  X,
  UserCog,
  Smartphone,
  CreditCard,
  UserCheck,
  AlertTriangle,
  MessageSquare,
  Loader2,
  Wrench,
} from "lucide-react";
import Swal from "sweetalert2";

// Import Foto Teknisi
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
];

const Transaksi = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isEditOpen, setIsEditOpen] = useState(false);

  // Data Edit
  const [editData, setEditData] = useState({
    id: null,
    status: "",
    cost: 0,
    technician: "",
    paymentType: "Cash",
    userPhone: "",
    userName: "",
    deviceName: "",
    originalStatus: "",
  });

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("transactions")
        .select(`*, profiles:user_id (full_name, email, phone_number)`)
        .in("status", ["Pending", "Approved", "Working"])
        .order("created_at", { ascending: false });

      if (error) throw error;
      setTransactions(data);
    } catch (error) {
      console.error("Error:", error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Hapus Data?",
      text: "Data akan hilang permanen!",
      icon: "warning",
      showCancelButton: true,
      background: "#1e293b",
      color: "#fff",
      confirmButtonColor: "#ef4444",
      confirmButtonText: "Ya, Hapus!",
    });
    if (result.isConfirmed) {
      await supabase.from("transactions").delete().eq("id", id);
      fetchTransactions();
    }
  };

  const handleEditClick = (item) => {
    setEditData({
      id: item.id,
      status: item.status,
      cost: item.total_cost || 0,
      technician: item.technician_name || "",
      paymentType: item.payment_type || "Cash",
      userPhone: item.profiles?.phone_number || "",
      userName: item.profiles?.full_name || "Pelanggan",
      deviceName: item.device_name,
      originalStatus: item.status,
    });
    setIsEditOpen(true);
  };

  const handleSaveEdit = async (e) => {
    e.preventDefault();

    if (
      editData.originalStatus === "Pending" &&
      editData.status === "Working"
    ) {
      Swal.fire({
        icon: "error",
        title: "Tunggu Pelanggan!",
        text: 'Pelanggan BELUM menyetujui biaya. Biarkan status "Pending" sampai pelanggan klik "Setuju" di dashboard mereka. Status akan otomatis berubah jadi "Working".',
        background: "#1e293b",
        color: "#fff",
      });
      return;
    }

    try {
      const { error } = await supabase
        .from("transactions")
        .update({
          status: editData.status,
          total_cost: editData.cost,
          technician_name: editData.technician,
          payment_type: editData.paymentType,
        })
        .eq("id", editData.id);

      if (error) throw error;

      Swal.fire({
        title: "Berhasil!",
        icon: "success",
        background: "#1e293b",
        color: "#fff",
        showConfirmButton: false,
        timer: 1500,
      });
      setIsEditOpen(false);
      fetchTransactions();
    } catch (error) {
      Swal.fire("Gagal", error.message, "error");
    }
  };

  const sendWANotification = () => {
    if (!editData.userPhone || editData.userPhone.length < 5) {
      Swal.fire("Error", "No WA Pelanggan tidak valid.", "error");
      return;
    }
    let phone = editData.userPhone.replace(/\D/g, "");
    if (phone.startsWith("0")) phone = "62" + phone.slice(1);

    const message = `Halo Kak ${editData.userName},
    
Info Servis: *${editData.deviceName}*
Teknisi: ${editData.technician || "-"}
Biaya: Rp ${parseInt(editData.cost).toLocaleString("id-ID")}
    
Mohon Buka Dashboard & Klik *SETUJU* agar bisa langsung dikerjakan.
Link: https://bengkellaptopti.com/dashboard/user`;

    window.open(
      `https://wa.me/${phone}?text=${encodeURIComponent(message)}`,
      "_blank",
    );
  };

  const getTechPhoto = (name) => {
    const tech = TECHNICIANS_DATA.find((t) => t.name === name);
    return tech ? tech.img : null;
  };

  const filteredData = transactions.filter(
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
          <h1 className="text-3xl font-bold mb-1 flex items-center gap-2 text-brand-accent">
            <Smartphone /> Transaksi Aktif
          </h1>
          <p className="text-gray-400">
            Kelola antrian. Input Harga & Teknisi, lalu tunggu User setuju.
          </p>
        </div>
        <div className="relative w-full md:w-72">
          <Search className="absolute left-3 top-3 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Cari Pelanggan..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-brand-dark border border-white/10 rounded-full py-2.5 pl-10 pr-4 text-sm focus:outline-none focus:border-brand-accent transition shadow-lg"
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
                <th className="p-4">Biaya</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {loading ? (
                <tr>
                  <td colSpan="7" className="p-8 text-center animate-pulse">
                    <Loader2 className="animate-spin inline mr-2" /> Memuat...
                  </td>
                </tr>
              ) : (
                filteredData.map((item) => (
                  <tr
                    key={item.id}
                    className="hover:bg-white/5 transition-colors duration-200 group"
                  >
                    <td className="p-4 align-top">
                      <span className="font-mono text-brand-accent font-bold">
                        #{item.id.slice(0, 6)}
                      </span>
                      <div className="text-xs text-gray-500 mt-1">
                        {new Date(item.created_at).toLocaleDateString("id-ID")}
                      </div>
                    </td>
                    <td className="p-4 align-top">
                      <div className="font-bold text-white text-sm">
                        {item.profiles?.full_name}
                      </div>
                      <div className="text-[10px] text-gray-500">
                        {item.profiles?.email}
                      </div>
                    </td>
                    <td className="p-4 align-top max-w-[180px]">
                      <div className="font-medium text-white text-sm">
                        {item.device_name}
                      </div>
                      <div className="text-[10px] text-gray-400 mt-1 truncate">
                        {item.problem_desc?.replace(/^\[.*?\]/, "")}
                      </div>
                    </td>
                    <td className="p-4 align-top">
                      {item.technician_name ? (
                        <div className="flex items-center gap-2">
                          <img
                            src={getTechPhoto(item.technician_name)}
                            className="w-6 h-6 rounded-full border border-brand-accent object-cover"
                          />
                          <span className="text-xs font-bold text-brand-cyan">
                            {item.technician_name.split(" ")[0]}
                          </span>
                        </div>
                      ) : (
                        <span className="text-xs text-red-400 italic">
                          Belum diset
                        </span>
                      )}
                    </td>
                    <td className="p-4 align-top font-mono text-sm">
                      {item.total_cost > 0 ? (
                        <span className="text-green-400">
                          Rp {item.total_cost.toLocaleString("id-ID")}
                        </span>
                      ) : (
                        <span className="text-gray-500">Menunggu</span>
                      )}
                    </td>
                    <td className="p-4 align-top">
                      <span
                        className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wide border flex items-center w-fit gap-1 ${
                          item.status === "Working"
                            ? "bg-blue-500/10 text-blue-400 border-blue-500/20"
                            : "bg-yellow-500/10 text-yellow-500 border-yellow-500/20"
                        }`}
                      >
                        {item.status === "Pending" ? (
                          <Clock size={10} />
                        ) : (
                          <Wrench size={10} className="animate-pulse" />
                        )}
                        {item.status === "Working"
                          ? "SEDANG DIKERJAKAN"
                          : "MENUNGGU PERSETUJUAN"}
                      </span>
                    </td>
                    <td className="p-4 align-top text-center">
                      <div className="flex justify-center gap-2 opacity-80 group-hover:opacity-100 transition">
                        <button
                          onClick={() => handleEditClick(item)}
                          className="p-1.5 bg-brand-accent/10 text-brand-accent rounded hover:bg-brand-accent hover:text-white transition"
                        >
                          <Edit size={14} />
                        </button>
                        <button
                          onClick={() => handleDelete(item.id)}
                          className="p-1.5 bg-red-500/10 text-red-400 rounded hover:bg-red-500 hover:text-white transition"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* --- MODAL EDIT --- */}
      {isEditOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-brand-dark border border-white/10 rounded-2xl w-full max-w-lg shadow-2xl animate-in zoom-in duration-200">
            <div className="bg-white/5 p-5 border-b border-white/10 flex justify-between items-center">
              <h2 className="text-lg font-bold text-white flex gap-2 items-center">
                <Edit size={18} /> Update Pesanan
              </h2>
              <button onClick={() => setIsEditOpen(false)}>
                <X size={20} className="text-gray-400 hover:text-white" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase mb-1">
                    Teknisi
                  </label>
                  <select
                    className="w-full bg-black/30 border border-white/10 rounded-lg p-2.5 text-sm text-white focus:border-brand-accent focus:outline-none"
                    value={editData.technician}
                    onChange={(e) =>
                      setEditData({ ...editData, technician: e.target.value })
                    }
                  >
                    <option value="">-- Pilih --</option>
                    {TECHNICIANS_DATA.map((tech, i) => (
                      <option key={i} value={tech.name}>
                        {tech.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase mb-1">
                    Biaya (Rp)
                  </label>
                  <input
                    type="number"
                    className="w-full bg-black/30 border border-white/10 rounded-lg p-2.5 text-sm text-white focus:border-brand-accent focus:outline-none"
                    value={editData.cost}
                    onChange={(e) =>
                      setEditData({ ...editData, cost: e.target.value })
                    }
                  />
                </div>
              </div>

              {/* NOTIFIKASI WA OPSIONAL */}
              {editData.cost > 0 && editData.originalStatus === "Pending" && (
                <button
                  type="button"
                  onClick={sendWANotification}
                  className="w-full py-2 bg-green-500/10 text-green-400 border border-green-500/20 rounded-lg flex items-center justify-center gap-2 text-xs font-bold hover:bg-green-500 hover:text-white transition"
                >
                  <MessageSquare size={14} /> Beritahu User via WA (Opsional)
                </button>
              )}

              {/* STATUS UPDATE */}
              <div className="bg-brand-accent/5 p-3 rounded-lg border border-brand-accent/20">
                <label className="block text-xs font-bold text-brand-accent uppercase mb-1">
                  Status
                </label>
                <select
                  className="w-full bg-black/30 border border-white/10 rounded-lg p-2.5 text-sm text-white focus:border-brand-accent focus:outline-none"
                  value={editData.status}
                  onChange={(e) =>
                    setEditData({ ...editData, status: e.target.value })
                  }
                >
                  <option value="Pending">Pending (Tunggu User)</option>

                  {/* Working Muncul Jika User Sudah Setuju */}
                  {editData.originalStatus !== "Pending" && (
                    <option value="Working">Working (Sedang Dikerjakan)</option>
                  )}

                  <option value="Selesai">Selesai (Arsipkan)</option>
                  <option value="Dibatalkan">Dibatalkan (Arsipkan)</option>
                </select>

                {editData.originalStatus === "Pending" && (
                  <div className="flex items-start gap-2 mt-2 text-[10px] text-yellow-500">
                    <AlertTriangle size={12} className="shrink-0 mt-0.5" />
                    <span>
                      <b>Info:</b> Biarkan "Pending" hingga User klik "Setuju".
                      Nanti status otomatis berubah jadi "Working".
                    </span>
                  </div>
                )}
              </div>

              <button
                type="submit"
                className="w-full bg-brand-accent hover:bg-orange-600 text-white font-bold py-3 rounded-lg transition"
              >
                Simpan Perubahan
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Transaksi;
