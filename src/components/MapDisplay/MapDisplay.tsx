import React, {useEffect, useState, useRef, useCallback} from 'react';
import {
  APIProvider,
  Map,
  AdvancedMarker,
  MapCameraChangedEvent,
  useMap,
  Pin,
  InfoWindow,
  useAdvancedMarkerRef
}
from '@vis.gl/react-google-maps';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { useGetWeatherStations } from "../../hooks/useGetWeatherStations";

const MarkerWithInfoWindow = ({poi}) => {
  // `markerRef` and `marker` are needed to establish the connection between
  // the marker and infowindow (if you're using the Marker component, you
  // can use the `useMarkerRef` hook instead).
  const [markerRef, marker] = useAdvancedMarkerRef();

  const [infoWindowShown, setInfoWindowShown] = useState(false);

  // clicking the marker will toggle the infowindow
  const handleMarkerClick = useCallback(
    () => setInfoWindowShown(isShown => !isShown),
    []
  );

  // if the maps api closes the infowindow, we have to synchronize our state
  const handleClose = useCallback(() => setInfoWindowShown(false), []);

  return (
    <>
      <AdvancedMarker
	key={poi.id}
        ref={markerRef}
        position={{
	  lat: parseFloat(poi.latitude),
	  lng: parseFloat(poi.longitude)
	}}
        onClick={handleMarkerClick}
      >
	<Pin background={'#FBBC04'} glyphColor={'#000'} borderColor={'#000'} />
      </AdvancedMarker>

      {infoWindowShown && (
        <InfoWindow anchor={marker} onClose={handleClose} headerDisabled>
          <Typography variant="h6" gutterBottom>{poi.name}
	  </Typography>
          <Typography>Site: {poi.site}</Typography>
	  <Typography>Portfolio: {poi.portfolio}</Typography>
	  <Typography>Last Measurement: {poi.measurements[poi.measurements.length - 1].timestamp}</Typography>
	  {poi.measurements[poi.measurements.length - 1].datapoints.map( (datapoint) => (
	    <Typography key={datapoint.id}>- {datapoint.variable.long_name}: {datapoint.value} {datapoint.variable.unit}</Typography>

	    ))}
	    
	    

        </InfoWindow>
      )}
    </>
  );
};

const PoiMarkers = (props: { pois }) => {
  const map = useMap();
 

  const handleClick = useCallback((ev: google.maps.MapMouseEvent) => {
    if(!map) return;
    if(!ev.latLng) return;
    console.log('marker clicked:', ev.latLng.toString());
    map.panTo(ev.latLng);
  });

  return (
    <>
      {props.pois.map((poi) => (
	<MarkerWithInfoWindow poi={poi} key={poi.id} />
      ))}
    </>
  );
};


export default function MapDisplay() {

  const { isLoading, error, data } = useGetWeatherStations();

  return (
    <>
      <APIProvider apiKey={import.meta.env.VITE_MAPS_API_KEY} onLoad={() => console.log('Maps API has loaded.')}>
	<Box
	  sx={{
	    width: '100%',
	    height: '100%',

	  }}
	>
	  <Map
	    style={{width: '100%', height: '100%'}}
	    defaultZoom={4}
	    defaultCenter={ { lat: -26.8539498, lng: 133.0460983 } }
	    mapId='d177017b90527cd4'
	    onCameraChanged={ (ev: MapCameraChangedEvent) =>
              console.log('camera changed:', ev.detail.center, 'zoom:', ev.detail.zoom)
	    }>
		(!isLoading && !error && <PoiMarkers pois={data} />)
	  </Map>
	</Box>
      </APIProvider>
    </>
  );
}
