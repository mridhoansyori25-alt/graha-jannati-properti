/**
 * home.js — khusus index.html
 * Menampilkan kavling unggulan dan mengarahkan pencarian hero ke halaman daftar.
 */

document.addEventListener("DOMContentLoaded", async () => {
  const container = document.getElementById("featuredGrid");
  if (!container) return;

  try {
    const data = await getKavlingData();
    const unggulan = data.filter((k) => k.unggulan).slice(0, 3);
    const daftar = unggulan.length > 0 ? unggulan : data.slice(0, 3);

    container.innerHTML = daftar.map(renderKavlingCard).join("");
    setupCompareCheckboxes();

    // Isi dropdown lokasi di hero search
    const lokasiSelect = document.getElementById("heroLokasi");
    if (lokasiSelect) {
      getDaftarLokasi(data).forEach((kota) => {
        const opt = document.createElement("option");
        opt.value = kota;
        opt.textContent = kota;
        lokasiSelect.appendChild(opt);
      });
    }
  } catch (err) {
    container.innerHTML = `<p class="text-muted">Gagal memuat data kavling.</p>`;
    console.error(err);
  }
});

function submitHeroSearch(event) {
  event.preventDefault();
  const lokasi = document.getElementById("heroLokasi").value;
  const status = document.getElementById("heroStatus").value;

  const params = new URLSearchParams();
  if (lokasi) params.set("lokasi", lokasi);
  if (status) params.set("status", status);

  window.location.href = `kavling.html?${params.toString()}`;
}
