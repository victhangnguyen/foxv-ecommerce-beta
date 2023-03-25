import React from 'react';

const StarSolidIcon = ({ size, color }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 574 512"
      width={size ? size : '1rem'}
      fill={color ? color : 'black'}
    >
      <g id="star-solid">
        <path d="M315.72,18a32,32,0,0,0-57.59,0L193.84,150.28,50.25,171.48a32,32,0,0,0-17.79,54.39L136.64,329,112.05,474.65a32.08,32.08,0,0,0,46.69,33.59L287,439.75l128.28,68.49A32.08,32.08,0,0,0,462,474.65L437.31,329,541.5,225.87a32,32,0,0,0-17.8-54.39L380,150.28Z" />
      </g>
    </svg>
  );
};

export default StarSolidIcon;
