import React from 'react'
import PropTypes from 'prop-types'
import { find, isUndefined, isEmpty } from 'lodash'
import { Popover } from 'antd'
import { MathSpan } from '@edulastic/common'
import { response as responseConstant } from '@edulastic/constants'
import { getEvalautionColor } from '../../../utils/evaluation'

import { IconWrapper } from './styled/IconWrapper'
import { CheckBox } from './styled/CheckBox'

/**
 *
 * @param {String} userAnswer
 * @param {Boolean} isMath
 * @param {String} unit
 *
 * combines the unit and value in case of math with unit
 */
function combineUnitAndValue(userAnswer, isMath, unit) {
  return userAnswer && userAnswer.value
    ? isMath
      ? userAnswer.value.search('=') === -1
        ? `${userAnswer.value}\\ ${unit}`
        : userAnswer.value.replace(/=/gm, `\\ ${unit}=`)
      : userAnswer.value
    : userAnswer?.unit || ''
}

const { mathInputMaxHeight } = responseConstant

const CheckBoxedMathBox = ({ value, style }) => {
  return (
    <MathSpan
      style={style}
      dangerouslySetInnerHTML={{
        __html: `<span class="input__math" data-latex="${value}"></span>`,
      }}
    />
  )
}

CheckBoxedMathBox.propTypes = {
  value: PropTypes.string.isRequired,
  style: PropTypes.object.isRequired,
}

const CheckedBlock = ({
  item,
  evaluation,
  userAnswer,
  id,
  type,
  isMath,
  width,
  onInnerClick,
  showIndex,
  isPrintPreview = false,
  answerScore,
  allCorrects,
}) => {
  const { responseIds } = item
  const { index } = find(responseIds[type], (res) => res.id === id)
  let { unit = '' } = userAnswer || {}
  /**
   * certain keys already have the \text{} format, like \text{ft}^{2}
   * wrap inside \text{} only if its not already beginning with \text{
   * @see https://snapwiz.atlassian.net/browse/EV-15169
   */
  const unitWrappedInTextFormat = unit.match(/^\\text{/)
  if (
    (unit.search('f') !== -1 || unit.search(/\s/g) !== -1) &&
    !unitWrappedInTextFormat
  ) {
    unit = `\\text{${unit}}`
  }

  const answer = combineUnitAndValue(userAnswer, isMath, unit)

  const { fillColor, mark, indexBgColor } = getEvalautionColor(
    answerScore,
    userAnswer && evaluation[id],
    !!answer,
    allCorrects,
    isEmpty(evaluation)
  )

  /**
   * if its math or math with units, need to convert the latex string to actual math template
   * passing latex string to the function would give incorrect dimensions
   * as latex might have extra special characters for rendering math
   */
  const showPopover = !!answer // show popover when answer is provided

  const popoverContent = (isPopover) => (
    <CheckBox
      fillColor={fillColor}
      isPrintPreview={isPrintPreview}
      indexBgColor={indexBgColor}
      key={`input_${index}`}
      onClick={onInnerClick}
      width={isPopover ? null : width}
    >
      {showIndex && (
        <span
          className="index"
          style={{ alignSelf: 'stretch', height: 'auto' }}
        >
          {index + 1}
        </span>
      )}
      <span
        className="value"
        style={{
          alignItems: 'center',
          fontWeight: 'normal',
          textAlign: 'left',
          paddingLeft: '11px',
        }}
      >
        {isMath ? (
          <CheckBoxedMathBox
            value={answer}
            style={{
              minWidth: 'unset',
              display: 'flex',
              alignItems: 'center',
              textAlign: 'left',
              maxHeight: !isPopover && mathInputMaxHeight,
              padding: isPopover && '4px 0px',
            }}
          />
        ) : (
          answer
        )}
      </span>
      {userAnswer && !isUndefined(evaluation[id]) && (
        <IconWrapper>{mark}</IconWrapper>
      )}
    </CheckBox>
  )

  return showPopover ? (
    <Popover content={popoverContent(true)}>{popoverContent()}</Popover>
  ) : (
    popoverContent()
  )
}

CheckedBlock.propTypes = {
  evaluation: PropTypes.array.isRequired,
  userAnswer: PropTypes.any,
  item: PropTypes.object.isRequired,
  type: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  showIndex: PropTypes.bool,
  isMath: PropTypes.bool,
  width: PropTypes.string,
  onInnerClick: PropTypes.func,
}

CheckedBlock.defaultProps = {
  isMath: false,
  showIndex: false,
  userAnswer: '',
  width: '120px',
  onInnerClick: () => {},
}

export default CheckedBlock
