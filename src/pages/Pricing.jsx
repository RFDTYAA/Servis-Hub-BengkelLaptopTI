import React, { useState } from "react";
import {
  Search,
  Cpu,
  HardDrive,
  Smartphone,
  Monitor,
  Wrench,
  ShieldCheck,
  Zap,
} from "lucide-react";

const Pricing = () => {
  const [searchTerm, setSearchTerm] = useState("");

  // Data Harga diambil dari Screenshot yang Anda kirim
  const services = [
    // --- HARDWARE & LAPTOP ---
    {
      id: 1,
      name: "LCD Replacing",
      price: "Rp 125.000",
      category: "Hardware",
      icon: <Monitor />,
    },
    {
      id: 2,
      name: "Laptop Full Deep Cleaning",
      price: "Rp 50.000",
      category: "Maintenance",
      icon: <Zap />,
      featured: true,
    },
    {
      id: 3,
      name: "Paste Replacing (Repaste)",
      price: "Rp 35.000",
      category: "Maintenance",
      icon: <Wrench />,
    },
    {
      id: 4,
      name: "Sparepart Mounting",
      price: "Rp 35.000",
      category: "Hardware",
      icon: <Cpu />,
    },

    // --- SOFTWARE & DATA ---
    {
      id: 5,
      name: "Re-Install OS + Office",
      price: "Rp 75.000",
      category: "Software",
      icon: <ShieldCheck />,
      featured: true,
    },
    {
      id: 6,
      name: "Office Installation Only",
      price: "Rp 25.000",
      category: "Software",
      icon: <ShieldCheck />,
    },
    {
      id: 7,
      name: "Data Recovery",
      price: "Rp 135.000",
      category: "Data",
      icon: <HardDrive />,
    },
    {
      id: 8,
      name: "Data Backup",
      price: "Rp 35.000",
      category: "Data",
      icon: <HardDrive />,
    },

    // --- PC & PRINTER ---
    {
      id: 9,
      name: "PC Full Deep Cleaning",
      price: "Rp 100.000",
      category: "Maintenance",
      icon: <Monitor />,
    },
    {
      id: 10,
      name: "Service Expert For PC",
      price: "Rp 55.000",
      category: "Service",
      icon: <Wrench />,
    },
    {
      id: 11,
      name: "Service Expert For Printers",
      price: "Rp 55.000",
      category: "Service",
      icon: <Wrench />,
    },

    // --- MOBILE / HANDPHONE ---
    {
      id: 12,
      name: "Phone LCD Replacing",
      price: "Rp 35.000",
      category: "Mobile",
      icon: <Smartphone />,
    },
    {
      id: 13,
      name: "Service Expert For HP",
      price: "Rp 75.000",
      category: "Mobile",
      icon: <Smartphone />,
    },

    // --- ADMIN FEES ---
    {
      id: 14,
      name: "Admin Fee (Beli Sparepart)",
      price: "Rp 20.000",
      category: "Admin",
      icon: <Zap />,
    },
    {
      id: 15,
      name: "Admin Fee (Jasa Expert)",
      price: "Rp 35.000",
      category: "Admin",
      icon: <Zap />,
    },
  ];

  // Logic untuk memfilter list berdasarkan ketikan user
  const filteredServices = services.filter((service) =>
    service.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-brand-black text-white min-h-screen">
      {/* 1. HERO SECTION & SEARCH BAR */}
      <section className="relative py-20 bg-brand-dark border-b border-white/5">
        <div className="container mx-auto px-6 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Daftar Harga <span className="text-brand-accent">Transparan</span>
          </h1>
          <p className="text-gray-400 mb-8 max-w-xl mx-auto">
            Tidak ada biaya tersembunyi. Cek estimasi biaya perbaikan gadget
            kesayangan Anda di sini.
          </p>

          {/* Search Box Keren */}
          <div className="relative max-w-lg mx-auto group">
            <div className="absolute inset-0 bg-brand-accent/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition duration-500"></div>
            <div className="relative flex items-center bg-brand-black border border-white/10 rounded-full px-6 py-3 shadow-2xl focus-within:border-brand-accent transition">
              <Search className="text-gray-400 mr-3" />
              <input
                type="text"
                placeholder="Cari servis... (misal: LCD, Install, Cleaning)"
                className="bg-transparent border-none outline-none text-white w-full placeholder-gray-500"
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>
      </section>

      {/* 2. PRICING LIST GRID */}
      <section className="py-16">
        <div className="container mx-auto px-6">
          {/* Jika tidak ada hasil pencarian */}
          {filteredServices.length === 0 && (
            <div className="text-center py-20">
              <p className="text-gray-500 text-lg">
                Servis yang Anda cari tidak ditemukan.
              </p>
              <button className="mt-4 text-brand-accent hover:underline">
                Hubungi Admin untuk tanya harga
              </button>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredServices.map((service) => (
              <div
                key={service.id}
                className={`
                  relative bg-brand-dark p-6 rounded-xl border transition-all duration-300 group hover:-translate-y-1
                  ${
                    service.featured
                      ? "border-brand-accent/50 shadow-[0_0_15px_rgba(249,115,22,0.1)]"
                      : "border-white/5 hover:border-brand-accent/30"
                  }
                `}
              >
                {/* Badge "Popular" jika featured */}
                {service.featured && (
                  <span className="absolute -top-3 right-4 bg-brand-accent text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                    POPULAR
                  </span>
                )}

                <div className="flex items-start justify-between mb-4">
                  <div
                    className={`p-3 rounded-lg ${
                      service.featured
                        ? "bg-brand-accent/20 text-brand-accent"
                        : "bg-brand-black text-gray-400 group-hover:text-brand-cyan group-hover:bg-brand-cyan/10"
                    } transition`}
                  >
                    {service.icon}
                  </div>
                  <span className="text-xs font-mono text-gray-500 bg-brand-black px-2 py-1 rounded border border-white/5">
                    {service.category}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-white mb-2 group-hover:text-brand-accent transition">
                  {service.name}
                </h3>

                <div className="flex items-baseline gap-1">
                  <span className="text-2xl font-bold text-brand-cyan tracking-tight">
                    {service.price}
                  </span>
                  <span className="text-xs text-gray-500">/ unit</span>
                </div>

                {/* Garis dekorasi bawah */}
                <div className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-brand-accent to-brand-cyan w-0 group-hover:w-full transition-all duration-500 rounded-b-xl"></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. CTA SECTION */}
      <section className="py-12 border-t border-white/5 bg-brand-black">
        <div className="container mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6 bg-brand-accent/10 p-8 rounded-2xl border border-brand-accent/20">
          <div>
            <h3 className="text-xl font-bold text-white mb-2">
              Punya masalah spesifik?
            </h3>
            <p className="text-gray-400 text-sm">
              Jika kerusakan tidak ada di daftar, teknisi kami siap melakukan
              pengecekan langsung.
            </p>
          </div>
          <button className="bg-brand-accent hover:bg-orange-600 text-white px-8 py-3 rounded-lg font-bold transition whitespace-nowrap shadow-lg">
            Konsultasi via WA
          </button>
        </div>
      </section>
    </div>
  );
};

export default Pricing;
