import React, { useEffect } from 'react';
import { Assets, Models, Constants } from 'utils/imports.utils';
import { useSetState } from 'utils/functions.utils';
import './user_management.scss';

interface IManagementComponentProps {
  onPress?: any;
  edit?: boolean;
  details: any;
}

export default function UserManagement(props: IManagementComponentProps) {
  const [state, setState] = useSetState({});
  console.log('userManagement');
  useEffect(() => {
    if (props?.details) {
      setState({
        name: props.details.name,
        email: props.details.decrypted_email,
      });
    }
  }, [props?.details]);

  return (
    <div className="container">
      <div className="details_wrapper">
        <div className="detail_label">Name</div>
        <input
          className="input"
          value={state.name}
          onChange={(event: any) => setState({ name: event.target.value })}
        />
      </div>
      <div className="details_wrapper">
        <div className="detail_label">Email</div>
        <input
          className="input"
          value={state.email}
          onChange={(event: any) => setState({ email: event.target.value })}
        />
      </div>
      <div
        className="button_wrapper"
        onClick={() => props.onPress({ email: state.email, name: state.name })}>
        <div className="button">{props.edit ? 'Edit user' : 'Add user'}</div>
      </div>
    </div>
  );
}
