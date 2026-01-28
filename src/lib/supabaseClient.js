import { createClient } from "@supabase/supabase-js";

// Mengambil URL & Key dari file .env (Environment Variables)
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Cek error jika .env belum dibuat
if (!supabaseUrl || !supabaseKey) {
  throw new Error(
    "Supabase URL atau Key tidak ditemukan. Pastikan file .env sudah dibuat.",
  );
}

export const supabase = createClient(supabaseUrl, supabaseKey);

// Log koneksi untuk debugging (Opsional, bisa dihapus saat production)
supabase
  .from("profiles")
  .select("count", { count: "exact", head: true })
  .then(({ count, error }) => {
    if (error) console.error("❌ Koneksi Gagal:", error.message);
    else console.log("✅ Koneksi Supabase Berhasil!");
  });
