import React from "react";
import { useSetState } from "utils/functions.utils";
import "./textarea.component.scss";

interface ITextarea {
  onChange?: Function;
  value?: string;
  style?: any;
  placeholder: string;
  name?:any
}
const TextareaComponent = (props: ITextarea) => {
  const [state, setState] = useSetState({
    focus: false,
  });
  return (
    <div>
      <textarea
      style={props.style}
      name={props.name}
      placeholder={props.placeholder}
      //@ts-ignore
        onChange={(e: any) => props.onChange(e.target.value)}
        value={props.value}
        onBlur={() => setState({ focus: false })}
        onFocus={() => setState({ focus: true })}
        className={`rejection_textarea ${state.focus ? "rejection_textarea_active" : "rejection_textarea_disable"}`}
      />
    </div>
  );
};

export default TextareaComponent;
