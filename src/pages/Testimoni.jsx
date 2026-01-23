import React, { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { Star, User, Quote, Plus, X, Send } from "lucide-react";

const Testimoni = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // State Form
  const [formData, setFormData] = useState({
    name: "",
    role: "",
    message: "",
    rating: 5,
  });

  // 1. Fetch Data dari Supabase
  const fetchReviews = async () => {
    const { data, error } = await supabase
      .from("testimonials")
      .select("*")
      .order("created_at", { ascending: false }); // Yang terbaru di atas

    if (error) console.error(error);
    else setReviews(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  // 2. Handle Submit Review Baru
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const { error } = await supabase.from("testimonials").insert([formData]);

    if (error) {
      alert("Gagal kirim review: " + error.message);
    } else {
      alert("Terima kasih! Review Anda berhasil ditambahkan.");
      setShowModal(false);
      setFormData({ name: "", role: "", message: "", rating: 5 }); // Reset form
      fetchReviews(); // Refresh data agar review baru muncul
    }
    setIsSubmitting(false);
  };

  return (
    <div className="min-h-screen bg-brand-black text-white relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
        <div className="absolute top-20 right-[-100px] w-96 h-96 bg-brand-accent/10 rounded-full blur-[100px]"></div>
        <div className="absolute bottom-20 left-[-100px] w-96 h-96 bg-blue-500/10 rounded-full blur-[100px]"></div>
      </div>

      <div className="container mx-auto px-6 py-12 relative z-10">
        {/* HEADER SECTION */}
        <div className="text-center mb-16 max-w-2xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
            Kata Mereka Tentang <span className="text-brand-accent">Kami.</span>
          </h1>
          <p className="text-gray-400 text-lg mb-8">
            Kepercayaan Anda adalah prioritas kami. Lihat apa yang dikatakan
            pelanggan setia Bengkel TI.
          </p>

          {/* TOMBOL BUKA MODAL */}
          <button
            onClick={() => setShowModal(true)}
            className="group bg-brand-accent hover:bg-orange-600 text-white px-8 py-3 rounded-full font-bold transition shadow-[0_0_20px_rgba(249,115,22,0.4)] hover:shadow-[0_0_30px_rgba(249,115,22,0.6)] flex items-center gap-2 mx-auto"
          >
            <Plus
              size={20}
              className="group-hover:rotate-90 transition duration-300"
            />
            Tulis Pengalamanmu
          </button>
        </div>

        {/* LOADING STATE */}
        {loading ? (
          <div className="text-center py-20 text-gray-500 animate-pulse">
            Sedang memuat testimoni...
          </div>
        ) : (
          /* GRID TESTIMONI */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {reviews.length === 0 ? (
              <div className="col-span-full text-center py-20 bg-white/5 rounded-2xl border border-white/10 border-dashed">
                <p className="text-gray-400 text-xl">
                  Belum ada testimoni. Jadilah yang pertama!
                </p>
              </div>
            ) : (
              reviews.map((item) => (
                <div
                  key={item.id}
                  className="bg-white/5 backdrop-blur-md border border-white/10 p-6 rounded-2xl hover:border-brand-accent/50 transition group hover:-translate-y-1 duration-300"
                >
                  {/* Bintang & Quote */}
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          size={16}
                          className={
                            i < item.rating
                              ? "fill-brand-accent text-brand-accent"
                              : "text-gray-600"
                          }
                        />
                      ))}
                    </div>
                    <Quote
                      size={24}
                      className="text-white/10 group-hover:text-brand-accent/20 transition"
                    />
                  </div>

                  {/* Isi Pesan */}
                  <p className="text-gray-300 mb-6 leading-relaxed italic">
                    "{item.message}"
                  </p>

                  {/* Profil User */}
                  <div className="flex items-center gap-3 border-t border-white/10 pt-4">
                    <div className="bg-gradient-to-br from-brand-accent to-orange-700 w-10 h-10 rounded-full flex items-center justify-center text-white font-bold shadow-lg">
                      {item.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h4 className="font-bold text-white text-sm">
                        {item.name}
                      </h4>
                      <p className="text-xs text-gray-500">
                        {item.role || "Pelanggan"}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {/* --- MODAL FORM INPUT (POPUP) --- */}
      {showModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-brand-dark border border-white/20 w-full max-w-lg rounded-2xl p-6 shadow-2xl relative">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white"
            >
              <X size={24} />
            </button>

            <h2 className="text-2xl font-bold mb-1">Bagikan Ceritamu</h2>
            <p className="text-gray-400 text-sm mb-6">
              Masukan Anda membantu kami berkembang lebih baik.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-400 mb-1">
                    NAMA LENGKAP
                  </label>
                  <input
                    required
                    type="text"
                    placeholder="Nama Anda"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-2 text-white focus:border-brand-accent outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-400 mb-1">
                    JURUSAN / STATUS
                  </label>
                  <input
                    required
                    type="text"
                    placeholder="Contoh: TI / Dosen"
                    value={formData.role}
                    onChange={(e) =>
                      setFormData({ ...formData, role: e.target.value })
                    }
                    className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-2 text-white focus:border-brand-accent outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-400 mb-1">
                  BERI RATING
                </label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setFormData({ ...formData, rating: star })}
                      className="focus:outline-none transform hover:scale-110 transition"
                    >
                      <Star
                        size={28}
                        className={
                          star <= formData.rating
                            ? "fill-brand-accent text-brand-accent"
                            : "text-gray-600"
                        }
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-400 mb-1">
                  PENGALAMAN ANDA
                </label>
                <textarea
                  required
                  rows="4"
                  placeholder="Ceritakan pengalaman servis di sini..."
                  value={formData.message}
                  onChange={(e) =>
                    setFormData({ ...formData, message: e.target.value })
                  }
                  className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-brand-accent outline-none"
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-brand-accent hover:bg-orange-600 text-white font-bold py-3 rounded-lg flex justify-center items-center gap-2 transition"
              >
                {isSubmitting ? (
                  "Mengirim..."
                ) : (
                  <>
                    Kirim Testimoni <Send size={18} />
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
