import type { Lesson } from '@/lib/catalog'
import { vimeoEmbedUrl } from '@/lib/catalog'

export function VimeoPlayer({ lesson, title }: { lesson: Lesson; title?: string }) {
  return (
    <div className="relative aspect-video w-full overflow-hidden rounded-[1.5rem] bg-horizon">
      <iframe
        src={vimeoEmbedUrl(lesson)}
        title={title ?? lesson.title}
        className="absolute inset-0 h-full w-full"
        allow="autoplay; fullscreen; picture-in-picture"
        allowFullScreen
      />
    </div>
  )
}
