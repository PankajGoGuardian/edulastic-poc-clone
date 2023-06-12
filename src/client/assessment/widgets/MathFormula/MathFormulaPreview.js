import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { withTheme } from 'styled-components'
import { get, isEqual } from 'lodash'

import {
  MathInput,
  StaticMath,
  MathFormulaDisplay,
  MathDisplay,
  FlexContainer,
  QuestionNumberLabel,
  getInnerValuesForStatic,
  QuestionLabelWrapper,
  QuestionSubLabel,
  QuestionContentWrapper,
} from '@edulastic/common'

import { white } from '@edulastic/colors'
import { SHOW, CHECK, CLEAR, EDIT } from '../../constants/constantsForQuestions'

import CorrectAnswerBox, {
  formatToMathAnswer,
} from './components/CorrectAnswerBox'
import { UnitsDropdown } from './components/MathFormulaAnswerMethod/options'

import MathInputWrapper from './styled/MathInputWrapper'
import { QuestionTitleWrapper } from './styled/QustionNumber'

import { getStylesFromUiStyleToCssStyle } from '../../utils/helpers'
import Instructions from '../../components/Instructions'

import CheckAnswerBox from './components/CheckAnswerBox'

class MathFormulaPreview extends Component {
  static propTypes = {
    item: PropTypes.object.isRequired,
    studentTemplate: PropTypes.string,
    type: PropTypes.string.isRequired,
    changePreviewTab: PropTypes.func.isRequired,
    changePreview: PropTypes.func.isRequired,
    saveAnswer: PropTypes.func.isRequired,
    evaluation: PropTypes.oneOfType([PropTypes.object, PropTypes.array])
      .isRequired,
    userAnswer: PropTypes.any,
    disableResponse: PropTypes.bool.isRequired,
    testItem: PropTypes.bool,
    answerContextConfig: PropTypes.object.isRequired,
    theme: PropTypes.object.isRequired,
    showQuestionNumber: PropTypes.bool,
  }

  static defaultProps = {
    studentTemplate: '',
    userAnswer: null,
    testItem: false,
    showQuestionNumber: false,
  }

  state = {
    innerValues: [],
  }

  constructor(props) {
    super(props)
    this.state = {
      innerValues: [],
    }
  }

  componentDidMount() {
    this.updateStaticMathFromUserAnswer()
  }

  componentDidUpdate(prevProps) {
    const {
      studentTemplate,
      type: previewType,
      answerContextConfig: { expressGrader, isAnswerModifiable },
      userAnswer,
    } = this.props
    const {
      studentTemplate: prevStudentTemplate,
      type: prevPreviewType,
      answerContextConfig: { isAnswerModifiable: prevIsAnswerModifiable },
      userAnswer: prevUserAnswer,
    } = prevProps

    if (
      (previewType !== prevPreviewType && previewType === CLEAR) ||
      studentTemplate !== prevStudentTemplate ||
      (expressGrader &&
        isAnswerModifiable &&
        isAnswerModifiable !== prevIsAnswerModifiable) ||
      !isEqual(userAnswer, prevUserAnswer)
    ) {
      this.updateStaticMathFromUserAnswer()
    }
  }

  get isStatic() {
    const { studentTemplate, item } = this.props
    return (
      (studentTemplate &&
        studentTemplate.search(/\\MathQuillMathField\{(.*)\}/g) !== -1 &&
        studentTemplate !== '\\MathQuillMathField{}') ||
      item.templateDisplay
    )
  }

  getValidLatex(props) {
    const { studentTemplate, userAnswer, item } = props
    if (this.isStatic) {
      return studentTemplate
    }

    if (userAnswer) {
      if (typeof userAnswer === 'string') {
        return userAnswer
      }

      const { isUnits, showDropdown } = item
      if (isUnits && showDropdown && typeof userAnswer === 'object') {
        return userAnswer.expression
      }

      return userAnswer[0]
    }
    return studentTemplate
  }

  updateStaticMathFromUserAnswer() {
    const { userAnswer, studentTemplate } = this.props
    if (!userAnswer) {
      this.setState({
        innerValues: [],
      })
      return
    }

    if (!this.isStatic) return

    const innerValues = getInnerValuesForStatic(studentTemplate, userAnswer)
    this.setState({ innerValues })
  }

  onUserResponse(latexv) {
    const { saveAnswer, userAnswer, item } = this.props
    // if (previewType === CHECK) return;
    const { isUnits, showDropdown } = item
    if (isUnits && showDropdown) {
      saveAnswer({ ...userAnswer, expression: latexv })
    } else {
      saveAnswer(latexv)
    }
  }

  onBlur(latexv) {
    const { type: previewType, saveAnswer, userAnswer, item } = this.props
    const { isUnits, showDropdown } = item

    if (this.isStatic && previewType !== CHECK) {
      if (isUnits && showDropdown) {
        saveAnswer({ ...userAnswer, expression: latexv })
      } else {
        saveAnswer(latexv)
      }
    }
  }

