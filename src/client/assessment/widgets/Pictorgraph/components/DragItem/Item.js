import React, { useContext } from 'react'
import PropTypes from 'prop-types'
import { EduIf, FlexContainer, QuestionContext } from '@edulastic/common'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowsAlt } from '@fortawesome/free-solid-svg-icons'

import { IconBox } from './styled/IconBox'
import { IconCheck } from './styled/IconCheck'
import { IconClose } from './styled/IconClose'
import { AnswerBox } from './styled/AnswerBox'
import { InnerWrapper } from './styled/InnerWrapper'

import TriggerStyle from './TriggerStyle'

const Item = ({
  isTransparent,
  valid,
  preview,
  dragHandle,
  image,
  width,
  maxWidth,
  minWidth,
  minHeight,
  maxHeight,
  isPrintPreview,
  count,
  unit,
  showElementValues,
}) => {
  const { questionId } = useContext(QuestionContext)

  const showIcon = preview && valid !== undefined

  const getContent = (inPopover) => {
    const answerBoxStyle = {}

    return (
      <InnerWrapper
        valid={valid}
        preview={preview}
        transparent={isTransparent}
        width={inPopover ? null : width}
        showIcon={showIcon}
        maxWidth={inPopover ? null : maxWidth}
        minWidth={minWidth}
        minHeight={minHeight}
        maxHeight={inPopover ? null : maxHeight}
        isPrintPreview={isPrintPreview}
      >
        {dragHandle && (
          <FontAwesomeIcon icon={faArrowsAlt} style={{ fontSize: 12 }} />
        )}
        <FlexContainer flexDirection="column" justifyContent="center">
          <span>
            <AnswerBox
              style={answerBoxStyle}
              checked={preview && valid !== undefined}
              dangerouslySetInnerHTML={{ __html: image }}
            />
          </span>
          {showElementValues && count && unit && (
            <span>
              {count} {unit}
            </span>
          )}
        </FlexContainer>
        <TriggerStyle
          questionId={`classification-cols-container-${questionId}`}
        />
        <EduIf condition={showIcon}>
          <IconBox checked={showIcon}>
            <EduIf condition={valid}>
              <IconCheck aria-label=", Correct answer" />
            </EduIf>
            <EduIf condition={!valid}>
              <IconClose aria-label=", Incorrect answer" />
            </EduIf>
          </IconBox>
        </EduIf>
      </InnerWrapper>
    )
  }

  const content = getContent()
  return content
}

Item.propTypes = {
  valid: PropTypes.bool.isRequired,
  preview: PropTypes.bool.isRequired,
  dragHandle: PropTypes.bool.isRequired,
  label: PropTypes.string.isRequired,
  isTransparent: PropTypes.bool.isRequired,
  maxWidth: PropTypes.number.isRequired,
  minWidth: PropTypes.number.isRequired,
  minHeight: PropTypes.number.isRequired,
  maxHeight: PropTypes.number.isRequired,
  width: PropTypes.number,
}

Item.defaultProps = {
  width: null,
}

export default Item
