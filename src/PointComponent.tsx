import { SVGProps } from 'react'

import { Feature, Point } from 'geojson'

import { CLASS_NAMES, Coordinate } from '@jetblack/map'

import { geoJsonPointToScreenPoint } from './utils'
import { ComponentProps, MarkerComponent } from './types'

const classNames = {
  point: [
    CLASS_NAMES.primary,
    CLASS_NAMES.draggable,
    CLASS_NAMES.zoomable,
    CLASS_NAMES.clickable,
    'geojson',
    'point',
  ].join(' '),
}

/**
 * The prop type for a [[`PointComponent`]]
 */
export interface PointComponentProps extends ComponentProps {
  /** The GeoJSON point */
  point: Point
  /** The GeoJSON feature */
  feature: Feature
  /** The marker component */
  markerComponent?: MarkerComponent
}

/** The default marker component */
export const Circle: MarkerComponent = ({ point, ...props }) => (
  <circle cx={point.x} cy={point.y} {...(props as SVGProps<SVGCircleElement>)} />
)

/**
 * Render a GeoJSON Point.
 */
export default function PointComponent({
  point,
  markerComponent: Component = Circle,
  centers,
  zoom,
  bounds,
  tileSize,
  ...props
}: PointComponentProps & SVGProps<SVGSVGElement>) {
  const toScreenPoint = (point: Point, center: Coordinate) =>
    geoJsonPointToScreenPoint(point.coordinates, center, zoom, bounds, tileSize)

  return (
    <>
      {centers.map((center, i) => (
        <Component
          key={i}
          className={classNames.point}
          point={toScreenPoint(point, center)}
          {...props}
        />
      ))}
    </>
  )
}
