import React, { useEffect } from 'react';
import { Assets, Models, Constants } from 'utils/imports.utils';
import { useSetState } from 'utils/functions.utils';
import './user_view.scss';

interface IManagementComponentProps {
  onPress?: any;
  details: any;
}

export default function UserView(props: IManagementComponentProps) {
  const [state, setState] = useSetState({});

  return (
    <div className="modal_wrapper">
      <div className="details_wrapper">
        <div className="detail_label">Name</div>
        {props?.details?.name}
      </div>
      <div className="details_wrapper">
        <div className="detail_label">Email</div>
        {props?.details?.decrypted_email}
      </div>
    </div>
  );
}
