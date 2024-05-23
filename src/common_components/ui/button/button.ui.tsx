import Colors from "imports/color.import";
import React from "react";
import "./button.ui.scss";

interface ButtonProps {
  value: string;
  onClick?: any;
  className?: string;
  loading?: boolean;
  color?: string;
  textColor?: string;
  borderColor?: string;
  buttonType?: string;
  buttonDisabled?: boolean;
}

const Button = (props: ButtonProps) => {
  const {
    value,
    onClick,
    className,
    loading,
    color,
    textColor,
    borderColor,
    buttonType,
  } = props;
  return (
    <div className="button_container">
      <button
        className={`${className} button`}
        style={{
          backgroundColor: color ? Colors[color] : Colors.primary,
          color: textColor ? Colors[textColor] : Colors.white,
          borderColor: borderColor ? Colors[borderColor] : Colors.white,
        }}
        // @ts-ignore: Unreachable code error
        type={buttonType || "submit"}
        disabled={props.buttonDisabled}
        onClick={onClick}
      >
        {value}
      </button>
    </div>
  );
};

Button.defaultProps = {
  className: "",
  onClick: () => {},
  loading: false,
};

export default Button;
