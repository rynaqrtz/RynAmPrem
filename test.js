const auth = require('./lib/auth')
const assert = require('assert')

const cases = [
  ['https://example.com/?oobCode=AbC123-x_Y', 'AbC123-x_Y'],
  ['https://example.com/?link=https%3A%2F%2Ffoo%3FoobCode%3Dzz9', 'zz9'],
  ['&amp;oobCode=Qw7&amp;x=1', 'Qw7'],
  ['plainCode12345', 'plainCode12345'],
  ['', null],
  [null, null],
  ['https://example.com/?x=1', null]
]

let pass = 0
for (const [input, expected] of cases) {
  const got = auth.extractCode(input)
  assert.strictEqual(got, expected, `extractCode(${JSON.stringify(input)}) = ${got}, want ${expected}`)
  pass++
}
console.log(`extractCode: ${pass}/${cases.length} ok`)
console.log('all tests passed')
