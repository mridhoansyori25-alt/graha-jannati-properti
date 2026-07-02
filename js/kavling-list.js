/**
 * kavling-list.js — khusus kavling.html
 * Menangani filter (status, lokasi, harga, luas), sort, dan render grid kavling.
 */

let SEMUA_KAVLING = [];

document.addEventListener("DOMContentLoaded", async () => {
  const grid = document.getElementById("kavlingGrid");
  if (!grid) return;

  try {
    SEMUA_KAVLING = await getKavlingData();
    isiDropdownLokasi(SEMUA_KAVLING);
    terapkanFilterDariURL();
    renderGrid(SEMUA_KAVLING);
    pasangListenerFilter();
  } catch (err) {
    grid.innerHTML = `<p class="text-muted">Gagal memuat data kavling.</p>`;
    console.error(err);
  }
});

function isiDropdownLokasi(data) {
  const select = document.getElementById("filterLokasi");
  if (!select) return;
  getDaftarLokasi(data).forEach((kota) => {
    const opt = document.createElement("option");
    opt.value = kota;
    opt.textContent = kota;
    select.appendChild(opt);
  });
}

/* Baca parameter ?lokasi=&status= dari URL (dikirim dari hero search di beranda) */
function terapkanFilterDariURL() {
  const params = new URLSearchParams(window.location.search);
  const lokasi = params.get("lokasi");
  const status = params.get("status");

  if (lokasi) document.getElementById("filterLokasi").value = lokasi;
  if (status) document.getElementById("filterStatus").value = status;
}

function pasangListenerFilter() {
  ["filterStatus", "filterLokasi", "filterHargaMax", "filterLuasMin", "sortBy"].forEach((id) => {
    const el = document.getElementById(id);
    if (el) el.addEventListener("input", () => renderGrid(ambilDataTerfilter()));
  });

  const toggleBtn = document.getElementById("filterToggleMobile");
  const filterBar = document.getElementById("filterBar");
  if (toggleBtn && filterBar) {
    toggleBtn.addEventListener("click", () => filterBar.classList.toggle("open"));
  }
}

function ambilDataTerfilter() {
  const status = document.getElementById("filterStatus").value;
  const lokasi = document.getElementById("filterLokasi").value;
  const hargaMax = Number(document.getElementById("filterHargaMax").value) || Infinity;
  const luasMin = Number(document.getElementById("filterLuasMin").value) || 0;
  const sortBy = document.getElementById("sortBy").value;

  let hasil = SEMUA_KAVLING.filter((k) => {
    const cocokStatus = !status || k.status === status;
    const cocokLokasi = !lokasi || k.lokasi.kota === lokasi;
    const cocokHarga = k.harga <= hargaMax;
    const cocokLuas = k.luas >= luasMin;
    return cocokStatus && cocokLokasi && cocokHarga && cocokLuas;
  });

  if (sortBy === "harga_asc") hasil.sort((a, b) => a.harga - b.harga);
  if (sortBy === "harga_desc") hasil.sort((a, b) => b.harga - a.harga);
  if (sortBy === "luas_desc") hasil.sort((a, b) => b.luas - a.luas);

  return hasil;
}

function renderGrid(list) {
  const grid = document.getElementById("kavlingGrid");
  const countEl = document.getElementById("resultCount");

  if (countEl) countEl.textContent = `${list.length} kavling ditemukan`;

  if (list.length === 0) {
    grid.innerHTML = `<div class="empty-state"><h2>Tidak ada kavling yang cocok</h2><p>Coba ubah filter pencarian Anda.</p></div>`;
    return;
  }

  grid.innerHTML = list.map(renderKavlingCard).join("");
  setupCompareCheckboxes();
}
