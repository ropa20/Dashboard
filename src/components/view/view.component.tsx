import ActionButton from "common_components/ui/action_button/action_button.ui";
import Button from "common_components/ui/button/button.ui";
import Divider from "common_components/ui/divider/divider.ui";
import NavButton from "common_components/ui/nav_button/nav_button.ui";
import Assets from "imports/assets.import";
import React from "react";
import { checkIfValidImage, filenameFromURL, getNestedObjectValue, useSetState } from "utils/functions.utils";
import { IAddValues } from "utils/interface.utils";
import CustomModal from "common_components/ui/modal/modal.component";
import "./view.component.scss";
import { check } from "prettier";
import moment from "moment";

interface viewProps {
  data: any;
  values: IAddValues[];
  actions?: { link?: string; label?: string; icon: string; onClick?: any }[];
  hasFiles?: boolean;
  head?: any;
  buttons?: any;
}

export default function View(props: viewProps) {
  const [state, setState] = useSetState({ view: false, viewURL: "" });
  const { data, values, actions = [], hasFiles, head, buttons } = props;
  const handleView = () => {
    setState({ view: !state.view, viewURL: "" });
  };

  const checkFileType = (data: any, key: any) => {
    const type = data[key].split(".").pop();
    if (type === "pdf") {
      return "https://bb-adsquare.s3.ap-south-1.amazonaws.com/1677849567430fN9iiE45fK.png";
    } else return data[key];
  };
 

  return (
    <div className="view_container">
      <div className="view_wrapper">
        <div className="view_head_container">
          <div className="view_head_wrapper">
            {head}
            <div className="view_head_right_container">
              <div className="view_head_nav_icon_wrapper">
                {actions.length > 0 &&
                  actions.map(({ link, icon, onClick, label }) =>
                    onClick ? (
                      <div className="view_head_nav_icon">
                        <ActionButton icon={icon} onClick={onClick} label={label} />
                      </div>
                    ) : (
                      <div className="view_head_nav_icon">
                        <NavButton link={link || ""} icon={icon} />
                      </div>
                    )
                  )}
              </div>
            </div>
          </div>
        </div>
        <Divider />
        <div className="view_field_body_container">
          <div className="view_field_body_wrapper">
            {values.map(({ label, key, type, isNested }) =>
              // !(getNestedObjectValue(data, key) || data[key]) ? null
              // :
              type === "string" ? (
                <div className="view_field_container">
                  <div className="view_field_label caption2">{label}</div>
                  <div className="view_field menu">{isNested ? getNestedObjectValue(data, key) : data[key]}</div>
                </div>
              ) : type === "store" && data?.store ? (
                <div className="view_field_container">
                  <div className="view_field_label caption2">{label}</div>
                  <div className="view_field menu">{isNested ? getNestedObjectValue(data, key) : data[key]}</div>
                </div>
              ) : type === "checkbox" ? (
                <div className="view_field_container">
                  <div className="view_field_label caption2">{label}</div>
                  <div className="view_field menu">{isNested ? getNestedObjectValue(data, key) : data[key]?.toString()}</div>
                </div>
              ) : type === "date" && data[key] ? (
                <div className="view_field_container">
                  <div className="view_field_label caption2">{label}</div>
                  <div className="view_field menu">{moment(data[key]).format("DD-MM-YYYY hh:mma")}</div>
                </div>
              ) : (
                type === "title" && <div className="title_container">{label}</div>
              )
            )}
          </div>
        </div>
        {hasFiles && (
          <>
            <Divider />
            <div className="view_field_body_container">
              <div className="view_field_body_wrapper">
                {values.map(({ label, key, type ,isNested}) =>
                  type === "file" && (data[key] || getNestedObjectValue(data, key) ) ?  (
                    <div className="view_field_container">
                      <div className="view_field_label caption2">{label}</div>
                      <div onClick={() => setState({ view: true, viewURL: isNested ? getNestedObjectValue(data, key):data[key] })} className="view_field menu">
                        <img src={isNested ? getNestedObjectValue(data, key): checkFileType(data,key)} className="view_file" />
                      </div>
                    </div>
                  ) : type === "files" && data[key] ? (
                    <div className="view_field_container">
                      <div className="view_field_label caption2">{label}</div>
                      {data[key].map(file => (
                        <div className="view_field menu">
                          <img onClick={() => setState({ view: true, viewURL: data[key] })} src={file} className="view_file" />
                        </div>
                      ))}
                    </div>
                  ) : null
                )}
              </div>
            </div>
          </>
        )}
        {buttons && buttons}
      </div>
      <CustomModal open={state.view} onClose={handleView}>
        {state.viewURL ? (
          <div className="view_file_container">
            {checkIfValidImage(state.viewURL) ? (
              <img src={state.viewURL} alt="upload image" className="view_file" />
            ) : (
              <a href={state.viewURL} download={filenameFromURL(state.viewURL)}>
                Download
              </a>
            )}
          </div>
        ) : (
          <div className="view_file_error_container">
            <div className="view_file_error">No file chosen</div>
          </div>
        )}
      </CustomModal>
    </div>
  );
}
