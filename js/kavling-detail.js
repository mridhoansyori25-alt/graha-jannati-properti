/**
 * kavling-detail.js — khusus kavling-detail.html
 * Membaca ?id= dari URL, menampilkan detail lengkap satu kavling.
 */

const NOMOR_WA = "6282157603218"; // ganti nommornya

document.addEventListener("DOMContentLoaded", async () => {
  const wrap = document.getElementById("detailWrap");
  if (!wrap) return;

  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");

  try {
    const data = await getKavlingData();
    const kavling = getKavlingById(data, id);

    if (!kavling) {
      wrap.innerHTML = `<div class="empty-state"><h2>Kavling tidak ditemukan</h2><p><a href="kavling.html" class="btn btn-primary">Lihat semua kavling</a></p></div>`;
      return;
    }

    document.title = `${kavling.nama} — LogoKavling`;
    renderDetail(kavling);
    renderSerupa(data, kavling);
    setupCompareCheckboxes();
  } catch (err) {
    wrap.innerHTML = `<p class="text-muted">Gagal memuat data kavling.</p>`;
    console.error(err);
  }
});

function renderDetail(kavling) {
  document.getElementById("breadcrumbLokasi").textContent = kavling.lokasi.kota;
  document.getElementById("breadcrumbNama").textContent = kavling.nama;

  document.getElementById("galleryMain").innerHTML =
    `<img src="${kavling.foto[0] || ''}" alt="Foto utama ${kavling.nama}">`;

  const thumbs = kavling.foto.slice(1, 3);
  const sisaFoto = kavling.foto.length - 3;
  document.getElementById("galleryThumbs").innerHTML = thumbs
    .map((foto, i) => {
      const overlay = i === thumbs.length - 1 && sisaFoto > 0
        ? `<div class="gallery-more-overlay">+${sisaFoto} foto</div>`
        : "";
      return `<div><img src="${foto}" alt="Foto ${kavling.nama}">${overlay}</div>`;
    })
    .join("");

  document.getElementById("statusBadgeDetail").innerHTML = renderStatusBadge(kavling.status);
  document.getElementById("namaKavling").textContent = kavling.nama;
  document.getElementById("alamatKavling").textContent = kavling.lokasi.alamat;
  document.getElementById("hargaTotal").textContent = formatRupiah(kavling.harga);
  document.getElementById("hargaPerM2").textContent = formatHargaPerM2(kavling.harga, kavling.luas);
  document.getElementById("deskripsiKavling").textContent = kavling.deskripsi;

  document.getElementById("specTable").innerHTML = `
    <tr><td>Luas tanah</td><td class="angka">${kavling.luas} m²</td></tr>
    <tr><td>Legalitas</td><td>${kavling.legalitas}</td></tr>
    <tr><td>Akses jalan</td><td>${kavling.akses_jalan}</td></tr>
    <tr><td>Kode kavling</td><td class="angka">${kavling.id}</td></tr>
  `;

  const mapSrc = `https://www.google.com/maps?q=${kavling.lokasi.lat},${kavling.lokasi.lng}&output=embed`;
  document.getElementById("mapEmbed").innerHTML = `<iframe src="${mapSrc}" loading="lazy" title="Peta lokasi ${kavling.nama}"></iframe>`;

  const waBtn = document.getElementById("waButton");
  waBtn.href = waLink(NOMOR_WA, kavling);

  const compareCheckbox = document.getElementById("compareCheckboxDetail");
  compareCheckbox.dataset.id = kavling.id;
  compareCheckbox.classList.add("compare-checkbox");
}

function renderSerupa(data, kavlingSekarang) {
  const serupa = data
    .filter((k) => k.id !== kavlingSekarang.id && k.lokasi.kota === kavlingSekarang.lokasi.kota)
    .slice(0, 3);

  const container = document.getElementById("kavlingSerupa");
  if (serupa.length === 0) {
    container.closest("section").style.display = "none";
    return;
  }
  container.innerHTML = serupa.map(renderKavlingCard).join("");
}
