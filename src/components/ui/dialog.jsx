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
      }, 200)
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
          transition: 'opacity 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
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
          "fixed left-1/2 top-1/2 z-50 grid w-full max-w-2xl -translate-x-1/2 -translate-y-1/2 gap-4 border bg-background p-4 sm:p-6 shadow-lg sm:rounded-lg transition-all duration-300 mx-4 sm:mx-0",
          isMounted ? "opacity-100 scale-100" : "opacity-0 scale-95",
          isClosing && "opacity-0 scale-95"
        )}
        style={{
          transitionTimingFunction: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
          maxHeight: '90vh'
        }}
      >
        <div className="flex items-center justify-between">
          {title && <h2 className="text-lg sm:text-2xl font-semibold pr-2">{title}</h2>}
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 flex-shrink-0"
            onClick={() => onOpenChange(false)}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
        <div className="overflow-y-auto max-h-[calc(90vh-80px)] sm:max-h-[70vh]">
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

