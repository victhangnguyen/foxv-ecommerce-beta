import React from 'react';

const throttle = (callback, sleepTime) => {
  let time = Date.now();

  return (...args) => {
    if (time + sleepTime - Date.now() < 0) {
      callback(...args);
      time = Date.now();
    }
  };
};

export function useItemsPerPage(
  itemsXs = 10,
  itemsSm = 12,
  itemsMd = 12,
  itemsLg = 18,
  itemsXl = 24
) {
  const getItemsPerPage = (width) => {
    const widthXs = 567;
    const widthSm = 768;
    const widthMd = 992;
    const widthLg = 1200;
    const widthXl = 1400;

    if (width <= widthXs) {
      return itemsXs;
    } else if (width < widthSm) {
      return itemsSm;
    } else if (width < widthMd) {
      return itemsMd;
    } else if (width < widthLg) {
      return itemsLg;
    } else if (width >= widthLg) {
      return itemsXl;
    }
  };

  // Initialize state with undefined width/height so server and client renders match
  // const [itemsPerPage, setItemsPerPage] = React.useState(0);
  const [itemsPerPage, setItemsPerPage] = React.useState((prevState) => {
    const innerWidth = window.innerWidth;
    return getItemsPerPage(innerWidth);
  });

  React.useEffect(() => {
    const updateItemsPerPage = throttle(() => {
      setItemsPerPage((prevState) => {
        const innerWidth = window.innerWidth;
        return getItemsPerPage(innerWidth);
      });
    }, 100);

    // Add event listener
    window.addEventListener('resize', updateItemsPerPage);
    return () => window.removeEventListener('resize', updateItemsPerPage);
  }, []);

  return itemsPerPage;
}
