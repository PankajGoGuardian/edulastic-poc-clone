import React from 'react'
import { greyThemeDark2 } from '@edulastic/colors'
import styled from 'styled-components'
import propTypes from 'prop-types'

const UnscoredHelperText = ({ text, fontSize, fontWeight, margin }) => (
  <StyledHelperText fontSize={fontSize} fontWeight={fontWeight} margin={margin}>
    {text}
  </StyledHelperText>
)

UnscoredHelperText.propTypes = {
  fontSize: propTypes.string,
  text: propTypes.string,
  fontWeight: propTypes.string,
  margin: propTypes.string,
}

UnscoredHelperText.defaultProps = {
  fontSize: '11px',
  text: 'Z or Zero point (This is practice question)',
  fontWeight: '600',
  margin: '10px 0px 0px 0px',
}

export default UnscoredHelperText

const StyledHelperText = styled.p`
  color: ${greyThemeDark2};
  font-size: ${({ fontSize }) => fontSize};
  font-weight: ${({ fontWeight }) => fontWeight};
  margin: ${({ margin }) => margin};
`
