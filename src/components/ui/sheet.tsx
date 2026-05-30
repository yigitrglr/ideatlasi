import type { ReactNode } from 'react'
import { X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from './button'

type SheetSide = 'left' | 'right' | 'top' | 'bottom'

interface SheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  children?: ReactNode
  side?: SheetSide
  title?: string
}

const sideClasses: Record<SheetSide, string> = {
  right: 'inset-y-0 right-0 top-0 border-l',
  left: 'inset-y-0 left-0 top-0 border-r',
  top: 'inset-x-0 top-0 border-b',
  bottom: 'inset-x-0 bottom-0 border-t',
}

const Sheet = ({ open, onOpenChange, children, side = 'right', title = 'Menü' }: SheetProps) => {
  const translateClass =
    side === 'left'
      ? open
        ? 'translate-x-0'
        : '-translate-x-full pointer-events-none'
      : side === 'right'
        ? open
          ? 'translate-x-0'
          : 'translate-x-full pointer-events-none'
        : open
          ? 'translate-y-0'
          : side === 'top'
            ? '-translate-y-full pointer-events-none'
            : 'translate-y-full pointer-events-none'

  return (
    <>
      <button
        type="button"
        className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm transition-opacity duration-300"
        style={{
          opacity: open ? 1 : 0,
          pointerEvents: open ? 'auto' : 'none',
          willChange: 'opacity',
        }}
        onClick={() => onOpenChange(false)}
        onKeyDown={(e) => {
          if (e.key === 'Escape' || e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            onOpenChange(false)
          }
        }}
        aria-label="Close menu"
      />
      <div
        className={cn(
          'fixed z-50 w-full sm:w-80 bg-background shadow-lg transition-transform duration-300 ease-out',
          sideClasses[side],
          translateClass
        )}
      >
        <div className="flex h-full flex-col pt-16">
          <div className="flex items-center justify-between border-b p-4">
            <h2 className="text-lg font-semibold truncate">{title}</h2>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onOpenChange(false)}
              aria-label="Kapat"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex-1 overflow-y-auto p-4">{children}</div>
        </div>
      </div>
    </>
  )
}

export { Sheet }
