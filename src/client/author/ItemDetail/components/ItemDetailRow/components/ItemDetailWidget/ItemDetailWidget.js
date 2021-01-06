import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { get } from 'lodash'
import { DragSource } from 'react-dnd'
import QuestionWrapper from '../../../../../../assessment/components/QuestionWrapper'
import { Types } from '../../../../constants'
import {
  setItemDetailDraggingAction,
  setItemLevelScoreAction,
  setItemLevelScoringAction,
} from '../../../../ducks'
import {
  getQuestionByIdSelector,
  setQuestionScoreAction,
} from '../../../../../sharedDucks/questions'
import Ctrls from './Controls'
import { Container, WidgetContainer, ButtonsContainer } from './styled'

const ItemDetailWidget = ({
  widget,
  onEdit,
  onDelete,
  isDragging,
  connectDragSource,
  connectDragPreview,
  widgetIndex,
  question,
  flowLayout,
  itemData,
  setItemLevelScore,
  setQuestionScore,
  rowIndex,
  previewTab,
}) => {
  const [showButtons, setShowButtons] = useState(!flowLayout)

  const onMouseEnterHander = () => {
    if (flowLayout) setShowButtons(true)
  }

  const onMouseLeaveHander = () => {
    if (flowLayout) setShowButtons(false)
  }

  const onChangeQuestionLevelPoint = (score) => {
    setQuestionScore({ score: +score, qid: question.id })
  }

  const onChangeItemLevelPoint = (score) => {
    setItemLevelScore(+score)
  }

  const showPoints = !(rowIndex === 0 && itemData.rows.length > 1)
  const isPointsBlockVisible =
    (itemData.itemLevelScoring && widgetIndex === 0 && showPoints) ||
    widget.widgetType === 'question'

  const score = itemData.itemLevelScoring
    ? itemData.itemLevelScore
    : get(question, 'validation.validResponse.score', 0)

  const scoreChangeHandler = itemData.itemLevelScoring
    ? onChangeItemLevelPoint
    : onChangeQuestionLevelPoint

  const disablePointsInput =
    (widgetIndex > 0 && itemData.itemLevelScoring) ||
    (question.rubrics && !itemData.itemLevelScoring)

  return (
    connectDragPreview &&
    connectDragSource &&
    connectDragPreview(
      <div onMouseEnter={onMouseEnterHander} onMouseLeave={onMouseLeaveHander}>
        <Container isDragging={isDragging} flowLayout={flowLayout}>
          <WidgetContainer>
            {(widget.widgetType === 'question' ||
              widget.widgetType === 'resource') && (
              <QuestionWrapper
                testItem
                qIndex={widgetIndex}
                type={widget.type}
                view="preview"
                questionId={widget.reference}
                previewTab={previewTab}
                data={{ ...question, smallSize: true }}
                flowLayout={flowLayout}
                disableResponse
              />
            )}
          </WidgetContainer>

          {(!flowLayout || showButtons) && (
            <ButtonsContainer>
              <Ctrls.Point
                value={score}
                onChange={scoreChangeHandler}
                visible={isPointsBlockVisible}
                disabled={disablePointsInput}
                isRubricQuestion={
                  !!question.rubrics && !itemData.itemLevelScoring
                }
              />

              {connectDragSource(
                <div>
                  <Ctrls.Move />
                </div>
              )}
              <Ctrls.Edit onEdit={onEdit} />
              <Ctrls.Delete onDelete={onDelete} />
            </ButtonsContainer>
          )}
        </Container>
      </div>
    )
  )
}

ItemDetailWidget.propTypes = {
  widget: PropTypes.object.isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  isDragging: PropTypes.bool.isRequired,
  connectDragSource: PropTypes.func.isRequired,
  connectDragPreview: PropTypes.func.isRequired,
  t: PropTypes.func.isRequired,
  question: PropTypes.object.isRequired,
  rowIndex: PropTypes.number.isRequired,
  widgetIndex: PropTypes.number.isRequired,
  flowLayout: PropTypes.bool,
}

const itemSource = {
  beginDrag({ setItemDetailDragging, widgetIndex, rowIndex }) {
    setTimeout(() => {
      setItemDetailDragging(true)
    }, 0)
    return {
      rowIndex,
      widgetIndex,
    }
  },
  endDrag({ setItemDetailDragging }) {
    setItemDetailDragging(false)
    return {}
  },
}

function collect(c, monitor) {
  return {
    connectDragSource: c.dragSource(),
    connectDragPreview: c.dragPreview(),
    isDragging: monitor.isDragging(),
  }
}

const enhance = compose(
  connect(
    (state, { widget }) => ({
      question: getQuestionByIdSelector(state, widget.reference),
    }),
    {
      setItemDetailDragging: setItemDetailDraggingAction,
      setItemLevelScoring: setItemLevelScoringAction,
      setItemLevelScore: setItemLevelScoreAction,
      setQuestionScore: setQuestionScoreAction,
    }
  ),
  DragSource(Types.WIDGET, itemSource, collect)
)

export default enhance(ItemDetailWidget)
