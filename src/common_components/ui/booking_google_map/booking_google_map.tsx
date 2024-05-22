import Assets from "imports/assets.import";
import React, { useEffect } from "react";
import { withGoogleMap, GoogleMap, DirectionsRenderer, Marker } from "react-google-maps";
import { useSetState } from "utils/functions.utils";

function Map({ origin, destination, icon,driverIcon }) {
  const [state, setState] = useSetState({
    directions: null,
  });

  useEffect(() => {
    getDirections();
  }, []);

  const getDirections = () => {
    const directionsService = new google.maps.DirectionsService();

    if (origin !== null && destination !== null) {
      directionsService.route(
        {
          origin: new google.maps.LatLng(origin[0],origin[1]),
          destination: new google.maps.LatLng(destination[0], destination[1]),
          travelMode: google.maps.TravelMode.DRIVING,
        },
        (result, status) => {
          if (status === google.maps.DirectionsStatus.OK) {
            setState({
              directions: result,
            });
          } else {
            console.error(`error fetching directions ${result}`);
          }
        }
      );
    } else {
      console.log("Please mark your destination in the map first!");
    }
  };

  const GoogleMapExample = withGoogleMap(props => (
    <GoogleMap defaultCenter={{ lat: 13.0894, lng: 80.1948 }} defaultZoom={13}>
      <Marker
        position={new google.maps.LatLng(destination[0], destination[1])}
        onClick={() => new google.maps.LatLng(destination[0], destination[1])}
        icon={icon}
      />
      <Marker
        position={new google.maps.LatLng(origin[0],origin[1])}
        onClick={() => new google.maps.LatLng(origin[0],origin[1])}
        icon={driverIcon}
      />
      <DirectionsRenderer
        directions={state.directions}
        defaultOptions={{
          suppressMarkers: true,
        }}
      />
    </GoogleMap>
  ));

  return (
    <div>
      <GoogleMapExample containerElement={<div style={{ height: `900px`, width: "" }} />} mapElement={<div style={{ height: `100%` }} />} />
    </div>
  );
}

export default Map;
