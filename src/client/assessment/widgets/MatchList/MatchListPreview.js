import React, { useState, useEffect, useContext, useRef, useMemo } from 'react'
import PropTypes from 'prop-types'
import produce from 'immer'
import { withTheme } from 'styled-components'
import { connect } from 'react-redux'
import { cloneDeep, isEqual, get, shuffle, keyBy, isEmpty, isNil } from 'lodash'
import { compose } from 'redux'
import {
  FlexContainer,
  Stimulus,
  DragDrop,
  HorizontalScrollContext,
  QuestionNumberLabel,
  AnswerContext,
  QuestionLabelWrapper,
  QuestionSubLabel,
  QuestionContentWrapper,
  AssessmentPlayerContext,
  withWindowSizes,
} from '@edulastic/common'
import { withNamespaces } from '@edulastic/localization'
import { ChoiceDimensions } from '@edulastic/constants'
import { tabletWidth, white } from '@edulastic/colors'

import Instructions from '../../components/Instructions'
import {
  CHECK,
  SHOW,
  PREVIEW,
  CLEAR,
  EDIT,
} from '../../constants/constantsForQuestions'
import { QuestionTitleWrapper } from './styled/QustionNumber'
import { getFontSize, getDirection } from '../../utils/helpers'
import { setQuestionDataAction } from '../../../author/QuestionEditor/ducks'
import { StyledPaperWrapper } from '../../styled/Widget'
import { CheckboxLabel } from '../../styled/CheckboxWithLabel'
import { storeOrderInRedux } from '../../actions/assessmentPlayer'
import CorrectAnswers from './components/CorrectAnswers'
import PossibleResponses from './components/PossibleResponses'
import MatchList from './components/MatchList'

const {
  maxWidth: choiceDefaultMaxW,
  minWidth: choiceDefaultMinW,
  minHeight: choiceMinHeight,
} = ChoiceDimensions

const getInitialAnswer = (list = []) => {
  const ans = {}
  Array.isArray(list) &&
    list.forEach((l) => {
      ans[l.value] = null
    })
  return ans
}

const { DragPreview } = DragDrop

/**
 * TODO
 * refactor the matchListPreview component
 * segregate components in separate files instead of accumulating everything in one mammoth file
 */
