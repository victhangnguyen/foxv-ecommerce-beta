import React from 'react';
import { Alert, Button } from 'react-bootstrap';

const AlertDismissibleComponent = ({
  show,
  handleHideAlert,
  children,
  title,
  labelButton,
  message,
  variant = 'success',
  alwaysShown = true,
}) => {
  const [seconds, setSeconds] = React.useState(5); //! used to countdown

  React.useEffect(() => {
    if (!alwaysShown) {
      const timer = setTimeout(() => {
        handleHideAlert();
      }, 5000);
      return () => clearTimeout(timer);
    }
  });

  // //! count seconds
  // React.useEffect(() => {
  //   const timer = setTimeout(() => setSeconds(seconds - 1), 1000);
  //   return () => clearTimeout(timer);
  // }); //! re-render after 1 second

  return (
    <>
      <Alert show={show} variant={variant}>
        <Alert.Heading>{title}</Alert.Heading>
        <div>{children ? children : message}</div>
        <hr />
        <div className="d-flex justify-content-end">
          <Button onClick={handleHideAlert} variant={`outline-${variant}`}>
            {labelButton
              ? labelButton
              : alwaysShown
              ? 'Ẩn ngay'
              : `Ẩn ngay sau (${seconds}s)`}
          </Button>
        </div>
      </Alert>
    </>
  );
};

export default AlertDismissibleComponent;
