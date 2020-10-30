import React, { useRef, useEffect } from 'react'
import PropTypes from 'prop-types'
import { find, isUndefined } from 'lodash'
import { Popover } from 'antd'
import { measureText } from '@edulastic/common'
import { response as responseConstant } from '@edulastic/constants'

import { IconWrapper } from './styled/IconWrapper'
import { RightIcon } from './styled/RightIcon'
import { WrongIcon } from './styled/WrongIcon'
import { CheckBox } from './styled/CheckBox'
import { getMathTemplate } from '../../../utils/variables'

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
  const filedRef = useRef()
  const replaceWithMathQuill = () => {
    if (!window.MathQuill || !filedRef.current) {
      return
    }
    const MQ = window.MathQuill.getInterface(2)
    const mQuill = MQ.StaticMath(filedRef.current)
    mQuill.latex(value || '')
  }

  useEffect(() => {
    replaceWithMathQuill()
  }, [value])

  return <span className="value" ref={filedRef} style={style} />
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
  let checkBoxClass = ''

  if (userAnswer && evaluation[id] !== undefined) {
    checkBoxClass = evaluation[id] ? 'right' : 'wrong'
  }

  const showValue = combineUnitAndValue(userAnswer, isMath, unit)

  /**
   * if its math or math with units, need to convert the latex string to actual math template
   * passing latex string to the function would give incorrect dimensions
   * as latex might have extra special characters for rendering math
   */
  const answer = isMath ? getMathTemplate(showValue) : showValue
  const { width: textWidth, height: textHeight } = measureText(answer, {
    padding: '0 0 0 11px',
    fontSize: '16px',
  })
  const availableWidth = (parseInt(width, 10) || 0) - (showIndex ? 58 : 26) // will show popover when availableHeight is not available or NaN

  // +15 is some extra height
  const showPopover =
    textWidth > availableWidth ||
    parseInt(textHeight, 10) + 15 > mathInputMaxHeight

  const popoverContent = (isPopover) => (
    <CheckBox
      className={!isPrintPreview && checkBoxClass}
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
            value={showValue}
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
          showValue
        )}
      </span>
      {userAnswer && !isUndefined(evaluation[id]) && (
        <IconWrapper>
          {checkBoxClass === 'right' ? <RightIcon /> : <WrongIcon />}
        </IconWrapper>
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
