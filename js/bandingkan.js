/**
 * bandingkan.js — khusus bandingkan.html
 * Menampilkan tabel perbandingan kavling yang tersimpan di localStorage.
 */

document.addEventListener("DOMContentLoaded", async () => {
  const wrap = document.getElementById("compareWrap");
  if (!wrap) return;

  try {
    const data = await getKavlingData();
    renderTabelBandingkan(data);
  } catch (err) {
    wrap.innerHTML = `<p class="text-muted">Gagal memuat data kavling.</p>`;
    console.error(err);
  }
});

function renderTabelBandingkan(data) {
  const wrap = document.getElementById("compareWrap");
  const ids = getCompareList();
  const list = ids.map((id) => getKavlingById(data, id)).filter(Boolean);

  if (list.length === 0) {
    wrap.innerHTML = `
      <div class="empty-state">
        <h2>Belum ada kavling untuk dibandingkan</h2>
        <p>Centang "Bandingkan" pada kartu kavling di halaman Semua Kavling.</p>
        <p style="margin-top:16px;"><a href="kavling.html" class="btn btn-primary">Lihat semua kavling</a></p>
      </div>`;
    return;
  }

  const baris = (label, fn) => `
    <tr>
      <th>${label}</th>
      ${list.map((k) => `<td>${fn(k)}</td>`).join("")}
    </tr>`;

  wrap.innerHTML = `
    <div class="compare-table-wrap">
      <table class="compare-table">
        <tbody>
          <tr>
            <th></th>
            ${list.map((k) => `<td><strong>${k.nama}</strong><br><span class="text-muted">Kode ${k.id}</span></td>`).join("")}
          </tr>
          ${baris("Status", (k) => renderStatusBadge(k.status))}
          ${baris("Lokasi", (k) => `${k.lokasi.kota}, ${k.lokasi.wilayah}`)}
          ${baris("Luas", (k) => `<span class="angka">${k.luas} m²</span>`)}
          ${baris("Harga", (k) => `<span class="angka">${formatRupiah(k.harga)}</span>`)}
          ${baris("Harga / m²", (k) => `<span class="angka">${formatHargaPerM2(k.harga, k.luas)}</span>`)}
          ${baris("Legalitas", (k) => k.legalitas)}
          ${baris("Akses jalan", (k) => k.akses_jalan)}
          ${baris("", (k) => `<a href="kavling-detail.html?id=${k.id}" class="btn btn-secondary btn-sm">Lihat detail</a>`)}
          <tr>
            <td class="remove-cell"></td>
            ${list.map((k) => `<td class="remove-cell"><button class="btn btn-sm" onclick="hapusDariBandingkan('${k.id}')">Hapus</button></td>`).join("")}
          </tr>
        </tbody>
      </table>
    </div>`;
}

function hapusDariBandingkan(id) {
  removeFromCompare(id);
  getKavlingData().then(renderTabelBandingkan);
}