const MatchListPreview = ({
  view,
  saveAnswer,
  userAnswer,
  item,
  t,
  previewTab,
  smallSize,
  theme,
  showQuestionNumber,
  setQuestionData,
  disableResponse,
  changePreviewTab,
  changePreview,
  evaluation,
  isReviewTab,
  isPrintPreview,
  updateOptionsToStore,
  optionsFromStore,
  hideCorrectAnswer,
  windowWidth,
  showAnswerScore,
  hideEvaluation = false,
}) => {
  const {
    possibleResponses: posResponses = [],
    possibleResponseGroups = [],
    groupPossibleResponses,
    stimulus,
    list = [],
    shuffleOptions,
    duplicatedResponses = false,
  } = item
  const answerContextConfig = useContext(AnswerContext)
  const assessmentPlayerContext = useContext(AssessmentPlayerContext)
  const { isStudentAttempt } = assessmentPlayerContext
  const { expressGrader, isAnswerModifiable } = answerContextConfig

  const validResponse = get(item, 'validation.validResponse.value', {})
  const validRespScore = get(item, 'validation.validResponse.score')

  const alternateResponses = get(item, 'validation.altResponses', [])
  const altRespScores = alternateResponses.map((resp) => resp?.score)

  const stemNumeration = get(item, 'uiStyle.validationStemNumeration', '')
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

  const getPossibleResponses = () => {
    if (!groupPossibleResponses) {
      return shuffleOptions ? [...shuffle(posResponses)] : [...posResponses]
    }
    let groupArrays = []
    possibleResponseGroups.forEach((group, groupIndex) => {
      let responses = shuffleOptions
        ? shuffle(group.responses)
        : group.responses
      responses = responses.map((response) => ({ ...response, groupIndex }))
      groupArrays = [...groupArrays, ...responses]
    })
    return groupArrays
  }

  const [ans, setAns] = useState([])

  function getInitialDragItems() {
    if (optionsFromStore) {
      return optionsFromStore
    }
    if (duplicatedResponses) {
      return getPossibleResponses()
    }
    return getPossibleResponses().filter(
      (answer) =>
        typeof userAnswer === 'object' &&
        !Object.values(userAnswer).includes(answer.value)
    )
  }

  const [dragItems, setDragItems] = useState(getInitialDragItems())

  /**
   * drag items has flattned structure of all the responses
   * we need to group back, based on group index
   * required to segregate into different groups in the responses section
   */
  const possibleResponsesGrouped = () => {
    const groupArrays = []
    dragItems.forEach((response) => {
      const { groupIndex } = response
      groupArrays[groupIndex] = groupArrays[groupIndex] || []
      groupArrays[groupIndex].push(response)
    })
    return groupArrays
  }

  const groupedPossibleResponses = possibleResponsesGrouped()

  /**
   * need ref to store the dragItems order
   * we need the order at which the user clicked on next button
   * this ref will be used to store the order in the redux, when component unmounts
   * relying on state values, does not work as state gets updated due to re-renders from other actions
   * values change in state due to useEffect
   * and during component unmount it has a different order, than what user last saw in the screen
   */
  const dragItemsRef = useRef(dragItems)

  /**
   * this ref is required to keep track if the user started to attempt
   * in that case we will not stop using the preserved order from the redux store
   */
  const userAttemptRef = useRef(false)

  useEffect(
    () =>
      /**
       * simulate component will unmount
       * during student attempt, only if shuffle is on
       * save the order of drag items in the redux store
       * so when user comes back to this question, show the responses in the preserved order
       * order is preserved until user attempts again, shuffle is done for every attempt
       * @see https://snapwiz.atlassian.net/browse/EV-14104
       */
      () => {
        if (isStudentAttempt && shuffleOptions) {
          updateOptionsToStore({
            itemId: item.id,
            options: dragItemsRef.current,
          })
        }
      },
    []
  )

  const initialAnswer = useMemo(() => getInitialAnswer(list), [list])

  useEffect(() => {
    if (!isEmpty(userAnswer)) {
      setAns(userAnswer)
    } else {
      setAns(initialAnswer)
    }
    let newDragItems = duplicatedResponses
      ? getPossibleResponses()
      : getPossibleResponses().filter(
          (answer) =>
            typeof userAnswer === 'object' &&
            !Object.values(userAnswer).some((i) => i === answer.value)
        )
    /**
     * at student side, if shuffle is on and if user comes back to this question
     * for subsequent renders, show the preserved order maintained in redux store
     * unless, user attempts the question again
     * store the order in a ref, which will be used to update in redux store, when component unmounts
     * @see https://snapwiz.atlassian.net/browse/EV-14104
     */
    if (isStudentAttempt && shuffleOptions) {
      if (!userAttemptRef.current && optionsFromStore) {
        newDragItems = optionsFromStore
      }
      dragItemsRef.current = newDragItems
    }
    if (!isEqual(dragItems, newDragItems)) {
      setDragItems(newDragItems)
    }
  }, [
    list,
    userAnswer,
    posResponses,
    possibleResponseGroups,
    duplicatedResponses,
  ])

  const preview = previewTab === CHECK || previewTab === SHOW

  const onDrop = (itemCurrent, itemTo) => {
    const answers = cloneDeep(ans)
    const dItems = cloneDeep(dragItems)
    const { item: _item, sourceFlag, sourceIndex } = itemCurrent

    if (isStudentAttempt && shuffleOptions) {
      userAttemptRef.current = true
    }

    // when item is set/unset (if/else) as an answer
    if (itemTo.flag === 'ans') {
      if (dItems.includes(_item)) {
        // when moved out from dragItems
        dItems.splice(dItems.indexOf(_item), 1)
      }
      if (sourceFlag === 'ans') {
        // when moved from one row to another
        answers[list[sourceIndex].value] = null
      }
      answers[list[itemTo.index].value] = _item.value
    } else if (Object.values(answers).includes(_item.value)) {
      answers[list?.[sourceIndex]?.value] = null
      dItems.push(_item)
    }

    if (!isEqual(ans, answers)) {
      setAns(answers)
    }
    if (!isEqual(dItems, dragItems)) {
      setDragItems(dItems)
    }
    if (preview) {
      changePreview(CLEAR)
    }
    saveAnswer(answers)
  }

  const handleShuffleChange = () => {
    setQuestionData(
      produce(item, (draft) => {
        draft.shuffleOptions = !item.shuffleOptions
      })
    )
  }

  const handleDuplicatedResponsesChange = () => {
    setQuestionData(
      produce(item, (draft) => {
        draft.duplicatedResponses = !item.duplicatedResponses
      })
    )
  }

  const allItemsById = keyBy(getPossibleResponses(), 'value')

  const alternateAnswers = {}
  if (alternateResponses.length > 0) {
    list.forEach((l) => {
      alternateAnswers[l.value] = []
      alternateResponses.forEach((alt) => {
        alternateAnswers[l.value].push(
          allItemsById?.[alt.value[l.value]]?.label || ''
        )
      })
    })
  }

  /**
   * calculate styles here based on question JSON
   */
  const fontSize = getFontSize(get(item, 'uiStyle.fontsize', 'normal'))
  const listPosition = get(item, 'uiStyle.possibilityListPosition', 'bottom')
  const horizontallyAligned =
    listPosition === 'left' || listPosition === 'right'

  const {
    answerBox: { borderColor },
    checkbox: { wrongBgColor, rightBgColor },
  } = theme

  const getStyles = ({ flag, _preview, correct, width }) => ({
    display: 'flex',
    width: width || 'auto',
    alignItems: 'center',
    justifyContent: _preview ? 'space-between' : 'center',
    background: isPrintPreview
      ? white
      : _preview
      ? isNil(correct)
        ? theme.widgets.matchList.dragItemBgColor
        : correct
        ? rightBgColor
        : wrongBgColor
      : theme.widgets.matchList.dragItemBgColor,
    border: _preview
      ? 'none'
      : flag === 'ans'
      ? 'none'
      : `1px solid ${borderColor}`,
    cursor: 'pointer',
    alignSelf: 'stretch',
    borderRadius: 4,
    fontWeight: theme.widgets.matchList.dragItemFontWeight,
    color: theme.widgets.matchList.dragItemColor,
    minWidth: dragItemMinWidth,
    maxWidth:
      (windowWidth > parseInt(tabletWidth, 10) && dragItemMaxWidth) || 335,
    overflow: 'hidden',
    transform: 'translate3d(0px, 0px, 0px)',
    minHeight: flag !== 'ans' ? choiceMinHeight : '100%',
  })

  const direction = getDirection(listPosition)
  const wrapperStyle = {
    display: 'flex',
    flexDirection:
      isPrintPreview && direction.includes('row')
        ? direction.replace(/row/gi, 'column')
        : direction,
    alignItems: horizontallyAligned ? 'flex-start' : 'center',
    width: isPrintPreview ? '100%' : horizontallyAligned ? 1050 : 750,
  }

  /**
   * @see https://snapwiz.atlassian.net/browse/EV-26868
   * avoid showing highlight if evaluation is empty
   */
  const showEvaluate =
    (preview && !isAnswerModifiable && expressGrader) ||
    (preview && !expressGrader && !isEmpty(evaluation))

  /**
   * scroll element
   */
  const previewWrapperRef = useRef()

  return (
    <HorizontalScrollContext.Provider
      value={{ getScrollElement: () => previewWrapperRef.current }}
    >
      <StyledPaperWrapper
        data-cy="matchListPreview"
        style={{
          fontSize,
          overflowX: isPrintPreview ? 'hidden' : 'auto',
          margin: 'auto',
          width: '100%',
        }}
        padding={smallSize}
        ref={previewWrapperRef}
        boxShadow={smallSize ? 'none' : ''}
      >
        <FlexContainer justifyContent="flex-start" alignItems="baseline">
          <QuestionLabelWrapper>
            {showQuestionNumber && (
              <QuestionNumberLabel>{item.qLabel}</QuestionNumberLabel>
            )}
            {item.qSubLabel && (
              <QuestionSubLabel>({item.qSubLabel})</QuestionSubLabel>
            )}
          </QuestionLabelWrapper>

          <QuestionContentWrapper showQuestionNumber={showQuestionNumber}>
            <QuestionTitleWrapper data-cy="questionTitle">
              {!smallSize && view === PREVIEW && (
                <Stimulus dangerouslySetInnerHTML={{ __html: stimulus }} />
              )}
            </QuestionTitleWrapper>
            <div
              data-cy="previewWrapper"
              style={wrapperStyle}
              className="match-list-preview-wrapper __no-flex-on-print"
            >
              <MatchList
                ans={ans}
                list={list}
                onDrop={onDrop}
                getStyles={getStyles}
                allItemsById={allItemsById}
                showEvaluate={showEvaluate}
                evaluation={evaluation}
                smallSize={smallSize}
                changePreviewTab={changePreviewTab}
                listPosition={listPosition}
                isPrintPreview={isPrintPreview}
                stemNumeration={stemNumeration}
                disableResponse={disableResponse}
                previewTab={previewTab}
                isAnswerModifiable={isAnswerModifiable}
                hideEvaluation={hideEvaluation}
              />

              {!disableResponse && (
                <PossibleResponses
                  t={t}
                  isPrintPreview={isPrintPreview}
                  dragItems={dragItems}
                  onDrop={onDrop}
                  getStyles={getStyles}
                  disableResponse={disableResponse}
                  groupPossibleResponses={groupPossibleResponses}
                  possibleResponseGroups={possibleResponseGroups}
                  groupedPossibleResponses={groupedPossibleResponses}
                  horizontallyAligned={horizontallyAligned}
                  dragItemMaxWidth={dragItemMaxWidth}
                  isAnswerModifiable={isAnswerModifiable}
                  changePreviewTab={changePreviewTab}
                  shuffleOptions={shuffleOptions}
                  previewTab={previewTab}
                />
              )}
            </div>
            {view === 'edit' && (
              <FlexContainer>
                <CheckboxLabel
                  className="additional-options"
                  key={`shuffleOptions_${item.shuffleOptions}`}
                  onChange={handleShuffleChange}
                  checked={item.shuffleOptions}
                  data-cy="shuffleOptions"
                >
                  {t('component.cloze.dragDrop.shuffleoptions')}
                </CheckboxLabel>
                <CheckboxLabel
                  className="additional-options"
                  key="duplicatedResponses"
                  onChange={handleDuplicatedResponsesChange}
                  checked={!!item.duplicatedResponses}
                  data-cy="duplicatedResponses"
                >
                  {t('component.matchList.duplicatedResponses')}
                </CheckboxLabel>
              </FlexContainer>
            )}
            <div style={{ ...wrapperStyle, alignItems: 'flex-start' }}>
              {view !== EDIT && <Instructions item={item} />}
            </div>
            {(previewTab === SHOW || isReviewTab) && !hideCorrectAnswer ? (
              <CorrectAnswers
                t={t}
                list={list}
                showAnswerScore={showAnswerScore}
                validRespScore={validRespScore}
                altRespScores={altRespScores}
                alternateAnswers={alternateAnswers}
                smallSize={smallSize}
                allItemsById={allItemsById}
                validResponse={validResponse}
                isPrintPreview={isPrintPreview}
                horizontallyAligned={horizontallyAligned}
                stemNumeration={stemNumeration}
              />
            ) : null}
          </QuestionContentWrapper>
        </FlexContainer>
        <DragPreview />
      </StyledPaperWrapper>
    </HorizontalScrollContext.Provider>
  )
}

