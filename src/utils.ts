import {
  Feature,
  Geometry,
  GeometryCollection,
  LineString,
  MultiLineString,
  MultiPoint,
  MultiPolygon,
  Point,
  Polygon,
  Position,
} from 'geojson'

import {
  isInWorldBounds,
  recenterScreenPoint,
  Coordinate,
  CoordinateBounds,
  Point as ScreenPoint,
  Size,
} from '@jetblack/map'

/**
 * Return a range of numbers.
 *
 * @param start The first number in the range.
 * @param stop The last number in the range (exclusive).
 * @param step The step (defaults to 1).
 * @returns An array of numbers.
 */
export function range(start: number, stop: number, step: number = 1): number[] {
  const length = Math.ceil((stop - start) / step)
  return Array.from({ length }, (_, i) => i * step + start)
}

/**
 * Convert a geojson position to a coordinate.
 *
 * @param position The geojson position.
 * @returns A coordinate
 */
export const geoJsonPointToCoordinate = ([longitude, latitude]: Position): Coordinate => ({
  latitude,
  longitude,
})

/**
 * Calculate a point in the screen coordinate system from a geojson point in
 * the world coordinate system.
 *
 * @param position The geojson position.
 * @param center The map center in world coordinates.
 * @param zoom The zoom level.
 * @param screenSize The screen size.
 * @param tileSize The tile size.
 * @returns The point in the screen coordinate system
 */
export const geoJsonPointToScreenPoint = (
  [longitude, latitude]: Position,
  center: Coordinate,
  zoom: number,
  screenSize: Size,
  tileSize: Size
): ScreenPoint =>
  recenterScreenPoint(
    {
      latitude,
      longitude,
    },
    center,
    zoom,
    screenSize,
    tileSize
  )

/**
 * Calculate the centers for the case where the map is zoomed out such that a point can appear more than once.
 *
 * @param center The center of the map
 * @param param1 The bounds of the coordinates
 * @returns The coordinates for map centers.
 */
export function calcCenters(
  center: Coordinate,
  { northWest, southEast }: CoordinateBounds
): Coordinate[] {
  const westLongitudeCount = Math.trunc(northWest.longitude / 180)
  const eastLongitudeCount = Math.trunc(southEast.longitude / 180)

  const centers = [
    ...range(westLongitudeCount, 0, 1).map(x => ({
      latitude: center.latitude,
      longitude: center.longitude + x * 360,
    })),
    center,
    ...range(0, eastLongitudeCount, 1).map(x => ({
      latitude: center.latitude,
      longitude: center.longitude + (x + 1) * 360,
    })),
  ]

  return centers
}

/**
 * Determine if the geojson point is in the viewable area.
 *
 * @param position The geojson position.
 * @param worldBounds The coordinate bounds for the viewable area.
 * @returns True if the point is in the viewable area; otherwise false.
 */
function isPointInWorldBounds(
  [longitude, latitude]: Position,
  worldBounds: CoordinateBounds
): boolean {
  return isInWorldBounds(latitude, longitude, worldBounds)
}

/**
 * Determine if the geojson geometry is in the viewable area.
 *
 * @param geometry The geojson geometry.
 * @param worldBounds The coordinate bounds for the viewable area.
 * @returns True if the geometry is in the viewable area; otherwise false.
 */
function isGeometryInWorldBounds(geometry: Geometry, worldBounds: CoordinateBounds): boolean {
  switch (geometry.type) {
    case 'GeometryCollection':
      return (geometry as GeometryCollection).geometries.some(g =>
        isGeometryInWorldBounds(g, worldBounds)
      )

    case 'Point':
      return isPointInWorldBounds((geometry as Point).coordinates, worldBounds)

    case 'MultiPoint':
      return (geometry as MultiPoint).coordinates.some(point =>
        isPointInWorldBounds(point, worldBounds)
      )

    case 'LineString':
      return (geometry as LineString).coordinates.some(point =>
        isPointInWorldBounds(point, worldBounds)
      )

    case 'MultiLineString':
      return (geometry as MultiLineString).coordinates.some(line =>
        line.some(point => isPointInWorldBounds(point, worldBounds))
      )

    case 'Polygon':
      return (geometry as Polygon).coordinates.some(path =>
        path.some(point => isPointInWorldBounds(point, worldBounds))
      )

    case 'MultiPolygon':
      return (geometry as MultiPolygon).coordinates.some(polygon =>
        polygon.some(path => path.some(point => isPointInWorldBounds(point, worldBounds)))
      )

    default:
      return false
  }
}

/**
 * Determine if the geojson feature is in the viewable area.
 *
 * @param feature The geojson feature.
 * @param worldBounds The coordinate bounds for the viewable area.
 * @returns True if the feature is in the viewable area; otherwise false.
 */
export function isFeatureInWorldBounds(feature: Feature, worldBounds: CoordinateBounds): boolean {
  return isGeometryInWorldBounds(feature.geometry, worldBounds)
}
