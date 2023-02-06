import { useRouteError } from 'react-router-dom';

export default function ErrorPage() {
  const error = useRouteError();
  console.error('ErrorScreen: ', error);

  return (
    <div id="error-page">
      <h1>Oops!</h1>
      {/* <p>Sorry, an unexpected error has occurred.</p> */}
      <p>Xin lỗi cho sự bất tiện này, có một số lỗi đang chờ xử lý.</p>
      <p>{error.statusText || error.message}</p>
      <p>{error.data}</p>
    </div>
  );
}
