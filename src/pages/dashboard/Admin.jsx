import React, { useEffect, useState } from "react";
import { supabase } from "../../lib/supabaseClient";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import {
  DollarSign,
  ShoppingBag,
  Users,
  TrendingUp,
  Calendar,
  ArrowUpRight,
} from "lucide-react";

const AdminDashboard = () => {
  const [loading, setLoading] = useState(true);

  // State untuk Data Statistik
  const [stats, setStats] = useState({
    weeklyRevenue: 0,
    weeklyOrders: 0,
    monthlyRevenue: 0,
    monthlyOrders: 0,
    totalCustomers: 0,
  });

  // State untuk Grafik
  const [revenueData, setRevenueData] = useState([]);
  const [categoryData, setCategoryData] = useState([]);

  // Format Uang (Rp)
  const formatRupiah = (number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(number);
  };

  // --- FUNGSI UTAMA PENGOLAH DATA ---
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // 1. Ambil Data Transaksi (Semua)
        const { data: transactions, error: transError } = await supabase
          .from("transactions")
          .select("*");

        // 2. Ambil Data Customer (Role = customer)
        const { count: customerCount, error: userError } = await supabase
          .from("profiles")
          .select("*", { count: "exact", head: true })
          .eq("role", "customer");

        if (transError || userError) throw new Error("Gagal ambil data");

        // --- PROSES DATA ---
        const now = new Date();
        const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay())); // Minggu ini
        const currentMonth = new Date().getMonth();
        const currentYear = new Date().getFullYear();

        let weekRev = 0,
          weekOrd = 0;
        let monthRev = 0,
          monthOrd = 0;

        // Setup Array Bulan untuk Grafik Revenue (Jan-Dec)
        const monthlyStats = Array(12)
          .fill(0)
          .map((_, i) => ({
            name: new Date(0, i).toLocaleString("default", { month: "short" }),
            total: 0,
          }));

        // Setup Kategori Counter
        const categoryCounts = {};

        transactions.forEach((t) => {
          const tDate = new Date(t.created_at);
          const tCost = t.total_cost || 0; // Pastikan tidak null

          // A. Hitung Mingguan
          if (tDate >= startOfWeek) {
            weekRev += tCost;
            weekOrd += 1;
          }

          // B. Hitung Bulanan (Bulan Ini)
          if (
            tDate.getMonth() === currentMonth &&
            tDate.getFullYear() === currentYear
          ) {
            monthRev += tCost;
            monthOrd += 1;
          }

          // C. Isi Grafik Revenue (Sepanjang Tahun)
          if (tDate.getFullYear() === currentYear) {
            monthlyStats[tDate.getMonth()].total += tCost;
          }

          // D. Parsing Kategori dari Deskripsi "[Hardware] Laptop Rusak..."
          // Kita ambil teks di dalam kurung siku []
          const match = t.problem_desc
            ? t.problem_desc.match(/^\[(.*?)\]/)
            : null;
          const category = match ? match[1] : "Lainnya"; // Jika tidak ada kurung, masuk Lainnya

          categoryCounts[category] = (categoryCounts[category] || 0) + 1;
        });

        // Format Data Pie Chart
        const pieData = Object.keys(categoryCounts).map((key) => ({
          name: key,
          value: categoryCounts[key],
        }));

        // --- UPDATE STATE ---
        setStats({
          weeklyRevenue: weekRev,
          weeklyOrders: weekOrd,
          monthlyRevenue: monthRev,
          monthlyOrders: monthOrd,
          totalCustomers: customerCount || 0,
        });

        setRevenueData(monthlyStats);
        setCategoryData(pieData);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Warna untuk Pie Chart
  const COLORS = ["#F97316", "#3B82F6", "#10B981", "#8B5CF6", "#EC4899"];

  if (loading)
    return (
      <div className="p-10 text-center text-white animate-pulse">
        Memuat Data Dashboard...
      </div>
    );

  return (
    <div className="min-h-screen bg-brand-black text-white p-6 pb-20">
      <div className="container mx-auto">
        {/* HEADER */}
        <div className="mb-8 flex justify-between items-end">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight">
              Dashboard Admin
            </h1>
            <p className="text-gray-400 mt-1">
              Ringkasan performa bengkel & statistik real-time.
            </p>
          </div>
          <div className="text-right hidden md:block">
            <div className="text-sm text-gray-400">Tanggal Hari Ini</div>
            <div className="font-bold text-lg">
              {new Date().toLocaleDateString("id-ID", { dateStyle: "full" })}
            </div>
          </div>
        </div>

        {/* --- MAIN GRID LAYOUT (BENTO STYLE) --- */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* KOLOM KIRI (KARTU STATISTIK KECIL) - 2 Kolom Grid di dalamnya */}
          <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* 1. WEEKLY REVENUE */}
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-6 rounded-3xl relative overflow-hidden group hover:border-brand-accent/30 transition">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition">
                <DollarSign size={80} />
              </div>
              <div className="flex items-center gap-2 text-gray-400 mb-2 text-sm font-bold uppercase tracking-wider">
                <div className="p-1.5 bg-green-500/20 rounded text-green-400">
                  <TrendingUp size={14} />
                </div>
                Pendapatan Mingguan
              </div>
              <div className="text-3xl font-bold text-white mb-1">
                {formatRupiah(stats.weeklyRevenue)}
              </div>
              <p className="text-xs text-gray-500">
                Total pemasukan 7 hari terakhir
              </p>
            </div>

            {/* 2. WEEKLY ORDERS */}
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-6 rounded-3xl relative overflow-hidden group hover:border-brand-accent/30 transition">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition">
                <ShoppingBag size={80} />
              </div>
              <div className="flex items-center gap-2 text-gray-400 mb-2 text-sm font-bold uppercase tracking-wider">
                <div className="p-1.5 bg-blue-500/20 rounded text-blue-400">
                  <ShoppingBag size={14} />
                </div>
                Orderan Mingguan
              </div>
              <div className="text-3xl font-bold text-white mb-1">
                {stats.weeklyOrders}{" "}
                <span className="text-base font-normal text-gray-500">
                  Servis
                </span>
              </div>
              <p className="text-xs text-gray-500">
                Unit masuk 7 hari terakhir
              </p>
            </div>

            {/* 3. MONTHLY REVENUE */}
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-6 rounded-3xl relative overflow-hidden group hover:border-brand-accent/30 transition">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition">
                <Calendar size={80} />
              </div>
              <div className="flex items-center gap-2 text-gray-400 mb-2 text-sm font-bold uppercase tracking-wider">
                <div className="p-1.5 bg-brand-accent/20 rounded text-brand-accent">
                  <DollarSign size={14} />
                </div>
                Pendapatan Bulanan
              </div>
              <div className="text-3xl font-bold text-white mb-1">
                {formatRupiah(stats.monthlyRevenue)}
              </div>
              <p className="text-xs text-gray-500">Akumulasi bulan ini</p>
            </div>

            {/* 4. MONTHLY ORDERS */}
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-6 rounded-3xl relative overflow-hidden group hover:border-brand-accent/30 transition">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition">
                <ShoppingBag size={80} />
              </div>
              <div className="flex items-center gap-2 text-gray-400 mb-2 text-sm font-bold uppercase tracking-wider">
                <div className="p-1.5 bg-purple-500/20 rounded text-purple-400">
                  <ShoppingBag size={14} />
                </div>
                Orderan Bulanan
              </div>
              <div className="text-3xl font-bold text-white mb-1">
                {stats.monthlyOrders}{" "}
                <span className="text-base font-normal text-gray-500">
                  Servis
                </span>
              </div>
              <p className="text-xs text-gray-500">Unit masuk bulan ini</p>
            </div>
          </div>

          {/* KOLOM KANAN (GRAFIK BESAR - REVENUE RECAP) */}
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-6 rounded-3xl lg:row-span-2 flex flex-col">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="text-xl font-bold text-white">
                  Grafik Pemasukan
                </h3>
                <p className="text-xs text-gray-400">
                  Rekapitulasi per bulan tahun ini
                </p>
              </div>
              <div className="bg-white/10 p-2 rounded-full">
                <ArrowUpRight size={20} />
              </div>
            </div>

            {/* AREA CHART */}
            <div className="flex-grow min-h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={revenueData}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="#333"
                    vertical={false}
                  />
                  <XAxis dataKey="name" stroke="#666" tick={{ fontSize: 12 }} />
                  <YAxis
                    stroke="#666"
                    tick={{ fontSize: 12 }}
                    tickFormatter={(value) => `Rp${value / 1000}k`}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1a1a1a",
                      border: "1px solid #333",
                      borderRadius: "8px",
                    }}
                    itemStyle={{ color: "#F97316" }}
                    formatter={(value) => formatRupiah(value)}
                  />
                  <Bar
                    dataKey="total"
                    fill="#F97316"
                    radius={[4, 4, 0, 0]}
                    barSize={40}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* KOLOM BAWAH KIRI (TOTAL CUSTOMERS) */}
          <div className="bg-gradient-to-r from-brand-accent/20 to-orange-900/20 backdrop-blur-xl border border-brand-accent/20 p-6 rounded-3xl flex items-center justify-between relative overflow-hidden">
            <div className="relative z-10">
              <div className="flex items-center gap-2 text-brand-accent mb-1 text-sm font-bold uppercase tracking-wider">
                <Users size={16} /> Total Pelanggan
              </div>
              <div className="text-4xl font-extrabold text-white">
                {stats.totalCustomers}
              </div>
              <p className="text-sm text-gray-400 mt-1">
                Akun terdaftar sebagai Customer
              </p>
            </div>
            {/* Decor Icon */}
            <Users
              size={100}
              className="absolute right-[-20px] bottom-[-20px] text-brand-accent/10"
            />
          </div>

          {/* KOLOM BAWAH TENGAH (PIE CHART KATEGORI) */}
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-6 rounded-3xl flex flex-col justify-center items-center relative min-h-[250px]">
            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider absolute top-6 left-6">
              Kategori Masalah
            </h3>

            <div className="w-full h-[200px] mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={70}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#000",
                      border: "1px solid #333",
                      borderRadius: "8px",
                    }}
                  />
                  <Legend
                    verticalAlign="bottom"
                    height={36}
                    iconType="circle"
                    wrapperStyle={{ fontSize: "12px" }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
