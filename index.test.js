const postcss = require('postcss')

const plugin = require('./')

async function run (input, output, opts = { }) {
  let result = await postcss([plugin(opts)]).process(input, { from: undefined })
  expect(result.css).toEqual(output)
  expect(result.warnings()).toHaveLength(0)
}

const testInput = `.test-h1 {
  @ms 0;
}`

const testOutput = `.test-h1 {
  font-size: 16px;
}`

it('adds the font sizes properly on the stylesheet', async () => {
  await run(testInput, testOutput, {})
})