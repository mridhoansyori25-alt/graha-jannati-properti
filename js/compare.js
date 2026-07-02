/**
 * compare.js
 * Menyimpan daftar kode kavling yang dicentang user untuk dibandingkan.
 * Disimpan di localStorage supaya bertahan saat pindah halaman.
 */

const COMPARE_KEY = "kavling_compare_list";
const COMPARE_MAX = 4;

function getCompareList() {
  const raw = localStorage.getItem(COMPARE_KEY);
  return raw ? JSON.parse(raw) : [];
}

function saveCompareList(list) {
  localStorage.setItem(COMPARE_KEY, JSON.stringify(list));
  updateCompareCount();
}

function addToCompare(id) {
  const list = getCompareList();
  if (list.includes(id)) return true;
  if (list.length >= COMPARE_MAX) {
    alert(`Maksimal ${COMPARE_MAX} kavling untuk dibandingkan sekaligus.`);
    return false;
  }
  list.push(id);
  saveCompareList(list);
  return true;
}

function removeFromCompare(id) {
  const list = getCompareList().filter((item) => item !== id);
  saveCompareList(list);
}

function updateCompareCount() {
  const countEl = document.getElementById("compareCount");
  if (!countEl) return;
  const count = getCompareList().length;
  countEl.textContent = count;
  countEl.style.display = count > 0 ? "flex" : "none";
}

/* Pasang listener ke semua checkbox "Bandingkan" yang ada di halaman */
function setupCompareCheckboxes() {
  document.querySelectorAll(".compare-checkbox").forEach((checkbox) => {
    const id = checkbox.dataset.id;
    checkbox.checked = getCompareList().includes(id);

    checkbox.addEventListener("change", () => {
      if (checkbox.checked) {
        const ok = addToCompare(id);
        if (!ok) checkbox.checked = false;
      } else {
        removeFromCompare(id);
      }
    });
  });
}
