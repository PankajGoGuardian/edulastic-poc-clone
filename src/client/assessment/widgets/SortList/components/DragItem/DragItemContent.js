import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { Popover } from 'antd'
import { EduIf, MathFormulaDisplay, measureText } from '@edulastic/common'

import { getStemNumeration } from '../../../../utils/helpers'
import DragHandle from '../DragHandle'
import { Container } from './styled/Container'
import { StyledDragHandle } from './styled/StyledDragHandle'
import { Text } from './styled/Text'
import { WithIndex } from './styled/WithIndex'
import { IconWrapper } from './styled/IconWrapper'
import { IconCheck } from './styled/IconCheck'
import { IconClose } from './styled/IconClose'

export const DragItemContent = ({
  smallSize,
  showPreview,
  active,
  correct,
  obj,
  index,
  style,
  isReviewTab,
  stemNumeration,
  isPrintPreview,
  hideEvaluation,
}) => {
  const [show, toggleShow] = useState(true)

  const hidePopover = () => {
    toggleShow(false)
  }

  const openPopover = () => {
    toggleShow(true)
  }

  const popoverContent = (
    <MathFormulaDisplay
      onMouseEnter={hidePopover}
      dangerouslySetInnerHTML={{ __html: obj }}
    />
  )
  const { scrollWidth } = measureText(obj, style)
  /**
   * 10 will be ellipsis width at other parts,
   * measureText method returns scrollWidth + 10
   * but in this type, drag item is not using ellipsis.
   * so need to reduce 10px
   */
  const showPopover = scrollWidth - 10 > style?.maxWidth
  const checkStyle = !active && showPreview && !isReviewTab && !hideEvaluation

  const content = (
    <Container
      onMouseEnter={openPopover}
      onMouseLeave={hidePopover}
      onDragEnter={hidePopover}
      smallSize={smallSize}
      checkStyle={checkStyle}
      correct={correct}
      style={style}
      active={active}
      isPrintPreview={isPrintPreview}
    >
      {!showPreview && (
        <StyledDragHandle smallSize={smallSize}>
          <DragHandle smallSize={smallSize} />
        </StyledDragHandle>
      )}

      <Text
        checkStyle={checkStyle}
        correct={correct}
        smallSize={smallSize}
        isPrintPreview={isPrintPreview}
      >
        {showPreview && (
          <WithIndex checkStyle={checkStyle} correct={correct}>
            {getStemNumeration(stemNumeration, index)}
          </WithIndex>
        )}
        <MathFormulaDisplay dangerouslySetInnerHTML={{ __html: obj }} />
        <EduIf condition={showPreview && checkStyle}>
          <IconWrapper
            checkStyle={checkStyle}
            correct={correct}
            isPrintPreview={isPrintPreview}
          >
            <EduIf condition={correct}>
              <IconCheck aria-label=", Correct answer" />
            </EduIf>
            <EduIf condition={!correct}>
              <IconClose aria-label=", Incorrect answer" />
            </EduIf>
          </IconWrapper>
        </EduIf>
      </Text>
    </Container>
  )

  return showPopover ? (
    <Popover visible={show} content={popoverContent}>
      {content}
    </Popover>
  ) : (
    content
  )
}

DragItemContent.propTypes = {
  obj: PropTypes.any,
  active: PropTypes.bool.isRequired,
  smallSize: PropTypes.bool.isRequired,
  showPreview: PropTypes.bool.isRequired,
  isReviewTab: PropTypes.bool.isRequired,
  index: PropTypes.number.isRequired,
  style: PropTypes.object.isRequired,
  correct: PropTypes.bool,
}

DragItemContent.defaultProps = {
  obj: null,
  correct: false,
}
