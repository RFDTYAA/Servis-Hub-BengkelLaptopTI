import { createClient } from "@supabase/supabase-js";

// Nanti ganti string kosong ini dengan API Key dari Dashboard Supabase Anda
const supabaseUrl = "https://kwtetxinkrwqrpglhdql.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt3dGV0eGlua3J3cXJwZ2xoZHFsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjYwMjYzMTksImV4cCI6MjA4MTYwMjMxOX0.HEt52GpzEH0GOX4E9tJl8iOcTK_416JTcLO9WvX96So";

export const supabase = createClient(supabaseUrl, supabaseKey);

// Tambahkan ini untuk tes koneksi
supabase
  .from("profiles")
  .select("count", { count: "exact", head: true })
  .then(({ count, error }) => {
    if (error) console.error("❌ Koneksi Gagal:", error.message);
    else console.log("✅ Koneksi Supabase Berhasil! Terhubung ke database.");
  });
