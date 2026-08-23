import { NextRequest, NextResponse } from 'next/server'
import { readFile } from 'fs/promises'
import path from 'path'
import { books } from '@/lib/catalog'
import { getEntitledSlugs, getSessionUser } from '@/lib/access'

export async function GET(request: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const book = books.find((b) => b.slug === slug && b.kind === 'pdf')
  if (!book?.pdfFile) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }

  const user = await getSessionUser()
  if (!user) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  const entitled = await getEntitledSlugs(user.id)
  const allowed =
    (slug === 'reading-music-is-easy' && (entitled.includes('one-hour-piano') || entitled.length === 3)) ||
    (slug === 'music-is-numbers' && (entitled.includes('music-is-numbers') || entitled.length === 3)) ||
    entitled.includes('piano-bundle')

  const ownsBundle = entitled.includes('one-hour-piano') && entitled.includes('music-is-numbers')
  if (!allowed && !ownsBundle) {
    return NextResponse.json({ error: 'Not entitled' }, { status: 403 })
  }

  const file = path.join(process.cwd(), 'content/pdfs', book.pdfFile)
  const bytes = await readFile(file)
  return new NextResponse(bytes, {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `inline; filename="${book.pdfFile}"`,
    },
  })
}
