export type Lesson = {
  slug: string
  title: string
  vimeoId: string
  vimeoHash?: string
  isPreview: boolean
  sortOrder: number
}

export type Course = {
  slug: string
  title: string
  tagline: string
  description: string
  who: string
  cover: string
  priceCents: number
  sku: string
  includesPdf?: string
  lessons: Lesson[]
}

export type Book = {
  slug: string
  title: string
  description: string
  cover: string
  kind: 'pdf' | 'amazon'
  amazonUrl?: string
  pdfFile?: string
  includedWith?: string[]
}

export const SITE = {
  name: 'Cynthia Music',
  tagline: 'To heal the world with music',
  promise: 'Learn piano and composition so you can play with your kids and grandkids.',
  email: 'hello@cynthiamusic.com',
  url: 'https://cynthiamusic.com',
  city: 'Sarasota, Florida',
}

export const PRICE = {
  courseCents: 9700,
  bundleCents: 19700,
}

function lesson(
  title: string,
  vimeoId: string,
  vimeoHash: string | undefined,
  isPreview: boolean,
  sortOrder: number,
): Lesson {
  return {
    slug: title
      .toLowerCase()
      .replace(/&/g, 'and')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, ''),
    title,
    vimeoId,
    vimeoHash,
    isPreview,
    sortOrder,
  }
}

export const courses: Course[] = [
  {
    slug: 'one-hour-piano',
    title: 'One Hour Piano',
    tagline: 'Sit down today. Play something real tonight.',
    description:
      'Cynthia built this for her brother Steve, who wanted to play piano and did not want a year of theory first. Ten short lessons: the seven letters, the black and white keys, middle C, chords, inversions, and left-hand patterns. Adults use it. Kids use it. Grandparents use it at the same piano.',
    who: 'First piano. Kids, adults, and grandparents together.',
    cover: '/images/courses/one-hour-piano.jpg',
    priceCents: PRICE.courseCents,
    sku: 'one-hour-piano',
    includesPdf: 'reading-music-is-easy',
    lessons: [
      lesson('Preview', '539393476', undefined, true, 0),
      lesson('Pythagoras', '539393586', 'b0f5cfd0e9', false, 1),
      lesson('Hands Fingering', '539393635', '84f0685790', false, 2),
      lesson('7 Letters', '539394653', '93204a0731', false, 3),
      lesson('Black and White Keys', '539395221', 'ac163c8c4b', false, 4),
      lesson('Middle C and the C Scale', '539395810', 'fbfb2f2444', false, 5),
      lesson('Relative Minors & Chords', '539418710', '17b0383a61', false, 6),
      lesson('Inversions', '539398343', '2c96ff55aa', false, 7),
      lesson('Octaves', '539400379', 'c4c0051215', false, 8),
      lesson('Left Hand Patterns', '539400829', '539b15b9f3', false, 9),
    ],
  },
  {
    slug: 'music-is-numbers',
    title: 'Music is Numbers',
    tagline: 'Compose with the Nashville number system.',
    description:
      'Chords, scales, and songs are numbers. Once you see that, you can play in any key, transpose on the spot, and write your own tunes. Cynthia walks through Walk the Line, I Have to Say I Love You, and José Cuervo — the #1 country song she wrote — so you can hear how the numbers become music.',
    who: 'After One Hour Piano. Families who want to write, not just read.',
    cover: '/images/courses/music-is-numbers.jpg',
    priceCents: PRICE.courseCents,
    sku: 'music-is-numbers',
    includesPdf: 'music-is-numbers',
    lessons: [
      lesson('Preview', '539415272', undefined, true, 0),
      lesson('Pythagoras', '539415613', 'b00068bda6', false, 1),
      lesson('Whole Steps Half Steps', '539415680', '3a9079c061', false, 2),
      lesson('Scales and Keys', '539416361', '68708d5340', false, 3),
      lesson('Relative Minors', '539416510', '3f2da6fcde', false, 4),
      lesson('Chords & Relative Minors', '539397097', 'bd231dab3a', false, 5),
      lesson('Chord Symbols', '539419588', 'e4697ac8a2', false, 6),
      lesson('Bass Note Slash', '539419623', 'a4ffb7d0e9', false, 7),
      lesson('Guitar Chords', '539419658', 'aa9d63b8f7', false, 8),
      lesson('I Walk the Line', '539419714', 'a04bffb889', false, 9),
      lesson('Time Signature', '539419816', '09640cde46', false, 10),
      lesson('Transposing', '539419918', 'a48aa46d1e', false, 11),
      lesson('I Have to Say I Love You', '539420038', 'cb60680418', false, 12),
      lesson('Jose Cuervo', '539420387', '50887e460b', false, 13),
      lesson('Music is Numbers', '539424160', '3db798a614', false, 14),
    ],
  },
  {
    slug: 'play-thousands',
    title: 'Play Thousands of Songs',
    tagline: 'Find any scale. Build any chord. Play the song.',
    description:
      'Three focused lessons on the “big fake”: how to find any scale, how to build chords from it, and the extra formulas that unlock thousands of songs. Short on purpose. You leave able to sit down and play.',
    who: 'Players who already know the keyboard and want songs, fast.',
    cover: '/images/courses/play-thousands.jpg',
    priceCents: PRICE.courseCents,
    sku: 'play-thousands',
    lessons: [
      lesson('Find Any Scale', '539420484', 'fa9192e3fe', true, 0),
      lesson('Building Chords', '539421922', '67fc36ff80', false, 1),
      lesson('More Chord Formulas', '539423429', '848770906f', false, 2),
    ],
  },
]

