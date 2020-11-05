import React from 'react'
import PropTypes from 'prop-types'
import { cardTitleColor } from '@edulastic/colors'
import { Container, Mid, After } from './styled'

export const Breadcrumb = ({
  children,
  color,
  handleClick,
  bgColor = '',
  title = false,
}) => (
  <Container onClick={handleClick} style={{ cursor: 'pointer' }} title={title}>
    <Mid bgColor={bgColor} color={color}>
      {children}
    </Mid>
    <After bgColor={bgColor} color={color} />
  </Container>
)

Breadcrumb.propTypes = {
  children: PropTypes.any.isRequired,
  color: PropTypes.string,
}

Breadcrumb.defaultProps = {
  color: cardTitleColor,
}
