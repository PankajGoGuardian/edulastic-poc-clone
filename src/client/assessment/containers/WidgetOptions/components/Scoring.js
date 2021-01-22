import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { compose } from 'redux'
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
import { FlexContainer } from '@edulastic/common'
import {
  getQuestionDataSelector,
  setQuestionDataAction,
  setIsGradingRubricAction,
  getIsGradingCheckboxState,
} from '../../../../author/QuestionEditor/ducks'

import { removeRubricIdAction } from '../../../../author/sharedDucks/questions'
import { Row } from '../../../styled/WidgetOptions/Row'
import { Col } from '../../../styled/WidgetOptions/Col'
import { Label } from '../../../styled/WidgetOptions/Label'
import { SectionHeading } from '../../../styled/WidgetOptions/SectionHeading'
import { Subtitle } from '../../../styled/Subtitle'
import { CustomStyleBtn } from '../../../styled/ButtonStyles'
import { FormGroup } from '../styled/FormGroup'
import GradingRubricModal from './GradingRubricModal'
import { updateRubricDataAction } from '../../../../author/GradingRubric/ducks'
import { getUserFeatures } from '../../../../student/Login/ducks'
import { CheckboxLabel } from '../../../styled/CheckboxWithLabel'
import { SelectInputStyled, TextInputStyled } from '../../../styled/InputStyles'
import QuestionTextArea from '../../../components/QuestionTextArea'
import { WidgetFRInput } from '../../../styled/Widget'
import { PointsInput } from '../../../styled/CorrectAnswerHeader'

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

  render() {
    const {
      setQuestionData,
      t,
      scoringTypes,
      isSection,
      questionData,
      showSelect,
      noPaddingLeft,
      fillSections,
      cleanSections,
      children,
      isGradingCheckboxState,
      setIsGradingRubric,
      userFeatures,
      dissociateRubricFromQuestion,
      theme,
      showScoringType,
      extraInScoring = null,
      isCorrectAnsTab = true,
      item = {},
    } = this.props
    const { showGradingRubricModal, rubricActionType } = this.state
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

    const questionTitle = item?.title || questionData?.title

    const onChange = (value) => {
      if (!(value > 0)) {
        return
      }
      const points = parseFloat(value, 10)
      handleChangeValidation('validResponse', {
        score: points,
      })
    }

    return (
      <div
        section="main"
        label={t('component.options.scoring')}
        fillSections={fillSections}
        cleanSections={cleanSections}
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
            {/* TODO Enable this when when we implement it.
              Handle this scenario:
                Enable unscore.
                Disable isAutomarkChecked.
                Observe the autoscore will be still true 
                Make it false whenver isAutomarkChecked changes to false
            */}
            {/* {isAutomarkChecked && (
              <Col md={12}>
                <CheckboxLabel
                  data-cy="unscoredChk"
                  checked={questionData.validation.unscored}
                  onChange={(e) =>
                    handleChangeValidation('unscored', e.target.checked)
                  }
                  size="large"
                  disabled={!isCorrectAnsTab}
                >
                  {t('component.options.unscored')}
                </CheckboxLabel>
              </Col>
            )} */}
          </Row>
        )}

        {isAutomarkChecked && (
          <Row gutter={24} type="flex" wrap="wrap" mb="0">
            {!isAutoMarkBtnVisible && (
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
                    min={0.5}
                    step={0.5}
                    disabled={
                      (!!questionData.rubrics && userFeatures.gradingrubrics) ||
                      isGradingCheckboxState
                    }
                  />
                </FlexContainer>
              </Col>
            )}
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
                onChange={(e) => {
                  setIsGradingRubric(e.target.checked)
                  if (questionData.rubrics) dissociateRubricFromQuestion()
                }}
                disabled={!isCorrectAnsTab}
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
                    e.target.blur()
                  }}
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
            <StyledTag>
              <span
                onClick={() => this.handleViewRubric(questionData.rubrics._id)}
              >
                {questionData.rubrics.name}
              </span>
              <span onClick={() => dissociateRubricFromQuestion()}>
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

        {children}

        {showGradingRubricModal && (
          <GradingRubricModal
            data-cy="GradingRubricModal"
            visible={showGradingRubricModal}
            actionType={rubricActionType}
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
  noPaddingLeft: PropTypes.bool,
  children: PropTypes.any,
  extraInScoring: PropTypes.elementType,
  showScoringType: PropTypes.bool,
}

Scoring.defaultProps = {
  noPaddingLeft: false,
  isSection: false,
  showSelect: true,
  children: null,
  fillSections: () => {},
  cleanSections: () => {},
  extraInScoring: null,
  showScoringType: true,
}

const enhance = compose(
  withNamespaces('assessment'),
  withTheme,
  connect(
    (state) => ({
      questionData: getQuestionDataSelector(state),
      isGradingCheckboxState: getIsGradingCheckboxState(state),
      userFeatures: getUserFeatures(state),
    }),
    {
      setQuestionData: setQuestionDataAction,
      updateRubricData: updateRubricDataAction,
      setIsGradingRubric: setIsGradingRubricAction,
      dissociateRubricFromQuestion: removeRubricIdAction,
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
