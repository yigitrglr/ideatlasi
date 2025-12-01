import { useState, useEffect } from "react"
import PropTypes from "prop-types"
import { X } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "./button"

const Dialog = ({ open, onOpenChange, children, title }) => {
  const [isClosing, setIsClosing] = useState(false)
  const [shouldRender, setShouldRender] = useState(open)

  useEffect(() => {
    if (open) {
      setShouldRender(true)
      setIsClosing(false)
    } else if (shouldRender) {
      setIsClosing(true)
      const timer = setTimeout(() => {
        setShouldRender(false)
        setIsClosing(false)
      }, 200)
      return () => clearTimeout(timer)
    }
  }, [open, shouldRender])

  if (!shouldRender) return null

  const dialogClass = isClosing ? "animate-scale-out" : "animate-scale-in"

  return (
    <>
      <div 
        role="button"
        tabIndex={0}
        className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
        style={{
          opacity: isClosing ? 0 : 1,
          transition: 'opacity 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
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
      <div className={cn(
        "fixed left-[50%] top-[50%] z-50 grid w-full max-w-2xl translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg sm:rounded-lg",
        dialogClass
      )}>
        <div className="flex items-center justify-between">
          {title && <h2 className="text-2xl font-semibold">{title}</h2>}
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6"
            onClick={() => onOpenChange(false)}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
        <div className="overflow-y-auto max-h-[70vh]">
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

