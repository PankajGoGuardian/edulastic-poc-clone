import React from 'react'
import PropTypes from 'prop-types'
import { response } from '@edulastic/constants'

import { IconWrapper } from './CheckboxTemplateBoxLayout/styled/IconWrapper'
import { CheckBox } from './CheckboxTemplateBoxLayout/styled/CheckBox'

const PopoverContent = ({
  indexStr,
  fontSize,
  userAnswer,
  checkAnswer,
  isExpressGrader,
  fillColor,
  indexBgColor,
  isPrintPreview,
  mark,
  singleResponseBox,
}) => (
  <CheckBox
    style={{ fontSize, padding: 20, overflow: 'hidden', margin: '0px 4px' }}
    fillColor={fillColor}
    indexBgColor={indexBgColor}
    isPrintPreview={isPrintPreview}
  >
    {!singleResponseBox && (
      <span
        className="index"
        style={{ display: checkAnswer && !isExpressGrader ? 'none' : 'flex' }}
      >
        {indexStr}
      </span>
    )}
    <div className="text" style={{ maxWidth: response.maxWidth }}>
      <div style={{ whiteSpace: 'normal' }}>{userAnswer}</div>
    </div>

    <div className="icons">
      {mark && <IconWrapper rightPosition={5}>{mark}</IconWrapper>}
    </div>
  </CheckBox>
)

PopoverContent.propTypes = {
  fontSize: PropTypes.number,
  userAnswer: PropTypes.string.isRequired,
  checkAnswer: PropTypes.bool.isRequired,
  isExpressGrader: PropTypes.bool.isRequired,
  singleResponseBox: PropTypes.bool,
}

PopoverContent.defaultProps = {
  fontSize: 14,
  singleResponseBox: false,
}

export default PopoverContent
