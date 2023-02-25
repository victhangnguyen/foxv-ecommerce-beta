import React from 'react';
import { Carousel } from 'react-bootstrap';

const CarouselComponent = ({ carouseItems }) => {
  const renderCarouselItems = carouseItems.map((item) => (
    <Carousel.Item key={item.key}>
      <img className="d-block w-100" src={item.src} alt={item.label} />
      <Carousel.Caption>
        <h5>{item.label}</h5>
        <p>{item.content}</p>
      </Carousel.Caption>
    </Carousel.Item>
  ));

  return <Carousel variant="dark">{renderCarouselItems}</Carousel>;
};

export default CarouselComponent;
