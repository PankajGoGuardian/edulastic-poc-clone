import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { compose } from 'redux'
import { withRouter } from 'react-router-dom'
import { cloneDeep, get } from 'lodash'
import produce from 'immer'

import { AnswerContext, WithResources } from '@edulastic/common'
import { withNamespaces } from '@edulastic/localization'
import { setQuestionDataAction } from '../../../author/QuestionEditor/ducks'
import { changePreviewAction } from '../../../author/src/actions/view'
import { EDIT } from '../../constants/constantsForQuestions'
import { replaceVariables, updateVariables } from '../../utils/variables'

import { ContentArea } from '../../styled/ContentArea'
import { EditorContainer } from './styled/EditorContainer'
import { AdditionalContainer } from './styled/AdditionalContainer'
import Options from './components/Options'
import Display from './Display'
import Authoring from './Authoring'
import CorrectAnswers from './CorrectAnswers'
import Question from '../../components/Question'
import { StyledPaperWrapper } from '../../styled/Widget'
import AppConfig from '../../../../app-config'
import { CheckboxLabel } from '../../styled/CheckboxWithLabel'

class ClozeImageText extends Component {
  static contextType = AnswerContext

  state = {
    duplicatedResponses: false,
    shuffleOptions: false,
    showDraghandle: false,
    transparentResponses: false,
  }

  getRenderData = () => {
    const { item: templateItem, history, view } = this.props
    const itemForPreview = replaceVariables(templateItem)
    const item = view === EDIT ? templateItem : itemForPreview

    const locationState = history.location.state
    const isDetailPage =
      locationState !== undefined ? locationState.itemDetail : false
    const previewDisplayOptions = item.options
    let previewStimulus
    let itemForEdit
    if (isDetailPage) {
      previewStimulus = item.stimulus
      itemForEdit = templateItem
    } else {
      previewStimulus = item.stimulus
      itemForEdit = {
        ...item,
        stimulus: templateItem.stimulus,
        list: templateItem.options,
        validation: templateItem.validation,
      }
    }
    return {
      previewStimulus,
      previewDisplayOptions,
      itemForEdit,
      uiStyle: item.uiStyle,
      itemForPreview,
    }
  }

  handleOptionsChange = (name, value) => {
    const { setQuestionData, item } = this.props
    setQuestionData(
      produce(item, (draft) => {
        draft[name] = value
        updateVariables(draft)
      })
    )

    switch (name) {
      case 'duplicated_responses': {
        this.setState({ duplicatedResponses: value })
        break
      }
      case 'shuffleOptions': {
        this.setState({ shuffleOptions: value })
        break
      }
      case 'show_draghandle': {
        this.setState({ showDraghandle: value })
        break
      }
      case 'transparent_responses': {
        this.setState({ transparentResponses: value })
        break
      }
      default:
    }
  }

  handleValidationOptionsChange = (name, value) => {
    const { setQuestionData, item } = this.props
    setQuestionData(
      produce(item, (draft) => {
        draft.validation[name] = value
        updateVariables(draft)
      })
    )
  }

  handleAddAnswer = (userAnswer) => {
    const { saveAnswer } = this.props
    const newAnswer = cloneDeep(userAnswer)
    saveAnswer(newAnswer)
  }

