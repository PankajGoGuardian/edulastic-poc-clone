import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { compose } from 'redux'
import { withRouter } from 'react-router-dom'
import { cloneDeep } from 'lodash'
import styled, { withTheme } from 'styled-components'
import produce from 'immer'

import {
  WithResources,
  AnswerContext,
  WithMathFormula,
} from '@edulastic/common'
import { withNamespaces } from '@edulastic/localization'
import { ContentArea } from '../../styled/ContentArea'

import { setQuestionDataAction } from '../../../author/QuestionEditor/ducks'
import { changePreviewAction } from '../../../author/src/actions/view'
import { EDIT } from '../../constants/constantsForQuestions'

import { CorrectAnswerOptions } from '../../styled/CorrectAnswerOptions'

import Authoring from './Authoring'
import CorrectAnswers from './CorrectAnswers'
import Display from './Display'
import Options from './components/Options'

import { replaceVariables, updateVariables } from '../../utils/variables'
import { handlePreventKeyDown } from '../../utils/helpers'
import { CheckContainer } from './styled/CheckContainer'
import Question from '../../components/Question'
import { StyledPaperWrapper } from '../../styled/Widget'
import AppConfig from '../../../../app-config'
import { CheckboxLabel } from '../../styled/CheckboxWithLabel'

const EmptyWrapper = styled.div``

class ClozeDragDrop extends Component {
  static contextType = AnswerContext

  componentDidMount() {
    if (window) {
      window.addEventListener('keydown', handlePreventKeyDown)
    }
  }

  componentWillUnmount() {
    if (window) {
      window.removeEventListener('keydown', handlePreventKeyDown)
    }
  }

  getRenderData = () => {
    const { item: templateItem, history, view } = this.props
    const itemForPreview = replaceVariables(templateItem)
    const item = view === EDIT ? templateItem : itemForPreview

    const locationState = history.location.state
    const isDetailPage =
      locationState !== undefined ? locationState.itemDetail : false
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
  }

  handleAddAnswer = (userAnswer) => {
    const { saveAnswer } = this.props
    const newAnswer = cloneDeep(userAnswer)
    saveAnswer(newAnswer)
  }

