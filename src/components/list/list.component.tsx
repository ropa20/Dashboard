import React, { useEffect } from "react";
import "./list.component.scss";
import { Link } from "react-router-dom";
import view_icon from "assets/icons/eye.svg";
import edit_icon from "assets/icons/edit.svg";
import delete_icon from "assets/icons/delete.svg";
import loader from "assets/videos/loader.gif";

interface IListComponentProps {
  selected?: any;
  data?: any;
  edit?: any;
  view?: any;
  delete?: any;
  color?: string;
  delete_icon_color?: string;
  loading?: boolean;
  theads: { head: string; value: string }[];
  link: string;
}

export default function ListComponent(props: IListComponentProps) {
  useEffect(() => {}, []);

  return (
    <div className="list_container">
      <div className="row">
        <div className="index_wrapper">
          <div className="index"></div>
        </div>
        <div className="list_wrappers">
          {props.theads.map(head => (
            <div className="list_containers">
              <div className="head_wrappers">
                <div className="head_texts">{head.head}</div>
              </div>
              <div className="key_wrappers">
                <div className="key_texts">{head.value}</div>
              </div>
            </div>
          ))}
        </div>
        <div className="action_wrapper"></div>
      </div>
    </div>
  );
}
