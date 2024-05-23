import React, { useEffect } from 'react';
import { useSetState, toastifyError} from 'utils/functions.utils';
import { Models } from 'utils/imports.utils';
import './store.screen.scss';
import 'react-responsive-modal/styles.css';
import DeletePopup from 'components/delete_popup/delete_popup.component';
import Table from 'components/table/table.component';
import Button from 'common_components/ui/button/button.ui';
import Search from 'common_components/ui/search/search.ui';
import Assets from 'imports/assets.import';
import CustomModal from 'common_components/ui/modal/modal.component';
import { useNavigate, useParams } from 'react-router-dom';
import _ from 'lodash';

export default function Store() {
  const navigate = useNavigate();
  const { organizationId } = useParams();
  let city: any = localStorage.getItem("city");
  city = JSON.parse(city);
  console.log(organizationId);
  //redux

  //state
  const [state, setState] = useSetState({
    data: [],
    search: '',
    openModal: false,
    viewModal: false,
    deleteModal: false,
    loading: false,
    organization: {},
  });

  const thead = [
    { head: 'Name', key: 'name' },
    { head: 'Address', key: 'address.address', isNested: true },
    { head: 'Type', key: 'type' },
    { head: 'Phone', key: 'phone' },
    // { head: 'Store incharge', key: 'store_incharge.username', isNested: true },
  ];
  // hooks
  useEffect(() => {
    GetManyData();
    GetOrganization();
  }, [state.search]);

  //network req
  const GetManyData = async () => {
    try {
      const body = {
        search: state.search,
        organization: organizationId,
      };
      if (!_.isEmpty(city)) {
        body["city"] = city.value;
      }
      setState({ loading: false });
      const res: any = await Models.store.getManyStore(body);
      setState({ data: res?.data?.docs, loading: false });
    } catch (error) {
      console.log(error);
    }
  };

  const GetOrganization = async () => {
    try {
      const response: any = await Models.organization.getOrganization({
        organization_id: organizationId,
      });
      setState({ organization: response.data });
    } catch (err) {
      console.log(err);
      toastifyError(err);
    }
  };

  const DeleteStore = async () => {
    try {
      await Models.store.deleteStore({
        store_id: state.id,
      });
      setState({ id: '', deleteModal: false });
      GetManyData();
    } catch (err) {
      console.log(err);
      toastifyError(err);
    }
  };

  const handleView = (data) => {
    navigate(`/organization/${organizationId}/view_store/${data._id}`);
  };
  const handleEdit = (data) => {
    navigate(`/organization/${organizationId}/edit_store/${data._id}`);
  };
  const handleDelete = (data) => {
    setState({ id: data._id, deleteModal: true });
  };

  return (
    <div className="store_screen">
      <div className="header_container">
        <div className="header_wrapper">
          <div className="header_details_wrapper">
            <div className="back_button_container">
              <img
                src={Assets.leftArrow}
                alt=""
                className="back_image"
                onClick={() => navigate(-1)}
              />
            </div>
            <div className="header_image_container">
              <img
                src={state?.organization?.logo || Assets.testPic}
                alt=""
                className="header_image"
              />
            </div>
            <div className="header_details">
              <div className="organization_name h5">
                {state?.organization?.name}
              </div>
              {/* <div className="organization_id">
                ID - {state?.organization?.id}
              </div> */}
              <div className="organization_contact_wrapper">
                <div className="organization_email">
                  {state?.organization?.phone}
                </div>
              </div>
            </div>
          </div>
          <div className="search_wrapper">
            <Search
              value={state.search}
              onChange={(search) => setState({ search })}
            />
            <Button
              value="Add Store"
              onClick={() => {
                navigate(`/organization/${organizationId}/add_store`);
              }}
            />
          </div>
        </div>
      </div>
      <div className="storetable">
        <Table
          data={state.data}
          loading={state.loading}
          theads={thead}
          link="store"
          actions={[
            {
              icon: 'view',
              onClick: handleView,
            },
            {
              icon: 'edit',
              onClick: handleEdit,
            },
            {
              icon: 'delete',
              onClick: handleDelete,
            },
          ]}
          imageKey="logo"
        />
      </div>
      <CustomModal
        center
        open={state.deleteModal}
        classNames={{ modalContainer: 'delete_modal_container' }}
        onClose={() => setState({ deleteModal: false })}>
        <DeletePopup
          onPress={DeleteStore}
          onCancel={() => setState({ deleteModal: false })}
        />
      </CustomModal>
    </div>
  );
}
