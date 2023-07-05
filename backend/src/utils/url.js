export function getFileNameFromURL(url) {
  const newUrl = new URL(url);
  console.log(
    "__Debugger__url\n__getFileNameFromURL__newUrl.pathname: ",
    newUrl.pathname,
    "\n"
  );
  const filename = newUrl.pathname.split("/").pop();
  return filename;
}