export const bundle = {
  slug: 'piano-bundle',
  title: 'The Piano Family Bundle',
  tagline: 'All three courses, both workbooks, one price.',
  description:
    'One Hour Piano, Music is Numbers, and Play Thousands of Songs — plus the Reading Music is Easy and Music is Numbers PDFs. The whole path from first notes to composing together.',
  priceCents: PRICE.bundleCents,
  sku: 'piano-bundle',
  courseSlugs: courses.map((c) => c.slug),
  savingsCents: PRICE.courseCents * 3 - PRICE.bundleCents,
}

export const books: Book[] = [
  {
    slug: 'reading-music-is-easy',
    title: 'Reading Music is Easy',
    description:
      'As easy as A-B-C-D-E-F-G and counting to 4. The workbook Cynthia wrote for her brother. Included with One Hour Piano and the bundle. Paperback on Amazon.',
    cover: '/images/books/reading-music-is-easy.jpg',
    kind: 'pdf',
    pdfFile: 'reading-music-is-easy.pdf',
    amazonUrl: 'https://www.amazon.com/Reading-Music-Easy-Cynthia-Jordan/dp/1515181898',
    includedWith: ['one-hour-piano', 'piano-bundle'],
  },
  {
    slug: 'music-is-numbers',
    title: 'Music is Numbers',
    description:
      'Composing and the Nashville number system, made easy. Included with the Music is Numbers course and the bundle. Paperback on Amazon.',
    cover: '/images/books/music-is-numbers.jpg',
    kind: 'pdf',
    pdfFile: 'music-is-numbers.pdf',
    amazonUrl: 'https://www.amazon.com/MUSIC-NUMBERS-COMPOSING-NASHVILLE-PLAYING/dp/B0G1YDFYSN',
    includedWith: ['music-is-numbers', 'piano-bundle'],
  },
  {
    slug: 'messages-from-animals',
    title: 'Beginner Piano with Messages from Animals',
    description:
      'Kids piano with life lessons from animals. The book you put on the bench next to a grandchild. Paperback on Amazon.',
    cover: '/images/books/messages-from-animals.jpg',
    kind: 'amazon',
    amazonUrl:
      'https://www.amazon.com/BEGINNER-PIANO-MESSAGES-ANIMALS-PLAYING/dp/B0FYDDYPNM',
  },
  {
    slug: 'music-is-fun',
    title: 'Music is Fun: Learning How to Read with Arpeggios',
    description:
      'Read music through arpeggios — patterns instead of panic. Paperback on Amazon.',
    cover: '',
    kind: 'amazon',
    amazonUrl: 'https://www.amazon.com/MUSIC-FUN-LEARNING-READ-ARPEGGIOS/dp/B0FXWFV9LC',
  },
]

export function formatPrice(cents: number) {
  return `$${Math.round(cents / 100)}`
}

export function getCourse(slug: string) {
  return courses.find((c) => c.slug === slug) ?? null
}

export function getLesson(courseSlug: string, lessonSlug: string) {
  const course = getCourse(courseSlug)
  if (!course) return null
  const lesson = course.lessons.find((l) => l.slug === lessonSlug) ?? null
  if (!lesson) return null
  return { course, lesson }
}

export function vimeoEmbedUrl(lesson: Lesson) {
  const hash = lesson.vimeoHash ? `?h=${lesson.vimeoHash}` : ''
  return `https://player.vimeo.com/video/${lesson.vimeoId}${hash}`
}

export function vimeoWatchUrl(lesson: Lesson) {
  return lesson.vimeoHash
    ? `https://vimeo.com/${lesson.vimeoId}/${lesson.vimeoHash}`
    : `https://vimeo.com/${lesson.vimeoId}`
}

export function allVimeoLessons() {
  return courses.flatMap((course) =>
    course.lessons.map((lesson) => ({ course, lesson })),
  )
}
