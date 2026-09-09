<div align="center">

<img src="banner.jpg" alt="RynAmPrem" width="736">

# ⚡ RynAmPrem

**Tool CLI untuk Alight Motion — login via magic link, tanpa password, tanpa akun Google.**

Ringan 🪶 · Cepat ⚡ · Jalan di mana saja 📱💻

[![Node](https://img.shields.io/badge/node-18%2B-339933?logo=node.js&logoColor=white&style=for-the-badge)]()
[![Platform](https://img.shields.io/badge/platform-Termux%20%7C%20Linux%20%7C%20VPS-3ddc84?style=for-the-badge)]()
[![Deps](https://img.shields.io/badge/deps-1%20(axios)-blue?style=for-the-badge)]()
[![License](https://img.shields.io/badge/license-MIT-orange?style=for-the-badge)]()
[![Stars](https://img.shields.io/github/stars/rynaqrtz/RynAmPrem?style=for-the-badge)]()
[![Forks](https://img.shields.io/github/forks/rynaqrtz/RynAmPrem?style=for-the-badge)]()
[![Issues](https://img.shields.io/github/issues/rynaqrtz/RynAmPrem?style=for-the-badge)]()
[![Last commit](https://img.shields.io/github/last-commit/rynaqrtz/RynAmPrem?style=for-the-badge)]()

📖 [Tentang](#-tentang) · ✨ [Fitur](#-fitur) · 🚀 [Instalasi](#-instalasi) · 📖 [Cara Pakai](#-cara-pakai) · 🗂 [Struktur](#-struktur-proyek) · 🧪 [Testing](#-testing) · 📊 [Hasil Testing](#-hasil-testing) · ❓ [FAQ](#-faq) · ⚠️ [Disclaimer](#-disclaimer)

</div>

---

## 🧠 Tentang

RynAmPrem adalah **tool CLI** untuk Alight Motion dengan alur **magic link** —
masuk cukup pakai email, tanpa password, tanpa akun Google.

Dibangun dengan prinsip minimalis:

> 🪶 Satu logika, satu CLI, satu dependency. Tidak ada server, tidak ada web UI,
> tidak ada yang berlebihan.

### ⚙️ Cara Kerja

```
┌──────────────┐      magic link       ┌─────────┐
│   Terminal   │ ────────────────────▶ │  Email  │
│  (index.js)  │ ◀──────────────────── │  kamu   │
└──────────────┘    paste link balik   └─────────┘
       │
       ▼
  sessions.json (lokal, aman di device kamu)
```

## ✨ Fitur

| Fitur | Keterangan |
|-------|------------|
| 📤 **Magic link** | Login cukup pakai email, tanpa password |
| 🧠 **Ekstraksi kode pintar** | Terima link utuh, link ter-encode, atau kode mentah |
| 🔄 **Refresh sesi** | Aktivasi ulang pakai token tersimpan |
| 📋 **Manajemen sesi** | Lihat semua sesi di device ini |
| 🔒 **Lokal 100%** | Sesi disimpan di device kamu, bukan di server |
| 🪶 **Minimalis** | Hanya 1 dependency: `axios` |

## 🚀 Instalasi

<details>
<summary><b>📱 Termux (Android)</b></summary>

```bash
pkg update && pkg install nodejs git -y
git clone https://github.com/rynaqrtz/RynAmPrem
cd RynAmPrem
npm install
node index.js
```

</details>

<details>
<summary><b>💻 VPS / Linux / Windows / macOS</b></summary>

```bash
git clone https://github.com/rynaqrtz/RynAmPrem
cd RynAmPrem
npm install
node index.js
```

</details>

> **Syarat:** Node.js 18+. Cek versi dengan `node -v`.

## 📖 Cara Pakai

Jalankan `node index.js`, lalu pilih menu:

```
RynAm
[1] kirim magic link
[2] verifikasi link + premium
[3] premium dari sesi
[4] lihat sesi
[5] cek sesi
```

| Menu | Fungsi | Keterangan |
|:----:|--------|------------|
| `1` | 📤 kirim magic link | masukkan email, link dikirim ke inbox |
| `2` | ✅ verifikasi link | paste link dari email, sesi tersimpan |
| `3` | 🔄 refresh sesi | aktivasi ulang pakai token tersimpan |
| `4` | 📋 lihat sesi | daftar semua sesi di device ini |
| `5` | 🔍 cek sesi | periksa validitas refresh token semua sesi |

**Alur tipikal:**

```text
menu 1 → masukkan email → buka email → copy link
menu 2 → masukkan email yang sama → paste link → selesai ✔
```

> 💡 **Tips:** paste **link utuh**, **link ter-encode**, atau **kode mentah** —
> semuanya dikenali otomatis oleh ekstraksi kode pintar.

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

## 🔒 Keamanan Sesi

Sesi tersimpan di `sessions.json` di folder proyek:

- ✅ Lokal 100% di device kamu
- ✅ Otomatis diabaikan git (sudah ada di `.gitignore`)
- ⚠️ Berisi token — **jangan dibagikan ke siapa pun**

## 🧪 Testing

```bash
npm test
```

Test berjalan **sepenuhnya lokal** (mock) — tidak ada request dikirim ke
server mana pun saat testing. Cocok 7/7 assertion untuk `extractCode`.

## 📊 Hasil Testing (real, 5 email temp)

Hasil tes end-to-end nyata pada `2026-09-09` menggunakan **5 email temp**
(layanan mail.tm). Setiap email menjalani alur lengkap: kirim magic link →
tunggu email masuk → ekstrak kode → verifikasi → refresh token → premium.

### Ringkasan

| Langkah | Hasil | Tingkat sukses |
|---------|-------|:--------------:|
| Kirim magic link | 5/5 | 100% |
| Email masuk ke inbox | 5/5 | 100% |
| Ekstraksi kode (`extractCode`) | 5/5 | 100% |
| Verifikasi login (menu 2) | 5/5 | 100% |
| Refresh token (menu 3) | 5/5 | 100% |
| Latensi kirim → email masuk | rata-rata **4.8 detik** | min 4s · max 5s |
| Aktivasi premium | 0/5 | 0% (stub — belum diimplementasikan) |

> ⚠️ Latensi diukur dengan polling tiap 4 detik, jadi angka sebenarnya bisa
> sedikit lebih cepat. Email temp bersifat sekali pakai dan hasil bisa
> bervariasi tergantung kondisi server Firebase / layanan email.

### Detail per email

| # | Email temp | Kirim | Masuk | Latensi | Ekstrak | Verify | User baru | Refresh | Premium |
|:-:|------------|:-----:|:-----:|:-------:|:-------:|:------:|:---------:|:-------:|:-------:|
| 1 | `rynammtuoa795507@uberip.com` | ✅ | ✅ | 5s | ✅ | ✅ | ya | ✅ | ❌ stub |
| 2 | `rynammtuoaddk445@uberip.com` | ✅ | ✅ | 4s | ✅ | ✅ | ya | ✅ | ❌ stub |
| 3 | `rynammtuoalsi930@uberip.com` | ✅ | ✅ | 5s | ✅ | ✅ | ya | ✅ | ❌ stub |
| 4 | `rynammtuoartb715@uberip.com` | ✅ | ✅ | 5s | ✅ | ✅ | ya | ✅ | ❌ stub |
| 5 | `rynammtuob0bv206@uberip.com` | ✅ | ✅ | 5s | ✅ | ✅ | ya | ✅ | ❌ stub |

Kesimpulan: alur **magic link — kirim → terima → verifikasi → refresh**
berfungsi stabil. Satu-satunya langkah yang belum jalan adalah aktivasi
premium karena memang belum diimplementasikan (stub agar CLI tidak crash).

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

<details>
<summary><b>Kenapa premium gagal / tidak aktif?</b></summary>
<br>Fungsi aktivasi premium belum diimplementasikan di versi ini (stub agar CLI tidak
crash). Login, kirim link, dan refresh sesi tetap berfungsi normal.
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

**dibuat oleh [rynaqrtz](https://github.com/rynaqrtz)** ⚡

</div>