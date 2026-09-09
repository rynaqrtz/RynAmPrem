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

// Simpan sesi ke disk dalam format JSON rapi (2 spasi)
const save = d => fs.writeFileSync(store, JSON.stringify(d, null, 2))

// Prompt satu baris di terminal, kembalikan jawaban yang sudah di-trim
const ask = q => new Promise(r => {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout })
  rl.question(q, a => { rl.close(); r(a.trim()) })
})

// Panggil auth.premium() dengan aman — kalau fungsi tidak tersedia, jangan crash
const tryPremium = async idToken =>
  typeof auth.premium === 'function'
    ? auth.premium(idToken)
    : { ok: false, why: 'premium tidak tersedia di build ini' }

// Tampilkan menu utama
const menu = () => console.log(`
RynAm
[1] kirim magic link
[2] verifikasi link + premium
[3] premium dari sesi
[4] lihat sesi
`)

// Menu 1 — kirim magic link ke email pengguna
async function sendLink() {
  const email = await ask('email: ')
  const r = await auth.link(email)
  console.log(r.ok ? 'link terkirim, cek inbox/spam' : `gagal: ${r.why}`)
}

// Menu 2 — verifikasi link dari email, lalu simpan sesi
async function verify() {
  const email = await ask('email: ')
  const raw = await ask('link: ')
  const v = await auth.verify(email, raw)
  if (!v.ok) return console.log(`gagal: ${v.why}`)
  console.log(`login ok: ${v.email} | baru: ${v.isNewUser}`)
  const p = await tryPremium(v.idToken)
  console.log(p.ok ? `premium aktif: ${p.order}` : `premium gagal: ${p.why}`)
  const sessions = load()
  sessions[email] = { uid: v.uid, refreshToken: v.refreshToken, pro: p.ok, at: new Date().toISOString() }
  save(sessions)
  console.log('sesi tersimpan')
}

// Menu 3 — refresh sesi dari refreshToken yang tersimpan
async function fromSession() {
  const email = await ask('email: ')
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

// Entry point — tampilkan menu, lalu jalankan pilihan pengguna
async function main() {
  menu()
  const p = await ask(': ')
  if (p === '1') await sendLink()
  if (p === '2') await verify()
  if (p === '3') await fromSession()
  if (p === '4') list()
}

main().catch(e => console.error(e.message))