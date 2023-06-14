import React from 'react'
import PropTypes from 'prop-types'
import StyledSpinner from './style'

export default function Spinner(props) {
  const { className, style, isVisible, size, color, zIndex } = props

  if (isVisible) {
    return (
      <StyledSpinner
        className={className}
        size={size}
        style={style}
        color={color}
        zIndex={zIndex}
      >
        <div />
        <div />
        <div />
        <div />
        <div />
        <div />
        <div />
        <div />
      </StyledSpinner>
    )
  }
  return null
}

Spinner.propTypes = {
  size: PropTypes.string,
  isVisible: PropTypes.bool,
  className: PropTypes.string,
  style: PropTypes.object,
}

Spinner.defaultProps = {
  size: '50px',
  isVisible: true,
  className: undefined,
  style: undefined,
}
