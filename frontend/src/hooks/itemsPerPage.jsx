import React from 'react';

export function useItemsPerPage(
  itemsXs = 10,
  itemsSm = 12,
  itemsMd = 12,
  itemsLg = 18,
  itemsXl = 24
) {
  const widthXs = 567;
  const widthSm = 768;
  const widthMd = 992;
  const widthLg = 1200;
  const widthXl = 1400;

  // Initialize state with undefined width/height so server and client renders match
  const [itemsPerPage, setItemsPerPage] = React.useState(0);

  React.useEffect(() => {
    // Handler to call on window resize
    function handleSetItemsPerPage() {
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
    }
    // Add event listener
    window.addEventListener('resize', handleSetItemsPerPage);
    //! initial setState
    handleSetItemsPerPage();

    return () => window.removeEventListener('resize', handleSetItemsPerPage);
  }, []);
  return itemsPerPage;
}
