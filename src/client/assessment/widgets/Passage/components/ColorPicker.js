import React from 'react'
import PropTypes from 'prop-types'
import { FlexContainer } from '@edulastic/common'
import { highlightColors } from '@edulastic/colors'
import { ColorButton, BackSlashIcon } from './styled-components'

const ColorPicker = ({ selectColor, bg }) => {
  const { blue: highlightBlue, green, orange, yellow, pink } = highlightColors
  const chooseColor = (value) => () => {
    selectColor(value)
  }

  return (
    <FlexContainer>
      <ColorButton onClick={chooseColor('remove')}>
        <BackSlashIcon type="minus" />
      </ColorButton>
      <ColorButton
        onClick={chooseColor(highlightBlue)}
        color={highlightBlue}
        active={bg === highlightBlue}
      />
      <ColorButton
        onClick={chooseColor(green)}
        color={green}
        active={bg === green}
      />
      <ColorButton
        onClick={chooseColor(orange)}
        color={orange}
        active={bg === orange}
      />
      <ColorButton
        onClick={chooseColor(yellow)}
        color={yellow}
        active={bg === yellow}
      />
      <ColorButton
        onClick={chooseColor(pink)}
        color={pink}
        active={bg === pink}
      />
    </FlexContainer>
  )
}

export default ColorPicker

ColorPicker.propTypes = {
  selectColor: PropTypes.func.isRequired,
  bg: PropTypes.string,
}

ColorPicker.defaultProps = {
  bg: null,
}
