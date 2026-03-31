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
          key={`text-skeleton-${lines}-${i}`}
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

export function SettingsPageSkeleton() {
  return (
    <div className="min-h-screen bg-background p-8 animate-fade-in">
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="flex items-center gap-2">
          <Skeleton className="h-9 w-40 rounded-md" />
        </div>

        <Skeleton className="h-9 w-36 rounded-md" />

        <div className="space-y-4">
          <div className="p-4 border rounded-lg space-y-3">
            <div className="flex items-center justify-between gap-4">
              <div className="space-y-2 flex-1">
                <Skeleton className="h-5 w-24 rounded" />
                <Skeleton className="h-4 w-48 rounded" />
              </div>
              <Skeleton className="h-11 w-36 rounded-md" />
            </div>
          </div>

          <div className="p-4 border rounded-lg space-y-2">
            <Skeleton className="h-5 w-20 rounded" />
            <Skeleton className="h-4 w-56 rounded" />
          </div>
        </div>
      </div>
    </div>
  )
}

export function AboutPageSkeleton() {
  return (
    <div className="min-h-screen bg-background p-8 animate-fade-in">
      <div className="max-w-4xl mx-auto space-y-6">
        <Skeleton className="h-9 w-40 rounded-md" />
        <Skeleton className="h-9 w-44 rounded-md" />

        <div className="space-y-3">
          <Skeleton className="h-4 w-full rounded" />
          <Skeleton className="h-4 w-11/12 rounded" />
          <Skeleton className="h-4 w-10/12 rounded" />
        </div>

        <div className="mt-8 space-y-6">
          <Skeleton className="h-7 w-40 rounded" />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-muted rounded-lg space-y-3">
              <div className="flex items-center gap-3">
                <Skeleton className="h-12 w-12 rounded-lg" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-28 rounded" />
                  <Skeleton className="h-7 w-16 rounded" />
                </div>
              </div>
            </div>
          </div>

          <div className="p-4 bg-muted rounded-lg space-y-4">
            <Skeleton className="h-6 w-48 rounded" />
            <div className="space-y-3">
              {['a', 'b', 'c', 'd', 'e'].map((k) => (
                <div key={`about-stat-skel-${k}`} className="space-y-2">
                  <div className="flex justify-between">
                    <Skeleton className="h-4 w-44 rounded" />
                    <Skeleton className="h-4 w-24 rounded" />
                  </div>
                  <Skeleton className="h-2 w-full rounded-full" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
