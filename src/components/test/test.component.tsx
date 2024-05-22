import React, { useEffect } from 'react';
import { Assets, Models, Constants } from 'utils/imports.utils';
import * as Types from 'interfaces/common.interface';
import { testDispatch } from 'utils/redux.utils';
import { useSelector } from 'react-redux';
import './test.component.scss';

interface IListComponentProps {
  name?: string;
  email?: string;
  time?: string;
}

export default function Test() {

  useEffect(() => {
  }, []);


  const handleTest = () => {
    testDispatch({ username: 'test' });
  };

  return (
    <div className="container">
      <div className="row">
        <div className="index">1</div>
        <div className="name">sai ramm</div>
        <div className="email">sairam@brownbutton.io</div>
        <div className="time">22-03-2022 02:40 am</div>
        <div className="action_btn">View</div>
        <div className="action_btn">Delete</div>
      </div>
    </div>
  );
}
