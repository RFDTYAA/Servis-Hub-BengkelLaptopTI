import React from "react";
import { Link } from "react-router-dom";
import {
  Instagram,
  Facebook,
  Twitter,
  MapPin,
  Phone,
  Mail,
} from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-brand-black border-t border-white/10 py-12 mt-auto">
      <div className="container mx-auto px-6">
        {/* GRID ADJUSTMENT: Menggunakan rasio custom [1.2fr 1.5fr 1.2fr] 
            agar bagian tengah lebih lega, dan kiri-kanan lebih proporsional */}
        <div className="grid grid-cols-1 md:grid-cols-[1.2fr_1.5fr_1.2fr] gap-8 items-start">
          {/* 1. BAGIAN KIRI: Brand & Deskripsi */}
          <div className="flex flex-col items-center md:items-start text-center md:text-left">
            <Link
              to="/"
              className="text-2xl font-bold text-white flex items-center gap-1 mb-4"
            >
              #BengkelLaptop<span className="text-brand-accent">TI.</span>
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed mb-4 max-w-xs">
              Solusi terbaik untuk perbaikan Komputer, Laptop, Printer &
              Handphone. Cepat, Transparan, dan Bergaransi.
            </p>
            <div className="bg-white/5 px-4 py-2 rounded-lg border border-white/5">
              <p className="text-xs text-gray-500 font-mono">
                &copy; {new Date().getFullYear()} Bengkel TI UNIDA.
              </p>
            </div>
          </div>

          {/* 2. BAGIAN TENGAH: Kontak (CENTER & ESTETIK) */}
          <div className="flex flex-col items-center text-center">
            <h4 className="text-white font-bold text-sm uppercase tracking-wider mb-6 relative">
              Hubungi Kami
              {/* Garis hiasan kecil di bawah judul */}
              <span className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-12 h-0.5 bg-brand-accent rounded-full"></span>
            </h4>

            <div className="flex flex-col gap-6 w-full px-4">
              {/* Alamat: Ikon di atas agar rapi */}
              <div className="flex flex-col items-center gap-2 group cursor-default">
                <div className="w-10 h-10 rounded-full bg-brand-accent/10 flex items-center justify-center text-brand-accent border border-brand-accent/20 group-hover:bg-brand-accent group-hover:text-white transition duration-500 shadow-[0_0_15px_rgba(249,115,22,0.15)]">
                  <MapPin size={18} />
                </div>
                <span className="text-gray-400 text-sm leading-relaxed">
                  Gedung Terpadu Unida Gontor, Lantai 2 Ruangan 208
                  <br />
                  Jl. Raya Siman Km. 5, Desa Demangan, Kecamatan Siman,
                  <br />
                  Kabupaten Ponorogo, Jawa Timur, 63471
                </span>
              </div>
            </div>
          </div>

          {/* 3. BAGIAN KANAN: Sosmed */}
          <div className="flex flex-col items-center md:items-end text-center md:text-right">
            <h4 className="text-white font-bold text-sm uppercase tracking-wider mb-6 relative">
              Ikuti Kami
              {/* Garis hiasan di kanan (untuk desktop) atau tengah (untuk mobile) */}
              <span className="absolute -bottom-2 left-1/2 md:left-auto md:right-0 transform -translate-x-1/2 md:translate-x-0 w-8 h-0.5 bg-brand-accent rounded-full"></span>
            </h4>

            <div className="flex gap-3 mb-4">
              <SocialLink
                href="https://www.instagram.com/_rafiaditya_/"
                icon={<Instagram size={18} />}
              />
              <SocialLink
                href="https://www.facebook.com/muh.rafi.aditya/"
                icon={<Facebook size={18} />}
              />
              <SocialLink
                href="https://x.com/_rafiaditya_"
                icon={<Twitter size={18} />}
              />
            </div>

            <p className="text-gray-500 text-xs leading-relaxed max-w-[220px]">
              Dapatkan info promo servis dan tips merawat gadget langsung di
              beranda sosial media Anda.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

// Komponen Ikon Sosmed (Tombol Kotak Rounded Modern)
const SocialLink = ({ href, icon }) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    className="w-10 h-10 flex items-center justify-center bg-white/5 hover:bg-brand-accent text-gray-400 hover:text-white rounded-xl transition transform hover:-translate-y-1 hover:shadow-lg border border-white/10"
  >
    {icon}
  </a>
);

export default Footer;
