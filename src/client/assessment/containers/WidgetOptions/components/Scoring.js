import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { compose } from 'redux'
import { withRouter } from 'react-router-dom'
import { cloneDeep, get } from 'lodash'
import { Select, Icon } from 'antd'
import styled, { withTheme } from 'styled-components'

import { themeColor, themeColorTagsBg } from '@edulastic/colors'
import { withNamespaces } from '@edulastic/localization'
import {
  rounding,
  evaluationType,
  nonAutoGradableTypes,
} from '@edulastic/constants'
import { getFormattedAttrId } from '@edulastic/common/src/helpers'
import { rubricsApi } from '@edulastic/api'
import {
  FlexContainer,
  PointBlockContext,
  notification,
} from '@edulastic/common'
import UnscoredHelperText from '@edulastic/common/src/components/UnscoredHelperText'

import {
  getQuestionDataSelector,
  setQuestionDataAction,
  updateScoreAndValidationAction,
  setIsGradingRubricAction,
  getIsGradingCheckboxState,
} from '../../../../author/QuestionEditor/ducks'

import {
  getCurrentQuestionSelector,
  getQuestionRubrics,
  removeRubricIdAction,
} from '../../../../author/sharedDucks/questions'
import { Row } from '../../../styled/WidgetOptions/Row'
import { Col } from '../../../styled/WidgetOptions/Col'
import { Label } from '../../../styled/WidgetOptions/Label'
import { SectionHeading } from '../../../styled/WidgetOptions/SectionHeading'
import { Subtitle } from '../../../styled/Subtitle'
import { CustomStyleBtn } from '../../../styled/ButtonStyles'
import { FormGroup } from '../styled/FormGroup'
import GradingRubricModal from './GradingRubricModal'
import {
  getPreviousStimulus,
  setRubricGenerationStimulusMetaDataAction,
  updateRubricDataAction,
  setRemoveAiTagAction,
} from '../../../../author/GradingRubric/ducks'
import { getUserFeatures } from '../../../../student/Login/ducks'
import { CheckboxLabel } from '../../../styled/CheckboxWithLabel'
import { SelectInputStyled, TextInputStyled } from '../../../styled/InputStyles'
import QuestionTextArea from '../../../components/QuestionTextArea'
import { WidgetFRInput } from '../../../styled/Widget'
import { PointsInput } from '../../../styled/CorrectAnswerHeader'
import {
  setItemLevelScoreFromRubricAction,
  getItemDetailQuestionsSelector,
} from '../../../../author/ItemDetail/ducks'

const roundingTypes = [rounding.roundDown, rounding.none]

class Scoring extends Component {
  state = {
    showGradingRubricModal: false,
    rubricActionType: '',
  }

  handleRubricAction = (actionType) => {
    this.setState({
      showGradingRubricModal: true,
      rubricActionType: actionType,
    })
  }

  updateStimulusMetadata = () => {
    const {
      currentQuestion,
      previousStimulus,
      setRubricGenerationStimulusMetaData,
    } = this.props
    if (currentQuestion.stimulus !== previousStimulus) {
      setRubricGenerationStimulusMetaData({
        stimulus: currentQuestion.stimulus,
        rubricGenerationCountForGivenStimulus: 0,
      })
    }
  }

  toggleRubricModal = () => {
    const { updateRubricData } = this.props
    this.setState({
      showGradingRubricModal: false,
      rubricActionType: '',
    })
    updateRubricData(null)
  }

  handleViewRubric = async (id) => {
    const { updateRubricData } = this.props
    await rubricsApi.getRubricsById(id).then((res) => {
      updateRubricData(res[0])
      this.handleRubricAction('VIEW RUBRIC')
    })
  }

  updateScoreOnBlur = (score) => {
    if (score < 0) {
      return
    }
    const { updateScoreAndValidation } = this.props
    const points = parseFloat(score, 10)
    updateScoreAndValidation(points)
  }

