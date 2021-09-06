import React from 'react'
import PropTypes from 'prop-types'
import { MathSpan } from '@edulastic/common'

import { IconWrapper } from './CheckboxTemplateBoxLayout/styled/IconWrapper'
import { CheckBox } from './CheckboxTemplateBoxLayout/styled/CheckBox'

const PopoverContent = ({
  indexStr,
  fontSize,
  answered,
  checkAnswer,
  isExpressGrader,
  fillColor,
  indexBgColor,
  mark,
  singleResponseBox,
}) => (
  <CheckBox
    isPopover
    fillColor={fillColor}
    indexBgColor={indexBgColor}
    style={{ fontSize, margin: '0px 4px' }}
  >
    {!singleResponseBox && (
      <div
        className="index"
        style={{
          display: checkAnswer && !isExpressGrader ? 'none' : 'flex',
        }}
      >
        {indexStr}
      </div>
    )}
    <div className="text">
      <div style={{ whiteSpace: 'normal' }}>
        <MathSpan dangerouslySetInnerHTML={{ __html: answered }} />
      </div>
    </div>
    <div className="icons">
      {answered && (
        <IconWrapper
          rightPosition={10}
          style={{ top: '50%', transform: 'translateY(-50%)' }}
        >
          {mark}
        </IconWrapper>
      )}
    </div>
  </CheckBox>
)

PopoverContent.propTypes = {
  fontSize: PropTypes.number,
  checkAnswer: PropTypes.bool.isRequired,
  isExpressGrader: PropTypes.bool.isRequired,
  singleResponseBox: PropTypes.bool,
}

PopoverContent.defaultProps = {
  fontSize: 14,
  singleResponseBox: false,
}

export default PopoverContent
