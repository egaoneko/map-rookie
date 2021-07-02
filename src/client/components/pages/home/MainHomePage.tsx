import React, { FC, useState } from 'react';
import SEO from '@components/organisms/common/SEO';
import HomeTemplate from '../../templates/layout/HomeTemplate';
import MapView, { MapViewPropsType } from '@components/atoms/view/MapView';
import { Layer, LayerProps, Source } from 'react-map-gl';
import { FeatureCollection } from 'geojson';

interface PropsType {}

const MainHomePage: FC<PropsType> = props => {
  const [viewport, setViewport] = useState<MapViewPropsType>({
    width: '100%',
    height: '100%',
    longitude: 126.9783882,
    latitude: 37.5666103,
    zoom: 11,
  });

  return (
    <>
      <SEO title="Home" />
      <HomeTemplate>
        <MapView
          mapStyle={'mapbox://styles/egaoneko/ckpv808ue0wuh17poxf9quq3t'}
          onViewportChange={nextViewport => setViewport(nextViewport)}
          {...viewport}
        >
          <Source
            id="map-rookie-source"
            type="vector"
            tiles={['http://localhost:3000/api/wmts/{z}/{x}/{y}']}
            minzoom={1}
            maxzoom={19}
          >
            <Layer
              id="ctprvn"
              source-layer="ctprvn"
              type="line"
              paint={{
                'line-color': '#007cbf',
              }}
            />
            <Layer
              id="charging_station"
              source-layer="charging_station"
              type="circle"
              paint={{
                'circle-color': '#ec1652',
              }}
            />
          </Source>
        </MapView>
      </HomeTemplate>
    </>
  );
};

export default MainHomePage;

const geojson: FeatureCollection = {
  type: 'FeatureCollection',
  features: [
    {
      type: 'Feature',
      properties: {},
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [127.20794677734374, 37.74900069437069],
            [126.97174072265625, 37.40725549559874],
            [127.3919677734375, 37.204081555898526],
            [127.6556396484375, 37.3461426132468],
            [127.7215576171875, 37.60552821745789],
            [127.20794677734374, 37.74900069437069],
          ],
        ],
      },
    },
    {
      type: 'Feature',
      properties: {},
      geometry: {
        type: 'LineString',
        coordinates: [
          [128.15277099609375, 37.95502661288625],
          [128.199462890625, 37.21064411993447],
          [127.66387939453124, 36.87522650673951],
          [127.87811279296875, 37.25656608611523],
          [127.93304443359375, 37.58811876638322],
          [127.8094482421875, 37.75768707689704],
          [127.628173828125, 37.87702138607635],
        ],
      },
    },
    {
      type: 'Feature',
      properties: {},
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [127.001953125, 36.619936625629215],
            [127.55126953124999, 36.619936625629215],
            [127.55126953124999, 37.08585785263673],
            [127.001953125, 37.08585785263673],
            [127.001953125, 36.619936625629215],
          ],
        ],
      },
    },
    {
      type: 'Feature',
      properties: {},
      geometry: {
        type: 'Point',
        coordinates: [128.5235595703125, 37.483576550426996],
      },
    },
    {
      type: 'Feature',
      properties: {},
      geometry: {
        type: 'Point',
        coordinates: [128.32305908203125, 37.01571219880126],
      },
    },
    {
      type: 'Feature',
      properties: {},
      geometry: {
        type: 'Point',
        coordinates: [128.56201171875, 36.901587303978474],
      },
    },
    {
      type: 'Feature',
      properties: {},
      geometry: {
        type: 'Point',
        coordinates: [128.00445556640625, 36.72787819497748],
      },
    },
    {
      type: 'Feature',
      properties: {},
      geometry: {
        type: 'Point',
        coordinates: [128.35052490234372, 37.727280276860036],
      },
    },
    {
      type: 'Feature',
      properties: {},
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [127.66387939453124, 36.70806354647625],
            [127.85064697265624, 36.39917828607653],
            [128.39996337890625, 36.511843709862454],
            [127.66387939453124, 36.70806354647625],
          ],
        ],
      },
    },
  ],
};

const pointStyle: LayerProps = {
  id: 'point',
  type: 'circle',
  paint: {
    'circle-radius': 10,
    'circle-color': '#007cbf',
  },
};

const lineStyle: LayerProps = {
  id: 'line',
  type: 'line',
  paint: {
    'line-color': '#000',
    'line-width': 3,
  },
};

const fillStyle: LayerProps = {
  id: 'fill',
  type: 'fill',
  paint: {
    'fill-color': '#0080ff',
    'fill-opacity': 0.5,
  },
};
