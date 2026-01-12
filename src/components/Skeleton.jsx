import PropTypes from 'prop-types'

export function Skeleton({ className, variant = 'rectangular' }) {
  const baseClasses = 'skeleton'
  const variantClasses = {
    rectangular: '',
    circular: 'rounded-full',
    text: 'h-4',
    avatar: 'rounded-full',
  }

  return (
    <div className={`${baseClasses} ${variantClasses[variant]} ${className || ''}`} />
  )
}

Skeleton.propTypes = {
  className: PropTypes.string,
  variant: PropTypes.oneOf(['rectangular', 'circular', 'text', 'avatar']),
}

export function ImageSkeleton({ className }) {
  return (
    <div className={`skeleton rounded-lg ${className || 'w-full h-full'}`} />
  )
}

ImageSkeleton.propTypes = {
  className: PropTypes.string,
}

export function TextSkeleton({ lines = 3, className }) {
  return (
    <div className={`space-y-2 ${className || ''}`}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          variant="text"
          className={i === lines - 1 ? 'w-3/4' : 'w-full'}
        />
      ))}
    </div>
  )
}

TextSkeleton.propTypes = {
  lines: PropTypes.number,
  className: PropTypes.string,
}

export function PhilosopherCardSkeleton() {
  return (
    <div className="p-4 bg-card rounded-lg border space-y-3">
      <div className="flex items-center gap-3">
        <ImageSkeleton className="w-16 h-16" />
        <div className="flex-1 space-y-2">
          <Skeleton variant="text" className="h-5 w-2/3" />
          <Skeleton variant="text" className="h-3 w-1/2" />
        </div>
      </div>
      <TextSkeleton lines={2} />
    </div>
  )
}
