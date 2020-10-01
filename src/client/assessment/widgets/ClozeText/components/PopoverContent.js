import React from 'react'
import PropTypes from 'prop-types'

import { getStemNumeration } from '../../../utils/helpers'
import { IconWrapper } from './CheckboxTemplateBoxLayout/styled/IconWrapper'
import { RightIcon } from './CheckboxTemplateBoxLayout/styled/RightIcon'
import { WrongIcon } from './CheckboxTemplateBoxLayout/styled/WrongIcon'

// eslint-disable-next-line max-len
const PopoverContent = ({
  stemNumeration,
  index,
  fontSize,
  userSelections,
  status,
  btnStyle,
  checkAnswer,
  isExpressGrader,
}) => {
  const indexStr = getStemNumeration(stemNumeration, index)
  return (
    <span
      className="template_box dropdown"
      style={{ fontSize, padding: 20, overflow: 'hidden', margin: '0px 4px' }}
    >
      <span
        className={`response-btn ${
          userSelections.length > 0 && userSelections[index]
            ? 'check-answer'
            : ''
        } ${status} show-answer"`}
        style={{ ...btnStyle, width: 'unset', margin: '0 2px 4px 0px' }}
      >
        <span
          className="index"
          style={{ display: checkAnswer && !isExpressGrader ? 'none' : 'flex' }}
        >
          {indexStr}
        </span>
        <span className="text">{userSelections?.[index]?.value}</span>
        <IconWrapper display="flex" rightPosition="10">
          {userSelections.length > 0 &&
            userSelections[index] &&
            status === 'right' && <RightIcon />}
          {userSelections.length > 0 &&
            userSelections[index] &&
            status === 'wrong' && <WrongIcon />}
        </IconWrapper>
      </span>
    </span>
  )
}

PopoverContent.propTypes = {
  stemNumeration: PropTypes.string,
  index: PropTypes.number.isRequired,
  fontSize: PropTypes.number,
  userSelections: PropTypes.array.isRequired,
  status: PropTypes.string.isRequired,
  btnStyle: PropTypes.object,
  checkAnswer: PropTypes.bool,
  isExpressGrader: PropTypes.bool,
}

PopoverContent.defaultProps = {
  stemNumeration: '',
  fontSize: 14,
  btnStyle: {},
  checkAnswer: false,
  isExpressGrader: false,
}

export default PopoverContent
