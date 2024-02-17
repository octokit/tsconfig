import assert from 'node:assert'
import fs from 'node:fs'
import { test } from 'node:test'
import Ajv from "ajv-draft-04"

const customKeywords = [
  "allowTrailingCommas",
  "markdownDescription",
  "markdownEnumDescriptions"
]

test('validate tsconfig by schema', async () => {
  const schema = await (await fetch('https://json.schemastore.org/tsconfig')).json()
  const ajv = new Ajv({
    strict: false
  });

  for (const keyword of customKeywords) {
    ajv.addKeyword({
      keyword
    })
  }

  const validate = ajv.compile(schema)
  const tsconfig = JSON.parse(await fs.promises.readFile('tsconfig.json', 'utf-8'))
  assert(validate(tsconfig), 'tsconfig.json does not match the schema')
})
