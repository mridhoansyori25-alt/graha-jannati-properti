# LogoKavling — Website Penjualan Kavling Tanah

Website statis multipage (HTML/CSS/JS murni, tanpa build tool).

## Cara menjalankan (WAJIB, jangan buka file langsung)

Karena situs ini memuat `data/kavling.json` dan `components/navbar.html`
menggunakan `fetch()`, browser akan memblokirnya kalau dibuka langsung
lewat `file://`. Jalankan lewat local server terlebih dahulu:

**Python** (biasanya sudah terpasang):
```
cd kavling-site
python -m http.server 8000
```
lalu buka `http://localhost:8000` di browser.

**Atau VS Code**: klik kanan `index.html` → "Open with Live Server".

## Struktur folder

```
kavling-site/
├── index.html              beranda
├── kavling.html             daftar semua kavling + filter
├── kavling-detail.html      detail satu kavling (?id=A-01)
├── bandingkan.html          tabel perbandingan kavling
├── tentang.html
├── kontak.html
│
├── data/
│   └── kavling.json         SATU-SATUNYA sumber data. Tambah/ubah kavling di sini saja.
│
├── components/               HTML reusable, di-load otomatis lewat JS
│   ├── navbar.html
│   └── footer.html
│
├── css/
│   ├── style.css             token warna, tipografi, layout dasar
│   └── components.css        styling navbar, card, badge, galeri, dll
│
├── js/
│   ├── data.js               fetch & olah data kavling.json (format rupiah, dsb)
│   ├── components.js         render kartu kavling, badge status, load navbar/footer
│   ├── compare.js            fitur "Bandingkan" (localStorage)
│   ├── home.js                khusus index.html
│   ├── kavling-list.js       khusus kavling.html (filter & sort)
│   ├── kavling-detail.js     khusus kavling-detail.html
│   └── bandingkan.js         khusus bandingkan.html
│
└── assets/images/            taruh foto kavling di sini
```

## Cara menambah kavling baru

Buka `data/kavling.json`, tambahkan objek baru di array `kavling` dengan
format yang sama seperti data yang sudah ada. Tidak perlu sentuh file
HTML/JS lain — semua halaman otomatis membaca ulang dari file ini.

Field wajib: `id`, `nama`, `status` ("tersedia"/"terjual"), `unggulan`
(true/false), `lokasi.kota`, `lokasi.wilayah`, `lokasi.alamat`,
`lokasi.lat`, `lokasi.lng`, `luas`, `harga`, `legalitas`, `akses_jalan`,
`deskripsi`, `foto` (array path gambar di assets/images/).

## Cara ganti nomor WhatsApp

Edit variabel `NOMOR_WA` di `js/kavling-detail.js`, dan link WhatsApp
di `index.html` (CTA bawah) serta `kontak.html`.

## Catatan

- Foto kavling belum disertakan (placeholder). Taruh file gambar asli
  di `assets/images/` dengan nama sesuai path di `kavling.json`.
- Peta di halaman detail memakai Google Maps embed sederhana berbasis
  koordinat lat/lng — tidak butuh API key.
