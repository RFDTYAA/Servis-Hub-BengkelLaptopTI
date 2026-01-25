import React from "react";

import fotorafi from "../assets/fotoprofile/rafi.png";
import fotojauhan from "../assets/fotoprofile/jauhan.png";
import fotoadjie from "../assets/fotoprofile/adjie.png";
import fotodamtoy from "../assets/fotoprofile/damtoy.png";
import fotoridho from "../assets/fotoprofile/ridho.png";
import fotofarrel from "../assets/fotoprofile/farrel.jpg";
import fotoraja from "../assets/fotoprofile/raja.jpg";
import fotowildan from "../assets/fotoprofile/wildan.jpg";

import {
  Award,
  Users,
  Wallet,
  GraduationCap,
  ArrowUpRight,
  CheckCircle2,
} from "lucide-react";

const About = () => {
  // --- SETUP WHATSAPP LINK (BARU) ---
  const phoneNumber = "6282125548653";
  const message =
    "Halo Admin, saya ingin konsultasi perihal cara bergabung menjadi staff Bengkel TI.";
  const waLink = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(
    message,
  )}`;

  const teamMembers = [
    {
      name: "Mohammad Ridho Cahyono",
      role: "Laptop & Handphone Specialist",
      img: fotoridho,
    },
    {
      name: "Muhammad Rafi Aditya",
      role: "PC Specialist & Web Designer",
      img: fotorafi,
    },
    {
      name: "Adam Toyib Nurwahid",
      role: "Printer Specialist",
      img: fotodamtoy,
    },
    {
      name: "Muhammad Setya Adjie",
      role: "Handphone Specialist",
      img: fotoadjie,
    },
    {
      name: "Farrel Ghozy Afifuddin",
      role: "Laptop & Handphone Specialist",
      img: fotofarrel,
    },
    {
      name: "Muhammad Wildan",
      role: "Laptop & Handphone Specialist",
      img: fotowildan,
    },
    {
      name: "Raja Muhammad",
      role: "Laptop & PC Specialist",
      img: fotoraja,
    },
    {
      name: "Jauhan Ahmad",
      role: "Web Designer",
      img: fotojauhan,
    },
  ];

  return (
    <div className="bg-brand-black text-white min-h-screen">
      {/* 1. HERO SECTION: Intro tentang Identitas */}
      <section className="relative py-20 overflow-hidden">
        {/* Background Accent */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-brand-accent/10 blur-[120px] rounded-full"></div>

        <div className="container mx-auto px-6 relative z-10 text-center">
          <span className="text-brand-cyan font-bold tracking-widest uppercase text-sm mb-4 block">
            Tentang Kami
          </span>
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Sinergi Mahasiswa &{" "}
            <span className="text-brand-accent">Teknologi</span>
          </h1>
          <p className="text-gray-400 max-w-2xl mx-auto text-lg leading-relaxed">
            Bengkel TI UNIDA Gontor dikelola langsung oleh Mahasiswa Terbaik
            Program Studi Informatika. Kami memadukan teori akademis terkini
            dengan pengalaman praktik lapangan untuk memberikan solusi perbaikan
            terbaik.
          </p>
        </div>
      </section>

      {/* 2. VALUE PROPOSITION */}
      <section className="pb-20">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Card 1 */}
            <div className="bg-brand-dark p-8 rounded-2xl border border-white/5 hover:border-brand-accent/50 transition duration-300 group">
              <div className="bg-brand-black w-14 h-14 rounded-xl flex items-center justify-center mb-6 group-hover:bg-brand-accent transition">
                <Users className="text-white" size={28} />
              </div>
              <h3 className="text-xl font-bold mb-3">Konsultasi Gratis</h3>
              <p className="text-gray-400">
                Bingung kenapa laptop lemot? Konsultasikan dulu masalah Anda
                kepada kami tanpa biaya sepeserpun. Jujur dan transparan.
              </p>
            </div>

            {/* Card 2 */}
            <div className="bg-brand-dark p-8 rounded-2xl border border-white/5 hover:border-brand-accent/50 transition duration-300 group">
              <div className="bg-brand-black w-14 h-14 rounded-xl flex items-center justify-center mb-6 group-hover:bg-brand-accent transition">
                <Wallet className="text-white" size={28} />
              </div>
              <h3 className="text-xl font-bold mb-3">Harga Mahasiswa</h3>
              <p className="text-gray-400">
                Kami paham kebutuhan Anda. Layanan profesional dengan harga yang
                tetap ramah di kantong mahasiswa dan umum.
              </p>
            </div>

            {/* Card 3 */}
            <div className="bg-brand-dark p-8 rounded-2xl border border-white/5 hover:border-brand-accent/50 transition duration-300 group">
              <div className="bg-brand-black w-14 h-14 rounded-xl flex items-center justify-center mb-6 group-hover:bg-brand-accent transition">
                <Award className="text-white" size={28} />
              </div>
              <h3 className="text-xl font-bold mb-3">Bergaransi</h3>
              <p className="text-gray-400">
                Kualitas adalah prioritas. Setiap layanan perbaikan kami
                lengkapi dengan garansi untuk memastikan kepuasan Anda.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. UNIVERSITY BADGE SECTION */}
      <section className="py-16 bg-brand-dark border-y border-white/5">
        <div className="container mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex items-center gap-6">
            <div className="bg-white/10 p-4 rounded-full">
              <GraduationCap size={40} className="text-brand-cyan" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">
                Managed by GitaFreyaAnindya{" "}
              </h2>
              <p className="text-gray-400">
                Unit Usaha Mahasiswa Teknik Informatika Universitas Darussalam
                Gontor
              </p>
            </div>
          </div>
          <div className="flex gap-4">
            {/* Badge Dekoratif */}
            <div className="px-6 py-2 rounded-full border border-white/10 text-sm text-gray-300">
              Professional
            </div>
            <div className="px-6 py-2 rounded-full border border-white/10 text-sm text-gray-300">
              Trusted
            </div>
            <div className="px-6 py-2 rounded-full border border-white/10 text-sm text-gray-300">
              Skillful
            </div>
          </div>
        </div>
      </section>

      {/* 4. TEAM SECTION */}
      <section className="py-24 relative">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Meet Our Experts</h2>
            <p className="text-gray-400 max-w-xl mx-auto">
              Kenali orang-orang hebat di balik layanan terbaik Bengkel TI. Tim
              ahli yang berdedikasi untuk solusi gadget Anda.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {teamMembers.map((member, index) => (
              <div
                key={index}
                className="group bg-brand-dark rounded-xl overflow-hidden hover:-translate-y-2 transition duration-300 border border-white/5 hover:border-brand-accent/30 shadow-lg"
              >
                {/* Image Container */}
                <div className="relative h-64 overflow-hidden">
                  <div className="absolute inset-0 bg-brand-accent/20 mix-blend-overlay z-10 opacity-0 group-hover:opacity-100 transition"></div>
                  <img
                    src={member.img}
                    alt={member.name}
                    className="w-full h-full object-cover transition duration-500 group-hover:scale-110 grayscale group-hover:grayscale-0"
                  />
                </div>

                {/* Text Content */}
                <div className="p-6 text-center relative">
                  {/* Decorative Line */}
                  <div className="w-10 h-1 bg-brand-accent mx-auto mb-4 rounded-full"></div>
                  <h3 className="text-lg font-bold text-white mb-1 group-hover:text-brand-cyan transition">
                    {member.name}
                  </h3>
                  <p className="text-sm text-gray-400">{member.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. CTA SIMPLE */}
      <section className="py-20 bg-gradient-to-t from-brand-accent/10 to-brand-black text-center">
        <h2 className="text-2xl font-bold mb-6">
          Ingin bergabung dengan tim kami?
        </h2>
        {/* PERUBAHAN: Link WhatsApp dengan pesan custom */}
        <a
          href={waLink}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 mx-auto text-brand-accent hover:text-white font-bold transition border-b border-brand-accent pb-1 hover:border-white cursor-pointer"
        >
          Hubungi Admin <ArrowUpRight size={18} />
        </a>
      </section>
    </div>
  );
};

export default About;
