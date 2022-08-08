import React, { useState, useMemo } from 'react'
import UnscoredHelperText from '@edulastic/common/src/components/UnscoredHelperText'
import PropTypes from 'prop-types'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { get, isEmpty } from 'lodash'
import { DragSource } from 'react-dnd'
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
import { isPremiumUserSelector } from '../../../../../src/selectors/user'
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
  onShowSettings,
  isPremiumUser,
  handleScoreUpdate,
}) => {
  const isEmtpyQuestion = useMemo(() => {
    return isEmpty(question)
  }, [question])

  const [showButtons, setShowButtons] = useState(!flowLayout)

  const onMouseEnterHander = () => {
    if (flowLayout) setShowButtons(true)
  }

  const onMouseLeaveHander = () => {
    if (flowLayout) setShowButtons(false)
  }

  const onChangeQuestionLevelPoint = (score, isOnBlur = false) => {
    if (typeof handleScoreUpdate === 'function') {
      handleScoreUpdate()
    }
    setQuestionScore({
      score: +score,
      qid: question.id,
      isOnBlur,
    })
  }

  const onChangeItemLevelPoint = (score) => {
    setItemLevelScore(+score)
  }

  const { itemLevelScoring, itemLevelScore, rows = [] } = itemData

  const showPoints = !(rowIndex === 0 && itemData.rows.length > 1)
  const isPointsBlockVisible =
    (itemLevelScoring && widgetIndex === 0 && showPoints) ||
    widget.widgetType === 'question'

  const questions = get(itemData, 'data.questions', [])

  const filterUnscoredQuestions = questions.filter(
    (x) => x.validation?.unscored !== true
  )

  const itemLevelPartScore =
    itemLevelScore /
    (filterUnscoredQuestions?.length > 0
      ? filterUnscoredQuestions?.length
      : rows[0]?.widgets?.length) // added for passage
  const score = get(question, 'validation.validResponse.score', 0)
  const partScore = itemLevelScoring
    ? Math.round(itemLevelPartScore * 100) / 100
    : score

  /**
   * @see https://snapwiz.atlassian.net/browse/EV-35305
   * For free user min value for the point input cannot be 0.5 strictly
   * For Eg: In case of 2 questions and itemLevelScore is 0.5 the part score is 0.25
   * Thus the min value for the input should be calculated dynamically for a free user and itemLevelScoring on.
   */
  const pointInputMinValue = useMemo(() => {
    let minValue
    if (isPremiumUser) {
      minValue = 0
    } else {
      minValue = itemLevelScoring ? Math.min(0.5, partScore) : 0.5
    }
    return minValue
  }, [isPremiumUser, itemLevelScoring, partScore])

  const unscored = itemLevelScoring
    ? question?.validation?.unscored
    : get(question, 'validation.unscored', false)

  const scoreChangeHandler = itemLevelScoring
    ? onChangeItemLevelPoint
    : onChangeQuestionLevelPoint

  const [isEditDisabled, disabledReason] = itemEditDisabled

  if (isEmtpyQuestion) {
    return null
  }

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
            <ButtonsContainer unscored={unscored}>
              <Ctrls.Point
                value={partScore}
                pointInputMinValue={pointInputMinValue}
                onChange={scoreChangeHandler}
                data-cy="pointUpdate"
                visible={isPointsBlockVisible}
                disabled={isEditDisabled}
                isRubricQuestion={!!question.rubrics && !itemLevelScoring}
                itemLevelScoring={itemLevelScoring}
                onShowSettings={onShowSettings}
              />

              {unscored && <UnscoredHelperText margin="0px 0px 10px 0px" />}

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
      isPremiumUser: isPremiumUserSelector(state),
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
