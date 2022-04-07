import React from 'react'
import PropTypes from 'prop-types'
import { Popover } from 'antd'
import { measureText } from '@edulastic/common'
import { response } from '@edulastic/constants'
import { Pointer } from '../../../../../styled/Pointer'
import { Point } from '../../../../../styled/Point'
import { Triangle } from '../../../../../styled/Triangle'
import { IconWrapper } from '../styled/IconWrapper'
import { TextContainer } from '../styled/TextContainer'
import PopoverContent from '../../PopoverContent'
import { getEvalautionColor } from '../../../../../utils/evaluation'
import { CheckBox } from '../styled/CheckBox'

const Response = ({
  showAnswer,
  checkAnswer,
  responseContainer,
  btnStyle,
  hasAnswered,
  userAnswer,
  onClickHandler,
  status,
  indexStr,
  lessMinWidth,
  isExpressGrader,
  isPrintPreview,
  answerScore,
  allCorrect,
  isEvaluationEmpty,
  singleResponseBox,
}) => {
  const { width: contentWidth } = measureText(userAnswer, btnStyle) // returns number
  const { fillColor, mark, indexBgColor } = getEvalautionColor(
    answerScore,
    status === 'right',
    hasAnswered,
    allCorrect,
    isEvaluationEmpty
  )

  const padding = lessMinWidth ? 4 : 30
  const indexWidth = showAnswer ? 40 : 0
  const boxWidth = parseInt(btnStyle.width, 10) // need to convert string to number ( "159px" => 159 ) for comparing
  /**
   *
   * content entered by user cannot be shown completely in the box
   * need to show ellipsis in the box
   * show entire entire answer in a popover on hover over the box
   *
   */
  const isOverConent = boxWidth < contentWidth + padding + indexWidth

  const popoverContent = (
    <PopoverContent
      indexStr={indexStr}
      userAnswer={userAnswer}
      btnStyle={{ ...btnStyle, position: 'unset' }}
      checkAnswer={checkAnswer}
      fillColor={fillColor}
      indexBgColor={indexBgColor}
      mark={mark}
      isExpressGrader={isExpressGrader}
      singleResponseBox={singleResponseBox}
    />
  )

  const content = (
    <CheckBox
      key={indexStr}
      fillColor={fillColor}
      indexBgColor={indexBgColor}
      isPrintPreview={isPrintPreview}
      style={{ ...btnStyle, minHeight: `${response.minHeight}px` }}
      onClick={onClickHandler}
    >
      {!singleResponseBox && (
        <span
          className="index"
          style={{ display: checkAnswer || lessMinWidth ? 'none' : 'flex' }}
        >
          {indexStr}
        </span>
      )}
      <TextContainer
        singleResponseBox={singleResponseBox}
        checkAnswer={checkAnswer}
        lessMinWidth={lessMinWidth}
        className="text"
      >
        <div className="clipText">{userAnswer}</div>
      </TextContainer>

      <div className="icons">
        {hasAnswered && (
          <IconWrapper rightPosition={lessMinWidth ? '5' : '10'}>
            {mark}
          </IconWrapper>
        )}
        <Pointer
          className={responseContainer.pointerPosition}
          width={responseContainer.width}
        >
          <Point />
          <Triangle />
        </Pointer>
      </div>
    </CheckBox>
  )

  // eslint-disable-next-line max-len
  return (isOverConent || lessMinWidth) && hasAnswered ? (
    <Popover content={popoverContent}>{content}</Popover>
  ) : (
    content
  )
}

Response.propTypes = {
  showAnswer: PropTypes.bool.isRequired,
  checkAnswer: PropTypes.bool.isRequired,
  responseContainer: PropTypes.object.isRequired,
  btnStyle: PropTypes.object,
  userAnswer: PropTypes.string.isRequired,
  onClickHandler: PropTypes.func.isRequired,
  status: PropTypes.string,
  indexStr: PropTypes.string,
  lessMinWidth: PropTypes.bool,
  isExpressGrader: PropTypes.bool.isRequired,
  isEvaluationEmpty: PropTypes.bool,
  singleResponseBox: PropTypes.bool,
}

Response.defaultProps = {
  btnStyle: {},
  status: '',
  indexStr: '',
  lessMinWidth: false,
  isEvaluationEmpty: true,
  singleResponseBox: false,
}

export default Response
