import * as fs from 'fs'
import * as path from 'path'
import { promisify } from 'util'

import * as mkdirp from 'mkdirp'

const readFile = promisify(fs.readFile)
const writeFile = promisify(fs.writeFile)

if (process.argv.length < 4) {
  console.log('Usage: source-map-extractor <sourcemap> <output directory>')
  process.exit()
}

export const toOutput = (filename: string) => {
  if (filename.startsWith('webpack://')) {
    filename = filename.replace(/^webpack:\/\//, '')
  }

  return filename
    .split(path.sep)
    .filter(s => s !== '' && s !== '.')
    .map(s => (s === '..' ? '__' : s))
    .join(path.sep)
}

export const validate = (filename: string, outputDir: string) => {
  return path.resolve(filename).startsWith(path.resolve(outputDir))
}

const parse = async (filename: string, outputDir: string) => {
  const {
    sources,
    sourcesContent,
  }: { sources: string[]; sourcesContent: string[] } = JSON.parse(
    await readFile(filename, { encoding: 'utf-8' })
  )
  for (const index in sources) {
    const name = sources[index]
    const outputFilename = path.join(outputDir, toOutput(name))
    if (!validate(outputFilename, outputDir)) {
      console.log('output filename error', name, outputFilename)
      process.exit(1)
    }
    console.log(outputFilename)
    mkdirp.sync(path.dirname(outputFilename))
    await writeFile(outputFilename, sourcesContent[index], {
      encoding: 'utf-8',
    })
  }
}

parse(process.argv[2], process.argv[3])
