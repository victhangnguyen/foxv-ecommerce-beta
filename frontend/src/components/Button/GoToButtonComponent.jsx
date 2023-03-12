import React from 'react';
import clsx from 'clsx';
import { Button } from 'react-bootstrap';
import { scrollToTop } from '../../hooks/scroll';
import { FaArrowUp } from 'react-icons/fa';
import PropTypes from 'prop-types';

const GoTopButton = ({ visible = true }) => (
  <Button
    className={clsx('back-to-top-btn', { 'back-to-top-btn--visible': visible })}
    onClick={scrollToTop}
    variant="dark"
    
  >
    <FaArrowUp />
  </Button>
);

GoTopButton.propTypes = {
  visible: PropTypes.bool,
};

export default GoTopButton;