import React from 'react';

const ToolbarComponent = ({ children, ...rest }) => {
  return (
    <div className="btn-toolbar" {...rest}>
      {children}
    </div>
  );
};

export default ToolbarComponent;
