import React, { useContext } from 'react'
import PropTypes from 'prop-types'
import {
  WithResources,
  AnswerContext,
  QuestionNumberLabel,
  MathKeyboard,
  FlexContainer,
  QuestionLabelWrapper,
  QuestionSubLabel,
  QuestionContentWrapper,
} from '@edulastic/common'
import { compose } from 'redux'
import { connect } from 'react-redux'
import produce from 'immer'
import { get, cloneDeep, find, orderBy } from 'lodash'
import { withTutorial } from '../../../tutorials/withTutorial'
import { CLEAR, PREVIEW, EDIT } from '../../constants/constantsForQuestions'
import ClozeMathAnswers from './ClozeMathAnswers'
import ClozeMathPreview from './ClozeMathPreview'
import MathFormulaOptions from '../MathFormula/components/MathFormulaOptions'
import { checkAnswerAction } from '../../../author/src/actions/testItem'
import { setQuestionDataAction } from '../../../author/src/actions/question'
import { setDropDownInUseAction } from '../../../student/Sidebar/ducks'
import { changePreviewAction } from '../../../author/src/actions/view'
import { ContentArea } from '../../styled/ContentArea'

import { replaceVariables, updateVariables } from '../../utils/variables'

// import ComposeQuestion from "./ComposeQuestion";
import Template from './Template'
import ChoicesForDropDown from './ChoicesForDropDown'
import { StyledPaperWrapper } from '../../styled/Widget'
import { StyledClozeMathWrapper } from './styled/StyledClozeMathWrapper'
import AppConfig from '../../../../app-config'
import Question from '../../components/Question'
import QuestionOptions from '../ClozeImageDropDown/QuestionOptions'
import { latexKeys } from './constants'