  render() {
    const answerContextConfig = this.context
    const {
      qIndex,
      view,
      previewTab,
      item,
      t,
      testItem,
      evaluation,
      advancedLink,
      advancedAreOpen,
      fillSections,
      userAnswer = {},
      cleanSections,
      ...restProps
    } = this.props

    const {
      previewStimulus,
      previewDisplayOptions,
      itemForEdit,
      itemForPreview,
      uiStyle,
    } = this.getRenderData()

    const ignoreCase =
      item && item.validation ? item.validation.ignoreCase : false

    const allowSingleLetterMistake =
      item && item.validation ? item.validation.allowSingleLetterMistake : false
    const mixAndMatch = get(item, ['validation', 'mixAndMatch'], false)
    const {
      duplicatedResponses,
      showDraghandle,
      shuffleOptions,
      transparentResponses,
    } = this.state

    const { expressGrader, isAnswerModifiable } = answerContextConfig

    const isCheckAnswer =
      previewTab === 'check' || (expressGrader && !isAnswerModifiable)
    const isClearAnswer =
      previewTab === 'clear' || (isAnswerModifiable && expressGrader)
    const isShowAnswer = previewTab === 'show' && !expressGrader

    const Wrapper = testItem ? React.Fragment : StyledPaperWrapper
    return (
      <>
        <WithResources
          resources={[AppConfig.jqueryPath]}
          fallBack={<span />}
          onLoaded={() => null}
        >
          {view === 'edit' && (
            <ContentArea>
              <EditorContainer>
                <div className="authoring">
                  <Authoring
                    item={itemForEdit}
                    fillSections={fillSections}
                    cleanSections={cleanSections}
                    imageWidth={item.imageWidth}
                  />
                  <Question
                    section="main"
                    label={t('component.correctanswers.setcorrectanswers')}
                    fillSections={fillSections}
                    cleanSections={cleanSections}
                  >
                    <CorrectAnswers
                      key={
                        duplicatedResponses || showDraghandle || shuffleOptions
                      }
                      validation={item.validation}
                      configureOptions={{
                        duplicatedResponses,
                        showDraghandle,
                        shuffleOptions,
                        transparentResponses,
                      }}
                      options={previewDisplayOptions}
                      imageAlterText={item.imageAlterText}
                      responses={item.responses}
                      imageUrl={item.imageUrl}
                      imageWidth={item.imageWidth}
                      question={previewStimulus}
                      showDashedBorder={
                        item.responseLayout &&
                        item.responseLayout.showdashedborder
                      }
                      uiStyle={uiStyle}
                      backgroundColor={item.background}
                      maxRespCount={item.maxRespCount}
                      fillSections={fillSections}
                      cleanSections={cleanSections}
                      imageOptions={item.imageOptions}
                      item={item}
                      updateVariables={updateVariables}
                    />

                    <AdditionalContainer>
                      <CheckboxLabel
                        onChange={() =>
                          this.handleValidationOptionsChange(
                            'ignoreCase',
                            !ignoreCase
                          )
                        }
                        checked={!!ignoreCase}
                      >
                        {t('component.cloze.dropDown.ignorecase')}
                      </CheckboxLabel>

                      <CheckboxLabel
                        onChange={() =>
                          this.handleValidationOptionsChange(
                            'allowSingleLetterMistake',
                            !allowSingleLetterMistake
                          )
                        }
                        checked={!!allowSingleLetterMistake}
                      >
                        {t('component.cloze.dropDown.allowsinglelettermistake')}
                      </CheckboxLabel>
                      <CheckboxLabel
                        onChange={() =>
                          this.handleValidationOptionsChange(
                            'mixAndMatch',
                            !mixAndMatch
                          )
                        }
                        checked={!!mixAndMatch}
                      >
                        Mix-n-Match alternative answers
                      </CheckboxLabel>
                    </AdditionalContainer>
                  </Question>
                </div>
              </EditorContainer>

              {advancedLink}

              <Options
                onChange={this.handleOptionsChange}
                uiStyle={uiStyle}
                outerStyle={{
                  padding: '16px 60px 7px 60px',
                }}
                advancedAreOpen={advancedAreOpen}
                fillSections={fillSections}
                cleanSections={cleanSections}
                responses={item.responses}
                item={item}
              />
            </ContentArea>
          )}
          {view === 'preview' && (
            <Wrapper>
              <Display
                checkAnswer={isCheckAnswer}
                showAnswer={isShowAnswer}
                preview={isClearAnswer}
                options={previewDisplayOptions}
                question={previewStimulus}
                uiStyle={uiStyle}
                item={itemForPreview}
                templateMarkUp={itemForPreview.templateMarkUp}
                userAnswers={userAnswer}
                onChange={this.handleAddAnswer}
                configureOptions={{
                  duplicatedResponses,
                  showDraghandle,
                  shuffleOptions,
                  transparentResponses,
                }}
                imageAlterText={item.imageAlterText}
                responseContainers={itemForPreview.responses}
                imageUrl={item.imageUrl}
                imageWidth={item.imageWidth}
                evaluation={evaluation}
                qIndex={qIndex}
                imageOptions={item.imageOptions}
                validation={itemForPreview.validation}
                showDashedBorder={
                  item.responseLayout && item.responseLayout.showdashedborder
                }
                backgroundColor={item.background}
                key={previewDisplayOptions && previewStimulus && uiStyle}
                maxRespCount={item.maxRespCount}
                isExpressGrader={expressGrader && previewTab === 'show'}
                view={view}
                {...restProps}
              />
            </Wrapper>
          )}
        </WithResources>
      </>
    )
  }
}

ClozeImageText.propTypes = {
  view: PropTypes.string.isRequired,
  previewTab: PropTypes.string,
  item: PropTypes.object,
  history: PropTypes.object,
  setQuestionData: PropTypes.func.isRequired,
  saveAnswer: PropTypes.func.isRequired,
  qIndex: PropTypes.number.isRequired,
  userAnswer: PropTypes.object.isRequired,
  t: PropTypes.func.isRequired,
  testItem: PropTypes.bool,
  evaluation: PropTypes.any,
  fillSections: PropTypes.func,
  cleanSections: PropTypes.func,
  advancedLink: PropTypes.any,
  advancedAreOpen: PropTypes.bool,
}

ClozeImageText.defaultProps = {
  previewTab: 'clear',
  item: {
    opttions: [],
  },
  history: {},
  testItem: false,
  evaluation: {},
  advancedLink: null,
  advancedAreOpen: false,
  fillSections: () => {},
  cleanSections: () => {},
}

const enhance = compose(
  withRouter,
  withNamespaces('assessment'),
  connect(null, {
    setQuestionData: setQuestionDataAction,
    changePreview: changePreviewAction,
  })
)

const ClozeImageTextContainer = enhance(ClozeImageText)

export { ClozeImageTextContainer as ClozeImageText }
