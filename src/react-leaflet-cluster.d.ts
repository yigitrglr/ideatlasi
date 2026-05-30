declare module 'react-leaflet-cluster' {
  import type { ReactNode } from 'react'
  import type { MarkerClusterGroupOptions } from 'leaflet'

  interface MarkerClusterGroupProps extends MarkerClusterGroupOptions {
    children?: ReactNode
    chunkedLoading?: boolean
    maxClusterRadius?: number
  }

  export default function MarkerClusterGroup(props: MarkerClusterGroupProps): ReactNode
}
