import React from 'react'
import Modal from './Modal'
import QuestionWrapper from '../QuestionWrapper'
import { keyBy } from '../../utils'
// import { getRows } from '../../../client/author/sharedDucks/itemDetail';

const BroadcastModal = ({ visible, handleSkip, handleSubmit, item = [] }) => {
  const questions = {
    ...keyBy(item?.data?.questions, 'id'),
    ...keyBy(item?.data?.resources, 'id'),
  }

  return (
    <Modal
      visible={visible}
      handleSkip={handleSkip}
      handleSubmit={handleSubmit}
    >
      {item.rows?.map((row = {}, i) => {
        const { widgets } = row

        return widgets?.map((widget, j, arr) => (
          <QuestionWrapper
            showFeedback={false}
            type={widget.type}
            view="preview"
            qIndex={j}
            previewTab="show"
            timespent={null}
            questionId={widget.reference}
            data={{ ...questions[widget.reference], smallSize: true }}
            tabIndex={widget.tabIndex}
            itemIndex={i}
            flowLayout={row.flowLayout}
            borderRadius="0"
            noPadding
            noBoxShadow
            isFlex
            LCBPreviewModal
          />
        ))
      })}
    </Modal>
  )
}

export default BroadcastModal
