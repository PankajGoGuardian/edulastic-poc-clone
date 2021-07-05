import React, { useState } from 'react'
import UnScored from '@edulastic/common/src/components/Unscored'
import PropTypes from 'prop-types'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { get, every } from 'lodash'
import { DragSource } from 'react-dnd'
import { FlexContainer } from '@edulastic/common'
import QuestionWrapper from '../../../../../../assessment/components/QuestionWrapper'
import { Types } from '../../../../constants'
import {
  setItemDetailDraggingAction,
  setItemLevelScoreAction,
  setItemLevelScoringAction,
} from '../../../../ducks'
import {
  getIsEditDisbledSelector,
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
  itemEditDisabled,
  dataCy,
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

  const { itemLevelScoring, itemLevelScore } = itemData

  const showPoints = !(rowIndex === 0 && itemData.rows.length > 1)
  const isPointsBlockVisible =
    (itemLevelScoring && widgetIndex === 0 && showPoints) ||
    widget.widgetType === 'question'

  const score = get(question, 'validation.validResponse.score', 0)
  const unscored = itemLevelScoring
    ? every(
        get(itemData, 'data.questions', []),
        ({ validation }) => validation && validation.unscored
      )
    : get(question, 'validation.unscored', false)
  const scoreChangeHandler = itemLevelScoring
    ? onChangeItemLevelPoint
    : onChangeQuestionLevelPoint

  const [isEditDisabled, disabledReason] = itemEditDisabled
  const hidePointsBlock =
    (widgetIndex > 0 && itemLevelScoring) ||
    (question.rubrics && !itemLevelScoring) ||
    isEditDisabled
  return (
    connectDragPreview &&
    connectDragSource &&
    connectDragPreview(
      <div
        onMouseEnter={onMouseEnterHander}
        onMouseLeave={onMouseLeaveHander}
        data-cy={dataCy}
      >
        <Container isDragging={isDragging} flowLayout={flowLayout}>
          {!hidePointsBlock && itemLevelScoring ? (
            !(unscored && showPoints) ? (
              <Ctrls.TotalPoints
                value={itemLevelScore}
                onChange={scoreChangeHandler}
                data-cy="totalPointUpdate"
                visible={isPointsBlockVisible}
                disabled={isEditDisabled}
                isRubricQuestion={!!question.rubrics && !itemLevelScoring}
                itemLevelScoring={itemLevelScoring}
              />
            ) : (
              <UnScored
                width="50px"
                height="50px"
                top={`${itemLevelScoring ? -80 : -50}px`}
              />
            )
          ) : null}

          <FlexContainer width="100%" justifyContent="space-between">
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
                {!(question.rubrics && !itemLevelScoring) &&
                  (!(unscored && showPoints) ? (
                    <Ctrls.Point
                      value={score}
                      onChange={scoreChangeHandler}
                      data-cy="pointUpdate"
                      visible={isPointsBlockVisible}
                      disabled={isEditDisabled}
                      isRubricQuestion={!!question.rubrics && !itemLevelScoring}
                      itemLevelScoring={itemLevelScoring}
                    />
                  ) : (
                    <UnScored
                      width="50px"
                      height="50px"
                      top={`${itemLevelScoring ? -80 : -50}px`}
                    />
                  ))}

                {isEditDisabled ? (
                  <div>
                    <Ctrls.Move
                      disabled={isEditDisabled}
                      disabledReason={disabledReason}
                    />
                  </div>
                ) : (
                  connectDragSource(
                    <div>
                      <Ctrls.Move />
                    </div>
                  )
                )}
                <Ctrls.Edit
                  onEdit={onEdit}
                  disabled={isEditDisabled}
                  disabledReason={disabledReason}
                />
                <Ctrls.Delete
                  onDelete={onDelete}
                  disabled={isEditDisabled}
                  disabledReason={disabledReason}
                />
              </ButtonsContainer>
            )}
          </FlexContainer>
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
  isPassageQuestion: PropTypes.bool,
}

const itemSource = {
  beginDrag({
    setItemDetailDragging,
    widgetIndex,
    rowIndex,
    isPassageQuestion,
  }) {
    setTimeout(() => {
      setItemDetailDragging(true)
    }, 0)
    return {
      rowIndex,
      widgetIndex,
      isPassageQuestion,
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
      itemEditDisabled: getIsEditDisbledSelector(state),
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
