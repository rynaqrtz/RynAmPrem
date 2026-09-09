const axios = require('axios')
const crypto = require('crypto')

const KEY = 'AIzaSyDtG1AU22ErnQD60AzBAcaknySiz9_CEq0'
const IDT = 'https://www.googleapis.com/identitytoolkit/v3/relyingparty'
const STK = 'https://securetoken.googleapis.com/v1/token'

const headers = {
  'content-type': 'application/json',
  'x-android-package': 'com.alightcreative.motion',
  'x-android-cert': 'ECA6BF91B8715A6F810ED0BBFC65B6CD578F52A8',
  'user-agent': 'dalvik/2.1.0 (linux; u; android 15; 23127pn0cc build/bp1a.250505.005)'
}

const post = (url, body, extra = {}) =>
  axios.post(url, body, { headers: { ...headers, ...extra }, timeout: 30000 })
    .then(r => r.data)
    .catch(e => {
      const d = e.response?.data
      throw new Error(d ? JSON.stringify(d) : e.message)
    })

function extractCode(raw) {
  if (!raw) return null
  let s = String(raw).replace(/&amp;/g, '&')
  try { s = decodeURIComponent(s) } catch {}
  try {
    const u = new URL(s)
    const direct = u.searchParams.get('oobCode')
    if (direct) return direct.replace(/[^a-zA-Z0-9_-]/g, '')
    const nested = u.searchParams.get('link') || u.searchParams.get('q') || u.searchParams.get('url')
    if (nested) {
      try { return new URL(nested).searchParams.get('oobCode') } catch {}
    }
  } catch {}
  const m = s.match(/oobCode=([a-zA-Z0-9_-]+)/i)
  if (m) return m[1]
  const t = raw.trim()
  return /^[a-zA-Z0-9_-]{10,}$/.test(t) && !t.includes('://') ? t : null
}

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

module.exports = { link, verify, refresh, extractCode }
