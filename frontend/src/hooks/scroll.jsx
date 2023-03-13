import React from 'react';

export const scrollToTop = () =>
  window.scrollTo({
    top: 0,
    behavior: 'smooth',
  });

const throttle = (callback, sleepTime) => {
  let time = Date.now();

  return (...args) => {
    if (time + sleepTime - Date.now() < 0) {
      callback(...args);
      time = Date.now();
    }
  };
};

export const useScroll = () => {
  const [scrollPosition, setScrollPosition] = React.useState(window.scrollY);

  const updateScrollPosition = throttle(() => {
    setScrollPosition(window.scrollY);
  }, 50);

  React.useEffect(() => {
    window.addEventListener('scroll', updateScrollPosition);
    return () => window.removeEventListener('scroll', updateScrollPosition);
  }, []);

  return scrollPosition;
};
