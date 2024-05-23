import React, { useEffect } from "react";
import { useSetState, toastifyError } from "utils/functions.utils";
import { Models} from "utils/imports.utils";
import { Validation} from "utils/imports.utils";
import "./city.screen.scss";
import "react-responsive-modal/styles.css";
import DeletePopup from "components/delete_popup/delete_popup.component";
import Table from "components/table/table.component";
import Search from "common_components/ui/search/search.ui";
import CustomModal from "common_components/ui/modal/modal.component";
import { useNavigate } from "react-router-dom";
import _ from "lodash";

export default function User() {
  const navigate = useNavigate();
  const org = localStorage.getItem("org");
  let city:any = localStorage.getItem('city')
  city = JSON.parse(city)
  //redux

  //state
  const [state, setState] = useSetState({
    data: [],
    search: "",
    openModal: false,
    viewModal: false,
    deleteModal: false,
    loading: true,
    timeout: 0,
    limit: 20,
    refreshLimit: 20,
    excelData: [],
    isOpenModel: false,
    start_date: "",
    end_date: "",
    export: false,
    exportLoader: false,
    cityNameFocus: false,
    cityValueFocus: false,
    cityName:"",
    cityValue:'',
    buttonLoading:false,
    errorArray:[],
    editCity:false
  });

  const thead = [
    { head: "City name", key: "city_name" },
    { head: "City value", key: "city_value" },
  ];



  // hooks
  useEffect(() => {
    GetManyData(true);
  }, [state.search]);

  // useEffect(() => {
  //   let interval = setInterval(() => {
  //     setState({ timeout: Math.random() });
  //   }, autoRefreshTime);
  //   return () => clearInterval(interval);
  // }, []);

  useEffect(() => {
    GetManyRefresh();
  }, []);

  //network req
  const GetManyRefresh = async () => {
    try {
      const limit = state.refreshLimit;
      const skip = 0;
      const body: any = {
        search: state.search,
        limit: limit,
        skip,
      };
      const res: any = await Models.city.getManyCity(body);
      setState({ data: res?.data?.docs, totalDocs: res.data.totalDocs });
    } catch (error) {
      console.log(error);
      toastifyError(error);
    }
  };

  const GetManyData = async (reset = false) => {
    try {
      if (reset) {
        setState({ loading: true, data: [] });
      }
      const skip = reset ? 0 : state.data.length;
      const limit = state.limit;
      const body: any = {
        search: state.search,
        limit: limit,
        skip,
      };
      const res: any = await Models.city.getManyCity(body);
      if (reset) {
        setState({ data: res?.data?.docs, totalDocs: res.data.totalDocs, loading: false,skip });
      } else {
        setState({ data: [...state.data, ...res?.data?.docs], totalDocs: res.data.totalDocs, loading: false,skip });
      }
      setState({ refreshLimit: res.data.docs.length });
    } catch (error) {
      console.log(error);
      setState({ loading: false });
      toastifyError(error);
    }
  };

  // create city
  const CityCreate = async () => {
    try {
      const body = {
        city_name: state.cityName,
        city_value: state.cityValue,
      };
      await Validation.city.validate(body, {
        abortEarly: false,
      });
      const res: any = await Models.city.createCity(body);
      window.location.reload()
      GetManyData(true)
    } catch (err: any) {
      let uniqueErr = _.unionBy(JSON.parse(JSON.stringify(err))?.inner,(e:any)=>{
        return e.path
      })
      setState({
        errorArray:uniqueErr,
      });
      toastifyError(err);
    }
  };

  const editCity = async () => {
    try {
      const body = {
        city_id:state.id,
        city_name: state.cityName,
        city_value: state.cityValue,
      };
      await Validation.city.validate(body, {
        abortEarly: false,
      });
      const res: any = await Models.city.editCity(body);
      window.location.reload()
    } catch (err: any) {
      let uniqueErr = _.unionBy(JSON.parse(JSON.stringify(err))?.inner, (e: any) => {
        return e.path;
      });
      setState({
        errorArray: uniqueErr,
      });
      toastifyError(err);
    }
  };

  const loadMore = async (reset = false) => {
    try {
      if (reset) {
        setState({ loading: true, data: [] });
      }
      const skip = state.limit;
      const body: any = {
        search: state.search,
        limit: state.limit,
        skip,
      };
      const res: any = await Models.city.getManyCity(body);
      if (reset) {
        setState({ data: res?.data?.docs, totalDocs: res.data.totalDocs, loading: false, skip });
      } else {
        setState({ data: [...state.data, ...res?.data?.docs], totalDocs: res.data.totalDocs, loading: false, skip });
      }
      setState({ refreshLimit: state.refreshLimit + state.limit });
    } catch (error) {
      console.log(error);
      setState({ loading: false });
      toastifyError(error);
    }
  };

  const DeleteUser = async () => {
    try {
      const body = {
        city_id: state.id,
      };
      const res: any = await Models.city.deleteCity(body);
      if (!_.isEmpty(city) && city.value !== "all_cities") {
        if (city.value === state.id) localStorage.removeItem("city");
      }
      window.location.reload()
    } catch (err: any) {
      toastifyError(err);
      setState({ deleteModal: false });
    }
  };

  const handleView = data => {
    navigate(`/view_user/${data?._id}`);
  };
  const handleEdit = (data: any) => {
    setState({ cityName: data.city_name, cityValue: data.city_value, editCity: true, id: data._id });
  };

  const handleDelete = async (data: any) => {
    setState({ id: data._id, deleteModal: true });
  };

  return (
    <div className="city_screen">
      <div className="header_container">
        <div className="header_wrapper">
          <div className="head h5">City</div>
          <div className="search_wrapper">
            <Search value={state.search} onChange={search => setState({ search })} />
          </div>
        </div>
      </div>
      <div className="city_screen_flex_wrapper">
        <div className="usertable" style={{ width: "50%" }}>
          <Table
            data={state.data}
            loading={state.loading}
            totalDocs={state.totalDocs}
            theads={thead}
            link="user"
            actions={[
              {
                icon: "edit",
                onClick: handleEdit,
              },
              {
                icon: "delete",
                onClick: handleDelete,
              },
            ]}
            loadMore={() => loadMore()}
            imageKey="logo"
          />
          <CustomModal
            center
            open={state.deleteModal}
            classNames={{ modalContainer: "delete_modal_container" }}
            onClose={() => setState({ deleteModal: false })}
          >
            <DeletePopup onPress={DeleteUser} onCancel={() => setState({ deleteModal: false })} />
          </CustomModal>
        </div>
        <div className="city_screen_field_wrapper">
          <div className="add_city_field">
            <div className="city_input_label">City*</div>
            <input
              value={state.cityName}
              onChange={(e: any) => setState({ cityName: e.target.value })}
              className={state.cityNameFocus ? "city_field_focus" : ""}
              onBlur={() => setState({ cityNameFocus: false })}
              onFocus={() => setState({ cityNameFocus: true })}
              placeholder="city name"
              type="text"
            />
            {/* error message */}
            {state.errorArray &&
              state.errorArray.map((error: any) => {
                return <>{"city_name" == error?.path && <div className="error_message">{"city_name" === error?.path && error.message}</div>}</>;
              })}
          </div>
          <div className="city_value_field">
            <div className="city_input_label">City value*</div>
            <input
              value={state.cityValue}
              onChange={(e: any) => setState({ cityValue: e.target.value })}
              className={state.cityValueFocus ? "city_field_focus" : ""}
              onBlur={() => setState({ cityValueFocus: false })}
              onFocus={() => setState({ cityValueFocus: true })}
              placeholder="city value"
              type="text"
            />
            {state.errorArray &&
              state.errorArray.map((error: any) => {
                return <>{"city_value" == error?.path && <div className="error_message">{"city_value" === error?.path && error.message}</div>}</>;
              })}
          </div>
          <div onClick={state.editCity ? () => editCity() : ()=>CityCreate()} className="city_submit_button_wrapper">
            <div className="city_submit_button">{state.editCity ? "Update" : "Save"}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
