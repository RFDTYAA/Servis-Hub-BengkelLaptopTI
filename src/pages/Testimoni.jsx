import React, { useState, useEffect } from "react";
import {
  Star,
  Quote,
  MessageSquarePlus,
  User,
  Loader2,
  X,
  Send,
} from "lucide-react";
import { supabase } from "../lib/supabaseClient";

const Testimoni = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);

  // STATE BARU: Untuk Mengatur Modal & Form
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    role: "", // Misal: Mahasiswa TI
    message: "",
    rating: 5, // Default bintang 5
  });

  // 1. FUNGSI AMBIL DATA (READ)
  const fetchTestimonials = async () => {
    try {
      setLoading(true);
      // PERBAIKAN: Menggunakan nama tabel 'testimonials'
      const { data, error } = await supabase
        .from("testimonials")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      if (data) setTestimonials(data);
    } catch (error) {
      console.error("Gagal ambil data:", error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTestimonials();
  }, []);

  // 2. FUNGSI KIRIM DATA (CREATE)
  const handleSubmit = async (e) => {
    e.preventDefault(); // Mencegah reload halaman
    setIsSubmitting(true);

    try {
      // Validasi sederhana
      if (!formData.name || !formData.message) {
        alert("Nama dan Pesan wajib diisi!");
        setIsSubmitting(false);
        return;
      }

      // PERBAIKAN: Menggunakan nama tabel 'testimonials' (disamakan dengan saat fetch)
      const { error } = await supabase.from("testimonials").insert([formData]);

      if (error) throw error;

      // Jika sukses:
      alert("Terima kasih! Ulasan Anda berhasil dikirim.");
      setIsModalOpen(false); // Tutup Modal
      setFormData({ name: "", role: "", message: "", rating: 5 }); // Reset Form
      fetchTestimonials(); // Refresh data agar ulasan baru langsung muncul
    } catch (error) {
      alert("Gagal mengirim ulasan: " + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-brand-black text-white min-h-screen py-20 relative">
      {/* HEADER */}
      <div className="container mx-auto px-6 text-center mb-16">
        <span className="text-brand-accent font-bold tracking-widest uppercase text-sm mb-2 block">
          Kata Mereka
        </span>
        <h1 className="text-4xl md:text-5xl font-bold mb-6">
          Tentang <span className="text-brand-cyan">Kami</span>
        </h1>
        <p className="text-gray-400 max-w-2xl mx-auto mb-8">
          Kepuasan pelanggan adalah prioritas kami. Berikut adalah pengalaman
          nyata mereka yang pernah servis di BengkelTl.
        </p>

        {/* TOMBOL BUKA MODAL */}
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-white/5 hover:bg-brand-accent border border-white/10 text-white px-6 py-3 rounded-full font-bold transition flex items-center gap-2 mx-auto group shadow-lg hover:shadow-brand-accent/20"
        >
          <MessageSquarePlus
            size={20}
            className="text-brand-accent group-hover:text-white transition"
          />
          Tulis Pengalamanmu
        </button>
      </div>

      {/* GRID TESTIMONI */}
      <div className="container mx-auto px-6">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2
              size={48}
              className="text-brand-accent animate-spin mb-4"
            />
            <p className="text-gray-400">Memuat ulasan...</p>
          </div>
        ) : testimonials.length === 0 ? (
          <div className="text-center py-20 bg-brand-dark rounded-2xl border border-white/5 border-dashed">
            <p className="text-gray-500 text-lg">
              Belum ada testimoni. Jadilah yang pertama!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {testimonials.map((item) => (
              <div
                key={item.id}
                className="bg-brand-dark p-8 rounded-2xl border border-white/5 relative flex flex-col h-full hover:border-brand-accent/30 transition duration-300 shadow-lg"
              >
                <Quote
                  size={40}
                  className="absolute top-6 right-6 text-white/5 rotate-180"
                />

                <div className="flex gap-1 mb-4 text-brand-accent">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={18}
                      fill={i < item.rating ? "currentColor" : "none"}
                      className={
                        i < item.rating ? "text-brand-accent" : "text-gray-600"
                      }
                    />
                  ))}
                </div>

                <p className="text-gray-300 leading-relaxed mb-8 italic flex-grow">
                  "{item.message}"
                </p>

                <div className="flex items-center gap-4 border-t border-white/5 pt-6 mt-auto">
                  <div className="w-12 h-12 bg-gradient-to-br from-brand-accent to-brand-cyan rounded-full flex items-center justify-center text-white font-bold shadow-md shrink-0">
                    <User size={20} />
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-lg leading-tight">
                      {item.name}
                    </h4>
                    <span className="text-sm text-brand-cyan font-medium">
                      {item.role || "Pelanggan"}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* --- MODAL FORM (POP-UP) --- */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-brand-dark border border-white/10 rounded-2xl p-6 w-full max-w-lg shadow-2xl relative animate-in fade-in zoom-in duration-200">
            {/* Tombol Close */}
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white bg-white/5 hover:bg-red-500/20 p-2 rounded-full transition"
            >
              <X size={20} />
            </button>

            <h2 className="text-2xl font-bold mb-6 text-white">
              Bagikan Pengalamanmu
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Input Nama */}
              <div>
                <label className="block text-sm text-gray-400 mb-1">
                  Nama Lengkap
                </label>
                <input
                  type="text"
                  required
                  className="w-full bg-brand-black border border-white/10 rounded-lg p-3 text-white focus:border-brand-accent focus:outline-none"
                  placeholder="Contoh: Muhammad Rafi Aditya"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                />
              </div>

              {/* Input Role/Status */}
              <div>
                <label className="block text-sm text-gray-400 mb-1">
                  Program Studi / Status
                </label>
                <input
                  type="text"
                  className="w-full bg-brand-black border border-white/10 rounded-lg p-3 text-white focus:border-brand-accent focus:outline-none"
                  placeholder="Contoh: Teknik Informatika / Mahasiswa"
                  value={formData.role}
                  onChange={(e) =>
                    setFormData({ ...formData, role: e.target.value })
                  }
                />
              </div>

              {/* Input Rating Bintang */}
              <div>
                <label className="block text-sm text-gray-400 mb-2">
                  Rating Kepuasan
                </label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      type="button"
                      key={star}
                      onClick={() => setFormData({ ...formData, rating: star })}
                      className={`transition transform hover:scale-110 ${star <= formData.rating ? "text-yellow-400" : "text-gray-600"}`}
                    >
                      <Star
                        size={32}
                        fill={star <= formData.rating ? "currentColor" : "none"}
                      />
                    </button>
                  ))}
                </div>
              </div>

              {/* Input Pesan */}
              <div>
                <label className="block text-sm text-gray-400 mb-1">
                  Pesan Ulasan
                </label>
                <textarea
                  required
                  rows="4"
                  className="w-full bg-brand-black border border-white/10 rounded-lg p-3 text-white focus:border-brand-accent focus:outline-none resize-none"
                  placeholder="Ceritakan pengalaman servis di sini..."
                  value={formData.message}
                  onChange={(e) =>
                    setFormData({ ...formData, message: e.target.value })
                  }
                ></textarea>
              </div>

              {/* Tombol Submit */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-brand-accent hover:bg-orange-600 text-white font-bold py-3 rounded-lg transition flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 size={20} className="animate-spin" /> Mengirim...
                  </>
                ) : (
                  <>
                    <Send size={20} /> Kirim Ulasan
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Testimoni;
