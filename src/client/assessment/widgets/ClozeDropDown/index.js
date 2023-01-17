import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { compose } from 'redux'
import { withRouter } from 'react-router-dom'
import styled, { withTheme } from 'styled-components'
import produce from 'immer'

import { WithResources, AnswerContext } from '@edulastic/common'
import { withNamespaces } from '@edulastic/localization'

import { setQuestionDataAction } from '../../../author/QuestionEditor/ducks'
import { setDropDownInUseAction } from '../../../student/Sidebar/ducks'
import { EDIT } from '../../constants/constantsForQuestions'

import { CorrectAnswerOptions } from '../../styled/CorrectAnswerOptions'

import Authoring from './Authoring'
import CorrectAnswers from './CorrectAnswers'
import Display from './Display'
import Options from './components/Options'

import { replaceVariables, updateVariables } from '../../utils/variables'
import { ContentArea } from '../../styled/ContentArea'
import ChoicesForResponses from './ChoicesForResponses'
import Question from '../../components/Question'
import { StyledPaperWrapper } from '../../styled/Widget'
import AppConfig from '../../../../app-config'
import { CheckboxLabel } from '../../styled/CheckboxWithLabel'

const EmptyWrapper = styled.div``

class ClozeDropDown extends Component {
  static contextType = AnswerContext

  getRenderData = () => {
    const { item: templateItem, history, view } = this.props
    const itemForPreview = replaceVariables(templateItem)
    const item = view === EDIT ? templateItem : replaceVariables(templateItem)

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
      instantFeedback: item.instant_feedback,
      instructorStimulus: item.instructorStimulus,
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
    saveAnswer(userAnswer)
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
      fillSections,
      cleanSections,
      advancedAreOpen,
      advancedLink,
      ...restProps
    } = this.props

    const {
      previewStimulus,
      previewDisplayOptions,
      itemForEdit,
      itemForPreview,
      uiStyle,
    } = this.getRenderData()

    const { shuffleOptions, responseIds } = item

    const Wrapper = testItem ? EmptyWrapper : StyledPaperWrapper

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
                <ChoicesForResponses
                  responses={responseIds || []}
                  item={item}
                  fillSections={fillSections}
                  cleanSections={cleanSections}
                />
                <Question
                  position="unset"
                  section="main"
                  label={t('component.correctanswers.setcorrectanswers')}
                  fillSections={fillSections}
                  cleanSections={cleanSections}
                >
                  <CorrectAnswers
                    key="shuffleOptions"
                    validation={item.validation}
                    configureOptions={{
                      shuffleOptions,
                    }}
                    options={previewDisplayOptions}
                    item={itemForPreview}
                    stimulus={previewStimulus}
                    uiStyle={uiStyle}
                    fillSections={fillSections}
                    cleanSections={cleanSections}
                  />
                  <CorrectAnswerOptions>
                    <CheckboxLabel
                      className="additional-options"
                      key="shuffleOptions"
                      onChange={() =>
                        this.handleOptionsChange(
                          'shuffleOptions',
                          !shuffleOptions
                        )
                      }
                      checked={shuffleOptions}
                    >
                      {t('component.cloze.dropDown.shuffleoptions')}
                    </CheckboxLabel>
                  </CorrectAnswerOptions>
                </Question>
              </div>

              {advancedLink}

              <Options
                onChange={this.handleOptionsChange}
                uiStyle={uiStyle}
                outerStyle={{
                  padding: '30px 120px',
                }}
                fillSections={fillSections}
                cleanSections={cleanSections}
                advancedAreOpen={advancedAreOpen}
                responseIDs={responseIds}
                item={item}
              />
            </>
          </ContentArea>
        )}
        {view === 'preview' && (
          <Wrapper>
            <Display
              showAnswer={
                previewTab === 'show' && !answerContextConfig.expressGrader
              }
              preview={
                previewTab === 'clear' ||
                (answerContextConfig.isAnswerModifiable &&
                  answerContextConfig.expressGrader)
              }
              checkAnswer={
                previewTab === 'check' ||
                (answerContextConfig.expressGrader &&
                  !answerContextConfig.isAnswerModifiable)
              }
              configureOptions={{
                shuffleOptions,
              }}
              item={itemForPreview}
              smallSize={smallSize}
              options={previewDisplayOptions}
              stimulus={previewStimulus}
              uiStyle={uiStyle}
              userAnswer={userAnswer}
              userSelections={userAnswer}
              onChange={this.handleAddAnswer}
              evaluation={evaluation}
              isExpressGrader={
                answerContextConfig.expressGrader && previewTab === 'show'
              }
              {...restProps}
            />
          </Wrapper>
        )}
      </WithResources>
    )
  }
}

ClozeDropDown.propTypes = {
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

ClozeDropDown.defaultProps = {
  previewTab: 'clear',
  item: {
    options: [],
  },
  smallSize: false,
  history: {},
  userAnswer: [],
  testItem: false,
  advancedAreOpen: false,
  advancedLink: null,
  fillSections: () => {},
  cleanSections: () => {},
}

const enhance = compose(
  withRouter,
  withNamespaces('assessment'),
  withTheme,
  connect(null, {
    setQuestionData: setQuestionDataAction,
    setDropDownInUse: setDropDownInUseAction,
  })
)

const ClozeDropDownContainer = enhance(ClozeDropDown)

export { ClozeDropDownContainer as ClozeDropDown }
