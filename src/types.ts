import React, { SVGProps } from 'react'

import { Feature } from 'geojson'

import { Bounds, Coordinate, Point, Size } from '@jetblack/map'

/**
 * The state of a feature.
 */
export interface FeatureState {
  /** True if the mouse is over the feature; otherwise false */
  mouseOver: boolean
}

/**
 * The handler for requesting a feature style.
 */
export type RequestFeatureStyleHandler = (
  feature: Feature,
  state: FeatureState
) => SVGProps<SVGSVGElement> | null

/**
 * The props for a marker component.
 */
export interface MarkerComponentProps extends SVGProps<SVGSVGElement> {
  /** The screen point */
  point: Point
  /** The geojson feature */
  feature: Feature
}

/**
 * The type for a marker component
 */
export type MarkerComponent = React.FC<MarkerComponentProps>

/**
 * The props for a GeoJsonLayer component.
 */
export interface ComponentProps {
  /** The map centers */
  centers: Coordinate[]
  /** The zoom level */
  zoom: number
  /** The screen coordinate bounds */
  bounds: Bounds
  /** The size of the tiles */
  tileSize: Size
}
