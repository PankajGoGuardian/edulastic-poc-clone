import React from 'react';
import PropTypes from 'prop-types';
import { black } from '@edulastic/colors';

export default (WrappedComponent) => {
  const hocComponent = ({ hoverColor, color, ...props }) => {
    if (!hoverColor) {
      hoverColor = color;
    }
    return <WrappedComponent color={color} hoverColor={hoverColor} {...props} />;
  };

  hocComponent.propTypes = {
    height: PropTypes.number,
    width: PropTypes.number,
    color: PropTypes.string,
    hoverColor: PropTypes.any,
  };

  hocComponent.defaultProps = {
    height: 16,
    width: 16,
    color: black,
    hoverColor: null,
  };

  return hocComponent;
};
