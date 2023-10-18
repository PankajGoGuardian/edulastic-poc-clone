import React, { Fragment, useMemo, useState, useContext } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { compose } from 'redux'
import { connect } from 'react-redux'
import produce from 'immer'

import { AnswerContext } from '@edulastic/common'
import { withNamespaces } from '@edulastic/localization'
import { setQuestionDataAction } from '../../../author/QuestionEditor/ducks'
import { checkAnswerAction } from '../../../author/src/actions/testItem'
import { changePreviewAction } from '../../../author/src/actions/view'
import { replaceVariables, updateVariables } from '../../utils/variables'

import { ContentArea } from '../../styled/ContentArea'

import { CLEAR, PREVIEW, EDIT } from '../../constants/constantsForQuestions'
import { latexKeys } from './constants'

import MathFormulaAnswers from './MathFormulaAnswers'
import MathFormulaOptions from './components/MathFormulaOptions'
import MathFormulaPreview from './MathFormulaPreview'
import ComposeQuestion from './ComposeQuestion'
import Template from './Template'
import { StyledPaperWrapper } from '../../styled/Widget'
import Question from '../../components/Question'

const EmptyWrapper = styled.div``

const MathFormula = ({
  view,
  testItem,
  previewTab,
  item,
  evaluation,
  setQuestionData,
  saveAnswer,
  smallSize,
  userAnswer,
  advancedAreOpen,
  fillSections,
  cleanSections,
  advancedLink,
  changePreview,
  t,
  ...restProps
}) => {
  const answerContextConfig = useContext(AnswerContext)
  const [keypadOffset, setOffset] = useState(0)
  const Wrapper = testItem ? EmptyWrapper : StyledPaperWrapper

  const handleItemChangeChange = (prop, uiStyle) => {
    setQuestionData(
      produce(item, (draft) => {
        draft[prop] = uiStyle
        updateVariables(draft, latexKeys)
      })
    )
  }

  const itemForPreview = useMemo(() => replaceVariables(item, latexKeys), [
    item,
  ])
  const studentTemplate =
    itemForPreview.templateDisplay &&
    itemForPreview.template &&
    itemForPreview.template.replace(
      /\\embed\{response\}/g,
      '\\MathQuillMathField{}'
    )

  return (
    <>
      {view === EDIT && (
        <ContentArea data-cy="question-content-area">
          <ComposeQuestion
            item={item}
            setQuestionData={setQuestionData}
            fillSections={fillSections}
            cleanSections={cleanSections}
          />
          {item.templateDisplay && (
            <Template
              item={item}
              setQuestionData={setQuestionData}
              fillSections={fillSections}
              cleanSections={cleanSections}
              view={view}
            />
          )}
          <Question
            section="main"
            label={t('component.math.correctAnswers')}
            fillSections={fillSections}
            cleanSections={cleanSections}
          >
            <MathFormulaAnswers
              item={item}
              setQuestionData={setQuestionData}
              keypadOffset={keypadOffset}
              fillSections={fillSections}
              cleanSections={cleanSections}
              view={view}
            />
          </Question>

          {advancedLink}

          <MathFormulaOptions
            onChange={handleItemChangeChange}
            uiStyle={item.uiStyle}
            item={item}
            responseContainers={item.responseContainers}
            customKeys={item.customKeys}
            stimulusReview={item.stimulusReview}
            metadata={item.metadata}
            advancedAreOpen={advancedAreOpen}
            setKeyPadOffest={setOffset}
            fillSections={fillSections}
            cleanSections={cleanSections}
          />
        </ContentArea>
      )}
      {view === PREVIEW && (
        <Wrapper height="100%" overflow="visible">
          <MathFormulaPreview
            type={previewTab}
            testItem={testItem}
            studentTemplate={studentTemplate}
            item={itemForPreview}
            saveAnswer={saveAnswer}
            evaluation={evaluation}
            smallSize={smallSize}
            userAnswer={userAnswer}
            fillSections={fillSections}
            cleanSections={cleanSections}
            changePreview={changePreview}
            answerContextConfig={answerContextConfig}
            view={view}
            {...restProps}
          />
        </Wrapper>
      )}
    </>
  )
}

MathFormula.propTypes = {
  view: PropTypes.string.isRequired,
  changePreview: PropTypes.func.isRequired,
  setQuestionData: PropTypes.func.isRequired,
  changeView: PropTypes.func.isRequired,
  saveAnswer: PropTypes.func.isRequired,
  previewTab: PropTypes.string,
  testItem: PropTypes.bool,
  item: PropTypes.object,
  evaluation: PropTypes.any.isRequired,
  userAnswer: PropTypes.any,
  smallSize: PropTypes.bool,
  advancedLink: PropTypes.any,
  advancedAreOpen: PropTypes.bool,
  fillSections: PropTypes.func,
  cleanSections: PropTypes.func,
}

MathFormula.defaultProps = {
  previewTab: CLEAR,
  testItem: false,
  item: {},
  userAnswer: null,
  smallSize: false,
  advancedLink: null,
  advancedAreOpen: false,
  fillSections: () => {},
  cleanSections: () => {},
}

const enhance = compose(
  withNamespaces('assessment'),
  connect(null, {
    setQuestionData: setQuestionDataAction,
    checkAnswer: checkAnswerAction,
    changePreview: changePreviewAction,
  })
)

const MathFormulaContainer = enhance(MathFormula)

export { MathFormulaContainer as MathFormula }
