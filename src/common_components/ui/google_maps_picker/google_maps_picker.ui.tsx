import React, { useState, useEffect } from 'react'
import Button from "common_components/ui/button/button.ui";
import MapPicker from 'react-google-map-picker'
import "./google_maps_picker.ui.scss"
import { MapTypeId } from 'utils/interface.utils';
import Autocomplete from "react-google-autocomplete"

const DefaultZoom = 20;

let currentLocation = {
  lat: 19,
  lng: 80
};

interface MapPickerOptions {
  defaultLocation: { lat: number, lng: number };
  defaultZoom: number;
  mapTypeId: MapTypeId;
  style: { height: string, width: string };
  onChangeLocation: (lat: number, lng: number, open?: boolean) => void;
  onChangeZoom: (newZoom: number) => void;
  apiKey: string;
}


const GoogleMapsPicker = (props: MapPickerOptions) => {
  const { defaultLocation: DefaultLocation, defaultZoom, mapTypeId, style, onChangeLocation, onChangeZoom, apiKey } = props;

  const [defaultLocation, setDefaultLocation] = useState(DefaultLocation);
  const [enableMap, setEnableMap] = useState(false);
  const [location, setLocation] = useState(defaultLocation);
  const [zoom, setZoom] = useState(defaultZoom);

  useEffect(() => {
    getLocation();
  }, [])

  async function getLocation() {
    // if (navigator.geolocation) {
      // navigator.geolocation.getCurrentPosition((position) => {
      //   let currentLocation = {
      //     lat: position.coords.latitude,
      //     lng: position.coords.longitude
      //   }
      //   setDefaultLocation(currentLocation);
      //   handleChangeLocation(currentLocation.lat, currentLocation.lng);
      //   setEnableMap(true);
      // }); 
      setDefaultLocation(defaultLocation)
      setEnableMap(true);
      setZoom(15)
    // } else {
    //   console.log("Geolocation is not supported by this browser.");
    //   return "Geolocation is not supported by this browser."
    // }
  }

  function handleChangeLocation(lat, lng) {
    setLocation({ lat: lat, lng: lng });
    onChangeLocation(lat, lng, true);
  }

  function handleChangeZoom(newZoom) {
    setZoom(newZoom);
    onChangeZoom(newZoom);
  }

  function handleResetLocation() {
    setDefaultLocation({ ...DefaultLocation });
    setZoom(DefaultZoom);
  }

  const center = { lat: 50.064192, lng: -130.605469 };
  // Create a bounding box with sides ~10km away from the center point
  const defaultBounds = {
    north: center.lat + 0.1,
    south: center.lat - 0.1,
    east: center.lng + 0.1,
    west: center.lng - 0.1,
  };
  return (
    <div className="google_picker_container">
      <div style={{ width: style.width, height: style.height }} className="map_picker_container">
        {enableMap && (
          <>
            <Autocomplete
              apiKey={apiKey}
              style={{
                boxSizing: `border-box`,
                border: `1px solid transparent`,
                width: `300px`,
                height: `44px`,
                padding: `0 12px`,
                borderRadius: `10px`,
                boxShadow: `0 2px 6px rgba(0, 0, 0, 0.3)`,
                fontSize: `14px`,
                outline: `none`,
                textOverflow: `ellipses`,
                position: "absolute",
                left: "41%",
                top: "28px",
                marginLeft: "-35px",
                zIndex: 2,
              }}
              onPlaceSelected={(place: any) => {
                setLocation({ lat: place?.geometry?.location?.lat(), lng: place?.geometry?.location?.lng() });
                onChangeLocation(place?.geometry?.location?.lat(), place?.geometry?.location?.lng(), true);
              }}
              options={{
                bounds: defaultBounds,
                componentRestrictions: { country: "in" },
                fields: ["address_components", "geometry", "icon", "name"],
                strictBounds: false,
                types: ["establishment"],
              }}
            />
            <MapPicker
              defaultLocation={location}
              zoom={zoom}
              mapTypeId={mapTypeId || MapTypeId.Roadmap}
              style={style}
              onChangeLocation={handleChangeLocation}
              onChangeZoom={handleChangeZoom}
              apiKey={apiKey}
              className="google_maps"
            />
          </>
        )}
      </div>
      <div onClick={() => onChangeLocation(location.lat, location.lng, false)} className="button_container">
        <Button value="Submit" />
      </div>
    </div>
  );
}

export default GoogleMapsPicker