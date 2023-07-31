import config from '../../../config';
import React from 'react';
//! imp RTK-Actions
import { Row } from 'react-bootstrap';

//! imp helpers
import { useScrollPosition } from '../../../hooks/scroll';

//! imp Components
import GoToButtonComponent from '../../../components/Button/GoToButtonComponent';
import CarouselComponent from '../components/Carousel/CarouselComponent';
// import Jumbotron from '../../../components/jumbotron/Jumbotron';
import BestSellersComponent from '../components/BestSellersComponent';
import NewArrivalsComponent from '../components/NewArrivalsComponent';

const HomeScreen = () => {
  const carouseItems = [
    {
      key: 'slide-01',
      label: '',
      content: '',
      src: `${config.react_app_db.databaseURL}/images/slides/slide-01.jpg`,
    },
    {
      key: 'slide-02',
      label: '',
      content: '',
      src: `${config.react_app_db.databaseURL}/images/slides/slide-02.jpg`,
    },
    {
      key: 'slide-03',
      label: '',
      content: '',
      src: `${config.react_app_db.databaseURL}/images/slides/slide-02.jpg`,
    },
  ];

  //! textArr of Jumbotron
  const textArr = ['Welcome to Foxv Ecommer', 'Trung tâm thương mại điện tử'];

  const scrollPosition = useScrollPosition();

  // ) : error ? (
  //   <MessageCommponent variant="danger">{error}</MessageCommponent>
  return (
    <>
      <CarouselComponent carouseItems={carouseItems} />
      <Row>{/* <Jumbotron textArr={textArr} /> */}</Row>
      <NewArrivalsComponent title={'Sản phẩm mới'} />
      <BestSellersComponent title={'Sản phẩm bán chạy'} />

      <GoToButtonComponent visible={scrollPosition > 300} />
    </>
  );
};

export default HomeScreen;
