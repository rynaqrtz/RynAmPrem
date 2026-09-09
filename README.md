<div align="center">

<img src="banner.jpg" alt="RynAm" width="736">

# RynAm

**Alight Motion tool — CLI only, ringan, jalan di mana saja**

<img src="https://img.shields.io/badge/node-18%2B-green" alt="">
<img src="https://img.shields.io/badge/platform-termux%20%7C%20vps%20%7C%20linux-blue" alt="">
<img src="https://img.shields.io/badge/license-MIT-orange" alt="">

</div>

## Tentang

RynAm adalah tool CLI untuk Alight Motion dengan alur magic link — masuk cukup
pakai email, tanpa password, tanpa akun Google. Seluruh logika ada di satu file
(`lib/auth.js`), CLI-nya tipis di atasnya. Tanpa server, tanpa web UI, tanpa
kebergantungan berlebih — hanya `axios`.

## Fitur

- **Magic link login** — kirim tautan login ke email, verifikasi, selesai
- **Manajemen sesi** — token tersimpan lokal, bisa di-refresh kapan saja
- **Ekstraksi kode pintar** — paste link utuh, link ter-encode, atau kode mentah
- **Satu sumber kebenaran** — CLI dan logika tidak duplikat

## Instalasi

### Termux (Android)

```bash
pkg update && pkg install nodejs git -y
git clone https://github.com/rynaqrtz/RynAm
cd RynAm
npm install
node index.js
```

### VPS / Linux / Windows

```bash
git clone https://github.com/rynaqrtz/RynAm
cd RynAm
npm install
node index.js
```

> Butuh Node.js 18 atau lebih baru. Cek dengan `node -v`.

## Cara pakai

Jalankan `node index.js` lalu pilih menu:

| Menu | Fungsi |
|:----:|--------|
| `1` | kirim magic link ke email |
| `2` | verifikasi link dari email |
| `3` | refresh token dari sesi tersimpan |
| `4` | lihat daftar sesi |

Alur tipikal:

```
menu 1 → masukkan email → buka email, copy link
menu 2 → masukkan email yang sama → paste link → selesai
```

Sesi tersimpan di `sessions.json` — file lokal berisi token, **jangan dibagikan
ke siapa pun**. File ini sudah diabaikan git secara default.

## Struktur proyek

```
RynAm/
├── index.js       CLI — menu, input, penyimpanan sesi
├── lib/
│   └── auth.js    logika inti — link, verify, refresh, extractCode
├── test.js        self-check tanpa request ke server
├── banner.jpg
└── package.json
```

## Test

```bash
npm test
```

Test berjalan sepenuhnya lokal (mock) — tidak ada request dikirim ke server
mana pun saat testing.

## FAQ

**Bisa jalan di Termux?**
Ya, itu salah satu target utamanya. Cukup Node.js 18+.

**Di mana sesi saya disimpan?**
Di `sessions.json` di folder proyek, lokal di device kamu.

**Kenapa CLI saja?**
Ringan, cepat, dan cukup. Tidak perlu server untuk tool seperti ini.

## Disclaimer

Proyek riset independen untuk keperluan pembelajaran. Tidak berafiliasi dengan
Alight Creative / Google. Semua merek dagang milik pemiliknya masing-masing.
Gunakan atas risiko sendiri — segala konsekuensi penggunaan menjadi tanggung
jawab pengguna.

## Lisensi

[MIT](LICENSE)
