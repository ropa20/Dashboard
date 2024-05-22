import Assets from 'imports/assets.import';
import React from 'react';
import './action_button.ui.scss';

interface actionButtonProps {
  icon: string;
  positon?: string;
  animation?: boolean;
  className?: string;
  iconClassName?: string;
  onClick?: any;
  shadow?: boolean;
  label?: string;
}

const ActionButton = (props: actionButtonProps) => {
  const {
    icon,
    positon,
    animation,
    className,
    iconClassName,
    onClick,
    shadow,
    label
  } = props;
  return (
    <button
      className={`icon_button icon_button_${positon} ${
        shadow ? 'button_shadow' : 'without_shadow'
      } ${className}`}
      type="button"
      onClick={onClick}>
        
      <img
        src={Assets[icon]}
        className={`${animation && 'icon_animation'} ${iconClassName}`}
      />
      { label && <div className="action_btn_label">{label}</div>}
    </button>
  );
};

ActionButton.defaultProps = {
  animation: false,
  className: '',
  iconClassName: '',
  onClick: () => {},
};

export default ActionButton;
