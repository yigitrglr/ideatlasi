import { useState, useEffect, useCallback, useRef } from "react"
import PropTypes from "prop-types"
import { X } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "./button"

const Dialog = ({ open, onOpenChange, children, title }) => {
  const [isClosing, setIsClosing] = useState(false)
  const [shouldRender, setShouldRender] = useState(open)
  const [isMounted, setIsMounted] = useState(false)
  const [dragTranslateY, setDragTranslateY] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const touchStartYRef = useRef(null)
  const handleRef = useRef(null)

  useEffect(() => {
    if (open) {
      document.body.classList.add('dialog-open')
      setShouldRender(true)
      setIsClosing(false)
      setDragTranslateY(0)
      setIsDragging(false)
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setIsMounted(true)
        })
      })
    } else if (shouldRender && !isDragging) {
      setIsMounted(false)
      setIsClosing(true)
      setDragTranslateY(0)
      setIsDragging(false)
      const timer = setTimeout(() => {
        setShouldRender(false)
        setIsClosing(false)
        document.body.classList.remove('dialog-open')
      }, 400)
      return () => {
        clearTimeout(timer)
        document.body.classList.remove('dialog-open')
      }
    }
  }, [open, shouldRender, isDragging])

  const requestClose = useCallback(() => {
    if (isDragging) {
      touchStartYRef.current = null
      setIsDragging(false)
      setDragTranslateY(0)
      requestAnimationFrame(() => onOpenChange(false))
    } else {
      onOpenChange(false)
    }
  }, [onOpenChange, isDragging])

  const handleTouchStart = useCallback((e) => {
    if (e.touches?.length === 1) {
      touchStartYRef.current = e.touches[0].clientY
      setIsDragging(true)
    }
  }, [])

  const handleTouchEnd = useCallback((e) => {
    const startY = touchStartYRef.current
    touchStartYRef.current = null
    setIsDragging(false)
    setDragTranslateY(0)

    if (startY == null) return

    const endY = e.changedTouches?.length > 0 ? e.changedTouches[0].clientY : startY
    const deltaY = endY - startY
    if (deltaY > 80) onOpenChange(false)
  }, [onOpenChange])

  // Non-passive touch listeners so preventDefault works and drag isn't stolen by scroll
  useEffect(() => {
    const el = handleRef.current
    if (!el) return
    const onMove = (e) => {
      const startY = touchStartYRef.current
      if (startY == null || !e.touches || e.touches.length === 0) return
      e.preventDefault()
      const currentY = e.touches[0].clientY
      const translate = Math.max(0, currentY - startY)
      setDragTranslateY(translate)
    }
    el.addEventListener('touchmove', onMove, { passive: false })
    return () => el.removeEventListener('touchmove', onMove)
  }, [shouldRender])

  if (!shouldRender) return null

  return (
    <>
      <button
        type="button"
        className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
        style={{
          opacity: isClosing ? 0 : (isMounted ? 1 : 0),
          transition: 'opacity 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
          pointerEvents: isClosing ? 'none' : 'auto',
          willChange: 'opacity'
        }}
        onClick={requestClose}
        onKeyDown={(e) => {
          if (e.key === 'Escape' || e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            requestClose()
          }
        }}
        aria-label="Close dialog"
      />
      <div 
        className={cn(
          "fixed z-50 grid bg-background shadow-lg dialog-container",
          // Mobile: smaller, bottom sheet style (leave space so drag handle is always visible)
          "inset-x-0 bottom-0 max-h-[80vh] rounded-t-2xl border-t border-l border-r",
          // Desktop: centered modal
          "sm:left-1/2 sm:top-1/2 sm:bottom-auto sm:max-w-2xl sm:max-h-[90vh] sm:-translate-x-1/2 sm:-translate-y-1/2 sm:rounded-lg sm:border sm:mx-0 lg:max-w-4xl lg:max-h-[92vh]",
          !isDragging && isMounted && !isClosing && "opacity-100 translate-y-0 sm:scale-100",
          !isDragging && !isMounted && "opacity-0 translate-y-full sm:translate-y-0 sm:scale-95",
          !isDragging && isClosing && "opacity-0 translate-y-full sm:translate-y-0 sm:scale-95",
          // Dragging state class
          isDragging && "dialog-dragging"
        )}
        data-dragging={isDragging ? 'true' : undefined}
        style={{
          transition: isDragging ? 'none' : (isClosing ? 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)' : 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)'),
          // Use CSS variable for drag transform so CSS !important overrides Tailwind
          ...(isDragging ? { '--drag-y': `${dragTranslateY}px` } : {}),
        }}
      >
        {/* Mobile: Close handle - ref for non-passive touchmove */}
        <div
          ref={handleRef}
          className="sm:hidden flex justify-center pt-2 pb-1 touch-none cursor-grab active:cursor-grabbing"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          style={{
            touchAction: 'none',
            WebkitUserSelect: 'none',
            userSelect: 'none',
            paddingBlock: '0.5rem',
          }}
        >
          <div className="w-12 h-1 bg-muted-foreground/30 rounded-full pointer-events-none" />
        </div>
        
        {/* Header */}
        <div className="flex items-center justify-between border-b px-4 py-3 sm:px-6 sm:py-4">
          {title && <h2 className="text-base sm:text-2xl font-semibold pr-2 truncate flex-1">{title}</h2>}
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 sm:h-6 sm:w-6 flex-shrink-0 -mr-2 sm:mr-0"
            onClick={requestClose}
            aria-label="Close"
          >
            <X className="h-5 w-5 sm:h-4 sm:w-4" />
          </Button>
        </div>
        
        {/* Content */}
        <div
          className="overflow-y-auto overscroll-contain px-4 pt-4 pb-4 sm:px-6 sm:pt-8 sm:pb-6"
          style={{
            maxHeight: 'calc(88vh - 60px)',
            paddingBottom: 'calc(env(safe-area-inset-bottom, 0px) + 1rem)',
          }}
        >
          {!isMounted ? (
            <div className="space-y-4 py-4">
              <div className="skeleton h-32 w-full rounded-lg" />
              <div className="skeleton h-4 w-full rounded" />
              <div className="skeleton h-4 w-3/4 rounded" />
              <div className="skeleton h-4 w-1/2 rounded" />
            </div>
          ) : (
            children
          )}
        </div>
      </div>
    </>
  )
}

const DialogContent = ({ className, children, ...props }) => {
  return (
    <div className={cn("", className)} {...props}>
      {children}
    </div>
  )
}

Dialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onOpenChange: PropTypes.func.isRequired,
  children: PropTypes.node,
  title: PropTypes.string
}

DialogContent.propTypes = {
  className: PropTypes.string,
  children: PropTypes.node
}

export { Dialog, DialogContent }

