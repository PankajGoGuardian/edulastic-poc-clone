import PropTypes from 'prop-types'
import styled, { withTheme } from 'styled-components'
import React, { Component, Fragment } from 'react'
import { cloneDeep, get } from 'lodash'
import uuid from 'uuid/v4'

import JsxParser from 'react-jsx-parser/lib/react-jsx-parser.min'
import {
  PreWrapper,
  helpers,
  QuestionNumberLabel,
  HorizontalScrollContext,
  DragDrop,
  FlexContainer,
  QuestionLabelWrapper,
  QuestionSubLabel,
  QuestionContentWrapper,
} from '@edulastic/common'
import { ChoiceDimensions } from '@edulastic/constants'

import CorrectAnswerBoxLayout from '../../components/CorrectAnswerBoxLayout'

import CheckboxTemplateBoxLayout from './components/CheckboxTemplateBoxLayout'
import ResponseBoxLayout from './components/ResponseBoxLayout'
import TemplateBox from './components/TemplateBox'
import { AnswerContainer } from './styled/AnswerContainer'
import { QuestionStimulusWrapper } from './styled/QuestionStimulus'
import { getFontSize } from '../../utils/helpers'
import MathSpanWrapper from '../../components/MathSpanWrapper'
import Instructions from '../../components/Instructions'
import { EDIT } from '../../constants/constantsForQuestions'

const { DragPreview } = DragDrop
const {
  maxWidth: choiceDefaultMaxW,
  minWidth: choiceDefaultMinW,
} = ChoiceDimensions
class ClozeDragDropDisplay extends Component {
  constructor(props) {
    super(props)
    const { stimulus } = props
    const respLength = this.getResponsesCount(stimulus)
    const userAnswers = new Array(respLength).fill(false)
    props.userSelections.map((userSelection, index) => {
      userAnswers[index] = userSelection
      return 0
    })
    const possibleResponses = this.getInitialResponses(props)

    this.state = {
      userAnswers,
      possibleResponses,
    }

    this.previewWrapperRef = React.createRef()
  }

  componentDidMount() {
    const { stimulus } = this.props
    this.setState({ parsedTemplate: helpers.parseTemplate(stimulus) })
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (this.state !== undefined) {
      const possibleResponses = this.getInitialResponses(nextProps)
      const parsedTemplate = helpers.parseTemplate(nextProps.stimulus)
      this.setState({
        userAnswers: nextProps.userSelections
          ? [...nextProps.userSelections]
          : [],
        possibleResponses,
        parsedTemplate,
      })
    }
  }

  getResponsesCount = (stimulus) => {
    if (!window.$) {
      return 0
    }
    const jQuery = window.$
    return jQuery(jQuery('<div />').html(stimulus)).find('response').length
  }

  onDrop = ({ data }, index) => {
    const { userAnswers: newAnswers, possibleResponses } = this.state
    const {
      onChange: changeAnswers,
      hasGroupResponses,
      userSelections,
      configureOptions,
      options,
      changePreviewTab,
      changePreview,
    } = this.props

    const { duplicatedResponses: isDuplicated } = configureOptions
    const newResponses = cloneDeep(possibleResponses)

    // Remove duplicated responses if duplicated option is disable
    if (!isDuplicated) {
      if (hasGroupResponses) {
        const groupIndex = data.split('_')[1]
        const groupData = data.split('_')[0]
        const sourceIndex = data.split('_')[2]
        const fromResp = data.split('_')[3]
        if (fromResp) {
          const temp = newAnswers[sourceIndex]
          newAnswers[sourceIndex] = newAnswers[index]
          newAnswers[index] = temp
        } else {
          for (let i = 0; i < newResponses[groupIndex].options.length; i++) {
            if (newResponses[groupIndex].options[i].value === groupData) {
              if (
                userSelections &&
                userSelections[index] !== null &&
                typeof userSelections[index] === 'object'
              ) {
                newResponses[userSelections[index].group].options.push({
                  value: uuid(),
                  label: userSelections[index].data,
                })
              }
              newResponses[groupIndex].options.splice(i, 1)
              break
            }
          }
        }
        newAnswers[index] = {
          group: groupIndex,
          data: groupData,
        }
      } else {
        const sourceIndex = data.split('_')[1]
        const sourceData = data.split('_')[0]
        const fromResp = data.split('_')[2]
        if (fromResp) {
          const temp = newAnswers[sourceIndex]
          newAnswers[sourceIndex] = newAnswers[index]
          newAnswers[index] = temp
        } else {
          newAnswers[index] = options.find(
            (option) => option.value === sourceData
          ).value
          for (let i = 0; i < newResponses.length; i++) {
            if (newResponses[i].value === sourceData) {
              newResponses.splice(i, 1)
              break
            }
          }
        }
      }
    } else if (hasGroupResponses) {
      const groupIndex = data.split('_')[1]
      const groupData = data.split('_')[0]
      const sourceIndex = data.split('_')[2]
      const fromResp = data.split('_')[3]

      if (fromResp) {
        const temp = newAnswers[sourceIndex]
        newAnswers[sourceIndex] = newAnswers[index]
        newAnswers[index] = temp
      }
      newAnswers[index] = {
        group: groupIndex,
        data: groupData,
      }
    } else {
      const value = data.split('_')[0]
      const sourceIndex = data.split('_')[1]
      const fromResp = data.split('_')[2]
      if (fromResp) {
        const temp = newAnswers[sourceIndex]
        newAnswers[sourceIndex] = newAnswers[index]
        newAnswers[index] = temp
      } else {
        newAnswers[index] = options.find(
          (option) => option.value === value
        ).value
        newResponses.splice(
          newResponses.indexOf((resp) => resp.value === value),
          1
        )
      }
    }

    this.setState({ userAnswers: newAnswers, possibleResponses: newResponses })
    changeAnswers(newAnswers)
    if (changePreview) {
      changePreview('clear') // Item level
    }
    changePreviewTab('clear') // Question level
  }

