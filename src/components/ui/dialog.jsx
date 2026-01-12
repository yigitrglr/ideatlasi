import { useState, useEffect } from "react"
import PropTypes from "prop-types"
import { X } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "./button"

const Dialog = ({ open, onOpenChange, children, title }) => {
  const [isClosing, setIsClosing] = useState(false)
  const [shouldRender, setShouldRender] = useState(open)
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    if (open) {
      setShouldRender(true)
      setIsClosing(false)
      // Use double RAF to ensure layout is complete before animation
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setIsMounted(true)
        })
      })
    } else if (shouldRender) {
      setIsMounted(false)
      setIsClosing(true)
      const timer = setTimeout(() => {
        setShouldRender(false)
        setIsClosing(false)
      }, 500)
      return () => clearTimeout(timer)
    }
  }, [open, shouldRender])

  if (!shouldRender) return null

  return (
    <>
      <div 
        role="button"
        tabIndex={0}
        className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
        style={{
          opacity: isClosing ? 0 : (isMounted ? 1 : 0),
          transition: 'opacity 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
          pointerEvents: isClosing ? 'none' : 'auto',
          willChange: 'opacity'
        }}
        onClick={() => onOpenChange(false)}
        onKeyDown={(e) => {
          if (e.key === 'Escape' || e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            onOpenChange(false)
          }
        }}
        aria-label="Close dialog"
      />
      <div 
        className={cn(
          "fixed z-50 grid w-full gap-4 border bg-background shadow-lg transition-all duration-500 ease-out",
          // Mobile: fullscreen
          "inset-0 sm:left-1/2 sm:top-1/2 sm:max-w-2xl sm:-translate-x-1/2 sm:-translate-y-1/2 sm:rounded-lg sm:mx-0",
          // Padding
          "p-3 sm:p-6",
          // Animation states
          isMounted ? "opacity-100 scale-100" : "opacity-0 scale-95",
          isClosing && "opacity-0 scale-95"
        )}
        style={{
          transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)',
          maxHeight: '100vh'
        }}
      >
        <div className="flex items-center justify-between border-b pb-2 sm:border-0 sm:pb-0">
          {title && <h2 className="text-base sm:text-2xl font-semibold pr-2 truncate flex-1">{title}</h2>}
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 sm:h-6 sm:w-6 flex-shrink-0"
            onClick={() => onOpenChange(false)}
          >
            <X className="h-5 w-5 sm:h-4 sm:w-4" />
          </Button>
        </div>
        <div className="overflow-y-auto flex-1 min-h-0">
          {children}
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

