const auth = require('./lib/auth')
const assert = require('assert')

const cases = [
  ['https://example.com/?oobCode=AbC123-x_Y', 'AbC123-x_Y'],
  ['https://example.com/?link=https%3A%2F%2Ffoo%3FoobCode%3Dzz9', 'zz9'],
  ['&amp;oobCode=Qw7&amp;x=1', 'Qw7'],
  ['plainCode12345', 'plainCode12345'],
  ['', null],
  [null, null],
  ['https://example.com/?x=1', null],
  // format link asli dari email Firebase Alight Creative (dari tes end-to-end)
  ['https://alight-creative.firebaseapp.com/__/auth/links?link=https://alightcreative.com/auth_action/?apiKey%3DAIzaSyDrZ9jr_Y16ltSBqsQR5IH6I04FRga6Ki0%26mode%3DsignIn%26oobCode%3DAbC123-x_Y9zzQqWwEeRrTtUuIiOoPpAaSsDdFfGgHhJjKkLl%26continueUrl%3Dhttps://alightcreative.com?ui_sid%253D0366624874%2526ui_sd%253D0%26lang%3Den', 'AbC123-x_Y9zzQqWwEeRrTtUuIiOoPpAaSsDdFfGgHhJjKkLl'],
  // link ber-entity HTML (&amp;) dengan oobCode ber-underscore
  ['https://example.com/?link=https%3A%2F%2Fx.com%2F%3FoobCode%3DqWe_rtY-123&amp;x=1', 'qWe_rtY-123']
]

let pass = 0
for (const [input, expected] of cases) {
  const got = auth.extractCode(input)
  assert.strictEqual(got, expected, `extractCode(${JSON.stringify(input)}) = ${got}, want ${expected}`)
  pass++
}
console.log(`extractCode: ${pass}/${cases.length} ok`)

// Pastikan semua fungsi inti tersedia (jaga-jaga dari regresi, mis. auth.premium)
const fns = ['link', 'verify', 'refresh', 'premium', 'extractCode']
for (const fn of fns) {
  assert.strictEqual(typeof auth[fn], 'function', `auth.${fn} harus berupa fungsi`)
  pass++
}
console.log(`exports: ${fns.length}/${fns.length} ok`)
console.log(`total: ${pass}/${cases.length + fns.length} assertion lulus`)
console.log('all tests passed')