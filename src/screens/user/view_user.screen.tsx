import React, { useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import "./view_user.screen.scss";
import History from "components/history/history.component";
import View from "components/view/view.component";
import Button from "common_components/ui/button/button.ui";
import Assets from "imports/assets.import";
import { Models } from "utils/imports.utils";
import { useSetState, toastifyError } from "utils/functions.utils";
import { IAddValues } from "utils/interface.utils";
import CustomModal from "common_components/ui/modal/modal.component";
import DeletePopup from "components/delete_popup/delete_popup.component";

export default function ViewUser() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [state, setState] = useSetState({
    data: {},
  });
  useEffect(() => {
    GetUser();
  }, []);

  const GetUser = async () => {
    try {
      // const response: any = await Models.user.getUser({ id });
      setState({
        data: {
          username: "jdoe",
          email: "jdoe@example.com",
          city: {
            city_name: "New York",
          },
          organization: {
            name: "Tech Corp",
          },
          store: {
            name: "Tech Store",
          },
          role: "Manager",
          phone: "123-456-7890",
        },
      });
    } catch (err) {
      console.log(err);
      toastifyError(err);
    }
  };

  const inputFields: IAddValues[] = [
    { label: "Email", key: "email", type: "string" },
    { label: "Role", key: "role", type: "string" },
    { label: "Phone", key: "phone", type: "string" },
    { label: "Username", key: "username", type: "string" },
  ];
  const handleDelete = data => {
    setState({ id: data._id, deleteModal: true });
  };
  const DeleteUser = async () => {
    try {
      await Models.user.deleteUser({
        user_id: id,
      });
      setState({ id: "", deleteModal: false });
      navigate("/user");
    } catch (err) {
      console.log(err);
      toastifyError(err);
    }
  };
  return (
    <div className="view_user_container">
      <div className="view_user_wrapper">
        <History name={state?.data?.username} />
        <div className="view_user_body_container">
          <View
            actions={[
              { link: `/edit_user/${id}`, icon: "edit" },
              { link: "/", icon: "delete", onClick: handleDelete },
            ]}
            data={state.data}
            values={inputFields}
            head={<ViewHeader />}
            // buttons={<ViewButton />}
            hasFiles
          />
        </div>
      </div>
      <CustomModal
        center
        open={state.deleteModal}
        classNames={{ modalContainer: "delete_modal_container" }}
        onClose={() => setState({ deleteModal: false })}
      >
        <DeletePopup onPress={DeleteUser} onCancel={() => setState({ deleteModal: false })} />
      </CustomModal>
    </div>
  );

  function ViewHeader() {
    return (
      <div className="view_head_left_container">
        <div className="view_head_image_conatiner">
          <img className="view_head_image" src={state?.data?.profile_picture || Assets.testPic} alt="head_image" />
        </div>
        <div className="view_head_title_container">
          <div className="view_head_title_wrapper">
            <div className="view_head_title">{state?.data?.username}</div>
            <div className="view_head_sub_title h5">{`${state?.data?.role}`}</div>
          </div>
        </div>
      </div>
    );
  }
}
