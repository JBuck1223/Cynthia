/**
 * Fill lesson transcripts for the LMS.
 *
 * 1. Use Vimeo captions if they exist.
 * 2. Otherwise download the owner's video file and run local Whisper.
 *
 * Needs VIMEO_ACCESS_TOKEN with scopes: public, private, video_files
 * Create it at https://developer.vimeo.com/apps → Cynthia Music → Authentication
 *
 *   VIMEO_ACCESS_TOKEN=xxxxx npm run transcripts
 *   npm run transcripts -- --force
 *   npm run transcripts -- --only=one-hour-piano/preview
 */
import { spawn } from 'node:child_process'
import { mkdir, writeFile, readFile, unlink } from 'node:fs/promises'
import { existsSync, readFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..')
const outDir = path.join(root, 'content/transcripts')
const tmpDir = path.join(root, 'tmp-transcripts')
const modelPath = path.join(root, 'models/ggml-base.en.bin')
const envFile = path.join(root, '.env.local')

const lessons = [
  ['one-hour-piano', 'preview', '539393476', ''],
  ['one-hour-piano', 'pythagoras', '539393586', 'b0f5cfd0e9'],
  ['one-hour-piano', 'hands-fingering', '539393635', '84f0685790'],
  ['one-hour-piano', '7-letters', '539394653', '93204a0731'],
  ['one-hour-piano', 'black-and-white-keys', '539395221', 'ac163c8c4b'],
  ['one-hour-piano', 'middle-c-and-the-c-scale', '539395810', 'fbfb2f2444'],
  ['one-hour-piano', 'relative-minors-and-chords', '539418710', '17b0383a61'],
  ['one-hour-piano', 'inversions', '539398343', '2c96ff55aa'],
  ['one-hour-piano', 'octaves', '539400379', 'c4c0051215'],
  ['one-hour-piano', 'left-hand-patterns', '539400829', '539b15b9f3'],
  ['music-is-numbers', 'preview', '539415272', ''],
  ['music-is-numbers', 'pythagoras', '539415613', 'b00068bda6'],
  ['music-is-numbers', 'whole-steps-half-steps', '539415680', '3a9079c061'],
  ['music-is-numbers', 'scales-and-keys', '539416361', '68708d5340'],
  ['music-is-numbers', 'relative-minors', '539416510', '3f2da6fcde'],
  ['music-is-numbers', 'chords-and-relative-minors', '539397097', 'bd231dab3a'],
  ['music-is-numbers', 'chord-symbols', '539419588', 'e4697ac8a2'],
  ['music-is-numbers', 'bass-note-slash', '539419623', 'a4ffb7d0e9'],
  ['music-is-numbers', 'guitar-chords', '539419658', 'aa9d63b8f7'],
  ['music-is-numbers', 'i-walk-the-line', '539419714', 'a04bffb889'],
  ['music-is-numbers', 'time-signature', '539419816', '09640cde46'],
  ['music-is-numbers', 'transposing', '539419918', 'a48aa46d1e'],
  ['music-is-numbers', 'i-have-to-say-i-love-you', '539420038', 'cb60680418'],
  ['music-is-numbers', 'jose-cuervo', '539420387', '50887e460b'],
  ['music-is-numbers', 'music-is-numbers', '539424160', '3db798a614'],
  ['play-thousands', 'find-any-scale', '539420484', 'fa9192e3fe'],
  ['play-thousands', 'building-chords', '539421922', '67fc36ff80'],
  ['play-thousands', 'more-chord-formulas', '539423429', '848770906f'],
]

function loadEnv() {
  if (!existsSync(envFile)) return
  const text = readFileSync(envFile, 'utf8')
  for (const line of text.split('\n')) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#')) continue
    const eq = trimmed.indexOf('=')
    if (eq < 1) continue
    const key = trimmed.slice(0, eq)
    let value = trimmed.slice(eq + 1)
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1)
    }
    if (!process.env[key]) process.env[key] = value
  }
}

function parseArgs(argv) {
  const args = { force: false, only: null }
  for (const raw of argv) {
    if (raw === '--force') args.force = true
    else if (raw.startsWith('--only=')) args.only = raw.slice('--only='.length)
  }
  return args
}

