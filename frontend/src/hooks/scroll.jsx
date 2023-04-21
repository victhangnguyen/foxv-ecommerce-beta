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

export const useScrollPosition = () => {
  const [scrollPosition, setScrollPosition] = React.useState(0); //! or init: window.scrollY

  React.useEffect(() => {
    const updatePosition = throttle(() => {
      setScrollPosition(window.pageYOffset);
    }, 50);

    window.addEventListener('scroll', updatePosition);
    //! init once
    updatePosition();
    
    return () => window.removeEventListener('scroll', updatePosition);
  }, []);

  return scrollPosition;
};
