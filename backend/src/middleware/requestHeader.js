export const setRequestHeaders = (req, res, next) => {
  // This middleware take care of the origin when the origin is undefined.
  // origin is undefined when request is local
  req.headers.origin = req.headers.origin || req.headers.host;
  if (!req.headers.origin.startsWith("http")) {
    req.headers.origin = req.protocol + "://" + req.headers.origin;
  }

  req.ipv4 = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
  next();
};
