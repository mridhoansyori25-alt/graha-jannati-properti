/**
 * components.js
 * Fungsi-fungsi yang menghasilkan HTML untuk elemen reusable:
 * badge status, kartu kavling, dan loader navbar/footer.
 */

function renderStatusBadge(status) {
  const label = status === "tersedia" ? "Tersedia" : "Terjual";
  return `<span class="badge-status ${status}">${label}</span>`;
}

function renderKavlingCard(kavling) {
  const fotoUtama = kavling.foto && kavling.foto[0]
    ? `<img src="${kavling.foto[0]}" alt="Foto ${kavling.nama}" loading="lazy">`
    : "Foto belum tersedia";

  const badgeUnggulan = kavling.unggulan
    ? `<span class="kavling-card-badge-unggulan">Unggulan</span>`
    : "";

  return `
    <article class="kavling-card ${kavling.status}" data-id="${kavling.id}">
      <a href="kavling-detail.html?id=${kavling.id}" aria-label="Lihat detail ${kavling.nama}">
        <div class="kavling-card-photo">
          ${badgeUnggulan}
          ${fotoUtama}
        </div>
      </a>
      <div class="kavling-card-body">
        <div class="kavling-card-top-row">
          ${renderStatusBadge(kavling.status)}
          <span class="kavling-card-kode">Kode ${kavling.id}</span>
        </div>
        <a href="kavling-detail.html?id=${kavling.id}">
          <div class="kavling-card-nama">${kavling.nama}</div>
        </a>
        <div class="kavling-card-lokasi">${kavling.lokasi.kota}, ${kavling.lokasi.wilayah}</div>
        <div class="kavling-card-meta">
          <span class="angka">${kavling.luas} m²</span>
          <span>${kavling.legalitas}</span>
        </div>
        <div class="kavling-card-harga">${formatRupiah(kavling.harga)}</div>
        <div class="kavling-card-footer">
          <label class="kavling-card-compare">
            <input type="checkbox" class="compare-checkbox" data-id="${kavling.id}">
            Bandingkan
          </label>
          <a href="kavling-detail.html?id=${kavling.id}" class="btn btn-secondary btn-sm">Lihat detail</a>
        </div>
      </div>
    </article>
  `;
}

/* Muat navbar & footer ke setiap halaman, lalu jalankan util bersama */
async function loadSharedComponents() {
  const navbarEl = document.getElementById("navbar-placeholder");
  const footerEl = document.getElementById("footer-placeholder");

  if (navbarEl) {
    const res = await fetch("components/navbar.html");
    navbarEl.innerHTML = await res.text();
    highlightActiveNav();
    setupMobileNav();
    updateCompareCount();
  }

  if (footerEl) {
    const res = await fetch("components/footer.html");
    footerEl.innerHTML = await res.text();
    const yearEl = document.getElementById("footerYear");
    if (yearEl) yearEl.textContent = new Date().getFullYear();
  }
}

function highlightActiveNav() {
  const current = document.body.dataset.page;
  document.querySelectorAll("[data-nav]").forEach((link) => {
    if (link.dataset.nav === current) link.classList.add("active");
  });
}

function setupMobileNav() {
  const toggle = document.getElementById("navbarToggle");
  const links = document.getElementById("navbarLinks");
  if (!toggle || !links) return;
  toggle.addEventListener("click", () => links.classList.toggle("open"));
}

document.addEventListener("DOMContentLoaded", loadSharedComponents);
