import React from "react";
import {
  Facebook,
  Instagram,
  Twitter,
  MapPin,
  Phone,
  Mail,
} from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-brand-dark text-gray-400 py-16 border-t border-white/10">
      <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12">
        {/* Kolom 1: Brand */}
        <div>
          <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
            Bengkel<span className="text-brand-accent">TI</span>
          </h3>
          <p className="leading-relaxed mb-6">
            Solusi terbaik untuk perbaikan Laptop, PC Gaming, dan Jaringan.
            Cepat, Transparan, dan Bergaransi.
          </p>
          <div className="flex gap-4">
            <SocialIcon icon={<Instagram size={20} />} />
            <SocialIcon icon={<Facebook size={20} />} />
            <SocialIcon icon={<Twitter size={20} />} />
          </div>
        </div>

        {/* Kolom 2: Layanan */}
        <div>
          <h4 className="text-white font-bold text-lg mb-6">Layanan Kami</h4>
          <ul className="space-y-4">
            <FooterLink text="Servis Hardware" />
            <FooterLink text="Install Ulang OS" />
            <FooterLink text="Rakit PC Gaming" />
            <FooterLink text="Recovery Data" />
          </ul>
        </div>

        {/* Kolom 3: Link Cepat */}
        <div>
          <h4 className="text-white font-bold text-lg mb-6">Navigasi</h4>
          <ul className="space-y-4">
            <FooterLink text="Tentang Kami" />
            <FooterLink text="Cek Status Servis" />
            <FooterLink text="Testimoni Pelanggan" />
            <FooterLink text="Hubungi Admin" />
          </ul>
        </div>

        {/* Kolom 4: Kontak & Newsletter */}
        <div>
          <h4 className="text-white font-bold text-lg mb-6">Hubungi Kami</h4>
          <div className="space-y-4 mb-6">
            <div className="flex items-start gap-3">
              <MapPin className="text-brand-accent shrink-0" size={20} />
              <span>Jl. Teknologi No. 10, Jakarta Selatan</span>
            </div>
            <div className="flex items-center gap-3">
              <Phone className="text-brand-accent shrink-0" size={20} />
              <span>+62 812-3456-7890</span>
            </div>
            <div className="flex items-center gap-3">
              <Mail className="text-brand-accent shrink-0" size={20} />
              <span>support@bengkelti.com</span>
            </div>
          </div>

          {/* Form Newsletter kecil mirip gambar */}
          <div className="flex">
            <input
              type="email"
              placeholder="Email Anda"
              className="w-full bg-black/30 border border-white/10 px-4 py-2 rounded-l focus:outline-none focus:border-brand-accent text-white"
            />
            <button className="bg-brand-accent text-white px-4 py-2 rounded-r font-bold">
              Kirim
            </button>
          </div>
        </div>
      </div>
      <div className="container mx-auto px-6 mt-16 pt-8 border-t border-white/5 text-center text-sm">
        &copy; 2024 Bengkel TI. All rights reserved.
      </div>
    </footer>
  );
};

// Komponen Kecil
const SocialIcon = ({ icon }) => (
  <a
    href="#"
    className="w-10 h-10 rounded-full bg-black/30 flex items-center justify-center hover:bg-brand-accent hover:text-white transition"
  >
    {icon}
  </a>
);

const FooterLink = ({ text }) => (
  <li>
    <a href="#" className="hover:text-brand-accent transition">
      {text}
    </a>
  </li>
);

export default Footer;
