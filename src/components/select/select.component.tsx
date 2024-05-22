import React, { useEffect } from "react";
import "./select.component.scss";
import { useSetState } from "utils/functions.utils";
import OverlayClose from "../../common_components/ui/overlay_close/overlay_close.component";
import CustomModal from "../../common_components/ui/modal/modal.component";
import AddAddress from "components/add_address/add_address.component";
import { Models } from "utils/imports.utils";
import Button from "../../common_components/ui/button/button.ui";
import Assets from "imports/assets.import";
import { useSelector } from "react-redux";
import { DRIVER_STATUS } from "constants/driver.constant";
import { ORG_TYPE } from "constants/org.constant";
import { DriverStatus } from "constants/user.constant";

interface customInputProps {
  className?: string;
  label?: string;
  placeholder?: string;
  name: string;
  org?: string;
  onChange: any;
  type: "address" | "store" | "organization" | "driver" | "user" | "store_driver" |"dedicated_org"|"hub"| "city"|"driver_status";
  value?: string;
}
export default function œœSelect(props: customInputProps) {
  const { label, name, className, placeholder, onChange, type, value } = props;
  const org = localStorage.getItem("org");
  const store = localStorage.getItem("store");

  const [state, setState] = useSetState({
    open: false,
    isVisible: false,
    data: [],
    value: "",
    id: "",
    search: "",
    limit: 1000,
  });
  useEffect(() => {
     Action[type]();
  }, [state.search]);


  useEffect(() => {
    if(type === "address" && value && !state.value){
      handleSelect(value);
    }
    if(type === 'city' && value && !state.value) {
      handleSelect(value)
    }
    if ((type === "driver" || type === "store_driver") && !value) {
      setState({ value })
    }
    if(type === 'hub' && value && !state.value){
       handleSelect(value);
    }
    if(type === 'organization' && value && !state.value) {
      handleSelect(value)
    }
    if(type === 'driver_status' && value && !state.value) {
      handleSelect(value)
    }
  }, [value])

  
  const GetManyAddress = async () => {
    try {
      const body: any = {
        search: state.search,
        limit: state.limit,
      };
      if (org) {
        body.org = org;
      }
      if (store) {
        body.store = store;
      }
      const res: any = await Models.address.getManyAddress(body);
      setState({ data: res?.data?.docs });
    } catch (err) {
      console.log(err);
    }
  };
  
  const GetManyDriver = async () => {
    const body: any = {
      search: state.search,
      limit: state.limit,
      filter:DRIVER_STATUS.APPROVED
    };
    if (org) {
      body.org = org;
    }
    if (store) {
      body.store = store;
    }
    try {
      const res: any = await Models.driver.getManyDriver(body);
      setState({ data: res?.data?.docs });
    } catch (err) {
      console.log(err);
    }
  };
  const getStoreDrivers = async () => {
    const body: any = {
      search: state.search,
      limit: state.limit,
    };
    if (org) {
      body.org = org;
    }
    if (store) {
      body.store = store;
    }
    try {
      const res: any = await Models.driver.getStoreDrivers(body);
      setState({ data: res?.data?.docs });
    } catch (err) {
      console.log(err);
    }
  };
  const GetManyOrganization = async () => {
    try {
      const body: any = {
        search: state.search,
        limit: state.limit,
      };
      const res: any = await Models.organization.getManyOrganization(body);
      setState({ data: res?.data?.docs });
    } catch (err) {
      console.log(err);
    }
  };
  const GetDedicatedOrg = async () => {
    try {
      const body: any = {
        search: state.search,
        limit: state.limit,
      };
      const res: any = await Models.organization.getManyOrganization(body);
      let filterOrg = res.data.docs.filter((org: any) => org.type === ORG_TYPE.DEDICATED);
      setState({ data: filterOrg });
    } catch (err) {
      console.log(err);
    }
  };

  const GetManyStore = async () => {
    setState({ loading: true });
    const body: any = {
      search: state.search,
      limit: state.limit,
    };
    if (org || props.org) {
      body.org = org || props.org;
    }
    try {
      // if(org || props.org){
      const res: any = await Models.store.getManyStore(body);
      setState({ data: res?.data?.docs, loading: false });
    // }
    } catch (err) {
      setState({ loading: false });
      console.log(err);
    }
  };
  const GetManyUser = async () => {
    const body: any = {
      search: state.search,
      limit: state.limit,
    };
    if (org) {
      body.org = org;
    }
    if (store) {
      body.store = store;
    }
    try {
      const res: any = await Models.user.getUserList(body);
      setState({ data: res?.data?.docs });
    } catch (err) {
      console.log(err);
    }
  };

  const getCity = async () => {
    try {
      const body = {
        search: state.search,
        limit: state.limit,
      };
      const res: any = await Models.city.getCityWithoutPagination(body);
      setState({ data: res?.data });
    } catch (err: any) {
      console.log(err);
    }
  };
  const GetManyHub = async () => {
    try {
      const res: any = await Models.hub.getHubWithoutPagination();
      setState({ data: res?.data });
    } catch (err: any) {
      console.log(err);
    }
  };

  const driverStatus = () => {
    setState({ data: DriverStatus });
  };
  const Action = {
    address: GetManyAddress,
    store: GetManyStore,
    organization: GetManyOrganization,
    driver: GetManyDriver,
    store_driver: getStoreDrivers,
    user: GetManyUser,
    dedicated_org:GetDedicatedOrg,
    city:getCity,
    hub:GetManyHub,
    driver_status:driverStatus
  };

  const getValue = data => {
    if (type === "address" || type === "user") {
      return type === "address" ? `${data.name} - ${data.address}, ${data.city}, ${data.pincode}` : data.username;
    }
    else if (type === "city") {
      return data.city_name ? data.city_name : "";
    }
    else if (type === "driver_status") return data;
    else return data.name ? data.name : "";
  };


   

  const handleSelect = data => {
    setState({
      value: getValue(data),
      id: data._id,
      isVisible: false,
      open: false,
      search: "",
    });
    if (store) {
      getStoreDrivers();
    }
    if(type === 'driver_status')  onChange(data)
    else onChange(data._id, data.name);
  };

  const handleChange = e => {
    setState({ search: e.target.value, value: e.target.value });
    if (!e.target.value) {
      onChange("");
    }
  };
  const handleVisible = e => {
    if (type === "store") {
      GetManyStore();
    }
    if(type === "store_driver"){
      getStoreDrivers();
    }
    setState({ isVisible: true, search: "" });
  };
  

  return (
    <div className="select_address">
      <OverlayClose onClick={() => setState({ isVisible: false })}>
        <div className="select_address_container">
          <div className="input_container">
            <div className="label_container caption2">{label}</div>
            <div className="field_wrap" onClick={handleVisible}>
              <input
                autoComplete="off"
                className={`${className} input menu`}
                name={name}
                onChange={handleChange}
                placeholder={placeholder}
                value={state.value || ""}
              />
            </div>
          </div>
          <div className={`select_address_body ${state.isVisible && "visible_body"}`}>
            <div className="custon_input_body_container">
              <div className="select_input_container">
                <div className="select_input_wrapper">
                  {type === "address" && (
                    <>
                      <div className="add_button_container">
                        <Button
                          value="+ Add address"
                          borderColor="primary"
                          color="white"
                          textColor="primary"
                          buttonType="button"
                          onClick={() => setState({ open: true })}
                        />
                      </div>
                      <div className="options_wrapper">
                        {state.data.length && state.search
                          ? state.data.map(data => (
                              <div className="options_container menu" onClick={() => handleSelect(data)}>
                                <div className="address_list_wrapper">
                                  <div className="address_list_name">
                                    {data.name} - {data.phone}{" "}
                                  </div>
                                  <div className="address_list_address">{`${data.address}, ${data.city}, ${data.pincode}`}</div>
                                </div>
                              </div>
                            ))
                          : state.search && <div className="no_data_found">No Address Found</div>}
                      </div>
                    </>
                  )}
                  {type === "store" && (
                    <div className="options_wrapper">
                      {!state.loading && state.data.length ? (
                        state.data.map(data => (
                          <div className="store_name_container menu" onClick={() => handleSelect(data)}>
                            {data.name}
                          </div>
                        ))
                      ) : state.loading ? (
                        // <div className="no_data_found">Select Organization</div>
                        <div className="no_data_found">Loading...</div>
                      ) : (
                        <div className="no_data_found">No Stores Found</div>
                      )}
                    </div>
                  )}
                  {type === "driver" && (
                    <div className="options_wrapper">
                      {state.data.length ? (
                        state.data.map(data => (
                          <div className="driver_wrapper" onClick={() => handleSelect(data)}>
                            <div className="driver_image_conainer">
                              <img src={data.profile_picture || Assets.testPic} alt="" className="driver_image" />
                            </div>
                            <div className="driver_name_wrapper">
                              <div className="driver_name_container manu">{data.name}</div>
                              {/* <div className="driver_id_container">
                                - ID{data.id}
                              </div> */}
                              <div className="driver_label_container">- Driver</div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="no_data_found">No Drivers Found</div>
                      )}
                    </div>
                  )}

                  {type === "hub" && (
                    <div className="options_wrapper">
                      {!state.loading && state.data.length ? (
                        state.data.map(data => (
                          <div className="store_name_container menu" onClick={() => handleSelect(data)}>
                            {data.name}
                          </div>
                        ))
                      ) : state.loading ? (
                        // <div className="no_data_found">Select Organization</div>
                        <div className="no_data_found">Loading...</div>
                      ) : (
                        <div className="no_data_found">No Hub Found</div>
                      )}
                    </div>
                  )}
                  {type === "city" && (
                    <div className="options_wrapper">
                      {!state.loading && state.data.length ? (
                        state.data.map(data => (
                          <div className="store_name_container menu" onClick={() => handleSelect(data)}>
                            {data.city_name}
                          </div>
                        ))
                      ) : state.loading ? (
                        // <div className="no_data_found">Select Organization</div>
                        <div className="no_data_found">Loading...</div>
                      ) : (
                        <div className="no_data_found">No City Found</div>
                      )}
                    </div>
                  )}
                  {type === "driver_status" && (
                    <div className="options_wrapper">
                      {!state.loading ? (
                        state.data.map(data => (
                          <div className="store_name_container menu" onClick={() => handleSelect(data)}>
                            {data}
                          </div>
                        ))
                      ) : state.loading ? (
                        // <div className="no_data_found">Select Organization</div>
                        <div className="no_data_found">Loading...</div>
                      ) : (
                        <div className="no_data_found"></div>
                      )}
                    </div>
                  )}
                  {type === "driver" && (
                    <div className="options_wrapper">
                      {state.data.length ? (
                        state.data.map(data => (
                          <div className="driver_wrapper" onClick={() => handleSelect(data)}>
                            <div className="driver_image_conainer">
                              <img src={data.profile_picture || Assets.testPic} alt="" className="driver_image" />
                            </div>
                            <div className="driver_name_wrapper">
                              <div className="driver_name_container manu">{data.name}</div>
                              {/* <div className="driver_id_container">
                                - ID{data.id}
                              </div> */}
                              <div className="driver_label_container">- Driver</div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="no_data_found">No Drivers Found</div>
                      )}
                    </div>
                  )}
                  {type === "store_driver" && (
                    <div className="options_wrapper">
                      {state.data.length ? (
                        state.data.map(data => (
                          <div className="driver_wrapper" onClick={() => handleSelect(data)}>
                            <div className="driver_image_conainer">
                              <img src={data.profile_picture || Assets.testPic} alt="" className="driver_image" />
                            </div>
                            <div className="driver_name_wrapper">
                              <div className="driver_name_container manu">{data.name}</div>
                              {/* <div className="driver_id_container">
                              - ID{data.id}
                            </div> */}
                              <div className="driver_label_container">- Driver</div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="no_data_found">No Drivers Found</div>
                      )}
                    </div>
                  )}
                  {type === "organization" && (
                    <div className="options_wrapper">
                      {state.data.length ? (
                        state.data.map(data => (
                          <div className="organization_wrapper" onClick={() => handleSelect(data)}>
                            <div className="organization_image_conainer">
                              <img src={data.logo || Assets.testPic} alt="" className="organization_image" />
                            </div>
                            <div className="options_container menu" onClick={() => handleSelect(data)}>
                              {data.name}
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="no_data_found">No Organization Found</div>
                      )}
                    </div>
                  )}
                  {type === "dedicated_org" && (
                    <div className="options_wrapper">
                      {state.data?.length ? (
                        state.data.map(data => (
                          <div className="organization_wrapper" onClick={() => handleSelect(data)}>
                            <div className="organization_image_conainer">
                              <img src={data.logo || Assets.testPic} alt="" className="organization_image" />
                            </div>
                            <div className="options_container menu" onClick={() => handleSelect(data)}>
                              {data.name}
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="no_data_found">No Organization Found</div>
                      )}
                    </div>
                  )}
                  {type === "user" && (
                    <div className="options_wrapper">
                      {state.data.length ? (
                        state.data.map(data => (
                          <div className="user_wrapper" onClick={() => handleSelect(data)}>
                            <div className="user_image_conainer">
                              <img src={data.profile_picture || Assets.testPic} alt="" className="user_image" />
                            </div>
                            <div className="options_container menu">{data.username}</div>
                          </div>
                        ))
                      ) : (
                        <div className="no_data_found">No Users Found</div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </OverlayClose>
      <CustomModal open={state.open} onClose={() => setState({ open: false })}>
        <AddAddress onChange={data => handleSelect(data)} />
      </CustomModal>
    </div>
  );
}
