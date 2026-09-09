#!/usr/bin/env node
// RynAmPrem — CLI Alight Motion (alur magic link)
// Entry point: menu interaktif, input pengguna, penyimpanan sesi lokal.
const fs = require('fs')
const path = require('path')
const readline = require('readline')
const auth = require('./lib/auth')

// Lokasi file sesi — lokal 100% di device pengguna
const store = path.join(__dirname, 'sessions.json')

// Baca semua sesi dari disk; kembalikan {} jika file belum ada / rusak
const load = () => {
  try { return JSON.parse(fs.readFileSync(store, 'utf8')) } catch { return {} }
}

// Simpan sesi ke disk (format JSON rapi, izin file hanya untuk pemilik)
const save = d => fs.writeFileSync(store, JSON.stringify(d, null, 2), { mode: 0o600 })

// Normalisasi alamat email: buang spasi & samakan huruf kecil,
// supaya lookup sesi konsisten walau format input beda-beda
const norm = e => String(e || '').trim().toLowerCase()

// Antrean baris input — tahan banting untuk terminal interaktif maupun pipe
const rl = readline.createInterface({ input: process.stdin, output: process.stdout })
const lines = []
let waiter = null
rl.on('line', l => {
  if (waiter) { waiter(l); waiter = null } else lines.push(l)
})
// Ctrl+D / EOF: anggap sebagai keluar supaya tidak menggantung
rl.on('close', () => { if (waiter) { waiter('0'); waiter = null } })

// Prompt satu baris di terminal, kembalikan jawaban yang sudah di-trim
const ask = q => new Promise(r => {
  process.stdout.write(q)
  if (lines.length) return r(lines.shift().trim())
  waiter = l => r(l.trim())
})

// Panggil auth.premium() dengan aman — kalau fungsi tidak tersedia, jangan crash
const tryPremium = async idToken =>
  typeof auth.premium === 'function'
    ? auth.premium(idToken)
    : { ok: false, why: 'premium tidak tersedia di build ini' }

// Tampilkan menu utama
const menu = () => console.log(`
RynAm
[0] keluar
[1] kirim magic link
[2] verifikasi link + premium
[3] premium dari sesi
[4] lihat sesi
[5] cek sesi
`)

// Menu 1 — kirim magic link ke email pengguna
async function sendLink() {
  const email = norm(await ask('email: '))
  const r = await auth.link(email)
  console.log(r.ok ? 'link terkirim, cek inbox/spam' : `gagal: ${r.why}`)
}

// Menu 2 — verifikasi link dari email, lalu simpan sesi
async function verify() {
  const email = norm(await ask('email: '))
  const raw = await ask('link: ')
  const v = await auth.verify(email, raw)
  if (!v.ok) return console.log(`gagal: ${v.why}`)
  console.log(`login ok: ${v.email} | baru: ${v.isNewUser}`)
  const p = await tryPremium(v.idToken)
  console.log(p.ok ? `premium aktif: ${p.order}` : `premium gagal: ${p.why}`)
  const sessions = load()
  sessions[norm(email)] = { uid: v.uid, refreshToken: v.refreshToken, pro: p.ok, at: new Date().toISOString() }
  save(sessions)
  console.log('sesi tersimpan')
}

// Menu 3 — refresh sesi dari refreshToken yang tersimpan
async function fromSession() {
  const email = norm(await ask('email: '))
  const s = load()[email]
  if (!s) return console.log('sesi tidak ditemukan')
  const r = await auth.refresh(s.refreshToken)
  if (!r.ok) return console.log(`gagal: ${r.why}`)
  const p = await tryPremium(r.idToken)
  console.log(p.ok ? `premium aktif: ${p.order}` : `premium gagal: ${p.why}`)
}

// Menu 4 — daftar semua sesi yang tersimpan di device ini
function list() {
  const s = load()
  const keys = Object.keys(s)
  if (!keys.length) return console.log('kosong')
  for (const e of keys) console.log(`${e} | uid=${s[e].uid} | pro=${s[e].pro} | ${s[e].at}`)
}

// Menu 5 — cek validitas semua sesi dengan mencoba refresh token-nya
async function check() {
  const sessions = load()
  const keys = Object.keys(sessions)
  if (!keys.length) return console.log('kosong — tidak ada sesi tersimpan')
  console.log(`memeriksa ${keys.length} sesi...`)
  let okCount = 0
  for (const email of keys) {
    const s = sessions[email]
    const r = await auth.refresh(s.refreshToken)
    if (r.ok) {
      okCount++
      // Firebase bisa merotasi refresh token — simpan versi terbaru
      sessions[email] = { ...s, refreshToken: r.refreshToken, at: new Date().toISOString() }
      console.log(`${email} | ✓ valid`)
    } else {
      console.log(`${email} | ✗ ${r.why}`)
    }
  }
  save(sessions)
  console.log(`hasil: ${okCount}/${keys.length} sesi valid`)
}

// Entry point — tampilkan menu berulang sampai pengguna memilih 0 (keluar)
async function main() {
  while (true) {
    menu()
    const p = await ask(': ')
    if (p === '0') return console.log('sampai jumpa 👋')
    try {
      if (p === '1') await sendLink()
      else if (p === '2') await verify()
      else if (p === '3') await fromSession()
      else if (p === '4') list()
      else if (p === '5') await check()
      else console.log('pilihan tidak valid')
    } catch (e) {
      console.error(`error: ${e.message}`)
    }
  }
}

main().catch(e => console.error(e.message))