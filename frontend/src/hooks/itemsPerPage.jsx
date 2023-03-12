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
  // Initialize state with undefined width/height so server and client renders match
  const [itemsPerPage, setItemsPerPage] = React.useState(0);

  const handleItemsPerPage = () => {
    const widthXs = 567;
    const widthSm = 768;
    const widthMd = 992;
    const widthLg = 1200;
    const widthXl = 1400;

    const width = window.innerWidth;
    if (width <= widthXs) {
      return setItemsPerPage(itemsXs);
    } else if (width < widthSm) {
      return setItemsPerPage(itemsSm);
    } else if (width < widthMd) {
      return setItemsPerPage(itemsMd);
    } else if (width < widthLg) {
      return setItemsPerPage(itemsLg);
    } else if (width >= widthLg) {
      return setItemsPerPage(itemsXl);
    }
  };

  const updateItemsPerPage = throttle(handleItemsPerPage, 100);

  React.useEffect(() => {
    // Add event listener
    window.addEventListener('resize', updateItemsPerPage);
    //! initial setState
    handleItemsPerPage();

    return () => window.removeEventListener('resize', updateItemsPerPage);
  }, []);
  return itemsPerPage;
}
