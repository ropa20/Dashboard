import React from 'react';

interface dividerProps {
  style?: any;
}
export default function Divider(props: dividerProps) {
  const { style } = props;
  return (
    <div className="divider_container">
      <hr color="#e4e4e4" style={{ height: 0.2, opacity: 0.75, margin: '0 2em', ...style }} />
    </div>
  );
}