  shuffle = (arr) => {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[arr[i], arr[j]] = [arr[j], arr[i]]
    }
    return arr
  }

  shuffleGroup = (data) =>
    data.map((arr) => {
      arr.options = this.shuffle(arr.options)
      return arr
    })

  getInitialResponses = (props) => {
    const {
      hasGroupResponses,
      configureOptions,
      userSelections: userSelectionsProp,
      options,
    } = props
    const { duplicatedResponses: isDuplicated } = configureOptions
    const userSelections = userSelectionsProp || []

    let possibleResps = []
    possibleResps = cloneDeep(options)

    if (!isDuplicated) {
      if (hasGroupResponses) {
        userSelections.forEach((userSelection) => {
          if (userSelection !== null && typeof userSelection === 'object') {
            for (
              let i = 0;
              i < (possibleResps[userSelection?.group]?.options || []).length;
              i++
            ) {
              if (
                possibleResps[userSelection.group].options[i].value ===
                userSelection.data
              ) {
                possibleResps[userSelection.group].options.splice(i, 1)
                break
              }
            }
          }
        })
      } else {
        for (let j = 0; j < userSelections.length; j++) {
          for (let i = 0; i < possibleResps.length; i++) {
            if (possibleResps[i].value === userSelections[j]) {
              possibleResps.splice(i, 1)
              break
            }
          }
        }
      }
    }

    return possibleResps
  }

  getBtnStyles = () => {
    const { uiStyle } = this.props

    const btnStyle = {
      width: 0,
      height: 0,
      widthpx: 0,
      heightpx: 0,
      whiteSpace: undefined,
      wordwrap: undefined,
    }

    const responseBtnStyle = {
      widthpx: uiStyle.widthpx !== 0 ? uiStyle.widthpx : 140,
      heightpx: uiStyle.heightpx !== 0 ? uiStyle.heightpx : 32,
      whiteSpace: uiStyle.wordwrap ? 'inherit' : 'nowrap',
    }

    btnStyle.width = 'auto'

    if (btnStyle && btnStyle.height === 0) {
      btnStyle.height = responseBtnStyle.heightpx
    } else {
      btnStyle.height = btnStyle.heightpx
    }
    if (btnStyle && btnStyle.whiteSpace === undefined) {
      btnStyle.whiteSpace = responseBtnStyle.whiteSpace
    } else {
      btnStyle.whiteSpace = btnStyle.wordwrap
    }

    return { btnStyle, responseBtnStyle }
  }

  render() {
    const {
      smallSize,
      configureOptions,
      hasGroupResponses,
      preview,
      options,
      uiStyle,
      showAnswer,
      checkAnswer,
      validation,
      evaluation,
      item,
      theme,
      responseIDs,
      disableResponse,
      isReviewTab,
      flowLayout,
      showQuestionNumber,
      isExpressGrader,
      isPrintPreview,
      question,
      view,
      t,
      hideCorrectAnswer,
      answerScore,
      showAnswerScore,
    } = this.props
    const { userAnswers, possibleResponses, parsedTemplate } = this.state
    const { showDraghandle: dragHandler, shuffleOptions } = configureOptions

    const { btnStyle, responseBtnStyle } = this.getBtnStyles()

    let responses = cloneDeep(possibleResponses)

    if (preview && shuffleOptions) {
      if (hasGroupResponses) {
        responses = this.shuffleGroup(possibleResponses)
      } else {
        responses = this.shuffle(possibleResponses)
      }
    }

    // Layout Options
    const fontSize = theme.fontSize || getFontSize(uiStyle.fontsize)
    const {
      responsecontainerposition,
      responsecontainerindividuals,
      stemNumeration,
    } = uiStyle

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

    const dragItemStyle = {
      minWidth: dragItemMinWidth,
      maxWidth: dragItemMaxWidth,
      overflow: 'hidden',
    }

    const templateBoxLayout =
      checkAnswer || showAnswer || isReviewTab
        ? CheckboxTemplateBoxLayout
        : TemplateBox

    const resProps = {
      options,
      btnStyle,
      smallSize,
      evaluation,
      showAnswer,
      checkAnswer,
      userAnswers,
      responseIDs,
      isReviewTab,
      stemNumeration,
      responseBtnStyle,
      hasGroupResponses,
      disableResponse,
      userSelections: userAnswers,
      responsecontainerindividuals,
      globalSettings: uiStyle.globalSettings,
      maxWidth: dragItemMaxWidth,
      onDrop: !disableResponse ? this.onDrop : () => {},
      onDropHandler: !disableResponse ? this.onDrop : () => {},
      cAnswers: get(item, 'validation.validResponse.value', []),
      isExpressGrader,
      isPrintPreview,
      answerScore,
    }

    const templateBoxLayoutContainer = (
      <PreWrapper view={view} padding="0px">
        <div
          className={`template_box ${smallSize ? 'small' : ''}`}
          style={{
            fontSize: smallSize
              ? theme.widgets.clozeDragDrop.previewTemplateBoxSmallFontSize
              : fontSize,
          }}
        >
          <JsxParser
            bindings={{ resProps }}
            showWarnings
            disableKeyGeneration
            components={{
              response: templateBoxLayout,
              mathspan: MathSpanWrapper,
            }}
            jsx={parsedTemplate}
          />
        </div>
      </PreWrapper>
    )

    const previewResponseBoxLayout = (
      <ResponseBoxLayout
        smallSize={smallSize}
        hasGroupResponses={hasGroupResponses}
        responses={responses}
        fontSize={fontSize}
        dragHandler={dragHandler}
        onDrop={!disableResponse ? this.onDrop : () => {}}
        containerPosition={responsecontainerposition}
        dragItemStyle={dragItemStyle}
        getHeading={t}
      />
    )

    const horizontallyAligned =
      responsecontainerposition === 'left' ||
      responsecontainerposition === 'right'

    const answerContainerStyle = {
      minWidth: dragItemMaxWidth + 62,
      maxWidth: isPrintPreview ? '100%' : horizontallyAligned ? 1050 : 750,
    }

    const responseBoxStyle = {
      height: '100%',
      width: horizontallyAligned ? 'auto' : answerContainerStyle.maxWidth, // 62 is padding and margin of respose box
      flexShrink: 0,
      borderRadius: smallSize ? 0 : 10,
      marginRight: responsecontainerposition === 'left' ? 15 : null,
      marginLeft: responsecontainerposition === 'right' ? 15 : null,
      marginBottom: responsecontainerposition === 'top' ? 15 : null,
      marginTop: responsecontainerposition === 'bottom' ? 15 : null,
      background: theme.widgets.clozeDragDrop.responseBoxBgColor,
    }

    const templateBoxStyle = {
      borderRadius: smallSize ? 0 : 10,
      width: horizontallyAligned
        ? answerContainerStyle.maxWidth - dragItemMaxWidth + 62
        : null,
    }

    const correctAnswerBoxLayout = (
      <div style={{ ...responseBoxStyle, margin: 0 }} data-cy="answerBox">
        <CorrectAnswerBoxLayout
          centerText
          hasGroupResponses={hasGroupResponses}
          fontSize={fontSize}
          groupResponses={options}
          userAnswers={
            validation.validResponse && validation.validResponse.value
          }
          btnStyle={{
            ...btnStyle,
            whiteSpace: 'normal',
            maxWidth: dragItemMaxWidth,
          }}
          stemNumeration={stemNumeration}
          singleResponseBox={responseIDs?.length === 1}
          showAnswerScore={showAnswerScore}
          score={validation?.validResponse?.score}
        />
        {((item.validation && item.validation.altResponses) || []).map(
          (ele, ind) => (
            <CorrectAnswerBoxLayout
              centerText
              hasGroupResponses={hasGroupResponses}
              fontSize={fontSize}
              groupResponses={options}
              userAnswers={ele.value}
              altAnsIndex={ind + 1}
              btnStyle={{
                ...btnStyle,
                whiteSpace: 'normal',
                maxWidth: dragItemMaxWidth,
              }}
              stemNumeration={stemNumeration}
              singleResponseBox={responseIDs?.length === 1}
              showAnswerScore={showAnswerScore}
              score={ele?.score}
            />
          )
        )}
      </div>
    )
    const responseBoxLayout =
      showAnswer || isReviewTab ? (
        <></>
      ) : (
        <div style={responseBoxStyle}>{previewResponseBoxLayout}</div>
      )
    const answerBox =
      (showAnswer || isExpressGrader) && !hideCorrectAnswer ? (
        correctAnswerBoxLayout
      ) : (
        <></>
      )

    const questionContent = (
      <div>
        {responsecontainerposition === 'top' && (
          <div style={answerContainerStyle}>
            {responseBoxLayout}
            <div style={templateBoxStyle}>{templateBoxLayoutContainer}</div>
          </div>
        )}
        {responsecontainerposition === 'bottom' && (
          <div style={answerContainerStyle}>
            <div style={templateBoxStyle}>{templateBoxLayoutContainer}</div>
            {responseBoxLayout}
          </div>
        )}
        {responsecontainerposition === 'left' && (
          <AnswerContainer
            position={responsecontainerposition}
            style={answerContainerStyle}
          >
            {responseBoxLayout}
            <div style={templateBoxStyle}>{templateBoxLayoutContainer}</div>
          </AnswerContainer>
        )}
        {responsecontainerposition === 'right' && (
          <AnswerContainer
            position={responsecontainerposition}
            style={answerContainerStyle}
          >
            <div style={templateBoxStyle}>{templateBoxLayoutContainer}</div>
            {responseBoxLayout}
          </AnswerContainer>
        )}
      </div>
    )

    return (
      <TextWrappedDiv style={{ fontSize }} ref={this.previewWrapperRef}>
        <HorizontalScrollContext.Provider
          value={{ getScrollElement: () => this.previewWrapperRef.current }}
        >
          <FlexContainer justifyContent="flex-start" alignItems="baseline">
            <QuestionLabelWrapper>
              {showQuestionNumber && !flowLayout ? (
                <QuestionNumberLabel>{item.qLabel}</QuestionNumberLabel>
              ) : null}
              {item.qSubLabel && (
                <QuestionSubLabel>({item.qSubLabel})</QuestionSubLabel>
              )}
            </QuestionLabelWrapper>

            <QuestionContentWrapper showQuestionNumber={showQuestionNumber}>
              <QuestionStimulusWrapper>
                {!question && questionContent}
              </QuestionStimulusWrapper>
              {question && questionContent}
              {view !== EDIT && <Instructions item={item} />}
              {answerBox}
              <DragPreview />
            </QuestionContentWrapper>
          </FlexContainer>
        </HorizontalScrollContext.Provider>
      </TextWrappedDiv>
    )
  }
}

