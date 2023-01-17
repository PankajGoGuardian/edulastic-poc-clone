import React, { Fragment, useEffect, useContext, useMemo } from 'react'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import { compose } from 'redux'
import { isEmpty } from 'lodash'
import { WithResources, AnswerContext } from '@edulastic/common'
import { withNamespaces } from '@edulastic/localization'
import { setQuestionDataAction } from '../../../author/QuestionEditor/ducks'
import { StyledPaperWrapper } from '../../styled/Widget'
import AppConfig from '../../../../app-config'
import { replaceVariables } from '../../utils/variables'
import Authoring from './Authoring'
import Display from './Display'
import {
  EDIT,
  PREVIEW,
  SHOW,
  CLEAR,
  CHECK,
} from '../../constants/constantsForQuestions'
import { subOptions, displayStyles } from './constants'

const EmptyWrapper = Fragment

const getRenderData = (templateItem, history, view) => {
  const itemForPreview = replaceVariables(templateItem)
  const item = view === 'edit' ? templateItem : replaceVariables(templateItem)

  const locationState = history.location.state
  const isDetailPage =
    locationState !== undefined ? locationState.itemDetail : false
  // keep this in check
  const previewDisplayOptions = item.hasGroupResponses
    ? item.groupResponses
    : item.options
  let previewStimulus
  let itemForEdit
  if (item.smallSize || isDetailPage) {
    previewStimulus = item.stimulus
    itemForEdit = templateItem
  } else {
    previewStimulus = item.stimulus
    itemForEdit = {
      ...templateItem,
      stimulus: templateItem.stimulus,
      list: templateItem.options,
      validation: templateItem.validation,
    }
  }
  return {
    previewStimulus,
    previewDisplayOptions,
    itemForEdit,
    itemForPreview,
    uiStyle: item.uiStyle,
    instantFeedback: item.instant_feedback,
    instructorStimulus: item.instructorStimulus,
  }
}

const EditingTask = ({
  view,
  previewTab,
  smallSize,
  item,
  userAnswer,
  t,
  history,
  testItem,
  evaluation,
  fillSections,
  cleanSections,
  advancedAreOpen,
  advancedLink,
  setQuestionData,
  saveAnswer,
  isPrintPreview,
  isPrint,
  ...restProps
}) => {
  const answerContext = useContext(AnswerContext)

  const handleAddAnswer = (answers) => {
    saveAnswer(answers)
  }
  const { responseIds, displayStyle } = item
  const Wrapper = testItem ? EmptyWrapper : StyledPaperWrapper
  const {
    previewStimulus,
    previewDisplayOptions,
    itemForPreview,
    uiStyle,
  } = getRenderData(item, history, view)
  const { expressGrader, isAnswerModifiable } = answerContext
  const isShowAnswer = previewTab === SHOW && !expressGrader
  const isPreview =
    previewTab === CLEAR || (isAnswerModifiable && expressGrader)
  const isCheckAnswer =
    previewTab === CHECK || (expressGrader && !isAnswerModifiable)
  const isExpressGrader = expressGrader && previewTab === SHOW

  const hasUserAnswer = useMemo(
    () =>
      responseIds?.some(
        ({ id: responseId }) => !isEmpty(userAnswer[responseId])
      ),
    [responseIds, userAnswer]
  )
  useEffect(() => {
    // Fix me: We might not require this for display type input
    // don’t re-initialize user response when already exists
    if (hasUserAnswer) {
      return
    }

    if (
      isPreview &&
      !isPrint &&
      !isPrintPreview &&
      displayStyle?.option !== subOptions.EMPTY &&
      displayStyle?.type !== displayStyles.TEXT_INPUT
    ) {
      const initialAnswers = {}
      responseIds.forEach((response) => {
        const opts = previewDisplayOptions?.[response.id] || []
        initialAnswers[response.id] = opts[0] || ''
      })
      handleAddAnswer(initialAnswers)
    }
  }, [view])

  return (
    <WithResources resources={[AppConfig.jqueryPath]} fallBack={<span />}>
      {view === EDIT && (
        <Authoring
          item={item}
          advancedLink={advancedLink}
          advancedAreOpen={advancedAreOpen}
          fillSections={fillSections}
          cleanSections={cleanSections}
          setQuestionData={setQuestionData}
          previewData={{
            previewDisplayOptions,
            itemForPreview,
            previewStimulus,
          }}
        />
      )}
      {view === PREVIEW && (
        <Wrapper>
          <Display
            showAnswer={isShowAnswer}
            preview={isPreview}
            checkAnswer={isCheckAnswer}
            item={itemForPreview}
            smallSize={smallSize}
            options={previewDisplayOptions}
            stimulus={previewStimulus}
            uiStyle={uiStyle}
            userAnswer={userAnswer}
            userSelections={userAnswer}
            onChange={handleAddAnswer}
            evaluation={evaluation}
            isExpressGrader={isExpressGrader}
            previewTab={previewTab}
            isPrintPreview={isPrintPreview}
            isPrint={isPrint}
            {...restProps}
          />
        </Wrapper>
      )}
    </WithResources>
  )
}

EditingTask.propTypes = {
  view: PropTypes.string.isRequired,
  previewTab: PropTypes.string,
  item: PropTypes.object,
  smallSize: PropTypes.bool,
  history: PropTypes.object,
  setQuestionData: PropTypes.func.isRequired,
  saveAnswer: PropTypes.func.isRequired,
  userAnswer: PropTypes.object,
  t: PropTypes.func.isRequired,
  testItem: PropTypes.bool,
  evaluation: PropTypes.any.isRequired,
  fillSections: PropTypes.func,
  cleanSections: PropTypes.func,
  advancedLink: PropTypes.any,
  advancedAreOpen: PropTypes.bool,
}

EditingTask.defaultProps = {
  previewTab: 'clear',
  item: { options: [] },
  smallSize: false,
  history: {},
  userAnswer: {},
  testItem: false,
  advancedAreOpen: false,
  advancedLink: null,
  fillSections: () => {},
  cleanSections: () => {},
}

const enhance = compose(
  withRouter,
  withNamespaces('assessment'),
  connect(null, { setQuestionData: setQuestionDataAction })
)

const EditingTaskContainer = enhance(EditingTask)

export { EditingTaskContainer as ClozeEditingTask }