function run(cmd, args, opts = {}) {
  return new Promise((resolve, reject) => {
    const child = spawn(cmd, args, { stdio: ['ignore', 'pipe', 'pipe'], ...opts })
    let stdout = ''
    let stderr = ''
    child.stdout.on('data', (d) => { stdout += d })
    child.stderr.on('data', (d) => { stderr += d })
    child.on('close', (code) => {
      if (code === 0) resolve({ stdout, stderr })
      else reject(new Error((stderr || stdout || `${cmd} exited ${code}`).slice(0, 800)))
    })
  })
}

function vttToCues(vtt) {
  const cues = []
  const blocks = vtt.replace(/^\uFEFF/, '').split(/\n\n+/)
  for (const block of blocks) {
    const lines = block.split('\n').map((l) => l.trim()).filter(Boolean)
    const time = lines.find((l) => l.includes('-->'))
    if (!time) continue
    const [startRaw, endRaw] = time.split('-->').map((s) => s.trim().split(' ')[0])
    const text = lines
      .filter((l) => l !== time && !/^\d+$/.test(l) && l !== 'WEBVTT' && !l.startsWith('NOTE'))
      .join(' ')
      .replace(/<[^>]+>/g, '')
      .replace(/\s+/g, ' ')
      .trim()
    if (!text) continue
    cues.push({ start: clockToSeconds(startRaw), end: clockToSeconds(endRaw), text })
  }
  return cues
}

function clockToSeconds(value) {
  if (!value) return 0
  const clean = value.replace(',', '.')
  const parts = clean.split(':').map(Number)
  if (parts.some((n) => Number.isNaN(n))) return 0
  if (parts.length === 3) return parts[0] * 3600 + parts[1] * 60 + parts[2]
  if (parts.length === 2) return parts[0] * 60 + parts[1]
  return parts[0] || 0
}

function cuesToText(cues) {
  return cues.map((c) => c.text).join(' ').replace(/\s+/g, ' ').trim()
}

function whisperCues(payload) {
  const rows = payload.transcription || payload.segments || []
  return rows
    .map((row) => {
      const text = String(row.text || '').replace(/\s+/g, ' ').trim()
      if (!text) return null
      const start = row.offsets?.from != null ? row.offsets.from / 1000 : clockToSeconds(row.timestamps?.from)
      const end = row.offsets?.to != null ? row.offsets.to / 1000 : clockToSeconds(row.timestamps?.to)
      return { start, end, text }
    })
    .filter(Boolean)
}

async function api(token, method, urlPath, body) {
  const res = await fetch(`https://api.vimeo.com${urlPath}`, {
    method,
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/vnd.vimeo.*+json;version=3.4',
      'Content-Type': 'application/json',
    },
    body: body ? JSON.stringify(body) : undefined,
  })
  const text = await res.text()
  if (!res.ok) throw new Error(`${method} ${urlPath} ${res.status} ${text.slice(0, 300)}`)
  return text ? JSON.parse(text) : null
}

function pickDownload(video) {
  const candidates = []
  for (const item of video.download || []) {
    if (item?.link) candidates.push(item)
  }
  for (const item of video.files || []) {
    if (item?.link && item.type !== 'video/hls' && !String(item.link).includes('.m3u8')) candidates.push(item)
  }
  const progressive = video.play?.progressive || []
  for (const item of progressive) {
    if (item?.link) candidates.push(item)
  }
  if (!candidates.length) return null
  candidates.sort((a, b) => (a.size || a.height || 99999) - (b.size || b.height || 99999))
  return candidates[0]
}