  specialKeyCheck = (e) => {
    if (!e) {
      return false
    }

    if (e === 'cmd') {
      return true
    }

    const isSpecialChar = !!(e.key.length > 1 || e.key.match(/[^a-zA-Z]/g))
    const isArrowOrShift =
      (e.keyCode >= 37 && e.keyCode <= 40) ||
      e.keyCode === 16 ||
      e.keyCode === 8

    if (!isSpecialChar || isArrowOrShift) {
      return false
    }
    return true
  }

  onInnerFieldClick = () => {
    const {
      type: previewType,
      changePreview,
      changePreviewTab,
      disableResponse,
    } = this.props

    if ((previewType === SHOW || previewType === CHECK) && !disableResponse) {
      changePreview(CLEAR) // Item level
      changePreviewTab(CLEAR) // Question level
    }
  }

  selectUnitFromDropdown = (unit) => {
    const {
      userAnswer,
      saveAnswer,
      type: previewType,
      changePreview,
      changePreviewTab,
      disableResponse,
    } = this.props
    saveAnswer({ ...userAnswer, unit })
    if ((previewType === SHOW || previewType === CHECK) && !disableResponse) {
      changePreview(CLEAR) // Item level
      changePreviewTab(CLEAR) // Question level
    }
  }

  get restrictKeys() {
    const { item } = this.props
    const { allowedVariables } = item
    return allowedVariables
      ? allowedVariables.split(',').map((segment) => segment.trim())
      : []
  }

  get selectedUnit() {
    const { userAnswer, testItem, item } = this.props
    // if user doesn't choose units it shows 'undefined' in math input. Thus return empty string instead of undefined
    if (!testItem && userAnswer) {
      return userAnswer.unit || ''
    }
    if (testItem) {
      return get(item, 'validation.validResponse.value[0].options.unit', '')
    }
    return ''
  }

  get formattedUserAnswer() {
    const { userAnswer, item } = this.props
    const { template } = item
    let latex = ''
    const unit = this.selectedUnit
    if (this.isStatic && userAnswer && template) {
      latex = formatToMathAnswer(userAnswer, template)
    }

    if (!this.isStatic && userAnswer) {
      latex = this.getValidLatex(this.props)
      latex = !Array.isArray(latex)
        ? latex?.replace('\\MathQuillMathField{}', '')
        : ''
    }

    if (item.isUnits && item.showDropdown) {
      latex = `${latex} ${unit}`
    }

    return latex
  }

