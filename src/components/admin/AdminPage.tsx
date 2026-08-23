import type { ReactNode } from 'react'

export function AdminPage({ children }: { children: ReactNode }) {
  return <div className="w-full px-6 py-8">{children}</div>
}
