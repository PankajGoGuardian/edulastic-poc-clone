import React, { useContext } from 'react'
import PropTypes from 'prop-types'
import { EduIf, measureText, QuestionContext } from '@edulastic/common'
import { templateHasMath } from '@edulastic/common/src/helpers'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowsAlt } from '@fortawesome/free-solid-svg-icons'
import { Popover } from 'antd'

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
  label,
  width,
  maxWidth,
  minWidth,
  minHeight,
  maxHeight,
  isPrintPreview,
}) => {
  const { questionId } = useContext(QuestionContext)

  const showIcon = preview && valid !== undefined
  let showPopover = false
  if (templateHasMath(label)) {
    const { scrollWidth } = measureText(label)
    const widthOverflow = scrollWidth > maxWidth - 16
    showPopover = widthOverflow
  }
  const getContent = (inPopover) => {
    const answerBoxStyle = {}
    if (showPopover && !inPopover) {
      answerBoxStyle.maxWidth = maxWidth - 60
      answerBoxStyle.overflow = 'hidden'
    }
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
        <EduIf condition={dragHandle}>
          <FontAwesomeIcon icon={faArrowsAlt} style={{ fontSize: 12 }} />
        </EduIf>
        <AnswerBox
          style={answerBoxStyle}
          checked={preview && valid !== undefined}
          dangerouslySetInnerHTML={{ __html: label }}
        />
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
  const popoverContent = getContent(true)

  if (showPopover) {
    return (
      <Popover placement="bottomLeft" content={popoverContent}>
        {content}
      </Popover>
    )
  }
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
