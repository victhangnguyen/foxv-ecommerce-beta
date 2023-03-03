export const queryParam = (url, params) => {
  var str = Object.keys(params)
    .map(function (key) {
      return key + '=' + params[key];
    })
    .join('&');

  const urlSearchParams = `${url}?${str}`;
  return urlSearchParams;
};