  render() {
    const {
      evaluation: mathEvaluation,
      item,
      type: previewType,
      showQuestionNumber,
      studentTemplate,
      testItem,
      theme,
      disableResponse,
      view,
      isPrintPreview,
      viewComponent,
      hideCorrectAnswer,
      answerScore,
      answerContextConfig: { expressGrader },
      showAnswerScore,
    } = this.props
    const { innerValues } = this.state
    const isCheckAnswer = previewType === SHOW || previewType === CHECK
    const latex = this.getValidLatex(this.props)
    const evaluation = Array.isArray(mathEvaluation) ? mathEvaluation : []
    const altAnswers = get(item, 'validation.altResponses')
    const cssStyles = getStylesFromUiStyleToCssStyle(item.uiStyle)

    const testItemCorrectValues = testItem
      ? item?.validation?.validResponse?.value?.map(
          (validResponse) => validResponse?.value
        )
      : []

    const customKeys = get(item, 'customKeys', [])
    const allowNumericOnly = get(item, 'allowNumericOnly', false)

    // in Units type, this need when the show dropdown option is true
    const correctUnit = get(
      item,
      'validation.validResponse.value[0].options.unit',
      ''
    )
    // if (
    //   (correctUnit.search('text{') === -1 && correctUnit.search('f') !== -1) ||
    //   correctUnit.search(/\s/g) !== -1
    // ) {
    //   correctUnit = `\\text{${correctUnit}}`
    // }
    return (
      <div>
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
            <QuestionTitleWrapper data-cy="questionTitleWrapper">
              <MathFormulaDisplay
                data-cy="preview-header"
                style={{ marginBottom: 15 }}
                dangerouslySetInnerHTML={{ __html: item.stimulus }}
              />
            </QuestionTitleWrapper>
            {testItem && (
              <FlexContainer
                alignItems="stretch"
                justifyContent="flex-start"
                width="100%"
              >
                <MathDisplay
                  styles={cssStyles}
                  template="\MathQuillMathField{}"
                  innerValues={testItemCorrectValues}
                />
                {item.isUnits && item.showDropdown && (
                  <UnitsDropdown
                    preview
                    disabled
                    item={item}
                    selected={this.selectedUnit}
                    onChange={this.selectUnitFromDropdown}
                  />
                )}
              </FlexContainer>
            )}

            {!testItem && (
              <FlexContainer
                alignItems="stretch"
                justifyContent="flex-start"
                width="100%"
                onClick={this.onInnerFieldClick}
              >
                {(expressGrader ? disableResponse : isCheckAnswer) && (
                  <CheckAnswerBox
                    isStatic={this.isStatic}
                    answer={this.formattedUserAnswer}
                    minWidth={cssStyles.width}
                    minHeight={cssStyles.height}
                    evaluation={evaluation}
                    answerScore={answerScore}
                  />
                )}

                {(expressGrader ? !disableResponse : !isCheckAnswer) && (
                  <MathInputWrapper bg={white} minWidth={cssStyles.width}>
                    {this.isStatic && (
                      <StaticMath
                        symbols={item.symbols}
                        restrictKeys={this.restrictKeys}
                        allowNumericOnly={allowNumericOnly}
                        customKeys={customKeys}
                        numberPad={item.numberPad}
                        onInput={(latexv) => this.onUserResponse(latexv)}
                        latex={studentTemplate}
                        innerValues={innerValues}
                        onInnerFieldClick={() => this.onInnerFieldClick()}
                        isPrintPreview={isPrintPreview}
                        style={cssStyles}
                        noBorder
                      />
                    )}
                    {!this.isStatic && (
                      <MathInput
                        resetMath
                        symbols={item.symbols}
                        restrictKeys={this.restrictKeys}
                        allowNumericOnly={allowNumericOnly}
                        customKeys={customKeys}
                        numberPad={item.numberPad}
                        minHeight={cssStyles.height}
                        minWidth={cssStyles.width}
                        fontSize={cssStyles.fontSize}
                        value={
                          latex && !Array.isArray(latex)
                            ? latex.replace('\\MathQuillMathField{}', '')
                            : null
                        }
                        onInput={(latexv) => this.onUserResponse(latexv)}
                        onBlur={(latexv) => this.onBlur(latexv)}
                        onInnerFieldClick={() => this.onInnerFieldClick()}
                      />
                    )}
                  </MathInputWrapper>
                )}
                {(expressGrader ? !disableResponse : !isCheckAnswer) &&
                  item.isUnits &&
                  item.showDropdown && (
                    <UnitsDropdown
                      item={item}
                      preview
                      onChange={this.selectUnitFromDropdown}
                      data-cy="selectUnitDropdown"
                      selected={this.selectedUnit}
                      disabled={disableResponse}
                      keypadMode={item?.keypadMode} // to get selected keypadMode on student side
                    />
                  )}
              </FlexContainer>
            )}
            {view && view !== EDIT && <Instructions item={item} />}
            {previewType === SHOW &&
              !hideCorrectAnswer &&
              item?.validation?.validResponse?.value?.[0].value !==
                undefined && (
                <CorrectAnswerBox
                  theme={theme}
                  viewComponent={viewComponent}
                  extraOtps={get(item, ['extraOpts', 0], {})}
                  options={item.validation.validResponse.value[0].options}
                  method={item.validation.validResponse.value[0].method}
                  allowNumericOnly={allowNumericOnly}
                  allowedVariables={this.restrictKeys}
                  template={item.template}
                  showAnswerScore={showAnswerScore}
                  score={item?.validation?.validResponse?.score}
                  answer={
                    item.isUnits && item.showDropdown
                      ? item.validation.validResponse.value[0].value.search(
                          '='
                        ) === -1
                        ? `${item.validation.validResponse.value[0].value}\\ ${correctUnit}`
                        : item.validation.validResponse.value[0].value.replace(
                            /=/gm,
                            `\\ ${correctUnit}=`
                          )
                      : item.validation.validResponse.value[0].value
                  }
                />
              )}
            {altAnswers &&
              previewType === SHOW &&
              !hideCorrectAnswer &&
              item?.validation?.altResponses.map((ans, index) => {
                let answer = ''

                answer = ans?.value?.[0]?.value

                if (item.isUnits && item.showDropdown) {
                  const altUnit = get(ans, 'value[0].options.unit', '')
                  // if (
                  //   (altUnit.search('text{') === -1 &&
                  //     altUnit.search('f') !== -1) ||
                  //   altUnit.search(/\s/g) !== -1
                  // ) {
                  //   altUnit = `\\text{${altUnit}}`
                  // }

                  answer =
                    ans.value[0].value.search('=') === -1
                      ? `${ans.value[0].value}\\ ${altUnit}`
                      : ans.value[0].value.replace(/=/gm, `\\ ${altUnit}=`)
                }

                return (
                  <CorrectAnswerBox
                    altAnswers
                    theme={theme}
                    template={item.template}
                    answer={answer}
                    index={index + 1}
                    showAnswerScore={showAnswerScore}
                    score={ans?.score}
                    viewComponent={viewComponent}
                    method={ans?.value?.[0]?.method}
                    options={ans?.value?.[0]?.options}
                    allowNumericOnly={allowNumericOnly}
                    allowedVariables={this.restrictKeys}
                    extraOtps={get(item, ['extraOpts', index + 1], {})}
                  />
                )
              })}
          </QuestionContentWrapper>
        </FlexContainer>
      </div>
    )
  }
}

export default withTheme(MathFormulaPreview)
