import React from 'react';
import './input.ui.scss';

interface InputProps {
  className?: string;
  onChange: any;
  name: string;
  placeholder?: string;
  label?: string;
}
const Input = (props: InputProps) => {
  const { className, onChange, name, placeholder, label } = props;
  return (
    <div className="input_container">
      {label && <div className="label_container caption2">{label}</div>}
      <input
        autoComplete="off"
        className={`${className} input menu`}
        name={name}
        onChange={(e: any) => onChange(name, e.target.value)}
        placeholder={placeholder}
      />
    </div>
  );
};

Input.defaultProps = {
  placeholder: '',
  className: '',
  label: '',
};

export default Input;
