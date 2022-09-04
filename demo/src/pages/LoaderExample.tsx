import React, { SVGProps, useEffect, useRef, useState } from 'react'

import { Feature } from 'geojson'

import {
  Coordinate,
  Map,
  Point,
  Popup,
  osmTileProvider,
  useClick,
  useDrag,
  useZoom,
} from '@jetblack/map'
import { FeatureState, GeoJSONLayer } from '../../../dist'

const GREENWICH_OBSERVATORY: Coordinate = {
  latitude: 51.47684676353231,
  longitude: -0.0005261695762532147,
}

export default function LoaderExample() {
  const [data, setData] = useState<Feature>({} as Feature)

  const ref = useRef<HTMLDivElement>(null)

  const [zoom, setZoom] = useZoom({ ref, defaultZoom: 5 })
  const [center, setCenter] = useDrag({
    ref,
    zoom,
    defaultCenter: GREENWICH_OBSERVATORY,
    tileSize: osmTileProvider.tileSize,
  })

  useClick({
    ref,
    center,
    zoom,
    tileSize: osmTileProvider.tileSize,
    onClick: (coordinate: Coordinate, point: Point) => console.log('click', { coordinate, point }),
    onDoubleClick: (coordinate: Coordinate, point: Point) => {
      setCenter(coordinate)
      setZoom(zoom + 1)
    },
  })

  useEffect(() => {
    fetch(
      'https://raw.githubusercontent.com/isellsoap/deutschlandGeoJSON/main/2_bundeslaender/4_niedrig.geo.json'
    )
      .then(response => response.json())
      .then(data => setData(data))
  }, [])

  const handleRequestFeatureStyle = (
    feature: Feature,
    state: FeatureState
  ): SVGProps<SVGSVGElement> | null => {
    if (state.mouseOver) {
      return {
        fill: '#93c0d099',
        strokeWidth: '2',
        stroke: 'white',
        opacity: 0.5,
      }
    } else {
      return {
        fill: '#d4e6ec99',
        strokeWidth: '1',
        stroke: 'white',
        r: '20',
        opacity: 0.3,
      }
    }
  }

  const handleRenderFeature = (feature: Feature, point: Point) => {
    if (!(feature && feature.properties)) {
      return null
    }

    return (
      <Popup point={point}>
        <table
          style={{
            backgroundColor: 'rgb(255, 255, 255, 0.6)',
            borderRadius: 5,
            maxWidth: 300,
            padding: 2,
          }}
        >
          <tbody>
            {Object.entries(feature.properties).map(([key, value]) => (
              <tr key={key}>
                <th style={{ textAlign: 'left' }}>{key}</th>
                <td>{value}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Popup>
    )
  }

  return (
    <div>
      <div>
        <h2>Loader</h2>

        <p>
          This example uses <code>fetch</code> to dynamically load features.
        </p>

        <p>
          It also uses the <code>renderFeatureStyle</code> prop to create a hover effect, and the{' '}
          <code>renderPopup</code> prop to add a tooltip.
        </p>
      </div>

      <Map
        ref={ref}
        center={center}
        zoom={zoom}
        tileProvider={osmTileProvider}
        width={800}
        height={400}
      >
        <GeoJSONLayer
          data={data}
          requestFeatureStyle={handleRequestFeatureStyle}
          renderPopup={handleRenderFeature}
        />
      </Map>
    </div>
  )
}
