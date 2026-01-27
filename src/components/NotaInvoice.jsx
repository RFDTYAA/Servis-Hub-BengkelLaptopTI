import React from "react";

// Menggunakan forwardRef agar bisa dibaca oleh library printer
export const NotaInvoice = React.forwardRef(({ data }, ref) => {
  if (!data) return null;

  const {
    id,
    created_at,
    device_name,
    problem_desc,
    total_cost,
    status,
    profiles,
    payment_type,
    technician_name,
  } = data;

  // Format Rupiah
  const formatRupiah = (num) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(num);

  // Status Lunas (Support Bahasa Indo & Inggris)
  const isPaid = status === "Selesai" || status === "Done";

  // Bersihkan deskripsi dari tag internal [ ]
  const cleanDesc = (desc) => {
    if (!desc) return "";
    return desc.replace(/\[.*?\]/g, "").trim();
  };

  return (
    <div className="flex justify-center bg-gray-100 py-10 print:bg-white print:p-0">
      <div
        ref={ref}
        className="bg-white text-slate-800 font-sans relative shadow-xl print:shadow-none flex flex-col justify-between"
        // Style: A4 Fixed Size dengan Padding Bawah Besar (70mm) agar footer naik ke 3/4 halaman
        style={{
          width: "210mm",
          height: "297mm",
          boxSizing: "border-box",
          padding: "12mm 12mm 70mm 12mm", // Atas Kanan Bawah Kiri (Bawah 70mm = Space kosong)
        }}
      >
        {/* === KONTEN UTAMA (HEADER - BODY) === */}
        <div className="flex-grow">
          {/* HEADER */}
          <div className="flex justify-between items-start border-b-4 border-orange-600 pb-5 mb-6">
            <div className="w-2/3 pr-4">
              <h1 className="text-3xl font-extrabold tracking-tighter text-slate-900">
                #BengkelLaptop<span className="text-orange-600">TI.</span>
              </h1>
              <p className="text-slate-500 mt-1 text-xs leading-relaxed">
                Solusi Perbaikan Gadget Profesional & Bergaransi.
              </p>
              <div className="mt-2 text-[10px] text-slate-500 space-y-0.5">
                <p>
                  <strong>Alamat:</strong> Gedung Terpadu Unida Gontor, Lt 2
                  R.208
                </p>
                <p>Jl. Raya Siman Km. 5, Ponorogo, Jawa Timur, 63471</p>
                <p>
                  <strong>WhatsApp:</strong> 0821-2554-8653
                </p>
              </div>
            </div>

            <div className="text-right">
              <h2 className="text-2xl font-bold text-slate-300 uppercase tracking-widest">
                INVOICE
              </h2>
              <p className="font-mono text-lg font-bold text-orange-600 mt-0.5">
                #{id.slice(0, 8).toUpperCase()}
              </p>
              <p className="text-xs text-slate-500 mt-0.5">
                {new Date(created_at).toLocaleDateString("id-ID", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </p>
            </div>
          </div>

          {/* INFO PELANGGAN */}
          <div className="flex justify-between mb-6 bg-slate-50 p-4 rounded-lg border border-slate-100">
            <div className="w-1/2">
              <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                Kepada Yth:
              </h3>
              <p className="font-bold text-base text-slate-800 uppercase">
                {profiles?.full_name || "Pelanggan Umum"}
              </p>
              <p className="text-xs text-slate-600">{profiles?.email}</p>
              <p className="text-xs text-slate-600">
                {profiles?.phone_number || "-"}
              </p>
            </div>
            <div className="w-1/2 text-right border-l border-slate-200 pl-4">
              <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                Pembayaran:
              </h3>
              <p className="font-bold text-base text-slate-800 uppercase">
                {payment_type || "Cash"}
              </p>
              <div className="mt-1">
                {isPaid ? (
                  <span className="text-[10px] font-bold text-green-700 bg-green-100 px-2 py-0.5 rounded">
                    LUNAS
                  </span>
                ) : (
                  <span className="text-[10px] font-bold text-red-600 bg-red-100 px-2 py-0.5 rounded">
                    BELUM LUNAS
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* TABEL RINCIAN */}
          <div className="mb-6">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-800 text-white uppercase text-[10px] tracking-wider">
                  <th className="p-3 rounded-tl-md w-1/2">Deskripsi Layanan</th>
                  <th className="p-3">Teknisi</th>
                  <th className="p-3 text-right rounded-tr-md">Biaya</th>
                </tr>
              </thead>
              <tbody className="text-xs text-slate-700">
                <tr className="border-b border-slate-200">
                  <td className="p-3 align-top">
                    <p className="font-bold text-sm text-slate-900 mb-1">
                      {device_name}
                    </p>
                    <p className="text-slate-500 whitespace-pre-wrap leading-relaxed max-w-xs">
                      {cleanDesc(problem_desc)}
                    </p>
                  </td>
                  <td className="p-3 align-top font-medium">
                    {technician_name || "-"}
                  </td>
                  <td className="p-3 align-top text-right font-mono text-sm font-bold text-slate-800">
                    {formatRupiah(total_cost)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* TOTAL */}
          <div className="flex justify-end mb-6">
            <div className="w-1/2">
              <div className="flex justify-between items-center py-2 border-b-2 border-slate-200">
                <span className="text-sm font-bold text-slate-600">
                  Total Tagihan
                </span>
                <span className="font-bold text-2xl text-orange-600">
                  {formatRupiah(total_cost)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* === FOOTER (GARANSI & TTD) - POSISI LEBIH NAIK === */}
        {/* Menggunakan items-start agar sejajar dari atas garis */}
        <div className="flex justify-between items-start pt-4 border-t-2 border-slate-200">
          {/* KIRI: Syarat & Ketentuan */}
          <div className="text-[9px] text-slate-400 max-w-sm leading-relaxed pr-2 pt-1">
            <p className="font-bold text-slate-600 mb-1 uppercase">
              Ketentuan Garansi:
            </p>
            <ul className="list-disc pl-3 space-y-0.5">
              <li>
                Garansi servis berlaku 7 hari setelah barang diambil (kerusakan
                sama).
              </li>
              <li>
                Barang tidak diambil &gt; 30 hari diluar tanggung jawab kami.
              </li>
              <li>
                Nota ini adalah bukti pembayaran & klaim garansi yang sah.
              </li>
            </ul>
          </div>

          {/* KANAN: Tanda Tangan & Stempel */}
          <div className="text-center relative w-40 pt-1">
            {/* STEMPEL (Ditempatkan di tengah area TTD) */}
            {isPaid && (
              <div className="absolute top-4 left-1/2 -translate-x-1/2 w-24 h-24 border-[3px] border-green-600 rounded-full flex items-center justify-center opacity-85 -rotate-12 pointer-events-none mix-blend-multiply z-10">
                <div className="w-20 h-20 border border-green-600 rounded-full flex items-center justify-center">
                  <div className="text-center leading-none">
                    <div className="text-[8px] font-bold text-green-600 tracking-wider mb-0.5">
                      BENGKEL TI
                    </div>
                    <div className="text-xl font-black text-green-600 tracking-widest">
                      LUNAS
                    </div>
                    <div className="text-[7px] font-mono text-green-600 mt-0.5">
                      OFFICIAL
                    </div>
                  </div>
                </div>
              </div>
            )}

            <p className="text-xs font-bold text-slate-600 mb-16">
              Hormat Kami,
            </p>

            <div className="border-b border-slate-400 pb-1 mb-1 relative z-20">
              <p className="text-xs font-bold text-slate-800">
                Admin Bengkel TI
              </p>
            </div>
            <p className="text-[8px] text-slate-400 uppercase tracking-widest">
              Authorized Signature
            </p>
          </div>
        </div>
      </div>
    </div>
  );
});