ClozeDragDropDisplay.propTypes = {
  options: PropTypes.array,
  item: PropTypes.object,
  onChange: PropTypes.func,
  changePreviewTab: PropTypes.func,
  preview: PropTypes.bool,
  showAnswer: PropTypes.bool,
  userSelections: PropTypes.array,
  smallSize: PropTypes.bool,
  checkAnswer: PropTypes.bool,
  stimulus: PropTypes.string,
  question: PropTypes.string.isRequired,
  hasGroupResponses: PropTypes.bool,
  configureOptions: PropTypes.object,
  validation: PropTypes.object,
  evaluation: PropTypes.array,
  uiStyle: PropTypes.object,
  disableResponse: PropTypes.bool,
  theme: PropTypes.object.isRequired,
  showQuestionNumber: PropTypes.bool,
  flowLayout: PropTypes.bool,
  isExpressGrader: PropTypes.bool,
  isReviewTab: PropTypes.bool,
  view: PropTypes.string,
  responseIDs: PropTypes.array.isRequired,
  changePreview: PropTypes.func.isRequired,
  t: PropTypes.func.isRequired,
  isPrintPreview: PropTypes.bool.isRequired,
  // qIndex: PropTypes.number
}

ClozeDragDropDisplay.defaultProps = {
  options: [],
  onChange: () => {},
  changePreviewTab: () => {},
  preview: true,
  item: {},
  disableResponse: false,
  showAnswer: false,
  userSelections: [],
  evaluation: [],
  checkAnswer: false,
  stimulus: '',
  view: '',
  smallSize: false,
  hasGroupResponses: false,
  validation: {},
  configureOptions: {
    showDraghandle: false,
    duplicatedResponses: false,
    shuffleOptions: false,
  },
  uiStyle: {
    responsecontainerposition: 'bottom',
    fontsize: 'normal',
    stemNumeration: 'numerical',
    widthpx: 0,
    heightpx: 0,
    wordwrap: false,
    responsecontainerindividuals: [],
  },
  showQuestionNumber: false,
  flowLayout: false,
  isExpressGrader: false,
  isReviewTab: false,
  // qIndex: null
}

export default withTheme(ClozeDragDropDisplay)

const TextWrappedDiv = styled.div`
  word-break: break-word;
  max-width: 100%;
  width: 100%;
  overflow-x: auto;
  overflow-y: hidden;
  position: relative;
`