const ClozeMath = ({
  view,
  previewTab,
  item,
  setQuestionData,
  saveAnswer,
  checkAnswer,
  evaluation,
  userAnswer,
  fillSections,
  cleanSections,
  advancedAreOpen,
  instructorStimulus,
  showQuestionNumber,
  flowLayout,
  advancedLink,
  t,
  isPrint,
  isPrintPreview,
  ...restProps
}) => {
  const answerContextConfig = useContext(AnswerContext)
  let actualPreviewMode = previewTab
  if (
    answerContextConfig.expressGrader &&
    !answerContextConfig.isAnswerModifiable
  ) {
    actualPreviewMode = 'check'
  } else if (
    answerContextConfig.expressGrader &&
    answerContextConfig.isAnswerModifiable
  ) {
    actualPreviewMode = 'clear'
  }

  const { col } = restProps
  const _itemChange = (prop, uiStyle) => {
    const newItem = produce(item, (draft) => {
      draft[prop] = uiStyle
      updateVariables(draft)
    })

    setQuestionData(newItem)
  }

  const _setQuestionData = (newItem) => {
    setQuestionData(
      produce(newItem, (draft) => {
        updateVariables(draft)
      })
    )
  }

  const handleKeypadMode = (keypad) => {
    setQuestionData(
      produce(item, (draft) => {
        const symbols = cloneDeep(draft.symbols)
        symbols[0] = keypad
        draft.symbols = symbols
        updateVariables(draft)
      })
    )
  }

  const itemForPreview = replaceVariables(item, latexKeys)

  const isV1Multipart = get(col, 'isV1Multipart', false)
  const { qLabel, isV1Migrated = false, qSubLabel } = item
  let options = []
  let allOptions = []
  if (isPrint || isPrintPreview) {
    const { mathUnits, dropDowns } = item.responseIds
    const dropdownOptions =
      dropDowns?.map((d) => ({ ...d, type: 'dropdown' })) || []
    const mathunitOptions =
      mathUnits?.map((m) => ({ ...m, type: 'mathunit' })) || []
    allOptions = orderBy([...dropdownOptions, ...mathunitOptions], ['index'])
    options = allOptions.map((o) => {
      if (o.type === 'dropdown') {
        return item.options[o.id]
      }
      const { keypadMode, customUnits } =
        find(item.responseIds.mathUnits, (res) => res.id === o.id) || {}
      let otherOptions = MathKeyboard.KEYBOARD_BUTTONS.filter((btn) =>
        btn.types.includes(keypadMode)
      ).map((b) => b.label)

      if (keypadMode === 'custom') {
        otherOptions = customUnits.split(',').filter((u) => !!u)
      }
      return otherOptions
    })
  }

  return (
    <WithResources
      criticalResources={[AppConfig.jqueryPath]}
      resources={[
        `${AppConfig.mathquillPath}/mathquill.css`,
        `${AppConfig.mathquillPath}/mathquill.min.js`,
      ]}
      fallBack={<span />}
      onLoaded={() => {}}
    >
      <StyledClozeMathWrapper>
        <FlexContainer
          justifyContent="flex-start"
          alignItems="baseline"
          width="100%"
        >
          <QuestionLabelWrapper>
            {!flowLayout
              ? showQuestionNumber && (
                  <QuestionNumberLabel>{qLabel}</QuestionNumberLabel>
                )
              : null}
            {qSubLabel && <QuestionSubLabel>({qSubLabel})</QuestionSubLabel>}
          </QuestionLabelWrapper>
          <QuestionContentWrapper className="__question-content-wrapper">
            {view === PREVIEW && (
              <StyledPaperWrapper
                isV1Multipart={isV1Multipart}
                style={{
                  height: '100%',
                  width: '100%',
                  'max-width': '100%',
                  flex: 'auto',
                }}
              >
                <ClozeMathPreview
                  type={actualPreviewMode}
                  isExpressGrader={answerContextConfig.expressGrader}
                  item={itemForPreview}
                  stimulus={itemForPreview.stimulus}
                  options={itemForPreview.options || {}}
                  responseIds={item.responseIds}
                  saveAnswer={saveAnswer}
                  check={checkAnswer}
                  userAnswer={userAnswer}
                  evaluation={evaluation}
                  isV1Migrated={isV1Migrated}
                  isPrintPreview={isPrint || isPrintPreview}
                  allOptions={allOptions}
                  {...restProps}
                />
              </StyledPaperWrapper>
            )}
            {(isPrint || isPrintPreview) && (
              <QuestionOptions
                options={options}
                style={{ marginTop: '50px' }}
              />
            )}
            {view === EDIT && (
              <ContentArea data-cy="question-area">
                <Template
                  item={item}
                  setQuestionData={_setQuestionData}
                  fillSections={fillSections}
                  cleanSections={cleanSections}
                />

                <ChoicesForDropDown
                  item={item}
                  fillSections={fillSections}
                  cleanSections={cleanSections}
                />

                <Question
                  section="main"
                  label={t('component.math.correctAnswers')}
                  fillSections={fillSections}
                  cleanSections={cleanSections}
                >
                  <ClozeMathAnswers
                    id="answers"
                    item={item}
                    setQuestionData={_setQuestionData}
                    fillSections={fillSections}
                    cleanSections={cleanSections}
                    onChangeKeypad={handleKeypadMode}
                    t={t}
                  />
                </Question>

                {advancedLink}

                <MathFormulaOptions
                  onChange={_itemChange}
                  uiStyle={item.uiStyle}
                  item={item}
                  responseContainers={item.responseContainers}
                  customKeys={item.customKeys}
                  stimulusReview={item.stimulusReview}
                  metadata={item.metadata}
                  advancedAreOpen={advancedAreOpen}
                  showResponseBoxes
                  fillSections={fillSections}
                  cleanSections={cleanSections}
                />
              </ContentArea>
            )}
          </QuestionContentWrapper>
        </FlexContainer>
      </StyledClozeMathWrapper>
    </WithResources>
  )
}

ClozeMath.propTypes = {
  view: PropTypes.string.isRequired,
  setQuestionData: PropTypes.func.isRequired,
  t: PropTypes.func.isRequired,
  saveAnswer: PropTypes.func.isRequired,
  checkAnswer: PropTypes.func.isRequired,
  userAnswer: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
  evaluation: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
  previewTab: PropTypes.string,
  item: PropTypes.object,
  fillSections: PropTypes.func,
  cleanSections: PropTypes.func,
  advancedAreOpen: PropTypes.bool,
  instructorStimulus: PropTypes.string.isRequired,
  showQuestionNumber: PropTypes.bool,
  flowLayout: PropTypes.bool,
  advancedLink: PropTypes.any,
}

ClozeMath.defaultProps = {
  previewTab: CLEAR,
  userAnswer: [],
  item: {},
  evaluation: [],
  advancedAreOpen: false,
  fillSections: () => {},
  cleanSections: () => {},
  showQuestionNumber: false,
  flowLayout: false,
  advancedLink: null,
}

const enhance = compose(
  withTutorial('clozeMath'),
  connect(
    (state) => ({
      enableMagnifier: state.testPlayer.enableMagnifier,
    }),
    {
      setQuestionData: setQuestionDataAction,
      checkAnswer: checkAnswerAction,
      changePreview: changePreviewAction,
      setDropDownInUse: setDropDownInUseAction,
    }
  )
)

export default enhance(ClozeMath)
