export function queryParam(url, params) {
  var str = Object.keys(params)
    .map(function (key) {
      return key + '=' + params[key];
    })
    .join('&');

  const urlSearchParams = `${url}?${str}`;
  return urlSearchParams;
}

export function queryIds(ids) {
  const query = 'ids[]=';
  const idPairs = ids.map((id) => query + encodeURIComponent(id)).join('&');
  return idPairs;
}
