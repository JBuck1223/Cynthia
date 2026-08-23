import { spawn } from 'node:child_process'
import { mkdir, writeFile, readFile, readdir } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..')
const outDir = path.join(root, 'content/transcripts')
const tmpDir = path.join(root, 'tmp-transcripts')

const lessons = [
  ['one-hour-piano', 'preview', 'https://vimeo.com/539393476'],
  ['one-hour-piano', 'pythagoras', 'https://vimeo.com/539393586/b0f5cfd0e9'],
  ['one-hour-piano', 'hands-fingering', 'https://vimeo.com/539393635/84f0685790'],
  ['one-hour-piano', '7-letters', 'https://vimeo.com/539394653/93204a0731'],
  ['one-hour-piano', 'black-and-white-keys', 'https://vimeo.com/539395221/ac163c8c4b'],
  ['one-hour-piano', 'middle-c-and-the-c-scale', 'https://vimeo.com/539395810/fbfb2f2444'],
  ['one-hour-piano', 'relative-minors-and-chords', 'https://vimeo.com/539418710/17b0383a61'],
  ['one-hour-piano', 'inversions', 'https://vimeo.com/539398343/2c96ff55aa'],
  ['one-hour-piano', 'octaves', 'https://vimeo.com/539400379/c4c0051215'],
  ['one-hour-piano', 'left-hand-patterns', 'https://vimeo.com/539400829/539b15b9f3'],
  ['music-is-numbers', 'preview', 'https://vimeo.com/539415272'],
  ['music-is-numbers', 'pythagoras', 'https://vimeo.com/539415613/b00068bda6'],
  ['music-is-numbers', 'whole-steps-half-steps', 'https://vimeo.com/539415680/3a9079c061'],
  ['music-is-numbers', 'scales-and-keys', 'https://vimeo.com/539416361/68708d5340'],
  ['music-is-numbers', 'relative-minors', 'https://vimeo.com/539416510/3f2da6fcde'],
  ['music-is-numbers', 'chords-and-relative-minors', 'https://vimeo.com/539397097/bd231dab3a'],
  ['music-is-numbers', 'chord-symbols', 'https://vimeo.com/539419588/e4697ac8a2'],
  ['music-is-numbers', 'bass-note-slash', 'https://vimeo.com/539419623/a4ffb7d0e9'],
  ['music-is-numbers', 'guitar-chords', 'https://vimeo.com/539419658/aa9d63b8f7'],
  ['music-is-numbers', 'i-walk-the-line', 'https://vimeo.com/539419714/a04bffb889'],
  ['music-is-numbers', 'time-signature', 'https://vimeo.com/539419816/09640cde46'],
  ['music-is-numbers', 'transposing', 'https://vimeo.com/539419918/a48aa46d1e'],
  ['music-is-numbers', 'i-have-to-say-i-love-you', 'https://vimeo.com/539420038/cb60680418'],
  ['music-is-numbers', 'jose-cuervo', 'https://vimeo.com/539420387/50887e460b'],
  ['music-is-numbers', 'music-is-numbers', 'https://vimeo.com/539424160/3db798a614'],
  ['play-thousands', 'find-any-scale', 'https://vimeo.com/539420484/fa9192e3fe'],
  ['play-thousands', 'building-chords', 'https://vimeo.com/539421922/67fc36ff80'],
  ['play-thousands', 'more-chord-formulas', 'https://vimeo.com/539423429/848770906f'],
]

function run(cmd, args) {
  return new Promise((resolve, reject) => {
    const child = spawn(cmd, args, { stdio: ['ignore', 'pipe', 'pipe'] })
    let stdout = ''
    let stderr = ''
    child.stdout.on('data', (d) => { stdout += d })
    child.stderr.on('data', (d) => { stderr += d })
    child.on('close', (code) => {
      if (code === 0) resolve({ stdout, stderr })
      else reject(new Error(stderr || stdout || `${cmd} exited ${code}`))
    })
  })
}

function vttToText(vtt) {
  return vtt
    .replace(/^WEBVTT.*$/m, '')
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line && !line.includes('-->') && !/^\d+$/.test(line) && !line.startsWith('NOTE'))
    .join(' ')
    .replace(/\s+/g, ' ')
    .trim()
}

async function findVtt(dir) {
  try {
    const files = await readdir(dir)
    const vtt = files.find((f) => f.endsWith('.vtt'))
    if (!vtt) return null
    return readFile(path.join(dir, vtt), 'utf8')
  } catch {
    return null
  }
}

async function save(course, slug, payload) {
  const dir = path.join(outDir, course)
  await mkdir(dir, { recursive: true })
  await writeFile(path.join(dir, `${slug}.json`), JSON.stringify(payload, null, 2))
}

async function main() {
  await mkdir(tmpDir, { recursive: true })
  for (const [course, slug, url] of lessons) {
    const dest = path.join(outDir, course, `${slug}.json`)
    try {
      await readFile(dest)
      console.log('skip', course, slug)
      continue
    } catch {
      // pull
    }
    const work = path.join(tmpDir, `${course}--${slug}`)
    await mkdir(work, { recursive: true })
    console.log('captions', course, slug)
    try {
      await run('yt-dlp', [
        '--write-subs',
        '--write-auto-subs',
        '--sub-langs',
        'en.*',
        '--skip-download',
        '--convert-subs',
        'vtt',
        '-o',
        path.join(work, 'video.%(ext)s'),
        url,
      ])
      const vtt = await findVtt(work)
      if (vtt) {
        const text = vttToText(vtt)
        if (text) {
          await save(course, slug, { text, source: 'vimeo', url })
          console.log('saved captions', course, slug)
          continue
        }
      }
    } catch (err) {
      console.log('no captions', course, slug, err.message.split('\n')[0])
    }
    await save(course, slug, { text: '', source: 'pending', url })
    console.log('pending', course, slug)
  }
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
