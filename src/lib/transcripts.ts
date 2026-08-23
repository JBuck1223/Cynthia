import { readFile } from 'fs/promises'
import path from 'path'

export type TranscriptCue = {
  start: number
  end: number
  text: string
}

export type Transcript = {
  text: string
  source: 'vimeo' | 'whisper' | 'manual' | 'pending'
  cues?: TranscriptCue[]
}

function hasSpokenWords(text: string) {
  const cleaned = text
    .replace(/\[[^\]]*\]/g, ' ')
    .replace(/\([^)]*music[^)]*\)/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim()
  return cleaned.length > 40
}

export async function loadTranscript(courseSlug: string, lessonSlug: string): Promise<Transcript | null> {
  const file = path.join(process.cwd(), 'content/transcripts', courseSlug, `${lessonSlug}.json`)
  try {
    const raw = await readFile(file, 'utf8')
    const data = JSON.parse(raw) as Transcript
    if (!data.text || !hasSpokenWords(data.text)) return null
    return data
  } catch {
    return null
  }
}
