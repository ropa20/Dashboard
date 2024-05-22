import InputField from "common_components/ui/field/field.ui";
import { Form, Formik, Field } from "formik";
import React, { useEffect } from "react";
import "./add_address.component.scss";
import * as validation from "utils/validation.utils";
import Button from "common_components/ui/button/button.ui";
import { Models } from "utils/imports.utils";
import GoogleMapsPicker from 'common_components/ui/google_maps_picker/google_maps_picker.ui';
import CustomModal from "../../common_components/ui/modal/modal.component";
import { toastifyError, useSetState } from "utils/functions.utils";
import { MapTypeId } from "utils/interface.utils";
import { ROLES } from "constants/user.constant";
import {
  geocodeByAddress,
  geocodeByPlaceId,
  getLatLng,
} from 'react-places-autocomplete';

interface addAddressProps {
  onChange?: any;
}
let form = null;
export default function AddAddress(props: addAddressProps) {
  const [state, setState] = useSetState({ 
    open: false,
    defaultLocation: { lat: 13.0739183, lng: 80.1907184 },
  });
  const { onChange } = props;
  const initialValues = {
    name: "",
    address: "",
    city: "",
    phone: "",
    pincode: "",
    landmark: "",
  };

  const org = localStorage.getItem("organization");
  const store = localStorage.getItem("store");
  const role = localStorage.getItem("role");

  const handleSubmit = async value => {
    try {
      const { latitude: lat, longitude: lon, ...values } = value;
      const { latitude, longitude } = state;
      if (latitude && longitude) {
        const location = {
          type: "Point",
          coordinates: [longitude, latitude],
        };
        values.location = location;
      } else {
        return toastifyError("Choose location from map");
      }
      
      if(org) {
        values.organization = org;
      }
      if(store) {
        values.store = store;
      }
      if(role === ROLES.ADMIN) {
        values.is_admin = true;
      }

      const address: any = await Models.address.createAddress(values);
      onChange(address?.data);
    } catch (err) {
      toastifyError(err);
      console.log(err);
    }
  };

  const handleChangeLocation = (lat, lng, open) => {
    setState({ latitude: lat, longitude: lng, open: open });
  }

  const openMaps=()=> {
    var geocoder = new google.maps.Geocoder();
    let pincode = document.getElementById("pincode")
    {/*@ts-ignore*/}
    var address = pincode?.value;
    geocoder.geocode({ 'address': 'zipcode ' + address }, function (results, status) {
      if (status == google.maps.GeocoderStatus.OK) {
        {/*@ts-ignore*/ }
        var latitude = results[0].geometry.location.lat();
        {/*@ts-ignore*/}
        var longitude = results[0].geometry.location.lng();
        console.log(latitude , longitude);
        setState({defaultLocation:{lat:latitude,lng:longitude},open:true});
      } else {
        setState({ defaultLocation: { lat: 13.0739184, lng: 80.1907183 }, open: true })
      }
    });
  }

  return (
    <div className="add_address_container">
      <div className="address_head_container">Add Address</div>
      {/*@ts-ignore*/}
      <Formik onSubmit={handleSubmit} validationSchema={validation.address} initialValues={initialValues}>
        <Form>
          <div className="address_input_container">
            <InputField name="name" type="text" placeholder="Name" />
          </div>
          <div className="address_input_container">
            <InputField name="phone" type="text" placeholder="Phone" />
          </div>
          <div className="address_input_container">
            <InputField name="address" type="text" placeholder="Door no, Street name, Area name" />
          </div>
          <div className="address_input_wrapper">
            <div className="address_input_container">
              <InputField name="city" type="text" placeholder="City" />
            </div>
            <div className="address_input_container">
              <InputField id="pincode" name="pincode" 
              type="number" placeholder="Pincode" />
            </div>
          </div>
            {
              state.latitude && state.longitude &&
              <>
                <div className="address_input_location">Latitude   : {state.latitude}</div>
                <div className="address_input_location">Longitude : {state.longitude}</div>
              </>
            }
          <div className="address_map_text" onClick={() => openMaps()}>Pick location from map</div>
          <div className="address_input_container">
            <InputField name="landmark" type="text" placeholder="Landmark (Optional)" />
          </div>
          <div className="button_container">
            <Button value="Add address" />
          </div>
        </Form>
      </Formik>

      <CustomModal open={state.open} onClose={() => setState({ open: false })}>
        <GoogleMapsPicker 
          defaultLocation = {state.defaultLocation}
          defaultZoom= {16}
          mapTypeId= {MapTypeId.Roadmap}
          style= {{ height: "600px", width: "600px" }}
          onChangeLocation = {(lat: number, lng: number, open?: boolean) => handleChangeLocation(lat, lng, open)}
          onChangeZoom= {(newZoom: number) => console.log(newZoom)}
          apiKey= "AIzaSyBG8SjQz30VnO_BrRL1YqQgx9dJ24NII1k"
        />
      </CustomModal>
    </div>
  );
}
