import React from 'react'
import PropTypes from 'prop-types'
import styled, { css } from 'styled-components'

const WhiteFlashStyled = styled.div`
  position: absolute;
  height: 100%;
  width: 100%;
  opacity: 1;
  transition: opacity 0.9s ease-out;
  ${(props) =>
    props.isFlashVisible &&
    css`
      opacity: 0;
      background: white;
    `}
`
export const WhiteFlash = ({ isFlashVisible }) => {
  return <WhiteFlashStyled isFlashVisible={isFlashVisible} />
}

WhiteFlash.propTypes = {
  isFlashVisible: PropTypes.bool,
}

WhiteFlash.defaultProps = {
  isFlashVisible: false,
}

export default WhiteFlash
