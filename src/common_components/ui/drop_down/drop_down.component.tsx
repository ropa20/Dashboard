import React, { useEffect } from 'react';
import { useSetState } from 'utils/functions.utils';
import uuid from 'react-uuid';
import './drop_down.component.scss';
import OverlayClose from '../overlay_close/overlay_close.component';

interface dropDoenItems {
  label: string;
  value: string;
}

interface dropDownProps {
  placeholder: string;
  items: dropDoenItems[];
  onClick: any;
  label: string;
}

const DropDown = (props: dropDownProps) => {
  const { placeholder, items, onClick, label } = props;
  const [state, setState] = useSetState({
    activeDropdown: '',
    isDropDownOpen: false,
  });
  const handleClick = (item) => {
    onClick(item.value);
    setState({ activeDropdown: item.label, isDropDownOpen: false });
  };
  const handleDropDownClick = () => {
    setState({ isDropDownOpen: !state.isDropDownOpen });
  };
  return (
    <OverlayClose onClick={() => setState({ isDropDownOpen: false })}>
      <div className={`dropdown ${state.isDropDownOpen && 'active'}`}>
        <div className="label_container caption2">{label}</div>
        <div className="dropdown_head menu" onClick={handleDropDownClick}>
          {state.activeDropdown || placeholder}
        </div>
        <div className="dropdown_body">
          {items.map((item) => (
            <div className="dropdown_item" key={uuid()}>
              <div
                className="dropdown_title title menu"
                onClick={() => handleClick(item)}
                role="none">
                {item.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </OverlayClose>
  );
};

export default DropDown;
