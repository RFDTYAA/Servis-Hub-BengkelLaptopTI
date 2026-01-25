import React from "react";
import {
  ArrowRight,
  CheckCircle,
  Cpu,
  Wrench,
  HardDrive,
  DownloadCloud,
  MessageSquare,
} from "lucide-react";
import { Link } from "react-router-dom";

const Home = () => {
  // --- LOGIC WHATSAPP OTOMATIS (Ditambahkan) ---
  const phoneNumber = "6282125548653";
  const message =
    "Halo Admin Bengkel TI, saya ingin konsultasi perihal kerusakan gadget saya. Bisakah dibantu?";
  const waLink = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(
    message,
  )}`;

  return (
    <div className="bg-brand-black text-brand-text w-full overflow-hidden">
      {/* --- 1. HERO SECTION --- */}
      <section className="relative py-16 lg:py-24">
        <div className="container mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Teks Kiri */}
          <div className="z-10 order-2 lg:order-1 text-center lg:text-left">
            <span className="text-brand-accent font-bold tracking-wider uppercase text-xs mb-2 block animate-pulse">
              • Ready to Repair
            </span>
            <h1 className="text-4xl lg:text-6xl font-bold text-white leading-tight mb-6">
              Solusi Tepat <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-accent to-brand-cyan">
                Gadget Masa Kini
              </span>
            </h1>
            <p className="text-gray-400 text-lg mb-8 max-w-md mx-auto lg:mx-0 leading-relaxed">
              Jasa perbaikan Komputer, Laptop, Printer & Handphone secara
              profesional dengan sistem tracking transparan. Performa kembali
              ngebut seperti baru. Cepat, Transparan, dan bergaransi.
            </p>

            {/* Tombol Hero */}
            <div className="flex gap-4 justify-center lg:justify-start">
              <Link
                to="/register"
                className="bg-brand-accent hover:bg-blue-600 text-white px-8 py-3 rounded-full font-bold transition flex items-center gap-2 shadow-[0_0_20px_rgba(59,130,246,0.5)]"
              >
                Buat Akun
              </Link>
              <Link
                to="/pricing"
                className="border border-white/20 hover:border-white text-white px-8 py-3 rounded-full font-bold transition"
              >
                Cek Harga
              </Link>
            </div>
          </div>

          {/* Gambar Kanan */}
          <div className="relative order-1 lg:order-2 flex justify-center">
            <div className="absolute inset-0 bg-brand-accent/20 blur-[80px] rounded-full transform scale-75"></div>
            <img
              src="https://images.unsplash.com/photo-1593640408182-31c70c8268f5?q=80&w=1000&auto=format&fit=crop"
              alt="Hero Image"
              className="relative z-10 h-auto max-h-[350px] lg:max-h-[400px] w-auto object-contain rounded-xl shadow-2xl border border-white/10 hover:scale-105 transition duration-500"
            />
          </div>
        </div>
      </section>

      {/* --- 2. GRID LAYANAN --- */}
      <section className="py-20 bg-brand-black">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-white">Layanan Unggulan</h2>
            <p className="text-gray-400 mt-2">
              Apapun masalahnya, kami punya ahlinya.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <ImageCard
              img="https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?auto=format&fit=crop&w=500&q=80"
              icon={<Cpu size={24} />}
              title="Hardware Repair"
              desc="Ganti LCD, Keyboard, & Motherboard"
            />
            <ImageCard
              img="https://images.unsplash.com/photo-1542831371-29b0f74f9713?auto=format&fit=crop&w=500&q=80"
              icon={<DownloadCloud size={24} />}
              title="Software & OS"
              desc="Install Windows, Office, & Antivirus"
            />
            <ImageCard
              img="https://images.unsplash.com/photo-1555099962-4199c345e5dd?auto=format&fit=crop&w=500&q=80"
              icon={<DownloadCloud size={24} />}
              title="Maintenance"
              desc="Pembersihan Debu & Ganti Pasta"
            />
            <ImageCard
              img="https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?auto=format&fit=crop&w=500&q=80"
              icon={<HardDrive size={24} />}
              title="Upgrade & Rakit"
              desc="Tambah RAM/SSD & Rakit PC Custom"
            />
          </div>
        </div>
      </section>

      {/* --- 3. SECTION ZIG-ZAG --- */}
      <section className="py-16 bg-brand-dark">
        <div className="container mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="relative flex justify-center">
            <div className="absolute -inset-2 border border-brand-accent/20 rounded-xl transform rotate-2"></div>
            <img
              src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=800&q=80"
              alt="Technician"
              className="rounded-lg shadow-2xl w-full h-64 lg:h-80 object-cover relative z-10"
            />
          </div>
          <div>
            <h3 className="text-brand-accent font-bold uppercase tracking-widest text-sm mb-2">
              Profesionalitas
            </h3>
            <h2 className="text-3xl font-bold text-white mb-4">
              Teknisi Handal
            </h2>
            <p className="text-gray-400 leading-relaxed mb-6 text-sm lg:text-base">
              Tim kami terdiri dari teknisi yang memiliki sertifikasi resmi dan
              pengalaman tahunan menangani ribuan perangkat gaming dan kerja.
            </p>
            <ul className="space-y-3">
              <ListItem text="Sparepart Original 100%" />
              <ListItem text="Pengerjaan Cepat & Rapi" />
              <ListItem text="Garansi Resmi Bengkel" />
            </ul>
          </div>
        </div>
      </section>

      {/* --- 4. SECTION ZIG-ZAG --- */}
      <section className="py-16 bg-brand-black overflow-hidden">
        <div className="container mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="order-2 lg:order-1">
            <h3 className="text-brand-cyan font-bold uppercase tracking-widest text-sm mb-2">
              Transparansi
            </h3>
            <h2 className="text-3xl font-bold text-white mb-4">
              Realtime Tracking
            </h2>
            <p className="text-gray-400 leading-relaxed mb-6 text-sm lg:text-base">
              Pantau progres perbaikan, foto kondisi perangkat, dan rincian
              biaya langsung dari website ini kapan saja.
            </p>
            <button className="text-brand-accent font-bold hover:text-white transition flex items-center gap-2 text-sm">
              Coba Tracking Sekarang <ArrowRight size={16} />
            </button>
          </div>
          <div className="relative order-1 lg:order-2 flex justify-center">
            <img
              src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80"
              alt="System Dashboard"
              className="rounded-lg shadow-xl w-full h-64 lg:h-80 object-cover border border-white/5"
            />
          </div>
        </div>
      </section>

      {/* --- 5. CTA SECTION --- */}
      <section className="py-16 bg-brand-black flex justify-center px-6">
        <div className="w-full max-w-4xl bg-gradient-to-r from-brand-dark to-[#0f2027] border border-white/10 rounded-2xl p-8 md:p-12 text-center relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-64 h-64 bg-brand-accent/5 rounded-full blur-[80px]"></div>

          <div className="relative z-10">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">
              Gadget Bermasalah?
            </h2>
            <p className="text-gray-400 mb-8 max-w-lg mx-auto text-sm md:text-base">
              Konsultasikan sekarang gratis, tanpa biaya apapun.
            </p>

            <div className="flex flex-col sm:flex-row justify-center gap-4">
              {/* LINK WA DIUPDATE (Menggunakan waLink) */}
              <a
                href={waLink}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-brand-accent hover:bg-orange-600 text-white px-6 py-2.5 rounded-lg font-bold transition flex items-center justify-center gap-2 text-sm shadow-lg"
              >
                <MessageSquare size={18} /> Chat WhatsApp
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

// Komponen Card Gambar
const ImageCard = ({ img, title, desc, icon }) => (
  <div className="group relative overflow-hidden rounded-xl h-64 cursor-pointer border border-white/10">
    <img
      src={img}
      alt={title}
      className="absolute inset-0 w-full h-full object-cover transition duration-700 group-hover:scale-110 group-hover:rotate-1"
    />
    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent opacity-90"></div>
    <div className="absolute bottom-0 left-0 p-5 w-full">
      <div className="mb-3 text-brand-accent">{icon}</div>
      <h3 className="text-lg font-bold text-white mb-1 group-hover:text-brand-cyan transition">
        {title}
      </h3>
      <p className="text-gray-400 text-xs leading-snug group-hover:text-gray-200 transition">
        {desc}
      </p>
    </div>
  </div>
);

const ListItem = ({ text }) => (
  <li className="flex items-start gap-3 text-gray-300 text-sm">
    <CheckCircle size={18} className="text-brand-accent shrink-0 mt-0.5" />
    <span>{text}</span>
  </li>
);

export default Home;
