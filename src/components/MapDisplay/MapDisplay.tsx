import React, {useEffect, useState, useCallback} from 'react';
import {
  APIProvider,
  Map,
  AdvancedMarker,
  MapCameraChangedEvent,
  Pin,
  InfoWindow,
  useAdvancedMarkerRef
}
from '@vis.gl/react-google-maps';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid2';
import useGetWeatherStations from "../../hooks/useGetWeatherStations";
import POIFilter from "../POIFilter/POIFilter";

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
	<Pin background={'#FBBC04'} glyphColor={'#000'} borderColor={'#000'} scale={0.8} />
      </AdvancedMarker>

      {infoWindowShown && (
        <InfoWindow anchor={marker} onClose={handleClose} headerContent={<Typography variant="h6">{poi.name}</Typography>}>
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

const PoiMarkers = ({ pois }) => {
  return (
    <>
      {pois.map((poi) => (
	<MarkerWithInfoWindow poi={poi} key={poi.id} />
      ))}
    </>
  );
};


export default function MapDisplay() {

  const { isLoading, error, data } = useGetWeatherStations();
  const [filteredPOIS, setFilteredPOIS] = useState([]);

  useEffect(() => {
    if (data && data.length > 0) {
      setFilteredPOIS(data);
    }
  }, [data]);

  const handleFilterChange = (selectedStates) => {
    if (selectedStates.length === 0) {
      setFilteredPOIS(data);
    } else {
      const filtered = data.filter(poi =>
	selectedStates.includes(poi.state)
      );
      setFilteredPOIS(filtered);
    }
  }
  
  return (
      <APIProvider apiKey={import.meta.env.VITE_MAPS_API_KEY} onLoad={() => console.log('Maps API has loaded.')}>
	<Grid container spacing={2} sx={{height: '90%'}}>
	  <Grid size={2}>
	    <POIFilter
	      pois={data}
	      onFilterChange={handleFilterChange}
	    />
	  </Grid>
	  <Grid size="grow">
	    <Map
	      defaultZoom={5}
	      defaultCenter={ { lat: -30.2946953, lng: 145.7221977 } }
	      mapId='d177017b90527cd4'
	      onCameraChanged={ (ev: MapCameraChangedEvent) =>
		console.log('camera changed:', ev.detail.center, 'zoom:', ev.detail.zoom)
	      }>
	      {!isLoading && !error && <PoiMarkers pois={filteredPOIS} />}
	    </Map>
	  </Grid>
	</Grid>
      </APIProvider>
  );
}
