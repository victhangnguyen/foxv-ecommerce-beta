export function serializeQueryParams(url, params) {
  var serializedQuery = Object.keys(params)
    .map(function (key) {
      return key + '=' + params[key];
    })
    .join('&');

  const urlQueryParams = `${url}?${serializedQuery}`;
  return urlQueryParams;
}

export function serializeQueryArray(url, queryArr, queryArrName = 'ids') {
  const serializedQuery = `${queryArrName}[]=`;
  const queryPairs = queryArr
    .map((query) => serializedQuery + encodeURIComponent(query))
    .join('&');

  const urlQueryParams = `${url}?${queryPairs}`;
  return urlQueryParams;
}
