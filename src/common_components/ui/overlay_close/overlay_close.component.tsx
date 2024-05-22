import React, { useRef, useEffect } from 'react';

interface overlayCloseProps {
  children: any;
  onClick: any;
}
const OverlayClose = (props: overlayCloseProps) => {
  const { children, onClick } = props;
  const wrapperRef: any = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        onClick();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [wrapperRef]);

  return <div ref={wrapperRef}>{children}</div>;
};

export default OverlayClose;
