import React from 'react';
import GoogleMapsPicker from 'common_components/ui/google_maps_picker/google_maps_picker.ui';
import './test.screen.scss';
import { MapTypeId } from 'utils/interface.utils';
export default function Test() {
  return (
    <>
      <div style={{ backgroundColor: 'white' }}>Test</div>;
      <GoogleMapsPicker 
      defaultLocation = {{ lat: 19, lng: 80 }}
      defaultZoom= {16}
      mapTypeId= {MapTypeId.Roadmap}
      style= {{ height: "700px", width: "600px" }}
      onChangeLocation = {(lat: number, lng: number) => console.log(lat, lng)}
      onChangeZoom= {(newZoom: number) => console.log(newZoom)}
      apiKey= "AIzaSyBG8SjQz30VnO_BrRL1YqQgx9dJ24NII1k"
      />
    </>
  )
}
