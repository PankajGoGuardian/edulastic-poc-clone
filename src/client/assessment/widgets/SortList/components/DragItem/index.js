import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { DragDrop } from '@edulastic/common'
import { CHECK, SHOW, CLEAR } from '../../../../constants/constantsForQuestions'
import { TextEmpty } from './styled/TextEmpty'
import { DragItemContent } from './DragItemContent'

const DragItem = ({
  obj,
  onClick,
  active,
  smallSize,
  correct,
  previewTab,
  index,
  disableResponse,
  isReviewTab,
  stemNumeration,
  items,
  style,
  isPrintPreview,
  flag,
  checkAnswerInProgress,
  hideEvaluation,
}) => {
  const showPreview =
    (previewTab === CHECK || previewTab === SHOW) && !checkAnswerInProgress

  const clickHandler = () => {
    if (disableResponse) {
      return
    }
    if (active) {
      onClick('')
    } else {
      onClick(obj)
    }
  }

  const item = { item: obj, index, flag }

  return obj ? (
    <DragDrop.DragItem onClick={clickHandler} data={item}>
      <DragItemContent
        active={active}
        correct={correct}
        obj={obj}
        style={style}
        index={index}
        isReviewTab={isReviewTab}
        showPreview={showPreview}
        stemNumeration={stemNumeration}
        smallSize={smallSize}
        isPrintPreview={isPrintPreview}
        hideEvaluation={hideEvaluation}
      />
    </DragDrop.DragItem>
  ) : (
    <div>
      <TextEmpty smallSize={smallSize} style={style}>
        <HiddenContent dangerouslySetInnerHTML={{ __html: items[index] }} />
      </TextEmpty>
    </div>
  )
}

const HiddenContent = styled.div`
  display: flex;
  align-items: stretch;
  visibility: hidden;
  width: 100%;
  margin-left: 42px;
`

DragItem.propTypes = {
  obj: PropTypes.any,
  onClick: PropTypes.func.isRequired,
  active: PropTypes.bool.isRequired,
  smallSize: PropTypes.bool.isRequired,
  disableResponse: PropTypes.bool.isRequired,
  correct: PropTypes.bool,
  previewTab: PropTypes.string,
  index: PropTypes.number.isRequired,
  style: PropTypes.object,
  items: PropTypes.array,
}

DragItem.defaultProps = {
  obj: null,
  correct: false,
  previewTab: CLEAR,
  items: [],
  style: {},
}

export default DragItem
