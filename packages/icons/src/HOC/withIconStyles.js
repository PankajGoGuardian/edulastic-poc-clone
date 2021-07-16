import React from 'react'
import PropTypes from 'prop-types'
import { black } from '@edulastic/colors'

export default (WrappedComponent, propTypes = {}, defaultProps = {}) => {
  const hocComponent = ({ hoverColor, color, ...props }) => {
    if (!hoverColor) {
      hoverColor = color
    }
    return <WrappedComponent color={color} hoverColor={hoverColor} {...props} />
  }

  hocComponent.propTypes = {
    color: PropTypes.string,
    hoverColor: PropTypes.any,
    ...propTypes,
  }

  hocComponent.defaultProps = {
    color: black,
    hoverColor: null,
    ...defaultProps,
  }

  return hocComponent
}
