import PropTypes from 'prop-types'
import React, { Component } from 'react'
import produce from 'immer'
import {
  isUndefined,
  mapValues,
  cloneDeep,
  findIndex,
  find,
  get,
  orderBy,
} from 'lodash'
import styled, { withTheme } from 'styled-components'
import JsxParser from 'react-jsx-parser/lib/react-jsx-parser.min'

import {
  helpers,
  Stimulus,
  QuestionNumberLabel,
  FlexContainer,
  QuestionLabelWrapper,
  QuestionContentWrapper,
  QuestionSubLabel,
} from '@edulastic/common'
import { getLatexValueFromMathTemplate } from '@edulastic/common/src/utils/mathUtils'

import DisplayOptions from '../ClozeImageDropDown/QuestionOptions'

import { EDIT } from '../../constants/constantsForQuestions'

import CorrectAnswerBoxLayout from './components/CorrectAnswerBoxLayout'
import { getFontSize } from '../../utils/helpers'

import CheckboxTemplateBoxLayout from './components/CheckboxTemplateBoxLayout'
import { withCheckAnswerButton } from '../../components/HOC/withCheckAnswerButton'
import MathSpanWrapper from '../../components/MathSpanWrapper'
import Instructions from '../../components/Instructions'
import ChoicesBox from './ChoicesBox'

class ClozeDropDownDisplay extends Component {
  state = {
    parsedTemplate: '',
  }

  static getDerivedStateFromProps({
    stimulus,
    isVideoQuiz,
    isLCBView,
    isExpressGrader,
  }) {
    const shouldAppendResponseBox =
      (isLCBView || isExpressGrader) && isVideoQuiz

    return {
      parsedTemplate: helpers.parseTemplate(stimulus, shouldAppendResponseBox),
    }
  }

  componentDidMount() {
    const { stimulus, isVideoQuiz, isLCBView, isExpressGrader } = this.props
    const shouldAppendResponseBox =
      (isLCBView || isExpressGrader) && isVideoQuiz
    this.setState({
      parsedTemplate: helpers.parseTemplate(stimulus, shouldAppendResponseBox),
    })
  }

  selectChange = (value, index, id) => {
    const _value = getLatexValueFromMathTemplate(value) || value
    const {
      onChange: changeAnswers,
      userSelections,
      item: { responseIds },
    } = this.props
    changeAnswers(
      produce(userSelections, (draft) => {
        // answers are null for all the lower indices if a higher index is answered
        // TODO fix the way answers are stored
        const changedIndex = findIndex(
          draft,
          (answer = {}) => answer?.id === id
        )
        draft[index] = _value
        if (changedIndex !== -1) {
          draft[changedIndex] = { value: _value, index, id }
        } else {
          const response = find(responseIds, (res) => res.id === id)
          draft[response.index] = { value: _value, index, id }
        }
      })
    )
  }

