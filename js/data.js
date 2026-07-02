/**
 * data.js
 * Semua fungsi untuk mengambil dan mengolah data dari data/kavling.json.
 * Setiap halaman cukup panggil getKavlingData() untuk dapat array kavling.
 */

async function getKavlingData() {
  const res = await fetch("data/kavling.json");
  if (!res.ok) {
    throw new Error("Gagal memuat data kavling.json");
  }
  const json = await res.json();
  return json.kavling;
}

function getKavlingById(list, id) {
  return list.find((k) => k.id === id);
}

function formatRupiah(angka) {
  return "Rp " + Number(angka).toLocaleString("id-ID");
}

function formatHargaPerM2(harga, luas) {
  const perM2 = Math.round(harga / luas);
  return formatRupiah(perM2) + " / m²";
}

function waLink(nomor, kavling) {
  const pesan = `Halo, saya tertarik dengan ${kavling.nama} (kode ${kavling.id}) di ${kavling.lokasi.kota}. Apakah masih tersedia?`;
  return `https://wa.me/${nomor}?text=${encodeURIComponent(pesan)}`;
}

/* Daftar lokasi unik — dipakai untuk isi dropdown filter lokasi */
function getDaftarLokasi(list) {
  const kota = list.map((k) => k.lokasi.kota);
  return [...new Set(kota)];
}
