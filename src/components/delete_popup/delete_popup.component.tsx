import Button from "common_components/ui/button/button.ui";
import React from "react";
import { useSetState } from "utils/functions.utils";
import "./delete_popup.scss";
import * as validation from "utils/validation.utils";
import InputField from "common_components/ui/field/field.ui";

interface IDeletePopup {
  onPress?: any;
  onCancel?: any;
  desc?: string;
  primaryText?: string;
  cancel_booking?: Boolean;
}

export default function DeletePopup(props: IDeletePopup) {
  const { onPress, onCancel, desc, primaryText, cancel_booking } = props;

  const [state, setState] = useSetState({
    cancel_reason: "",
    error_status: false,
  });

  const onClick = () => {
    if (cancel_booking) {
      if (state.cancel_reason === "") {
        setState({ error_status: true });
      } else {
        setState({ error_status: false });
        onPress(state.cancel_reason);
      }
    } else {
      onPress();
    }
  };

  return (
    <div className="popup_container">
      <div className="popup_wrapper">
        <div className="text_wrapper">
          {props.cancel_booking ? (
            <>
              <div>
                <input
                  type="text"
                  className="cancel_booking_text"
                  placeholder="Enter Reason"
                  value={state.cancel_reason}
                  onChange={e => {
                    setState({ cancel_reason: e.target.value });
                  }}
                />
              </div>
            </>
          ) : (
            <div className="text_wrapper">{desc || "Are you sure ?"}</div>
          )}
        </div>
        {state.error_status && <div className="error_message">* Please enter valid reason</div>}
        <div className="button_wrapper">
          <div className="button_left">
            <Button value="Cancel" onClick={onCancel} color="redLight" textColor="red" />
          </div>
          <div className="button_right">
            <Button value={primaryText || "Confirm"} onClick={onClick} />
          </div>
        </div>
      </div>
    </div>
  );
}