async function downloadFile(url, dest, token) {
  const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` }, redirect: 'follow' })
  if (!res.ok) throw new Error(`download ${res.status}`)
  const buf = Buffer.from(await res.arrayBuffer())
  await writeFile(dest, buf)
}

async function save(course, slug, payload) {
  const dir = path.join(outDir, course)
  await mkdir(dir, { recursive: true })
  await writeFile(path.join(dir, `${slug}.json`), `${JSON.stringify(payload, null, 2)}\n`)
}

async function existingText(course, slug) {
  try {
    const raw = await readFile(path.join(outDir, course, `${slug}.json`), 'utf8')
    const data = JSON.parse(raw)
    return String(data.text || '').trim()
  } catch {
    return ''
  }
}

async function captionsFromVimeo(token, id) {
  const tracks = await api(token, 'GET', `/videos/${id}/texttracks`)
  const track = (tracks.data || []).find((t) => t.language?.startsWith('en')) || tracks.data?.[0]
  if (!track) return null
  const vttUrl = track.link || track.download_links?.vtt
  if (!vttUrl) return null
  const res = await fetch(vttUrl, { headers: { Authorization: `Bearer ${token}` } })
  if (!res.ok) return null
  const vtt = await res.text()
  const cues = vttToCues(vtt)
  const text = cuesToText(cues)
  if (!text) return null
  return { text, cues, source: 'vimeo' }
}

async function transcribeFile(mediaPath, workStem) {
  const wav = `${workStem}.wav`
  await run('ffmpeg', ['-y', '-i', mediaPath, '-ar', '16000', '-ac', '1', '-c:a', 'pcm_s16le', wav])
  await run('whisper-cli', [
    '-m', modelPath,
    '-f', wav,
    '-l', 'en',
    '-oj',
    '-otxt',
    '-of', workStem,
    '--no-prints',
  ])
  const payload = JSON.parse(await readFile(`${workStem}.json`, 'utf8'))
  const cues = whisperCues(payload)
  let text = cuesToText(cues)
  if (!text) {
    try {
      text = (await readFile(`${workStem}.txt`, 'utf8')).replace(/\s+/g, ' ').trim()
    } catch {
      text = ''
    }
  }
  return { text, cues, source: 'whisper' }
}

async function rm(file) {
  try { await unlink(file) } catch { /* ignore */ }
}

async function main() {
  loadEnv()
  const args = parseArgs(process.argv.slice(2))
  const token = process.env.VIMEO_ACCESS_TOKEN
  if (!token) {
    console.error('Set VIMEO_ACCESS_TOKEN (scopes: public, private, video_files)')
    process.exit(1)
  }
  if (!existsSync(modelPath)) {
    console.error(`Missing Whisper model at ${modelPath}`)
    process.exit(1)
  }

  const me = await api(token, 'GET', '/me?fields=name,account')
  console.log('Vimeo user', me.name, me.account || '')

  const probe = await api(token, 'GET', `/videos/${lessons[0][2]}?fields=download,files,play,name`)
  if (!pickDownload(probe)) {
    console.error('This token cannot download video files. Generate a new one with the video_files scope checked.')
    process.exit(1)
  }

  await mkdir(tmpDir, { recursive: true })
  let saved = 0
  let skipped = 0

  for (const [course, slug, id] of lessons) {
    const key = `${course}/${slug}`
    if (args.only && args.only !== key && args.only !== course && args.only !== slug) continue
    if (!args.force && await existingText(course, slug)) {
      console.log('skip', key)
      skipped += 1
      continue
    }

    const url = `https://vimeo.com/${id}`
    console.log('captions', key)
    try {
      const fromVimeo = await captionsFromVimeo(token, id)
      if (fromVimeo) {
        await save(course, slug, { ...fromVimeo, url })
        console.log('saved vimeo', key)
        saved += 1
        continue
      }
    } catch (err) {
      console.log('no captions', key, err.message.split('\n')[0])
    }

    const workStem = path.join(tmpDir, `${course}--${slug}`)
    const mediaPath = `${workStem}.mp4`
    console.log('whisper', key)
    try {
      const video = await api(token, 'GET', `/videos/${id}?fields=name,download,files,play`)
      const file = pickDownload(video)
      if (!file) throw new Error('no downloadable file')
      await downloadFile(file.link, mediaPath, token)
      const result = await transcribeFile(mediaPath, workStem)
      if (!result.text) throw new Error('empty transcript')
      await save(course, slug, { ...result, url })
      console.log('saved whisper', key, `${result.cues.length} cues`)
      saved += 1
    } catch (err) {
      await save(course, slug, { text: '', source: 'pending', url })
      console.error('fail', key, err.message.split('\n')[0])
    } finally {
      await rm(mediaPath)
      await rm(`${workStem}.wav`)
      await rm(`${workStem}.json`)
      await rm(`${workStem}.txt`)
    }
  }

  console.log(`done. saved ${saved}, skipped ${skipped}`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
