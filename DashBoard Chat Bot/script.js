// ===== DATA CONTOH (nanti diganti data dari database/API) =====
let pesanan = [
  { id: "CF-0142", nama: "Budi", isi: "Paket A x50", antar: "Jum 11.00", total: 1250000, status: "Menunggu DP" },
  { id: "CF-0141", nama: "Siti",  isi: "Paket B x20", antar: "Kam 12.00", total: 600000,  status: "Diproses" },
  { id: "CF-0140", nama: "Andi",  isi: "Tumpeng x2",  antar: "Rab 09.00", total: 700000,  status: "Selesai" },
  { id: "CF-0139", nama: "Rina",  isi: "Snack box x30", antar: "Sel 10.00", total: 450000, status: "Dibatalkan" },
  { id: "CF-0138", nama: "Dewi",  isi: "Paket A x25", antar: "Sen 12.00", total: 625000,  status: "Selesai" }
];

let menu = [
  { nama: "Paket A (Nasi Box)", harga: 25000, tersedia: true },
  { nama: "Paket B (Nasi Box)", harga: 30000, tersedia: true },
  { nama: "Tumpeng", harga: 350000, tersedia: true },
  { nama: "Snack Box", harga: 15000, tersedia: false }
];

let chat = [
  { no: "0812-xxxx-3344", pesan: "request menu custom, ada alergi kacang", selesai: false },
  { no: "0857-xxxx-1200", pesan: "bisa nego harga untuk 200 box?", selesai: false }
];

const statusList = ["Menunggu DP", "Diproses", "Selesai", "Dibatalkan"];
const rupiah = n => "Rp" + n.toLocaleString("id-ID");
const kelas = s => s.replace(" ", "-");

// ===== NAVIGASI =====
document.querySelectorAll(".sidebar a").forEach(a => {
  a.addEventListener("click", e => {
    e.preventDefault();
    document.querySelectorAll(".sidebar a").forEach(x => x.classList.remove("active"));
    document.querySelectorAll(".view").forEach(v => v.classList.remove("active"));
    a.classList.add("active");
    document.getElementById(a.dataset.view).classList.add("active");
  });
});

// ===== RENDER =====
function renderStats() {
  document.getElementById("statTotal").textContent = pesanan.length;
  document.getElementById("statDP").textContent =
    pesanan.filter(p => p.status === "Menunggu DP").length;
  document.getElementById("statOmzet").textContent = rupiah(
    pesanan.filter(p => p.status === "Selesai").reduce((t, p) => t + p.total, 0)
  );
  document.getElementById("statChat").textContent =
    chat.filter(c => !c.selesai).length;
}

function renderTerbaru() {
  let html = "<tr><th>No</th><th>Pelanggan</th><th>Pesanan</th><th>Total</th><th>Status</th></tr>";
  pesanan.slice(0, 5).forEach(p => {
    html += `<tr><td>${p.id}</td><td>${p.nama}</td><td>${p.isi}</td>
      <td>${rupiah(p.total)}</td>
      <td><span class="tag ${kelas(p.status)}">${p.status}</span></td></tr>`;
  });
  document.getElementById("tabelTerbaru").innerHTML = html;
}

function renderPesanan() {
  const kata = document.getElementById("cari").value.toLowerCase();
  const filter = document.getElementById("filterStatus").value;
  let html = "<tr><th>No</th><th>Pelanggan</th><th>Pesanan</th><th>Antar</th><th>Total</th><th>Status</th></tr>";
  pesanan
    .filter(p => (p.nama + p.id).toLowerCase().includes(kata))
    .filter(p => !filter || p.status === filter)
    .forEach(p => {
      const opsi = statusList
        .map(s => `<option ${s === p.status ? "selected" : ""}>${s}</option>`)
        .join("");
      html += `<tr><td>${p.id}</td><td>${p.nama}</td><td>${p.isi}</td>
        <td>${p.antar}</td><td>${rupiah(p.total)}</td>
        <td><select onchange="ubahStatus('${p.id}', this.value)">${opsi}</select></td></tr>`;
    });
  document.getElementById("tabelPesanan").innerHTML = html;
}

function renderMenu() {
  let html = "<tr><th>Nama</th><th>Harga</th><th>Tersedia</th><th>Aksi</th></tr>";
  menu.forEach((m, i) => {
    html += `<tr><td>${m.nama}</td><td>${rupiah(m.harga)}</td>
      <td>${m.tersedia ? "Ya" : "Habis"}</td>
      <td><button class="gray" onclick="toggleMenu(${i})">Ubah ketersediaan</button>
          <button onclick="hapusMenu(${i})">Hapus</button></td></tr>`;
  });
  document.getElementById("tabelMenu").innerHTML = html;
}

function renderChat() {
  const box = document.getElementById("daftarChat");
  if (chat.length === 0) { box.innerHTML = "<p>Tidak ada chat.</p>"; return; }
  box.innerHTML = chat.map((c, i) => `
    <div class="chat-item ${c.selesai ? "selesai" : ""}">
      <strong>${c.no}</strong>
      <p>"${c.pesan}"</p>
      ${c.selesai ? "Sudah ditangani" : `<button onclick="ambilAlih(${i})">Ambil alih</button>`}
    </div>`).join("");
}

// ===== AKSI =====
function ubahStatus(id, status) {
  pesanan.find(p => p.id === id).status = status;
  renderAll();
}
function toggleMenu(i) { menu[i].tersedia = !menu[i].tersedia; renderMenu(); }
function hapusMenu(i) { menu.splice(i, 1); renderMenu(); }
function ambilAlih(i) { chat[i].selesai = true; renderAll(); }

document.getElementById("formMenu").addEventListener("submit", e => {
  e.preventDefault();
  menu.push({
    nama: document.getElementById("menuNama").value,
    harga: Number(document.getElementById("menuHarga").value),
    tersedia: true
  });
  e.target.reset();
  renderMenu();
});
document.getElementById("cari").addEventListener("input", renderPesanan);
document.getElementById("filterStatus").addEventListener("change", renderPesanan);

function renderAll() {
  renderStats(); renderTerbaru(); renderPesanan(); renderMenu(); renderChat();
}
renderAll();