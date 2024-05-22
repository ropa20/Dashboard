import React, { useEffect, Fragment } from "react";
import { useSetState } from "utils/functions.utils";
import { useSelector } from "react-redux";
import { reducers } from "interfaces/common.interface";
import connectSocket from "utils/socket.utils";
import Sidebar from "common_components/ui/sidebar/sidebar.ui";

let socket: any;

export default function Main(props: any) {
  const [state, setState] = useSetState({ signout: false, loading: false });
  const user = useSelector((store: reducers) => store.user);

  useEffect(() => {
    socket = connectSocket();
  }, []);

  const showSuccess = (text: string) => {
    //show snack success
  };

  const throwError = (text: string) => {
    //show snack error
  };

  const setMainLoading = (loading: boolean) => {
    setState({ loading: loading });
  };

  const renderChildren = () => {
    return React.Children.map(props.children, (child: any) => {
      if (child) {
        return React.cloneElement(child, {
          user,
          showSuccess,
          throwError,
          socket,
          setMainLoading,
        });
      }
    });
  };

  if (state.signout) window.location.href = "/";
  if (state.loading) return <div>Loading</div>;
  // const token = localStorage.getItem('token');
  // if (!token) window.location.href = '/auth';
  return (
    <div>
      <div
        style={{
          display: "flex",
          minHeight: "100vh",
          flexDirection: "column",
          position: "relative",
          background: "#F6F6F6",
        }}
      >
        <div
          className="main_sidebar"
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            flexShrink: 0,
            width: "256px",
            height: "100vh",
            background: "#fff",
            borderRight: "2px solid #e4e4e4",
          }}
        >
          <Sidebar />
        </div>
        <div
          className="main_body"
          style={{
            flexGrow: 1,
            paddingLeft: "256px",
            transition: "all .25s",
            margin: "0px 50px",
          }}
        >
          {renderChildren()}
        </div>
      </div>
    </div>
  );
}
