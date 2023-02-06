import React from 'react';

const TrashIcon = ({ size, color }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 574 512"
      fill={color ? color : 'black'}
      width={size ? size : '1rem'}
    >
      <g id="trash">
        <path d="M510,48H367a24,24,0,0,0,0-48H207a24,24,0,0,0,0,48H64a24,24,0,0,0,0,48H510a24,24,0,0,0,0-48Z" />
        <path d="M122.31,475.49A39.79,39.79,0,0,0,162.16,512H411.84a39.79,39.79,0,0,0,39.85-36.51L481.2,139H92.8Z" />
      </g>
    </svg>
  );
};

export default TrashIcon;