  render() {
    const answerContextConfig = this.context

    const {
      view,
      previewTab,
      smallSize,
      item,
      userAnswer,
      t,
      testItem,
      evaluation,
      // eslint-disable-next-line no-unused-vars
      theme,
      fillSections,
      cleanSections,
      advancedLink,
      advancedAreOpen,
      setQuestionData,
      ...restProps
    } = this.props

    const {
      previewStimulus,
      previewDisplayOptions,
      itemForEdit,
      uiStyle,
    } = this.getRenderData()
    const {
      duplicatedResponses,
      showDraghandle,
      shuffleOptions,
      responseIds: responseIDs,
    } = item
    const Wrapper = testItem ? EmptyWrapper : StyledPaperWrapper
    const { expressGrader, isAnswerModifiable } = answerContextConfig

    const isClearAnswer =
      previewTab === 'clear' || (isAnswerModifiable && expressGrader)
    const isCheckAnswer =
      previewTab === 'check' || (expressGrader && !isAnswerModifiable)
    const isShowAnswer = previewTab === 'show' && !expressGrader

    return (
      <WithResources
        resources={[AppConfig.jqueryPath]}
        fallBack={<span />}
        onLoaded={() => null}
      >
        {view === 'edit' && (
          <ContentArea>
            <>
              <div className="authoring">
                <Authoring
                  item={itemForEdit}
                  fillSections={fillSections}
                  cleanSections={cleanSections}
                />
                <Question
                  section="main"
                  label={t('component.correctanswers.setcorrectanswers')}
                  position="unset"
                  fillSections={fillSections}
                  cleanSections={cleanSections}
                >
                  <CorrectAnswers
                    validation={item.validation}
                    hasGroupResponses={item.hasGroupResponses}
                    configureOptions={{
                      duplicatedResponses,
                      showDraghandle,
                      shuffleOptions,
                    }}
                    options={previewDisplayOptions}
                    stimulus={previewStimulus}
                    uiStyle={uiStyle}
                    fillSections={fillSections}
                    cleanSections={cleanSections}
                    responseIDs={item.responseIds}
                    setQuestionData={setQuestionData}
                    item={itemForEdit}
                  />
                  <CorrectAnswerOptions>
                    <CheckContainer>
                      <CheckboxLabel
                        className="additional-options"
                        key={`duplicatedResponses_${duplicatedResponses}`}
                        onChange={() =>
                          this.handleOptionsChange(
                            'duplicatedResponses',
                            !duplicatedResponses
                          )
                        }
                        checked={duplicatedResponses}
                      >
                        {t('component.cloze.dragDrop.duplicatedresponses')}
                      </CheckboxLabel>
                    </CheckContainer>
                    <CheckContainer>
                      <CheckboxLabel
                        className="additional-options"
                        key={`showDraghandle_${showDraghandle}`}
                        onChange={() =>
                          this.handleOptionsChange(
                            'showDraghandle',
                            !showDraghandle
                          )
                        }
                        checked={showDraghandle}
                      >
                        {t('component.cloze.dragDrop.showdraghandle')}
                      </CheckboxLabel>
                    </CheckContainer>
                    <CheckContainer>
                      <CheckboxLabel
                        className="additional-options"
                        key={`shuffleOptions_${shuffleOptions}`}
                        onChange={() =>
                          this.handleOptionsChange(
                            'shuffleOptions',
                            !shuffleOptions
                          )
                        }
                        checked={shuffleOptions}
                      >
                        {t('component.cloze.dragDrop.shuffleoptions')}
                      </CheckboxLabel>
                    </CheckContainer>
                  </CorrectAnswerOptions>
                </Question>
              </div>

              {advancedLink}

              <div>
                <Options
                  onChange={this.handleOptionsChange}
                  uiStyle={uiStyle}
                  fillSections={fillSections}
                  cleanSections={cleanSections}
                  advancedAreOpen={advancedAreOpen}
                  outerStyle={{
                    padding: '30px 120px',
                  }}
                  responseIDs={responseIDs}
                  item={item}
                />
              </div>
            </>
          </ContentArea>
        )}
        {view === 'preview' && (
          <Wrapper>
            <Display
              view={view}
              item={item}
              preview={isClearAnswer}
              checkAnswer={isCheckAnswer}
              showAnswer={isShowAnswer}
              hasGroupResponses={item.hasGroupResponses}
              configureOptions={{
                duplicatedResponses,
                showDraghandle,
                shuffleOptions,
              }}
              smallSize={smallSize}
              options={previewDisplayOptions}
              stimulus={previewStimulus}
              uiStyle={uiStyle}
              userSelections={userAnswer}
              onChange={this.handleAddAnswer}
              evaluation={evaluation}
              responseIDs={item.responseIds}
              validation={item.validation}
              key={previewDisplayOptions && previewStimulus && uiStyle}
              isExpressGrader={expressGrader && previewTab === 'show'}
              t={t}
              {...restProps}
            />
          </Wrapper>
        )}
      </WithResources>
    )
  }
}

ClozeDragDrop.propTypes = {
  view: PropTypes.string.isRequired,
  previewTab: PropTypes.string,
  item: PropTypes.object,
  smallSize: PropTypes.bool,
  history: PropTypes.object,
  setQuestionData: PropTypes.func.isRequired,
  saveAnswer: PropTypes.func.isRequired,
  userAnswer: PropTypes.any,
  t: PropTypes.func.isRequired,
  testItem: PropTypes.bool,
  evaluation: PropTypes.any.isRequired,
  theme: PropTypes.object.isRequired,
  fillSections: PropTypes.func,
  cleanSections: PropTypes.func,
  advancedLink: PropTypes.any,
  advancedAreOpen: PropTypes.bool,
}

ClozeDragDrop.defaultProps = {
  previewTab: 'clear',
  item: {
    options: [],
  },
  smallSize: false,
  history: {},
  userAnswer: [],
  testItem: false,
  advancedLink: null,
  advancedAreOpen: false,
  fillSections: () => {},
  cleanSections: () => {},
}

const enhance = compose(
  withRouter,
  withNamespaces('assessment'),
  withTheme,
  WithMathFormula,
  connect(null, {
    setQuestionData: setQuestionDataAction,
    changePreview: changePreviewAction,
  })
)

const ClozeDragDropContainer = enhance(ClozeDragDrop)

export { ClozeDragDropContainer as ClozeDragDrop }
