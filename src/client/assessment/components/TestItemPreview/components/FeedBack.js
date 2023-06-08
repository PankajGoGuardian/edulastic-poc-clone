import React from 'react'
import { RenderFeedBack } from '../styled/Container'

const FeedBackBlock = ({
  renderFeedBacks,
  isExpressGrader,
  isPrintPreview,
  isStudentAttempt,
}) => {
  return (
    <RenderFeedBack
      isExpressGrader={isExpressGrader}
      isPrintPreview={isPrintPreview}
      isStudentAttempt={isStudentAttempt}
      className="__print-feedback-main-wrapper testtest"
    >
      {renderFeedBacks}
    </RenderFeedBack>
  )
}

export default FeedBackBlock
