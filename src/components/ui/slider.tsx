import * as React from 'react'
import { cn } from '@/lib/utils'

export interface SliderProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'value'> {
  value: number
  onChange: (value: number) => void
}

const Slider = React.forwardRef<HTMLInputElement, SliderProps>(
  ({ className, value, onChange, min, max, step, ...props }, ref) => {
    return (
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className={cn(
          'w-full h-2 bg-secondary rounded-lg appearance-none cursor-pointer accent-primary transition-all duration-200 hover:h-3',
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Slider.displayName = 'Slider'

export { Slider }