  handleRemoveRubric = () => {
    const { dissociateRubricFromQuestion, location, removeAiTag } = this.props
    dissociateRubricFromQuestion()
    removeAiTag(true)
    if (
      location?.state?.regradeFlow ||
      location?.pathname?.includes('classboard') ||
      location?.pathname?.includes('expressgrader')
    ) {
      notification({
        msg:
          'Score and max score will reset on re-score automatically option of re-grade',
      })
    }
  }

  handleGradingRubricCheckBox = (e) => {
    const {
      setIsGradingRubric,
      questionData,
      dissociateRubricFromQuestion,
      location,
      containsRubric,
    } = this.props
    setIsGradingRubric(e.target.checked)
    if (
      !e.target.checked &&
      (location?.state?.regradeFlow ||
        location?.pathname?.includes('classboard') ||
        location?.pathname?.includes('expressgrader')) &&
      containsRubric
    ) {
      notification({
        msg:
          'Score and max score will reset on re-score automatically option of re-grade',
      })
    }
    if (questionData.rubrics) dissociateRubricFromQuestion()
  }

  render() {
    const {
      setQuestionData,
      t,
      scoringTypes,
      isSection,
      questionData,
      showSelect,
      advancedAreOpen,
      noPaddingLeft,
      fillSections,
      cleanSections,
      children,
      isGradingCheckboxState,
      setIsGradingRubric,
      userFeatures,
      theme,
      showScoringType,
      extraInScoring = null,
      isCorrectAnsTab = true,
      item = {},
      setItemLevelScoring,
      location,
      itemDetailQuestions,
    } = this.props
    const { showGradingRubricModal, rubricActionType } = this.state
    const itemDetailQuestionsLength = itemDetailQuestions?.length || 0

    const handleChangeValidation = (param, value) => {
      const newData = cloneDeep(questionData)

      if (!newData.validation) {
        newData.validation = {}
      }
      if (
        (param === 'maxScore' ||
          param === 'penalty' ||
          param === 'minScoreIfAttempted' ||
          param === '') &&
        value < 0
      ) {
        newData.validation[param] = 0
      } else {
        if (param === 'automarkable' && !value) {
          newData.validation.scoringType = evaluationType.EXACT_MATCH
          delete newData.validation.unscored // unset unscored when auto scoring is disabled
        }
        if (param === 'unscored') {
          const updatedScore = value ? 0 : 1
          newData.validation.validResponse.score = updatedScore
          newData.validation.altResponses?.forEach((altResp) => {
            altResp.score = updatedScore
          })
          if (newData.validation?.maxScore) {
            newData.validation.maxScore = updatedScore
          }
          if (value) {
            delete newData.rubrics
          }
          /**
           * @see EV-35429 and EV-29700
           * If question is marked as unscored itemLevelScoring should be set to false (EV-29700).
           * If unscored is checked then as mentioned above itemLevelScoring was set to false
           * but if unscored is unchecked itemLevelScoring value wasn't being changed.
           * Items other than multipart have by default itemLevelScoring value true.
           * Thus setting back itemLevelScoring value if unscored is unchecked (for non-multipart items).
           */
          if (value) {
            setItemLevelScoring(false)
          } else if (
            value === false &&
            (itemDetailQuestionsLength === 0 || itemDetailQuestionsLength === 1)
          ) {
            setItemLevelScoring(true)
          }
        }
        newData.validation[param] = value
      }

      setQuestionData(newData)
    }

    const handleChangeInstructions = (param, value) => {
      const newData = cloneDeep(questionData)
      newData[param] = value
      setQuestionData(newData)
    }

    const isAutomarkChecked = get(questionData, 'validation.automarkable', true)
    const maxScore = get(questionData, 'validation.validResponse.score', 1)
    const questionType = get(questionData, 'type', '')
    const isAutoMarkBtnVisible = !nonAutoGradableTypes.includes(questionType)
    const isPractice = get(questionData, 'validation.unscored', false)
    const isPremiumUser = get(userFeatures, ['premium'], false)

    const questionTitle = item?.title || questionData?.title

    const onChange = (value) => {
      if (value < 0) {
        return
      }
      const points = parseFloat(value, 10)
      handleChangeValidation('validResponse', {
        score: points,
      })
    }

    const unscoredCheckBox = (
      <CheckboxLabel
        data-cy="unscoredChk"
        checked={questionData.validation.unscored}
        onChange={(e) => handleChangeValidation('unscored', e.target.checked)}
        size="large"
        disabled={!isCorrectAnsTab}
      >
        {t('component.options.unscored')}
      </CheckboxLabel>
    )

    return (
      <div
        section="advanced"
        label={t('component.options.scoring')}
        fillSections={fillSections}
        cleanSections={cleanSections}
        advancedAreOpen={advancedAreOpen}
      >
        {isSection && (
          <SectionHeading>{t('component.options.scoring')}</SectionHeading>
        )}
        {!isSection && (
          <Subtitle
            margin={noPaddingLeft ? '0 0 29px -30px' : null}
            id={getFormattedAttrId(
              `${questionTitle}-${t('component.options.scoring')}`
            )}
          >
            {t('component.options.scoring')}
          </Subtitle>
        )}
        {extraInScoring}

        {isAutoMarkBtnVisible && (
          <Row gutter={24}>
            <Col md={12}>
              <CheckboxLabel
                data-cy="autoscoreChk"
                checked={isAutomarkChecked}
                onChange={(e) =>
                  handleChangeValidation('automarkable', e.target.checked)
                }
                size="large"
                disabled={!isCorrectAnsTab}
              >
                {t('component.options.automarkable')}
              </CheckboxLabel>
            </Col>
            {isAutomarkChecked && isPremiumUser && (
              <Col md={12}>{unscoredCheckBox}</Col>
            )}
          </Row>
        )}

        {isAutomarkChecked && (
          <Row gutter={24} type="flex" wrap="wrap" mb="0">
            <PointBlockContext.Consumer>
              {(hidingScoringBlock) =>
                !isAutoMarkBtnVisible &&
                !hidingScoringBlock && (
                  <Col md={12}>
                    <FlexContainer flexDirection="column" mt="8px">
                      <Label>{t('component.options.maxScore')}</Label>
                      <PointsInput
                        data-cy="maxscore"
                        id={getFormattedAttrId(
                          `${questionTitle}-${t('component.options.maxScore')}`
                        )}
                        value={maxScore}
                        width="20%"
                        onChange={onChange}
                        onBlur={(e) => this.updateScoreOnBlur(e?.target?.value)}
                        min={isPremiumUser ? 0 : 0.5}
                        step={0.5}
                        disabled={
                          (!!questionData.rubrics &&
                            userFeatures.gradingrubrics) ||
                          isGradingCheckboxState
                        }
                      />
                      {isPractice && <UnscoredHelperText />}
                    </FlexContainer>
                  </Col>
                )
              }
            </PointBlockContext.Consumer>
            {/* showScoringType(default is true), hides  scoring type dropdown for few question types (eg: Short Text) */}
            {showScoringType && scoringTypes.length > 1 && showSelect && (
              <Col md={12}>
                <Label>{t('component.options.scoringType')}</Label>
                <SelectInputStyled
                  size="large"
                  data-cy="scoringType"
                  value={questionData.validation.scoringType}
                  getPopupContainer={(triggerNode) => triggerNode.parentNode}
                  onChange={(value) =>
                    handleChangeValidation('scoringType', value)
                  }
                >
                  {scoringTypes.map(({ value: val, label }) => (
                    <Select.Option data-cy={val} key={val} value={val}>
                      {label}
                    </Select.Option>
                  ))}
                </SelectInputStyled>
              </Col>
            )}
            {questionData.validation.scoringType ===
              evaluationType.PARTIAL_MATCH && (
              <>
                <Col md={12}>
                  <Label>{t('component.options.rounding')}</Label>
                  <SelectInputStyled
                    data-cy="rounding"
                    size="large"
                    value={questionData.validation.rounding}
                    getPopupContainer={(triggerNode) => triggerNode.parentNode}
                    onChange={(value) =>
                      handleChangeValidation('rounding', value)
                    }
                  >
                    {roundingTypes.map(({ value: val, label }) => (
                      <Select.Option data-cy={val} key={val} value={val}>
                        {label}
                      </Select.Option>
                    ))}
                  </SelectInputStyled>
                </Col>
                <Col md={12}>
                  <Label>{t('component.options.penalty')}</Label>
                  <FormGroup center>
                    <TextInputStyled
                      type="number"
                      data-cy="penalty"
                      step="0.5"
                      value={questionData.validation.penalty}
                      onChange={(e) =>
                        handleChangeValidation('penalty', +e.target.value)
                      }
                      size="large"
                      style={{ width: '100%', borderColor: '#E1E1E1' }}
                    />
                  </FormGroup>
                </Col>
              </>
            )}
          </Row>
        )}

        {userFeatures.gradingrubrics && (
          <Row gutter={24} mb="0">
            <Col md={12}>
              <CheckboxLabel
                data-cy="gradingRubricChk"
                checked={isGradingCheckboxState || questionData.rubrics}
                onChange={this.handleGradingRubricCheckBox}
                disabled={!isCorrectAnsTab || questionData.validation.unscored}
                size="large"
              >
                {t('component.options.gradingRubric')}
              </CheckboxLabel>
            </Col>
          </Row>
        )}
        {(isGradingCheckboxState || questionData.rubrics) &&
          userFeatures.gradingrubrics && (
            <Row gutter={24}>
              <Col md={24} lg={24} xs={24}>
                <CustomStyleBtn
                  onClick={(e) => {
                    this.handleRubricAction('CREATE NEW')
                    this.updateStimulusMetadata()
                    e.target.blur()
                  }}
                  data-cy="createNewRubric"
                  display="inline-block"
                  padding="0px 16px"
                  width="142px"
                  margin="0px 15px 0px 0px"
                  disabled={!isCorrectAnsTab}
                  ghost={!isCorrectAnsTab}
                >
                  Create New Rubric
                </CustomStyleBtn>
                <CustomStyleBtn
                  onClick={(e) => {
                    this.handleRubricAction('USE EXISTING')
                    e.target.blur()
                  }}
                  display="inline-block"
                  padding="0px 16px"
                  width="142px"
                  margin="0px 15px 0px 0px"
                  data-cy="useExistingRubric"
                  disabled={!isCorrectAnsTab}
                  ghost={!isCorrectAnsTab}
                >
                  Use Existing Rubric
                </CustomStyleBtn>
              </Col>
            </Row>
          )}

        {questionData.rubrics && userFeatures.gradingrubrics && (
          <RubricsContainer>
            <StyledTag data-cy="selectedRubric">
              <span
                onClick={() => this.handleViewRubric(questionData.rubrics._id)}
              >
                {questionData.rubrics.name}
              </span>
              <span data-cy="removeRubric" onClick={this.handleRemoveRubric}>
                <Icon type="close" />
              </span>
            </StyledTag>
          </RubricsContainer>
        )}

        <Row gutter={24} mb="0">
          <Col md={12}>
            <CheckboxLabel
              data-cy="isScoringInstructionsEnabled"
              checked={questionData?.isScoringInstructionsEnabled}
              onChange={(e) =>
                handleChangeInstructions(
                  'isScoringInstructionsEnabled',
                  e.target.checked
                )
              }
              size="large"
              disabled={!isCorrectAnsTab}
            >
              Enable scoring instructions
            </CheckboxLabel>
          </Col>
        </Row>
        {questionData?.isScoringInstructionsEnabled && isCorrectAnsTab && (
          <Row gutter={24}>
            <Col md={24} lg={24} xs={24}>
              <WidgetFRInput fontSize={theme?.fontSize}>
                <QuestionTextArea
                  data-cy="scoringInstructions"
                  border="border"
                  toolbarSize="SM"
                  toolbarId="scoringInstructions"
                  value={questionData?.scoringInstructions || ''}
                  placeholder="Add instructions - This is a placeholder text"
                  onChange={(value = '') =>
                    handleChangeInstructions('scoringInstructions', value)
                  }
                />
              </WidgetFRInput>
            </Col>
          </Row>
        )}

        {/* practice usage for manually gradable types */}
        {!isAutoMarkBtnVisible && isPremiumUser && (
          <Row gutter={24}>
            <Col md={12}>{unscoredCheckBox}</Col>
          </Row>
        )}

        {children}

        {showGradingRubricModal && (
          <GradingRubricModal
            data-cy="GradingRubricModal"
            visible={showGradingRubricModal}
            actionType={rubricActionType}
            isRegradeFlow={
              location?.state?.regradeFlow ||
              location?.pathname?.includes('classboard') ||
              location?.pathname?.includes('expressgrader')
            }
            toggleModal={() => {
              this.toggleRubricModal()
              setIsGradingRubric(false)
            }}
          />
        )}
      </div>
    )
  }
}

