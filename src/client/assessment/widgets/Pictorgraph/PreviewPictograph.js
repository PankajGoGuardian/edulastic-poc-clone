import React, { useState, useEffect, useContext, useRef } from 'react'
import PropTypes from 'prop-types'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { cloneDeep, isEqual, get, shuffle, uniq } from 'lodash'
import 'core-js/features/array/flat'
import {
  FlexContainer,
  Stimulus,
  DragDrop,
  QuestionNumberLabel,
  AnswerContext,
  QuestionLabelWrapper,
  QuestionSubLabel,
  QuestionContextProvider,
  HorizontalScrollContext,
} from '@edulastic/common'
import { withNamespaces } from '@edulastic/localization'
import { ChoiceDimensions } from '@edulastic/constants'

import {
  PREVIEW,
  SHOW,
  CLEAR,
  CHECK,
  EDIT,
} from '../../constants/constantsForQuestions'
import { setQuestionDataAction } from '../../../author/QuestionEditor/ducks'
import TableLayout from './components/TableLayout'
import TableRow from './components/TableRow'

import {
  getFontSize,
  getDirection,
  getJustification,
} from '../../utils/helpers'
import { QuestionStimulusWrapper } from './styled/QuestionStimulus'
import { StyledPaperWrapper } from '../../styled/Widget'

import { ResponseContainer } from './components/ResponseContainer'
import ChoiceContainer from './components/ChoiceContainer'
import ChoiceBoxes from './components/ChoiceBoxes'
import CorrectAnswers from './components/CorrectAnswers'
import Instructions from '../../components/Instructions'
import getMaxMinWidth from './getMaxMinWidth'
import ClickToSelect from './context/clickToSelect'
import { clearEvaluationAction } from '../../actions/evaluation'

const {
  maxWidth: choiceDefaultMaxW,
  minWidth: choiceDefaultMinW,
  minHeight: choiceDefaultMinH,
} = ChoiceDimensions

const { DragPreview } = DragDrop

