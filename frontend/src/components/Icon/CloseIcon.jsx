import React from 'react';

const CloseIcon = ({ size, color }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 512 512"
      fill={color ? color : 'black'}
      width={size ? size : '1rem'}
    >
      <g id="close">
        <path d="M289.94,256,505,41A24,24,0,0,0,471,7l-215,215L41,7A24,24,0,0,0,7,41l215,215L7,471A24,24,0,1,0,41,505l215-215L471,505A24,24,0,0,0,505,471Z" />
      </g>
    </svg>
  );
};

export default CloseIcon;
