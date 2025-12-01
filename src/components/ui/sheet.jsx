import { useState, useEffect } from "react"
import PropTypes from "prop-types"
import { X } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "./button"

const Sheet = ({ open, onOpenChange, children, side = "right" }) => {
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
      }, 300)
      return () => clearTimeout(timer)
    }
  }, [open, shouldRender])

  if (!shouldRender) return null

  const sideClasses = {
    right: "inset-y-0 right-0 border-l top-0",
    left: "inset-y-0 left-0 border-r top-0",
    top: "inset-x-0 top-0 border-b",
    bottom: "inset-x-0 bottom-0 border-t",
  }

  const animationClass = isClosing
    ? (side === "left" ? "animate-slide-out-left" : "animate-slide-out-right")
    : (side === "left" ? "animate-slide-in-left" : "animate-slide-in-right")

  return (
    <>
      <div 
        role="button"
        tabIndex={0}
        className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
        style={{
          opacity: isClosing ? 0 : 1,
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
        aria-label="Close menu"
      />
      <div className={cn(
        "fixed z-50 w-80 bg-background shadow-lg",
        sideClasses[side],
        animationClass
      )}>
        <div className="flex h-full flex-col pt-16">
          <div className="flex items-center justify-between border-b p-4">
            <h2 className="text-lg font-semibold">Menü</h2>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onOpenChange(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex-1 overflow-y-auto p-4">
            {children}
          </div>
        </div>
      </div>
    </>
  )
}

Sheet.propTypes = {
  open: PropTypes.bool.isRequired,
  onOpenChange: PropTypes.func.isRequired,
  children: PropTypes.node,
  side: PropTypes.oneOf(["left", "right", "top", "bottom"])
}

Sheet.defaultProps = {
  side: "right"
}

export { Sheet }

