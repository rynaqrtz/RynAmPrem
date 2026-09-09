const fs = require('fs')
const path = require('path')
const readline = require('readline')
const auth = require('./lib/auth')

const store = path.join(__dirname, 'sessions.json')

const load = () => {
  try { return JSON.parse(fs.readFileSync(store, 'utf8')) } catch { return {} }
}

const save = d => fs.writeFileSync(store, JSON.stringify(d, null, 2))

const ask = q => new Promise(r => {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout })
  rl.question(q, a => { rl.close(); r(a.trim()) })
})

const menu = () => console.log(`
RynAm
[1] kirim magic link
[2] verifikasi link + premium
[3] premium dari sesi
[4] lihat sesi
`)

async function sendLink() {
  const email = await ask('email: ')
  const r = await auth.link(email)
  console.log(r.ok ? 'link terkirim, cek inbox/spam' : `gagal: ${r.why}`)
}

async function verify() {
  const email = await ask('email: ')
  const raw = await ask('link: ')
  const v = await auth.verify(email, raw)
  if (!v.ok) return console.log(`gagal: ${v.why}`)
  console.log(`login ok: ${v.email} | baru: ${v.isNewUser}`)
  const p = await auth.premium(v.idToken)
  console.log(p.ok ? `premium aktif: ${p.order}` : `premium gagal: ${p.why}`)
  const sessions = load()
  sessions[email] = { uid: v.uid, refreshToken: v.refreshToken, pro: p.ok, at: new Date().toISOString() }
  save(sessions)
  console.log('sesi tersimpan')
}

async function fromSession() {
  const email = await ask('email: ')
  const s = load()[email]
  if (!s) return console.log('sesi tidak ditemukan')
  const r = await auth.refresh(s.refreshToken)
  if (!r.ok) return console.log(`gagal: ${r.why}`)
  const p = await auth.premium(r.idToken)
  console.log(p.ok ? `premium aktif: ${p.order}` : `premium gagal: ${p.why}`)
}

function list() {
  const s = load()
  const keys = Object.keys(s)
  if (!keys.length) return console.log('kosong')
  for (const e of keys) console.log(`${e} | uid=${s[e].uid} | pro=${s[e].pro} | ${s[e].at}`)
}

async function main() {
  menu()
  const p = await ask(': ')
  if (p === '1') await sendLink()
  if (p === '2') await verify()
  if (p === '3') await fromSession()
  if (p === '4') list()
}

main().catch(e => console.error(e.message))
