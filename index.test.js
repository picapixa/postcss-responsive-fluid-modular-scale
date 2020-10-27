const postcss = require('postcss')

const plugin = require('./')

async function run (input, output, opts = { }) {
  let result = await postcss([plugin(opts)]).process(input, { from: undefined })
  expect(result.css).toEqual(output)
  expect(result.warnings()).toHaveLength(0)
}

it('adds the font sizes properly on the stylesheet', async () => {
  const testInput = `.test-h1 {
    @ms 0;
  }`
  
  const testOutput = `.test-h1 {
    font-size: 16px;
  }`

 await run(testInput, testOutput, {})
})

it('fails the build when the modular scale key does not exist in the config', async() => {
  const testInput = `.test-h1 {
    @ms 0;
  }`
  
  const options = {
    scales: {
      base: 0,
    }
  };

  const process = postcss([plugin(options)]).process(testInput, { from: undefined })
  await expect(process).rejects.toThrow()
})

it('accounts for multiple breakpoints', async () => {
  const testInput = `.test-body {
    @ms 0;
  }`
  
  const options = {
    fontSize: 14,
    sm: {
      min: "768px",
      fontSize: 16
    }
  }

  const testOutput = `.test-body {
    font-size: 14px;
  }@media screen and (min-width: 768px) {.test-body {
        font-size: 16px;
    }
}`

  await run(testInput, testOutput, options)
})