Scoring.propTypes = {
  setQuestionData: PropTypes.func.isRequired,
  scoringTypes: PropTypes.array.isRequired,
  questionData: PropTypes.object.isRequired,
  t: PropTypes.func.isRequired,
  showSelect: PropTypes.bool,
  isSection: PropTypes.bool,
  fillSections: PropTypes.func,
  cleanSections: PropTypes.func,
  advancedAreOpen: PropTypes.bool,
  noPaddingLeft: PropTypes.bool,
  children: PropTypes.any,
  extraInScoring: PropTypes.elementType,
  showScoringType: PropTypes.bool,
}

Scoring.defaultProps = {
  noPaddingLeft: false,
  isSection: false,
  showSelect: true,
  advancedAreOpen: true,
  children: null,
  fillSections: () => {},
  cleanSections: () => {},
  extraInScoring: null,
  showScoringType: true,
}

Scoring.contextType = PointBlockContext

const enhance = compose(
  withNamespaces('assessment'),
  withTheme,
  withRouter,
  connect(
    (state) => ({
      questionData: getQuestionDataSelector(state),
      isGradingCheckboxState: getIsGradingCheckboxState(state),
      userFeatures: getUserFeatures(state),
      containsRubric: getQuestionRubrics(state),
      itemDetailQuestions: getItemDetailQuestionsSelector(state),
      currentQuestion: getCurrentQuestionSelector(state),
      previousStimulus: getPreviousStimulus(state),
    }),
    {
      setQuestionData: setQuestionDataAction,
      updateRubricData: updateRubricDataAction,
      setIsGradingRubric: setIsGradingRubricAction,
      dissociateRubricFromQuestion: removeRubricIdAction,
      setItemLevelScoring: setItemLevelScoreFromRubricAction,
      updateScoreAndValidation: updateScoreAndValidationAction,
      setRubricGenerationStimulusMetaData: setRubricGenerationStimulusMetaDataAction,
      removeAiTag: setRemoveAiTagAction,
    }
  )
)

export default enhance(Scoring)

export const RubricsContainer = styled.div`
  margin-bottom: 20px;
`

export const StyledTag = styled.div`
  display: inline-block;
  background: ${themeColorTagsBg};
  padding: 3px 8px;
  border-radius: 5px;
  color: ${themeColor};
  font-size: ${(props) => props.theme.smallFontSize};
  > span:first-child {
    margin-right: 5px;
    cursor: pointer;
  }
  > span:last-child {
    cursor: pointer;
  }
`
