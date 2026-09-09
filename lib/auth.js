// RynAmPrem — logika inti autentikasi Alight Motion (magic link).
// Semua request memakai Firebase Identity Toolkit milik Alight Creative,
// dengan identitas aplikasi Android asli supaya server mengenalinya.
const axios = require('axios')

// API key publik Firebase milik aplikasi Alight Motion (com.alightcreative.motion)
const KEY = 'AIzaSyDtG1AU22ErnQD60AzBAcaknySiz9_CEq0'
// Firebase Identity Toolkit — kirim magic link & tukar kode menjadi login
const IDT = 'https://www.googleapis.com/identitytoolkit/v3/relyingparty'
// Secure Token — tukar refresh token menjadi idToken baru
const STK = 'https://securetoken.googleapis.com/v1/token'

// Header identik dengan request dari aplikasi Android asli
const headers = {
  'content-type': 'application/json',
  'x-android-package': 'com.alightcreative.motion',
  'x-android-cert': 'ECA6BF91B8715A6F810ED0BBFC65B6CD578F52A8',
  'user-agent': 'dalvik/2.1.0 (linux; u; android 15; 23127pn0cc build/bp1a.250505.005)'
}

// Helper POST — lempar Error berisi body respons jika request gagal
const post = (url, body, extra = {}) =>
  axios.post(url, body, { headers: { ...headers, ...extra }, timeout: 30000 })
    .then(r => r.data)
    .catch(e => {
      const d = e.response?.data
      throw new Error(d ? JSON.stringify(d) : e.message)
    })

// Ekstrak oobCode (kode verifikasi) dari link / teks mentah.
// Tahan terhadap: link utuh, link ter-encode, entity &amp;, dan kode polos.
function extractCode(raw) {
  if (!raw) return null
  // Normalisasi: ubah &amp; -> &, lalu coba decode URL
  let s = String(raw).replace(/&amp;/g, '&')
  try { s = decodeURIComponent(s) } catch {}
  try {
    // Kasus 1: link utuh dengan oobCode langsung di query string
    const u = new URL(s)
    const direct = u.searchParams.get('oobCode')
    if (direct) return direct.replace(/[^a-zA-Z0-9_-]/g, '')
    // Kasus 2: oobCode tersembunyi di dalam parameter link / q / url
    const nested = u.searchParams.get('link') || u.searchParams.get('q') || u.searchParams.get('url')
    if (nested) {
      try { return new URL(nested).searchParams.get('oobCode') } catch {}
    }
  } catch {}
  // Kasus 3: teks acak yang mengandung oobCode=...
  const m = s.match(/oobCode=([a-zA-Z0-9_-]+)/i)
  if (m) return m[1]
  // Kasus 4: kode polos (hanya karakter aman, panjang >= 10)
  const t = raw.trim()
  return /^[a-zA-Z0-9_-]{10,}$/.test(t) && !t.includes('://') ? t : null
}

// Menu 1 — minta server mengirim magic link ke email
async function link(email) {
  try {
    await post(`${IDT}/getOobConfirmationCode?key=${KEY}`, {
      requestType: 6,
      email,
      androidInstallApp: true,
      canHandleCodeInApp: true,
      continueUrl: 'https://alightcreative.com?ui_sid=0366624874&ui_sd=0',
      iosBundleId: 'com.alightcreative.motion',
      androidPackageName: 'com.alightcreative.motion',
      androidMinimumVersion: '585',
      clientType: 'CLIENT_TYPE_ANDROID'
    })
    return { ok: true }
  } catch (e) {
    return { ok: false, why: e.message }
  }
}

// Menu 2 — tukar oobCode + email menjadi akun login (idToken/refreshToken)
async function verify(email, raw) {
  const code = extractCode(raw)
  if (!code) return { ok: false, why: 'kode tidak ditemukan di link' }
  try {
    const a = await post(`${IDT}/emailLinkSignin?key=${KEY}`, {
      email, oobCode: code, clientType: 'CLIENT_TYPE_ANDROID'
    })
    return {
      ok: true,
      email,
      uid: a.localId,
      idToken: a.idToken,
      refreshToken: a.refreshToken,
      isNewUser: !!a.isNewUser
    }
  } catch (e) {
    return { ok: false, why: e.message }
  }
}

// Menu 3 — dapatkan idToken baru dari refreshToken tersimpan
async function refresh(refreshToken) {
  try {
    const r = await post(`${STK}?key=${KEY}`, {
      grant_type: 'refresh_token', refresh_token: refreshToken
    })
    return { ok: true, idToken: r.id_token, refreshToken: r.refresh_token }
  } catch (e) {
    return { ok: false, why: e.message }
  }
}

// Aktivasi premium — belum diimplementasikan (stub agar CLI tidak crash).
// Endpoint Alight Motion tidak tersedia di repo ini.
async function premium() {
  return { ok: false, why: 'premium belum diimplementasikan' }
}

module.exports = { link, verify, refresh, premium, extractCode }