  shuffle = (arr) => {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[arr[i], arr[j]] = [arr[j], arr[i]]
    }
    return arr
  }

  shuffleGroup = (data) =>
    mapValues(data, (value, key) => {
      if (!isUndefined(value)) {
        data[key] = this.shuffle(value)
      }
      data[key] = value
      return data[key]
    })

  getBtnStyle = () => {
    const { uiStyle } = this.props
    const responseBtnStyle = {
      widthpx: uiStyle.widthpx !== 0 ? uiStyle.widthpx : 'auto',
      heightpx: uiStyle.heightpx !== 0 ? uiStyle.heightpx : 'auto',
    }

    const btnStyle = {
      width: 0,
      height: 0,
      widthpx: 0,
      heightpx: 0,
    }

    if (btnStyle && btnStyle.width === 0) {
      btnStyle.width = responseBtnStyle.widthpx
    } else {
      btnStyle.width = btnStyle.widthpx
    }
    if (btnStyle && btnStyle.height === 0) {
      btnStyle.height = responseBtnStyle.heightpx
    } else {
      btnStyle.height = btnStyle.heightpx
    }
    return { btnStyle, responseBtnStyle }
  }

  render() {
    const {
      qIndex,
      smallSize,
      question,
      configureOptions,
      preview,
      options,
      uiStyle,
      showAnswer,
      checkAnswer,
      evaluation,
      item,
      disableResponse,
      showQuestionNumber,
      userSelections,
      isReviewTab,
      isExpressGrader,
      theme,
      previewTab,
      changePreviewTab,
      view,
      isPrint,
      isPrintPreview,
      hideCorrectAnswer,
      answerScore,
      setDropDownInUse,
      showAnswerScore,
    } = this.props

    const { parsedTemplate } = this.state
    const { shuffleOptions } = configureOptions
    let responses = cloneDeep(options)
    if (preview && shuffleOptions) {
      responses = this.shuffleGroup(responses)
    }
    // Layout Options
    const fontSize = theme.fontSize || getFontSize(uiStyle.fontsize, true)
    const {
      placeholder,
      responsecontainerindividuals = [],
      stemNumeration,
    } = uiStyle
    const { btnStyle, responseBtnStyle } = this.getBtnStyle()
    let maxLineHeight = smallSize ? 50 : 40
    maxLineHeight =
      maxLineHeight < btnStyle.height ? btnStyle.height : maxLineHeight

    const answerBox =
      (showAnswer || isExpressGrader) && !hideCorrectAnswer ? (
        <>
          <CorrectAnswerBoxLayout
            fontSize={fontSize}
            groupResponses={options}
            userAnswers={
              item.validation.validResponse &&
              item.validation.validResponse.value
            }
            responseIds={item.responseIds}
            stemNumeration={stemNumeration}
            showAnswerScore={showAnswerScore}
            score={item?.validation?.validResponse?.score}
          />
          {item?.validation?.altResponses?.map((ans, index) => {
            return (
              <CorrectAnswerBoxLayout
                altAnswers
                altIndex={index + 1}
                fontSize={fontSize}
                groupResponses={options}
                userAnswers={ans.value}
                responseIds={item.responseIds}
                stemNumeration={stemNumeration}
                showAnswerScore={showAnswerScore}
                score={ans?.score}
              />
            )
          })}
        </>
      ) : (
        <div />
      )
    const resProps = {
      item,
      btnStyle,
      showAnswer,
      isPrint,
      isPrintPreview,
      isReviewTab,
      placeholder,
      disableResponse,
      responseBtnStyle,
      options: responses,
      onChange: this.selectChange,
      stemNumeration,
      previewTab,
      changePreviewTab,
      responsecontainerindividuals,
      cAnswers: get(item, 'validation.validResponse.value', []),
      userSelections:
        item && item.activity && item.activity.userResponse
          ? item.activity.userResponse
          : userSelections,
      evaluation:
        item && item.activity && item.activity.evaluation
          ? item.activity.evaluation
          : evaluation,
      answerScore,
      setDropDownInUse,
    }
    const displayOptions = orderBy(item.responseIds, ['index']).map(
      (option) => options[option.id]
    )
    const questionContent = (
      <ContentWrapper view={view} fontSize={fontSize}>
        <JsxParser
          disableKeyGeneration
          bindings={{ resProps, lineHeight: `${maxLineHeight}px` }}
          showWarnings
          components={{
            textdropdown:
              showAnswer || checkAnswer || isPrint || isPrintPreview
                ? CheckboxTemplateBoxLayout
                : ChoicesBox,
            mathspan: MathSpanWrapper,
          }}
          jsx={parsedTemplate}
        />
      </ContentWrapper>
    )

    return (
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

        <QuestionContentWrapper showQuestionNumber={showQuestionNumber}>
          <QuestionTitleWrapper data-cy="questionStimulus">
            {!!question && (
              <Stimulus
                qIndex={qIndex}
                smallSize={smallSize}
                dangerouslySetInnerHTML={{ __html: question }}
              />
            )}
            {!question && questionContent}
          </QuestionTitleWrapper>
          {question && questionContent}
          {(isPrint || isPrintPreview) && (
            <DisplayOptions
              options={displayOptions}
              responseIds={item.responseIds}
              style={{ marginTop: '50px' }}
            />
          )}
          {view !== EDIT && <Instructions item={item} />}
          {answerBox}
        </QuestionContentWrapper>
      </FlexContainer>
    )
  }
}

ClozeDropDownDisplay.propTypes = {
  options: PropTypes.object,
  onChange: PropTypes.func,
  preview: PropTypes.bool,
  showAnswer: PropTypes.bool,
  userSelections: PropTypes.array,
  smallSize: PropTypes.bool,
  checkAnswer: PropTypes.bool,
  isPrint: PropTypes.bool,
  stimulus: PropTypes.string,
  question: PropTypes.string.isRequired,
  configureOptions: PropTypes.object,
  evaluation: PropTypes.array,
  uiStyle: PropTypes.object,
  changePreviewTab: PropTypes.func.isRequired,
  previewTab: PropTypes.func.isRequired,
  item: PropTypes.object.isRequired,
  disableResponse: PropTypes.bool,
  qIndex: PropTypes.number,
  isExpressGrader: PropTypes.bool,
  isReviewTab: PropTypes.bool,
  showQuestionNumber: PropTypes.bool,
  theme: PropTypes.object,
  view: PropTypes.string.isRequired,
}

ClozeDropDownDisplay.defaultProps = {
  options: {},
  theme: {},
  onChange: () => {},
  preview: true,
  showAnswer: false,
  evaluation: [],
  checkAnswer: false,
  userSelections: [],
  isPrint: false,
  stimulus: '',
  disableResponse: false,
  smallSize: false,
  configureOptions: {
    shuffleOptions: false,
  },
  uiStyle: {
    fontsize: 'normal',
    stemNumeration: 'numerical',
    widthpx: 0,
    heightpx: 0,
    placeholder: null,
    responsecontainerindividuals: [],
  },
  showQuestionNumber: false,
  isReviewTab: false,
  isExpressGrader: false,
  qIndex: null,
}

export default withTheme(withCheckAnswerButton(ClozeDropDownDisplay))

const QuestionTitleWrapper = styled.div`
  display: flex;
  width: 100%;

  iframe {
    max-width: 100%;
  }
`

const ContentWrapper = styled.div`
  padding: ${(props) => (props.view === EDIT ? 15 : 0)}px;
  border: ${(props) =>
    props.view === EDIT
      ? `solid 1px ${props.theme.widgets.clozeText.questionContainerBorderColor}`
      : null};
  border-radius: ${(props) => (props.view === EDIT ? 10 : 0)}px;
  width: 100%;

  p {
    font-size: ${({ fontSize }) => fontSize || 'auto'};
  }
`