MatchListPreview.propTypes = {
  previewTab: PropTypes.string,
  t: PropTypes.func.isRequired,
  smallSize: PropTypes.bool,
  item: PropTypes.object.isRequired,
  saveAnswer: PropTypes.func.isRequired,
  view: PropTypes.string.isRequired,
  userAnswer: PropTypes.array,
  theme: PropTypes.object.isRequired,
  showQuestionNumber: PropTypes.bool,
  disableResponse: PropTypes.bool,
  setQuestionData: PropTypes.func.isRequired,
  changePreview: PropTypes.func.isRequired,
  changePreviewTab: PropTypes.func.isRequired,
  windowWidth: PropTypes.string.isRequired,
  evaluation: PropTypes.object,
  isReviewTab: PropTypes.bool,
  hideEvaluation: PropTypes.bool,
}

MatchListPreview.defaultProps = {
  previewTab: CLEAR,
  smallSize: false,
  userAnswer: [],
  evaluation: {},
  showQuestionNumber: false,
  disableResponse: false,
  isReviewTab: false,
  hideEvaluation: false,
}

const enhance = compose(
  withNamespaces('assessment'),
  withWindowSizes,
  withTheme,
  connect(
    (state, ownProps) => ({
      optionsFromStore:
        state.assessmentPlayer?.[ownProps?.item.id || ''] || null,
    }),
    {
      setQuestionData: setQuestionDataAction,
      updateOptionsToStore: storeOrderInRedux,
    }
  )
)

export default enhance(MatchListPreview)
