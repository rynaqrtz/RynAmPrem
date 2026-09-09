<div align="center">

<img src="banner.jpg" alt="RynAmPrem" width="736">

# ⚡ RynAmPrem

**Alight Motion tool — CLI only. Ringan. Cepat. Jalan di mana saja.**

<img src="https://img.shields.io/badge/node-18%2B-339933?logo=node.js&logoColor=white" alt="node">
<img src="https://img.shields.io/badge/platform-Termux%20%7C%20Linux%20%7C%20VPS-3ddc84?logo=android&logoColor=white" alt="platform">
<img src="https://img.shields.io/badge/deps-1%20(axios)-blue" alt="deps">
<img src="https://img.shields.io/badge/license-MIT-orange" alt="license">

[Instalasi](#-instalasi) · [Cara Pakai](#-cara-pakai) · [Struktur](#-struktur-proyek) · [FAQ](#-faq) · [Disclaimer](#-disclaimer)

</div>

---

## ✨ Tentang

RynAmPrem adalah tool CLI untuk Alight Motion dengan alur **magic link** —
masuk cukup pakai email, tanpa password, tanpa akun Google.

Dibangun dengan prinsip minimalis:

> 🪶 Satu logika, satu CLI, satu dependency. Tidak ada server, tidak ada web UI,
> tidak ada yang berlebihan.

```
┌──────────────┐      magic link       ┌─────────┐
│   Terminal   │ ────────────────────▶ │  Email  │
│  (index.js)  │ ◀──────────────────── │  kamu   │
└──────────────┘    paste link balik   └─────────┘
       │
       ▼
  sessions.json (lokal, aman di device kamu)
```

## 🚀 Instalasi

### Termux (Android)

```bash
pkg update && pkg install nodejs git -y
git clone https://github.com/rynaqrtz/RynAmPrem
cd RynAmPrem
npm install
node index.js
```

### VPS / Linux / Windows / macOS

```bash
git clone https://github.com/rynaqrtz/RynAmPrem
cd RynAmPrem
npm install
node index.js
```

> **Syarat:** Node.js 18+. Cek versi dengan `node -v`.

## 📖 Cara Pakai

Jalankan `node index.js`, lalu pilih menu:

```
RynAmPrem
[1] kirim magic link
[2] verifikasi link + premium
[3] premium dari sesi
[4] lihat sesi
```

| Menu | Fungsi | Keterangan |
|:----:|--------|------------|
| `1` | 📤 kirim magic link | masukkan email, link dikirim ke inbox |
| `2` | ✅ verifikasi link | paste link dari email, sesi tersimpan |
| `3` | 🔄 refresh sesi | aktivasi ulang pakai token tersimpan |
| `4` | 📋 lihat sesi | daftar semua sesi di device ini |

**Alur tipikal:**

```text
menu 1 → masukkan email → buka email → copy link
menu 2 → masukkan email yang sama → paste link → selesai ✔
```

Ekstraksi kode pintar: paste **link utuh**, **link ter-encode**, atau
**kode mentah** — semuanya dikenali otomatis.

## 🔒 Sesi Kamu

Sesi tersimpan di `sessions.json` di folder proyek:

- ✅ Lokal 100% di device kamu
- ✅ Otomatis diabaikan git (sudah ada di `.gitignore`)
- ⚠️ Berisi token — **jangan dibagikan ke siapa pun**

## 🗂 Struktur Proyek

```
RynAmPrem/
├── index.js        CLI — menu, input, penyimpanan sesi
├── lib/
│   └── auth.js     logika inti — link, verify, refresh, extractCode
├── test.js         self-check lokal, tanpa request ke server
├── banner.jpg
├── LICENSE
└── package.json
```

## 🧪 Test

```bash
npm test
```

Test berjalan **sepenuhnya lokal** (mock) — tidak ada request dikirim ke
server mana pun saat testing. Cocok 7/7 assertion untuk `extractCode`.

## ❓ FAQ

<details>
<summary><b>Bisa jalan di Termux?</b></summary>
<br>Ya — itu salah satu target utamanya. Cukup Node.js 18+ dari `pkg install nodejs`.
</details>

<details>
<summary><b>Di mana sesi saya disimpan?</b></summary>
<br>Di <code>sessions.json</code> di folder proyek, lokal di device kamu.
</details>

<details>
<summary><b>Kenapa CLI saja, tanpa web?</b></summary>
<br>Ringan, cepat, dan cukup. Untuk tool seperti ini, server adalah beban — bukan fitur.
</details>

<details>
<summary><b>Link saya tidak dikenali?</b></summary>
<br>Paste seluruh URL dari email, termasuk <code>https://</code> di depan. Kalau masih
gagal, coba menu 4 untuk cek apakah sesi sudah tersimpan.
</details>

## ⚠️ Disclaimer

Proyek riset independen untuk keperluan pembelajaran. Tidak berafiliasi dengan
Alight Creative / Google. Semua merek dagang milik pemiliknya masing-masing.
Gunakan atas risiko sendiri — segala konsekuensi penggunaan menjadi tanggung
jawab pengguna.

## 📄 Lisensi

[MIT](LICENSE)

---

<div align="center">

**dibuat oleh [rynaqrtz](https://github.com/rynaqrtz)**

</div>
