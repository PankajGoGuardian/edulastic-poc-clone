import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { title as titleColor } from '@edulastic/colors'

const Heading = ({
  title,
  description,
  titleFontSize,
  descriptionFontSize,
}) => {
  return (
    <Container
      $titleFontSize={titleFontSize}
      $descriptionFontSize={descriptionFontSize}
    >
      <h3>{title}</h3>
      <p>{description}</p>
    </Container>
  )
}

Heading.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string,
}

Heading.defaultProps = {
  description: '',
}

export default Heading

const Container = styled.div`
  h3 {
    font-size: ${({ $titleFontSize }) => $titleFontSize || '14px;'};
    font-weight: 700;
    color: ${titleColor};
  }
  p {
    font-size: ${({ $descriptionFontSize }) => $descriptionFontSize || '13px;'};
  }
`
