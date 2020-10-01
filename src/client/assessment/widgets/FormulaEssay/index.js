import React, { Fragment, useMemo } from 'react'
import PropTypes from 'prop-types'
import { compose } from 'redux'
import { isEmpty } from 'lodash'
import { connect } from 'react-redux'
import uuidv4 from 'uuid/v4'
import styled from 'styled-components'
import produce from 'immer'

import { withNamespaces } from '@edulastic/localization'
import { setQuestionDataAction } from '../../../author/QuestionEditor/ducks'
import { checkAnswerAction } from '../../../author/src/actions/testItem'
import { replaceVariables, updateVariables } from '../../utils/variables'

import { CLEAR, PREVIEW, EDIT } from '../../constants/constantsForQuestions'

import { ContentArea } from '../../styled/ContentArea'

import FormulaEssayPreview from './components/FormulaEssayPreview'
import FormulaEssayOptions from './components/FormulaEssayOptions'
import ComposeQuestion from './ComposeQuestion'
import TextFormattingOptions from './TextFormattingOptions'
import { StyledPaperWrapper } from '../../styled/Widget'

const EmptyWrapper = styled.div``

const FormulaEssay = ({
  view,
  previewTab,
  item,
  testItem,
  setQuestionData,
  smallSize,
  userAnswer,
  saveAnswer,
  advancedAreOpen,
  fillSections,
  cleanSections,
  disableResponse,
  advancedLink,
  ...restProps
}) => {
  const resetLines = () => {
    saveAnswer([
      {
        text: '',
        type: item.uiStyle && item.uiStyle.defaultMode,
        index: uuidv4(),
      },
    ])
  }

  const Wrapper = testItem ? EmptyWrapper : StyledPaperWrapper

  const handleItemChange = (prop, data) => {
    setQuestionData(
      produce(item, (draft) => {
        draft[prop] = data
        updateVariables(draft)
      })
    )
  }

  const handleSetLines = (plines) => saveAnswer(plines)

  const itemForPreview = useMemo(() => replaceVariables(item), [item])

  return (
    <>
      {view === EDIT && (
        <ContentArea>
          <ComposeQuestion
            item={item}
            setQuestionData={setQuestionData}
            fillSections={fillSections}
            cleanSections={cleanSections}
          />

          <TextFormattingOptions
            item={item}
            setQuestionData={setQuestionData}
            fillSections={fillSections}
            cleanSections={cleanSections}
          />

          {advancedLink}

          <FormulaEssayOptions
            onChange={handleItemChange}
            item={item}
            advancedAreOpen={advancedAreOpen}
            fillSections={fillSections}
            cleanSections={cleanSections}
          />
        </ContentArea>
      )}
      {view === PREVIEW && (
        <Wrapper style={{ height: '100%' }}>
          <FormulaEssayPreview
            disableResponse={disableResponse}
            key={itemForPreview.id}
            setLines={handleSetLines}
            resetLines={resetLines}
            type={previewTab}
            item={itemForPreview}
            smallSize={smallSize}
            lines={
              !isEmpty(userAnswer)
                ? userAnswer
                : [
                    {
                      text: '',
                      type: item.uiStyle && item.uiStyle.defaultMode,
                      index: uuidv4(),
                    },
                  ]
            }
            {...restProps}
          />
        </Wrapper>
      )}
    </>
  )
}

FormulaEssay.propTypes = {
  previewTab: PropTypes.string,
  view: PropTypes.string.isRequired,
  setQuestionData: PropTypes.func.isRequired,
  item: PropTypes.object,
  testItem: PropTypes.bool,
  smallSize: PropTypes.bool,
  userAnswer: PropTypes.any,
  advancedAreOpen: PropTypes.bool,
  fillSections: PropTypes.func,
  cleanSections: PropTypes.func,
  saveAnswer: PropTypes.func.isRequired,
  advancedLink: PropTypes.any,
  disableResponse: PropTypes.bool,
}

FormulaEssay.defaultProps = {
  disableResponse: false,
  previewTab: CLEAR,
  item: {},
  testItem: false,
  smallSize: false,
  userAnswer: null,
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
  })
)

const FormulaEssayContainer = enhance(FormulaEssay)

export { FormulaEssayContainer as FormulaEssay }
