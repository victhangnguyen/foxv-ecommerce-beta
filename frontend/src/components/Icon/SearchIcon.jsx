import React from 'react';

const SearchIcon = ({ size, color }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 512 512"
      width={size ? size : '1rem'}
      fill={color ? color : 'black'}
    >
      <g id="expand-magni">
        <path
          d="M209,418C93.76,418,0,324.24,0,209S93.76,0,209,0,418,93.76,418,209,324.24,418,209,418Zm0-370C120.22,48,48,120.22,48,209s72.22,161,161,161,161-72.22,161-161S297.78,48,209,48Z"
        />
        <path
          d="M488,512a23.92,23.92,0,0,1-17-7L371,405A24,24,0,0,1,405,371L505,471a24,24,0,0,1-17,41Z"
        />
      </g>
    </svg>
  );
};

export default SearchIcon;
