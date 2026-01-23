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
  } = data;

  // Format Rupiah
  const formatRupiah = (num) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(num);

  return (
    <div
      ref={ref}
      className="bg-white text-black p-10 font-sans max-w-3xl mx-auto border border-gray-200"
      style={{ minHeight: "297mm" }}
    >
      {" "}
      {/* Ukuran A4 */}
      {/* HEADER */}
      <div className="flex justify-between items-start border-b-4 border-orange-600 pb-6 mb-6">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tighter text-gray-900">
            #BengkelLaptop<span className="text-orange-600">TI.</span>
          </h1>
          <p className="text-gray-500 mt-2 text-sm">
            Jasa Servis & Maintenance Laptop Profesional
          </p>
          <p className="text-gray-500 text-sm">
            Jl. Raya Ponorogo - Madiun, No. 123
          </p>
          <p className="text-gray-500 text-sm">WhatsApp: 0812-3456-7890</p>
        </div>
        <div className="text-right">
          <h2 className="text-2xl font-bold text-gray-400 uppercase tracking-widest">
            INVOICE
          </h2>
          <p className="font-mono text-lg font-bold text-orange-600 mt-1">
            #{id}
          </p>
          <p className="text-sm text-gray-500 mt-1">
            Tanggal:{" "}
            {new Date(created_at).toLocaleDateString("id-ID", {
              dateStyle: "long",
            })}
          </p>

          {/* Status Badge di Nota */}
          <div
            className={`mt-4 inline-block px-4 py-1 rounded border-2 font-bold uppercase text-xs
            ${
              status === "Done"
                ? "border-green-600 text-green-600"
                : "border-blue-600 text-blue-600"
            }`}
          >
            {status === "Done" ? "LUNAS / SELESAI" : "DALAM PENGERJAAN"}
          </div>
        </div>
      </div>
      {/* INFO PELANGGAN */}
      <div className="flex justify-between mb-10">
        <div className="w-1/2">
          <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
            Ditagihkan Kepada:
          </h3>
          <p className="font-bold text-xl text-gray-800">
            {profiles?.full_name}
          </p>
          <p className="text-gray-600">{profiles?.email}</p>
        </div>
        <div className="w-1/2 text-right">
          <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
            Metode Pembayaran:
          </h3>
          <p className="font-bold text-gray-800">Cash / Transfer</p>
        </div>
      </div>
      {/* TABEL RINCIAN */}
      <div className="mb-8">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-100 text-gray-600 uppercase text-xs tracking-wider">
              <th className="p-4 border-b-2 border-gray-200">
                Deskripsi Layanan
              </th>
              <th className="p-4 border-b-2 border-gray-200 text-right">
                Biaya
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="p-4 border-b border-gray-100">
                <p className="font-bold text-lg text-gray-800">{device_name}</p>
                <p className="text-gray-500 text-sm mt-1 whitespace-pre-wrap">
                  {problem_desc}
                </p>
              </td>
              <td className="p-4 border-b border-gray-100 text-right font-mono text-lg">
                {formatRupiah(total_cost)}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      {/* TOTAL */}
      <div className="flex justify-end mb-16">
        <div className="w-1/2 bg-orange-50 p-6 rounded-xl">
          <div className="flex justify-between items-center">
            <span className="font-bold text-gray-600">Total Tagihan</span>
            <span className="font-bold text-3xl text-orange-600">
              {formatRupiah(total_cost)}
            </span>
          </div>
        </div>
      </div>
      {/* FOOTER / TTD */}
      <div className="flex justify-between items-end mt-auto pt-10 border-t border-gray-200">
        <div className="text-xs text-gray-400 max-w-md">
          <p className="font-bold text-gray-600 mb-1">Syarat & Ketentuan:</p>
          <ul className="list-disc pl-4 space-y-1">
            <li>Garansi servis berlaku 7 hari setelah barang diambil.</li>
            <li>
              Barang yang tidak diambil lebih dari 1 bulan bukan tanggung jawab
              kami.
            </li>
            <li>Simpan nota ini sebagai bukti garansi.</li>
          </ul>
        </div>
        <div className="text-center">
          <p className="text-sm font-bold text-gray-600 mb-16">Hormat Kami,</p>
          <div className="h-px w-40 bg-gray-300 mx-auto"></div>
          <p className="text-xs text-gray-400 mt-2">Admin Bengkel TI</p>
        </div>
      </div>
    </div>
  );
});