const PreviewPictograph = ({
  view,
  saveAnswer,
  item = { uiStyle: {} },
  t,
  evaluation,
  userAnswer,
  previewTab,
  smallSize,
  editCorrectAnswers,
  showQuestionNumber,
  disableResponse,
  isReviewTab,
  setQuestionData,
  isPrintPreview,
  isPrint,
  hideCorrectAnswer,
  droppedChoices,
  showClassName,
  isQuestionLayer,
  clearEvaluation,
}) => {
  const listPosition = get(item, 'uiStyle.possibilityListPosition', 'left')
  const rowHeader = get(item, 'uiStyle.rowHeader', null)
  const fontSize = getFontSize(get(item, 'uiStyle.fontsize', 'normal'))
  const isVertical = listPosition === 'left' || listPosition === 'right'
  const dragItemMinWidth = get(
    item,
    'uiStyle.choiceMinWidth',
    choiceDefaultMinW
  )
  const dragItemMaxWidth = get(
    item,
    'uiStyle.choiceMaxWidth',
    choiceDefaultMaxW
  )
  const stemNumeration = get(item, 'uiStyle.validationStemNumeration')
  const displayWrapperRef = useRef()

  const { isAnswerModifiable } = useContext(AnswerContext)

  const direction = getDirection(listPosition)
  const justifyContent = getJustification(listPosition)
  const flexDirection =
    (isPrintPreview || isPrint) && direction.includes('row')
      ? direction.replace(/row/gi, 'column')
      : direction
  const styles = {
    wrapperStyle: {
      display: 'flex',
      flexDirection,
      justifyContent,
    },
  }

  const {
    possibleResponses: posResponses = [],
    groupPossibleResponses,
    possibleResponseGroups = [],
    stimulus,
    imageUrl,
    imageOptions = {},
    shuffleOptions,
    transparentPossibleResponses,
    transparentBackgroundImage = true,
    duplicateResponses,
    uiStyle: {
      columnCount: colCount = 2,
      columnTitles: colTitles = [],
      rowCount,
      rowTitles = [],
      showDragHandle,
    },
    classifications = [],
  } = item

  const validArray = get(item, 'validation.validResponse.value', [])
  const altArrays = get(item, 'validation.altResponses', []).map(
    (arr) => arr.value || []
  )

  let groupArrays = []
  possibleResponseGroups.forEach((o) => {
    groupArrays = [...groupArrays, ...o.responses]
  })

  const posResp = groupPossibleResponses ? groupArrays : posResponses

  const possibleResponses =
    editCorrectAnswers.length > 0
      ? posResp.filter(
          (ite) =>
            ite &&
            editCorrectAnswers.every(
              (i) => !i.includes(posResp.find((resp) => resp.id === ite.id).id)
            )
        )
      : posResp

  const initialLength = (colCount || 2) * (rowCount || 1)

  const createEmptyArrayOfArrays = () =>
    Array(...Array(initialLength)).map(() => [])
  /*
    Changes :
    1. removing validArray mapping for initial answers 
       as it is correct ans array and we need user response array.
    2. Refactoring code for better readability of conditions.
 */
  const getInitialUserAnswers = () => {
    if (!disableResponse && Object.keys(editCorrectAnswers).length > 0) {
      return editCorrectAnswers
    }
    // it is called only in previewMode
    if (
      userAnswer &&
      Object.keys(userAnswer)?.some((key) => userAnswer[key]?.length !== 0)
    ) {
      return userAnswer
    }
    const initalAnswerMap = {}
    classifications.forEach((classification) => {
      initalAnswerMap[classification.id] =
        initalAnswerMap[classification.id] || []
    })
    return initalAnswerMap
  }

  /**
   * in edit mode
   * edit correct answers basically follows up the same schema as validation.value
   * it is passed from editClassification
   *
   * in preview mode
   * getInitialUserAnswers() is called to get answers
   * it also follows similar schema as of validation.value
   */
  const initialAnswers = getInitialUserAnswers()

  function getPossiblResponses() {
    const allAnswers = Object.values(initialAnswers).reduce((acc, curr) => {
      acc = acc.concat(curr)
      return acc
    }, [])
    function notSelected(obj) {
      if (obj) {
        return !allAnswers.includes(obj.id)
      }
    }
    const res = possibleResponses.filter(notSelected)
    return res
  }

  const [answers, setAnswers] = useState(initialAnswers)
  const [dragItems, setDragItems] = useState(possibleResponses)
  const [currentSelection, setCurrentSelection] = useState()
  /**
   * it is used to filter out responses from the bottom container and place in correct boxes
   * it also used to clear out responses when clear is pressed
   */
  const updateDragItems = () => {
    setAnswers(initialAnswers)
    setDragItems(getPossiblResponses())
  }

  useEffect(() => {
    if (
      !isEqual(answers, initialAnswers) ||
      (!groupPossibleResponses &&
        (possibleResponses.length !== dragItems.length ||
          !isEqual(possibleResponses, dragItems)))
    ) {
      updateDragItems()
    }
  }, [userAnswer, possibleResponses])

  useEffect(() => {
    if (view === EDIT) {
      updateDragItems()
    }
  }, [classifications, editCorrectAnswers])

  useEffect(updateDragItems, [])

  const boxes = createEmptyArrayOfArrays()

  const onDrop = ({ item: _item = {}, from, fromColumnId }, itemTo) => {
    if (evaluation) {
      clearEvaluation()
    }

    const { id: itemId = '' } = _item
    const maxResponsePerCell = get(item, 'maxResponsePerCell', '')
    const dItems = cloneDeep(dragItems)
    const userAnswers = cloneDeep(answers)

    if (
      maxResponsePerCell &&
      userAnswers?.[itemTo.columnId]?.length >= maxResponsePerCell
    ) {
      return
    }

    // this is called when responses are dragged back to the container from the columns
    if (itemTo.flag === 'dragItems') {
      const obj = posResp.find(({ id }) => id === itemId)
      if (obj) {
        if (from !== 'container') {
          Object.keys(userAnswers).forEach((key) => {
            if (key === fromColumnId) {
              const arr = userAnswers[key] || []
              const optionIndex = arr.findIndex((elem) => elem.id === obj.id)
              if (optionIndex !== -1) {
                arr.splice(optionIndex, 1)
              }
            }
          })
        }
        if (!dItems.flatMap(({ id }) => id).includes(itemId)) {
          dItems.push(posResponses.find(({ id }) => id === itemId))
          setDragItems(dItems)
        }
      }
    } else if (itemTo.flag === 'column') {
      /**
       * this is called when
       * responses are dragged from container to columns
       * or, from one column to another
       */
      const obj = posResp.find(({ id }) => id === itemId)
      if (obj) {
        Object.keys(userAnswers).forEach((key) => {
          const arr = userAnswers[key] || []
          if (!duplicateResponses && arr.includes(obj.id)) {
            arr.splice(arr.indexOf(obj.id), 1)
          } else if (from === 'column' && key === fromColumnId) {
            /**
             * when going from one column1 to column2
             * remove it from the column1
             */
            const optionIndex = arr.indexOf(obj.id)
            if (optionIndex !== -1) {
              arr.splice(optionIndex, 1)
            }
          }
          if (key === itemTo.columnId) {
            arr.push({ id: obj.id })
          }
        })
      }
      /**
       * this is to filter out responses when options are dropped
       * get a new list of possible responses
       */
      if (!duplicateResponses) {
        const includes = posResp.flatMap(({ id }) => id).includes(itemId)
        if (includes) {
          dItems.splice(
            dItems.findIndex((id) => id === itemId),
            1
          )
          setDragItems(dItems)
        }
      }
    } else if (itemTo.flag === 'clickToSelect' && currentSelection) {
      const answerIndex = userAnswers[fromColumnId].findIndex(
        (ans) => ans.elementContainerIndex === from
      )

      if (answerIndex === -1) {
        // not selected
        userAnswers[fromColumnId].push({
          id: currentSelection,
          elementContainerIndex: from,
        })
      } else if (
        // deselecting
        userAnswers[fromColumnId][answerIndex].id === currentSelection
      ) {
        userAnswers[fromColumnId].splice(answerIndex, 1)
      } else {
        // selecting an already selected option, but with different option
        userAnswers[fromColumnId][answerIndex].id = currentSelection
      }
    }
    /**
     * just a check to verify if actually anything has changed
     */
    if (!isEqual(userAnswers, answers)) {
      setAnswers(userAnswers)
    }
    saveAnswer(userAnswers)
  }

  const preview = previewTab === CHECK || previewTab === SHOW

  const arrayOfRows = new Set(
    boxes
      .map((n, ind) => (ind % colCount === 0 ? ind : undefined))
      .filter((i) => i !== undefined)
  )

  const verifiedDragItems = uniq(
    shuffleOptions
      ? shuffle(duplicateResponses ? posResponses : dragItems)
      : duplicateResponses
      ? posResponses
      : dragItems
  )

  /**
   * It is in case of group_possbile_responses
   * This takes care of filtering out draggable responses from the bottom container
   */
  const flattenAnswers = Object.values(answers).flatMap((arr) => arr)
  const verifiedGroupDragItems = duplicateResponses
    ? possibleResponseGroups.map((group) =>
        shuffleOptions ? shuffle(group.responses) : group.responses
      )
    : possibleResponseGroups.map((group) => {
        const responses = group.responses.filter(
          (response) => !flattenAnswers.includes(response.id)
        )
        return shuffleOptions ? shuffle(responses) : responses
      })

  const { maxWidth: choiceMaxWidth, minWidth: choiceMinWidth } = getMaxMinWidth(
    posResp,
    fontSize
  )
  const { maxWidth: colTitleMaxWidth } = getMaxMinWidth(
    colTitles.map((title) => ({ value: title }))
  )
  const choiceWdith = Math.max(choiceMaxWidth, colTitleMaxWidth)

  const dragItemSize = {
    maxWidth: dragItemMaxWidth,
    minWidth: dragItemMinWidth,
    minHeight: choiceDefaultMinH,
    maxHeight: 'auto', // Changing max height to auto, to avoid trimmed image
    width: choiceWdith + 10,
  }

  const dragItemProps = {
    disableResponse,
    from: 'container',
    dragHandle: showDragHandle,
    isTransparent: transparentPossibleResponses,
    padding: choiceMinWidth < 35 ? '0px 0px 0px 5px' : '0px 0px 0px 10px',
    isPrintPreview,
    ...dragItemSize,
  }

  const handleClick = (id) => {
    setCurrentSelection(id)
  }

  const dragLayout = (
    <ClickToSelect.Provider value={{ currentSelection, handleClick: onDrop }}>
      <TableRow
        colTitles={colTitles}
        isBackgroundImageTransparent={transparentBackgroundImage}
        isTransparent={transparentPossibleResponses}
        width={get(item, 'uiStyle.rowTitlesWidth', 'max-content')}
        height={get(item, 'uiStyle.rowMinHeight', '65px')}
        colCount={colCount}
        arrayOfRows={arrayOfRows}
        rowTitles={rowTitles}
        dragHandle={showDragHandle}
        answers={answers}
        evaluation={evaluation}
        preview={preview}
        previewTab={previewTab}
        possibleResponses={possibleResponses}
        onDrop={onDrop}
        isResizable={view === EDIT && isQuestionLayer}
        item={item}
        disableResponse={disableResponse}
        isReviewTab={isReviewTab}
        view={view}
        setQuestionData={setQuestionData}
        rowHeader={rowHeader}
        dragItemSize={dragItemProps}
        droppedChoices={droppedChoices}
        showClassName={showClassName}
        isQuestionLayer={isQuestionLayer}
      />
    </ClickToSelect.Provider>
  )

  const tableLayout = (
    <TableLayout
      colCount={colCount}
      rowCount={rowCount}
      rowTitles={rowTitles}
      colTitles={colTitles}
      width={get(item, 'uiStyle.rowTitlesWidth', 'max-content')}
      minWidth="200px"
      height={get(item, 'uiStyle.rowMinHeight', '85px')}
      isBackgroundImageTransparent={transparentBackgroundImage}
      isTransparent={transparentPossibleResponses}
      answers={answers}
      dragHandle={showDragHandle}
      item={item}
      isReviewTab={isReviewTab}
      evaluation={evaluation}
      preview={preview}
      onDrop={onDrop}
      disableResponse={disableResponse}
      rowHeader={rowHeader}
      dragItemSize={dragItemSize}
    />
  )

  const tableContent = rowCount > 1 ? tableLayout : dragLayout

  const classificationPreviewComponent = (
    <StyledPaperWrapper
      data-cy="classificationPreview"
      style={{ fontSize }}
      padding={smallSize}
      boxShadow={smallSize ? 'none' : ''}
      className="classification-preview"
    >
      <FlexContainer
        justifyContent="flex-start"
        alignItems="baseline"
        width="100%"
      >
        <QuestionLabelWrapper>
          {showQuestionNumber && (
            <QuestionNumberLabel>{item.qLabel}</QuestionNumberLabel>
          )}
          {item.qSubLabel && (
            <QuestionSubLabel>({item.qSubLabel})</QuestionSubLabel>
          )}
        </QuestionLabelWrapper>

        <div
          ref={displayWrapperRef}
          style={{
            overflow: 'auto',
            width: '100%', // fixes issue with skipped, teacher feedback (testActivityReport)
          }}
        >
          {!smallSize && view === PREVIEW && (
            <QuestionStimulusWrapper>
              <Stimulus dangerouslySetInnerHTML={{ __html: stimulus }} />
            </QuestionStimulusWrapper>
          )}
          <div
            data-cy="classificationPreviewWrapper"
            style={styles.wrapperStyle}
            className="classification-preview-wrapper"
          >
            <ResponseContainer
              direction={direction}
              imageOptions={imageOptions}
              imageUrl={imageUrl}
              disableResponse={disableResponse}
              className="classification-preview-wrapper-response"
            >
              {tableContent}
            </ResponseContainer>
            {!disableResponse && (
              <ChoiceBoxes
                t={t}
                item={item}
                onDrop={onDrop}
                direction={direction}
                isVertical={isVertical}
                stemNumeration={stemNumeration}
                dragItemProps={dragItemProps}
                dragItemMaxWidth={dragItemMaxWidth}
                disableResponse={disableResponse}
                isAnswerModifiable={isAnswerModifiable}
                possibleResponses={possibleResponses}
                verifiedDragItems={verifiedDragItems}
                possibleResponseGroups={possibleResponseGroups}
                groupPossibleResponses={groupPossibleResponses}
                verifiedGroupDragItems={verifiedGroupDragItems}
                isQuestionLayer={isQuestionLayer}
                onClick={handleClick}
              />
            )}
          </div>
          {view !== EDIT && <Instructions item={item} />}
          {(previewTab === SHOW || isReviewTab) && !hideCorrectAnswer ? (
            <ChoiceContainer isShowAnswer>
              <CorrectAnswers
                classifications={classifications}
                droppedChoices={droppedChoices}
                elementContainers={item.elementContainers}
                colCount={colCount}
                possibleResponse={posResp}
                answersArr={validArray}
                columnTitles={colTitles}
                stemNumeration={stemNumeration}
                dragItemProps={dragItemProps}
                title={t('component.classification.correctAnswers')}
                multiRow={rowCount > 1}
                isClickToSelect={item.answeringStyle === 'clickToSelect'}
              />
              {altArrays.map((altArray, ind) => (
                <CorrectAnswers
                  colCount={colCount}
                  isClickToSelect={item.answeringStyle === 'clickToSelect'}
                  elementContainers={item.elementContainers}
                  classifications={classifications}
                  possibleResponse={posResp}
                  droppedChoices={droppedChoices}
                  answersArr={altArray}
                  columnTitles={colTitles}
                  stemNumeration={stemNumeration}
                  dragItemProps={dragItemProps}
                  multiRow={rowCount > 1}
                  key={`alt-answer-${ind}`}
                  title={`${t('component.classification.alternateAnswer')} ${
                    ind + 1
                  }`}
                />
              ))}
            </ChoiceContainer>
          ) : null}
        </div>
      </FlexContainer>
    </StyledPaperWrapper>
  )

  return (
    <HorizontalScrollContext.Provider
      value={{ getScrollElement: () => displayWrapperRef.current }}
    >
      <QuestionContextProvider value={{ questionId: item.id }}>
        {classificationPreviewComponent}
        <DragPreview />
      </QuestionContextProvider>
    </HorizontalScrollContext.Provider>
  )
}

PreviewPictograph.propTypes = {
  previewTab: PropTypes.string,
  editCorrectAnswers: PropTypes.array,
  t: PropTypes.func.isRequired,
  smallSize: PropTypes.bool,
  evaluation: PropTypes.array.isRequired,
  item: PropTypes.object.isRequired,
  saveAnswer: PropTypes.func.isRequired,
  setQuestionData: PropTypes.any.isRequired,
  userAnswer: PropTypes.any.isRequired,
  view: PropTypes.string.isRequired,
  showQuestionNumber: PropTypes.bool,
  disableResponse: PropTypes.bool,
  isReviewTab: PropTypes.bool,
}

PreviewPictograph.defaultProps = {
  previewTab: CLEAR,
  smallSize: false,
  editCorrectAnswers: [],
  showQuestionNumber: false,
  disableResponse: false,
  isReviewTab: false,
}

const enhance = compose(
  withNamespaces('assessment'),
  connect(null, {
    setQuestionData: setQuestionDataAction,
    clearEvaluation: clearEvaluationAction,
  })
)

export default enhance(PreviewPictograph)
