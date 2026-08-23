import { readFile } from 'fs/promises'
import path from 'path'

export type Transcript = {
  text: string
  source: 'vimeo' | 'whisper' | 'manual'
}

export async function loadTranscript(courseSlug: string, lessonSlug: string): Promise<Transcript | null> {
  const file = path.join(process.cwd(), 'content/transcripts', courseSlug, `${lessonSlug}.json`)
  try {
    const raw = await readFile(file, 'utf8')
    return JSON.parse(raw) as Transcript
  } catch {
    return null
  }
}
