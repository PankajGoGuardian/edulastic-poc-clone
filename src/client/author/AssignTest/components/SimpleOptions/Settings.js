import React, { useState, useEffect, useRef } from 'react'
import { connect } from 'react-redux'
import { compose } from 'redux'
import { Row, Col, Select, Input, InputNumber, Modal } from 'antd'
import { withNamespaces } from '@edulastic/localization'
import { green, red, blueBorder, themeColor } from '@edulastic/colors'
import { test, testTypes, roleuser } from '@edulastic/constants'
import { playerSkinValues } from '@edulastic/constants/const/test'
import {
  RadioBtn,
  notification,
  SelectInputStyled,
  CheckboxLabel,
  EduIf,
} from '@edulastic/common'
import { withRouter } from 'react-router-dom'
import { get, isEmpty } from 'lodash'
import {
  AlignSwitchRight,
  SettingsWrapper,
  Password,
  StyledDiv,
  MessageSpan,
  Label,
  StyledCol,
  StyledRow,
  CheckBoxWrapper,
  TimeSpentInput,
  StyledRadioGroupWrapper,
  InputNumberStyled,
  Styled2ndLine,
} from './styled'
import {
  getUserRole,
  allowedToSelectMultiLanguageInTest,
  getUserIdSelector,
  getIsAiEvaulationDistrictSelector,
} from '../../../src/selectors/user'
import { getDisableAnswerOnPaperSelector } from '../../../TestPage/ducks'
import {
  getIsOverrideFreezeSelector,
  getmultiLanguageEnabled,
  getAdditionalDataSelector,
} from '../../../ClassBoard/ducks'
import DetailsTooltip from '../Container/DetailsTooltip'
import SettingContainer from '../Container/SettingsContainer'
import ShowHintsSwitch from '../../../TestPage/components/Setting/components/Container/HintsToStudents/ShowHintsSwitch'
import RadioOptions from '../../../TestPage/components/Setting/components/Container/HintsToStudents/RadioOptions'
import CalculatorSettings from '../../../Shared/Components/CalculatorSettings'
import { BetaTag2 } from '../../../AssessmentCreate/components/OptionDynamicTest/styled'
import DollarPremiumSymbol from '../Container/DollarPremiumSymbol'

const { COMMON } = testTypes.TEST_TYPES

const {
  releaseGradeTypes,
  evalTypeLabels,
  releaseGradeLabels,
  passwordPolicyOptions,
  passwordPolicy: passwordPolicyValues,
  redirectPolicy,
} = test

const { PARTIAL_CREDIT, PARTIAL_CREDIT_IGNORE_INCORRECT } = evalTypeLabels

const { ShowPreviousAttempt } = redirectPolicy

const QuestionDelivery = {
  [redirectPolicy.QuestionDelivery.ALL]: 'All',
  [redirectPolicy.QuestionDelivery.SKIPPED]: 'Skipped',
  [redirectPolicy.QuestionDelivery.SKIPPED_AND_WRONG]: 'Skipped and Wrong',
  [redirectPolicy.QuestionDelivery.SKIPPED_PARTIAL_AND_WRONG]:
    'Skipped, Partial and Wrong',
}

const Settings = ({
  testSettings = {},
  assignmentSettings = {},
  updateAssignmentSettings,
  isAdvanced,
  changeField,
  _releaseGradeKeys,
  isDocBased,
  disableAnswerOnPaper,
  premium,
  freezeSettings = false,
  features,
  match,
  totalItems,
  lcbBultiLanguageEnabled,
  allowedToSelectMultiLanguage,
  t: i18translate,
  additionalData,
  userId,
  userRole,
  togglePenaltyOnUsingHints,
  testItemsData,
  isAiEvaulationDistrict,
  isVideoQuiz = false,
}) => {
  const [tempTestSettings, updateTempTestSettings] = useState({
    ...testSettings,
  })
  const [passwordStatus, setPasswordStatus] = useState({
    color: blueBorder,
    message: '',
  })
  const [timedTestConfirmed, setTimedtestConfirmed] = useState(false)

  const numInputRef = useRef()

  const passwordValidationStatus = (assignmentPassword) => {
    if (assignmentPassword.split(' ').length > 1) {
      setPasswordStatus({
        color: red,
        message: 'Password must not contain space',
      })
      return
    }
    if (assignmentPassword.length >= 6 && assignmentPassword.length <= 25) {
      setPasswordStatus({
        color: green,
        message: '',
      })
      return
    }
    let validationMessage =
      'Password is too short - must be at least 6 characters'
    if (assignmentPassword.length > 25)
      validationMessage = 'Password is too long'
    setPasswordStatus({
      color: red,
      message: validationMessage,
    })
  }
  const overRideSettings = (key, value) => {
    if ((key === 'maxAnswerChecks' || key === 'maxAttempts') && value < 0)
      value = 0
    if (key === 'answerOnPaper' && value && disableAnswerOnPaper) {
      return notification({
        messageKey: 'answerOnPaperNotSupportedForThisTest',
      })
    }

    const newSettings = {}
    if (
      key === 'restrictNavigationOut' &&
      value === 'warn-and-report-after-n-alerts'
    ) {
      newSettings.restrictNavigationOutAttemptsThreshold = 5
    }

    // SimpleOptions onChange method has similar condition
    if (key === 'scoringType') {
      const penalty = value === evalTypeLabels.PARTIAL_CREDIT

      newSettings.penalty = penalty
    }

    const newSettingsState = {
      ...assignmentSettings,
      ...newSettings,
      [key]: value,
    }

    const newTempTestSettingsState = {
      ...tempTestSettings,
      ...newSettings,
      [key]: value,
    }
    if (key === 'safeBrowser' && value === false) {
      delete newSettingsState.sebPassword
      delete newTempTestSettingsState.sebPassword
    }
    if (key === 'assignmentPassword') {
      passwordValidationStatus(value)
    }
    updateTempTestSettings(newTempTestSettingsState)
    updateAssignmentSettings(newSettingsState)
    changeField(key)(value)
  }

  useEffect(() => {
    const { scoringType: _scoringType, penalty: _penalty } = tempTestSettings
    const {
      scoringType = _scoringType,
      penalty = _penalty,
    } = assignmentSettings
    if (scoringType === PARTIAL_CREDIT && !penalty)
      overRideSettings('scoringType', PARTIAL_CREDIT_IGNORE_INCORRECT)
  }, [])

  const handleUpdatePasswordExpireIn = (e) => {
    let { value = 1 } = e.target
    value *= 60
    // eslint-disable-next-line no-restricted-globals
    if (value < 60 || Number.isNaN(value)) {
      value = 60
    } else if (value > 999 * 60) {
      value = 999 * 60
    }
    overRideSettings('passwordExpireIn', value)
  }

  const handleAutoRedirectSettingsChange = (key, value) => {
    if (key === 'maxRedirects' && (value > 3 || value < 1)) {
      return
    }
    if (key === 'scoreThreshold' && (value > 100 || value < 1)) {
      return
    }
    if (key === 'scoreThreshold' && value === 100) {
      return notification({
        type: 'warn',
        msg: 'Threshold value should be less than 100%',
      })
    }

    const newSettingsState = {
      ...assignmentSettings,
      autoRedirectSettings: {
        ...assignmentSettings.autoRedirectSettings,
        [key]: value,
      },
    }

    changeField('autoRedirect')(true)
    changeField('autoRedirectSettings')(newSettingsState.autoRedirectSettings)
  }

  const updateTimedTestAttrs = (attr, value) => {
    if (
      match?.params?.assignmentId &&
      match?.params?.classId &&
      !timedTestConfirmed
    ) {
      Modal.confirm({
        title: 'Do you want to Proceed ?',
        content:
          'Changes made in Timed Assignment will impact all Students who are In Progress or Not Started.',
        onOk: () => {
          if (attr === 'timedAssignment' && value)
            overRideSettings('allowedTime', totalItems * 60 * 1000)
          overRideSettings(attr, value)
          setTimedtestConfirmed(true)
          Modal.destroyAll()
        },
        onCancel: () => {},
        okText: 'Proceed',
        centered: true,
        width: 500,
        okButtonProps: {
          style: { background: themeColor },
        },
      })
      return
    }
    if (attr === 'timedAssignment' && value)
      overRideSettings('allowedTime', totalItems * 60 * 1000)
    overRideSettings(attr, value)
  }

  const {
    assessmentSuperPowersAutoRedirect,
    assessmentSuperPowersCheckAnswerTries,
    assessmentSuperPowersRequirePassword,
    assessmentSuperPowersAnswerOnPaper,
    assessmentSuperPowersShowCalculator,
    assessmentSuperPowersTimedTest,
    assessmentSuperPowersRestrictQuestionBackNav,
    maxAttemptAllowed,
  } = features

  const {
    releaseScore = tempTestSettings.releaseScore,
    calcTypes = tempTestSettings.calcTypes,
    answerOnPaper = tempTestSettings.answerOnPaper,
    vqPreventSkipping = tempTestSettings.vqPreventSkipping,
    maxAnswerChecks = tempTestSettings.maxAnswerChecks,
    passwordPolicy = tempTestSettings.passwordPolicy,
    assignmentPassword = tempTestSettings.assignmentPassword,
    maxAttempts = tempTestSettings.maxAttempts,
    passwordExpireIn = tempTestSettings.passwordExpireIn || 15 * 60,
    autoRedirect = false,
    autoRedirectSettings,
    blockNavigationToAnsweredQuestions = tempTestSettings.blockNavigationToAnsweredQuestions,
    timedAssignment = tempTestSettings.timedAssignment,
    allowedTime = tempTestSettings.allowedTime,
    pauseAllowed = tempTestSettings.pauseAllowed,
    testType = tempTestSettings.testType,
    multiLanguageEnabled = !!testSettings.multiLanguageEnabled,
    blockSaveAndContinue = tempTestSettings.blockSaveAndContinue,
    restrictNavigationOut = tempTestSettings.restrictNavigationOut,
    safeBrowser = tempTestSettings.safeBrowser,
    restrictNavigationOutAttemptsThreshold = tempTestSettings.restrictNavigationOutAttemptsThreshold,
    allowTeacherRedirect = tempTestSettings.allowTeacherRedirect,
    showHintsToStudents = tempTestSettings.showHintsToStudents,
    penaltyOnUsingHints = tempTestSettings.penaltyOnUsingHints,
    playerSkinType = testSettings.playerSkinType,
    showTtsForPassages = tempTestSettings.showTtsForPassages,
    allowAutoEssayEvaluation = tempTestSettings.allowAutoEssayEvaluation,
  } = assignmentSettings

  const showMultiLangSelection =
    allowedToSelectMultiLanguage && lcbBultiLanguageEnabled

  const navigationThresholdMoreThan1 =
    restrictNavigationOut === 'warn-and-report-after-n-alerts' &&
    restrictNavigationOutAttemptsThreshold > 1

  const isTestlet = playerSkinType?.toLowerCase() === playerSkinValues.testlet
  let isAssignedTeacher = true
  if (
    additionalData &&
    `${additionalData?.assignedBy?._id}` !== `${userId}` &&
    userRole === roleuser.TEACHER
  ) {
    isAssignedTeacher = false
  }
  let isEssayWithRubricQuestion = false
  if (!isEmpty(testItemsData)) {
    for (const item of testItemsData) {
      if (item?.data?.questions) {
        for (const question of item?.data?.questions) {
          if (
            question?.rubrics &&
            question?.title?.toLowerCase().includes('essay')
          ) {
            isEssayWithRubricQuestion = true
            break
          }
        }
      }
      if (isEssayWithRubricQuestion) {
        break
      }
    }
  }
  return (
    <SettingsWrapper isAdvanced={isAdvanced}>
      <StyledDiv>
        {/* Release score */}
        <SettingContainer id="release-score-setting">
          <DetailsTooltip
            title="RELEASE SCORES"
            content="Decide what students immediately get to see upon submitting an assessment."
            premium
          />
          <StyledRow gutter={16}>
            <Col span={12}>
              <Label>
                RELEASE SCORES{' '}
                {releaseScore === releaseGradeLabels.DONT_RELEASE
                  ? '[OFF]'
                  : '[ON]'}
              </Label>
            </Col>
            <Col span={12}>
              <SelectInputStyled
                data-cy="selectRelaseScore"
                placeholder="Please select"
                cache="false"
                value={releaseScore}
                onChange={changeField('releaseScore')}
                height="30px"
              >
                {_releaseGradeKeys.map((item, index) => (
                  <Select.Option data-cy="class" key={index} value={item}>
                    {releaseGradeTypes[item]}
                  </Select.Option>
                ))}
              </SelectInputStyled>
            </Col>
          </StyledRow>
        </SettingContainer>
        {/* Release score */}

        {/* Show Calculator */}
        <SettingContainer>
          <DetailsTooltip
            title="SHOW CALCULATOR"
            content={i18translate('calculatorTypesSettings.info')}
            premium={assessmentSuperPowersShowCalculator}
          />
          <StyledRow gutter={16} mb="15px">
            <Col span={12}>
              <Label>SHOW CALCULATOR</Label>
            </Col>
            <Col span={12}>
              <CalculatorSettings
                disabled={
                  freezeSettings || !assessmentSuperPowersShowCalculator
                }
                value={calcTypes}
                onChange={(value) => overRideSettings('calcTypes', value)}
              />
            </Col>
          </StyledRow>
        </SettingContainer>
        {/* Show Calculator */}

        {/* Maximum attempt */}
        <SettingContainer>
          <DetailsTooltip
            title="MAXIMUM ATTEMPTS ALLOWED"
            content="Control the number of times a student can take the assignment."
            premium={maxAttemptAllowed}
          />
          <StyledRow gutter={16} mb="15px">
            <Col span={12}>
              <Label>MAXIMUM ATTEMPTS ALLOWED</Label>
            </Col>
            <Col span={12}>
              <InputNumber
                disabled={freezeSettings || !maxAttemptAllowed}
                value={maxAttempts}
                onChange={(value) => overRideSettings('maxAttempts', value)}
                min={1}
                step={1}
                bg="white"
                width="20%"
                data-cy="max-attempts-allowed"
              />
            </Col>
          </StyledRow>
        </SettingContainer>
        {/* Maximum attempt */}

        {
          /* Check Answer Tries Per Question */
          !isDocBased && (
            <SettingContainer>
              <DetailsTooltip
                title="CHECK ANSWER TRIES PER QUESTION"
                content="Control whether student can check in answer during attempt or not. Value mentioned will be equivalent to number of attempts allowed per student."
                premium={assessmentSuperPowersCheckAnswerTries}
              />
              <StyledRow gutter={16} mb="15px">
                <Col span={12}>
                  <Label>CHECK ANSWER TRIES PER QUESTION</Label>
                </Col>
                <Col span={12}>
                  <InputNumber
                    disabled={
                      freezeSettings || !assessmentSuperPowersCheckAnswerTries
                    }
                    onChange={(value) =>
                      overRideSettings('maxAnswerChecks', value)
                    }
                    value={maxAnswerChecks}
                    min={0}
                    placeholder="Number of tries"
                    bg="white"
                    data-cy="check-ans-tries"
                    width="20%"
                  />
                </Col>
              </StyledRow>
            </SettingContainer>
          )
          /* Check Answer Tries Per Question */
        }

        {/* Multi language */}
        {showMultiLangSelection && (
          <SettingContainer>
            <DetailsTooltip
              title="Multi-Language"
              content="Select ON , If you want to enable multiple languages for the test."
              premium={premium}
            />
            <StyledRow gutter={16} mb="15px" height="40">
              <Col span={12}>
                <Label>
                  <span>Multi-Language</span>
                </Label>
              </Col>
              <Col
                span={10}
                style={{ display: 'flex', flexDirection: 'column' }}
              >
                <Row style={{ display: 'flex', alignItems: 'center' }}>
                  <AlignSwitchRight
                    data-cy="multi-language"
                    size="small"
                    defaultChecked={false}
                    disabled={freezeSettings}
                    checked={multiLanguageEnabled}
                    onChange={(value) =>
                      overRideSettings('multiLanguageEnabled', value)
                    }
                  />
                </Row>
              </Col>
            </StyledRow>
          </SettingContainer>
        )}
        {/* Multi language */}
        {COMMON.includes(testType) && (
          <SettingContainer>
            <DetailsTooltip
              title="Allow Teachers to Redirect"
              content={i18translate('allowTeacherToRedirect.info')}
              premium={assessmentSuperPowersAutoRedirect}
            />
            <StyledRow gutter={16}>
              <StyledCol span={12}>
                <Label>Allow Teachers to Redirect</Label>
              </StyledCol>
              <StyledCol span={12}>
                <AlignSwitchRight
                  data-cy="allow-teacher-redirect-switch"
                  size="small"
                  defaultChecked
                  disabled={freezeSettings || !isAssignedTeacher}
                  checked={allowTeacherRedirect}
                  onChange={(value) =>
                    overRideSettings('allowTeacherRedirect', value)
                  }
                />
              </StyledCol>
            </StyledRow>
          </SettingContainer>
        )}
        {/* Auto Redirect */}
        <SettingContainer>
          <DetailsTooltip
            title="Enable Auto Redirect"
            content="When selected, allows students to automatically retake a test when they scored below a set threshold. Enables students to practice and improve learning through multiple self-directed attempts."
            premium={assessmentSuperPowersAutoRedirect}
          />
          <StyledRow gutter={16}>
            <StyledCol span={12}>
              <Label>Enable Auto Redirect</Label>
            </StyledCol>
            <StyledCol span={12}>
              <AlignSwitchRight
                data-cy="assignment-auto-redirect-switch"
                size="small"
                defaultChecked={false}
                disabled={freezeSettings || !assessmentSuperPowersAutoRedirect}
                checked={autoRedirect}
                onChange={(value) => changeField('autoRedirect')(value)}
              />
            </StyledCol>
          </StyledRow>
        </SettingContainer>
        {autoRedirect && (
          <>
            <SettingContainer>
              <DetailsTooltip
                title="SCORE THRESHOLD"
                content="If student scores below the selected percentage score, the student will automatically be given the option to retake the test."
                premium={assessmentSuperPowersAutoRedirect}
              />
              <StyledRow gutter={16}>
                <StyledCol span={12}>
                  <Label>SCORE THRESHOLD</Label>
                </StyledCol>
                <StyledCol span={12}>
                  <InputNumber
                    style={{ marginRight: '10px' }}
                    data-cy="auto-redirect-score-threshold"
                    min={1}
                    max={99}
                    value={autoRedirectSettings.scoreThreshold || ''}
                    onChange={(value) =>
                      handleAutoRedirectSettingsChange('scoreThreshold', value)
                    }
                  />
                  %
                </StyledCol>
              </StyledRow>
            </SettingContainer>

            <StyledRow gutter={16}>
              <StyledCol span={12}>
                <Label>EXTRA ATTEMPTS ALLOWED</Label>
              </StyledCol>
              <StyledCol span={12}>
                <InputNumber
                  data-cy="auto-redirect-max-attempts"
                  min={1}
                  max={3}
                  value={autoRedirectSettings.maxRedirects || ''}
                  onChange={(value) =>
                    handleAutoRedirectSettingsChange('maxRedirects', value)
                  }
                />
              </StyledCol>
            </StyledRow>

            <SettingContainer>
              <DetailsTooltip
                title="QUESTIONS DELIVERY"
                content="Choose which questions students should see on redirected tests."
                premium={assessmentSuperPowersAutoRedirect}
              />
              <StyledRow gutter={16}>
                <StyledCol span={12}>
                  <Label>QUESTIONS DELIVERY</Label>
                </StyledCol>
                <StyledCol span={12}>
                  <SelectInputStyled
                    data-cy="auto-redirect-que-delivery"
                    disabled={freezeSettings}
                    onChange={(value) => {
                      handleAutoRedirectSettingsChange(
                        'questionsDelivery',
                        value
                      )
                    }}
                    value={autoRedirectSettings.questionsDelivery || ''}
                    height="30px"
                  >
                    {Object.keys(QuestionDelivery).map((item, index) => (
                      <Select.Option key={index} value={item}>
                        {QuestionDelivery[item]}
                      </Select.Option>
                    ))}
                  </SelectInputStyled>
                </StyledCol>
              </StyledRow>
            </SettingContainer>

            <SettingContainer>
              <DetailsTooltip
                title="SHOW PREVIOUS ATTEMPT"
                content="Choose how much information students will see on redirected tests."
                premium={assessmentSuperPowersAutoRedirect}
                placement="rightTop"
              />
              <StyledRow gutter={16}>
                <StyledCol span={12}>
                  <Label>SHOW PREVIOUS ATTEMPT</Label>
                </StyledCol>
                <StyledCol span={12}>
                  <SelectInputStyled
                    data-cy="auto-redirect-poilcy"
                    disabled={freezeSettings}
                    onChange={(value) => {
                      handleAutoRedirectSettingsChange(
                        'showPreviousAttempt',
                        value
                      )
                    }}
                    value={autoRedirectSettings.showPreviousAttempt || ''}
                    height="30px"
                  >
                    {Object.keys(ShowPreviousAttempt).map((item, index) => (
                      <Select.Option key={index} value={item}>
                        {ShowPreviousAttempt[item]}
                      </Select.Option>
                    ))}
                  </SelectInputStyled>
                </StyledCol>
              </StyledRow>
            </SettingContainer>
          </>
        )}
        {/* Auto Redirect */}

        {
          /* BLOCK SAVE AND CONTINUE starts */
          <SettingContainer id="block-saveandcontinue-setting">
            <DetailsTooltip
              title="Complete test in one sitting"
              content="If ON, then students will not be allowed to exit the test without submitting. In case they close the app they will be paused and the instructor will need to manually resume."
              placement="rightTop"
              premium
            />
            <StyledRow gutter={16} mb="15px">
              <Col span={12}>
                <Label>Complete test in one sitting</Label>
              </Col>
              <Col span={12}>
                <AlignSwitchRight
                  disabled={freezeSettings || !premium}
                  size="small"
                  checked={blockSaveAndContinue}
                  data-cy="bockSaveAndContinueSwitch"
                  onChange={(value) =>
                    overRideSettings('blockSaveAndContinue', value)
                  }
                />
              </Col>
            </StyledRow>
          </SettingContainer>
          /* BLOCK SAVE AND CONTINUE ends */
        }

        {
          /* Restrict navigation out starts */
          <SettingContainer id="restrict-nav-out-setting">
            <DetailsTooltip
              title="Restrict Navigation Out Of Test"
              content={
                <>
                  <p>
                    If ON, students must take the test in full screen mode to
                    prevent opening another browser window. Alert will appear if
                    student has navigated away for more than 5 seconds. If the
                    designated number of alerts are exceeded, the student’s
                    assignment will be paused and the instructor will need to
                    manually reset.
                  </p>
                  <p>Please Note: this is not compatible with iPads.</p>
                  {navigationThresholdMoreThan1 ? (
                    <>
                      <br />
                      <p>
                        Alert will appear if student has navigated away for more
                        than 5 seconds and student will be blocked after{' '}
                        {restrictNavigationOutAttemptsThreshold * 5} seconds
                      </p>
                    </>
                  ) : (
                    ''
                  )}
                </>
              }
              premium={premium}
            />
            <StyledRow gutter={16} mb="15px">
              <Col span={12}>
                <Label>Restrict Navigation Out Of Test</Label>
              </Col>
              <Col span={12}>
                <StyledRadioGroupWrapper
                  value={!premium ? false : restrictNavigationOut || false}
                  disabled={freezeSettings || !premium || safeBrowser}
                  onChange={(e) => {
                    overRideSettings('restrictNavigationOut', e.target.value)
                  }}
                >
                  <RadioBtn
                    value={false}
                    data-cy="restrict-nav-out-disabled"
                    title={
                      safeBrowser && 'Disabled since Safe Exam Browser Enabled'
                    }
                  >
                    DISABLED
                  </RadioBtn>
                  <br />
                  <RadioBtn
                    title={
                      safeBrowser && 'Disabled since Safe Exam Browser Enabled'
                    }
                    value="warn-and-report"
                    data-cy="restrict-nav-out-warn-report"
                  >
                    WARN AND REPORT ONLY
                  </RadioBtn>
                  <br />
                  <RadioBtn
                    value="warn-and-report-after-n-alerts"
                    data-cy="restrict-nav-out-warn-report-alerts"
                    title={
                      safeBrowser
                        ? 'Disabled since Safe Exam Browser Enabled'
                        : 'Alert will appear if student has navigated away for more than 5 seconds'
                    }
                  >
                    WARN AND BLOCK TEST AFTER{' '}
                    <InputNumberStyled
                      size="small"
                      ref={numInputRef}
                      min={1}
                      value={
                        !premium
                          ? undefined
                          : restrictNavigationOut
                          ? restrictNavigationOutAttemptsThreshold
                          : undefined
                      }
                      onChange={(v) => {
                        if (v) {
                          overRideSettings(
                            'restrictNavigationOutAttemptsThreshold',
                            v
                          )
                        } else {
                          numInputRef.current?.blur()
                          overRideSettings(
                            'restrictNavigationOut',
                            'warn-and-report'
                          )
                        }
                      }}
                      disabled={
                        !(
                          restrictNavigationOut ===
                          'warn-and-report-after-n-alerts'
                        ) ||
                        freezeSettings ||
                        safeBrowser ||
                        !premium
                      }
                    />{' '}
                    ALERTS
                    {navigationThresholdMoreThan1 ? (
                      <Styled2ndLine>
                        {' '}
                        {`or maximum of ${
                          restrictNavigationOutAttemptsThreshold * 5
                        } sec.`}{' '}
                      </Styled2ndLine>
                    ) : (
                      ''
                    )}
                  </RadioBtn>
                </StyledRadioGroupWrapper>
              </Col>
            </StyledRow>
          </SettingContainer>
          /* Restrict navigation ends */
        }

        {
          /* Restrict Question Navigation */
          !isDocBased && (
            <SettingContainer>
              <DetailsTooltip
                title="Restrict question navigation"
                content="If ON, then students will be restricted from navigating back to the previous question that they have answered. It is recommended to use this along with Shuffle Questions for preventing cheating among students."
                placement="rightTop"
                premium={assessmentSuperPowersRestrictQuestionBackNav}
              />
              <StyledRow gutter={16} mb="15px">
                <Col span={12}>
                  <Label>RESTRICT QUESTION NAVIGATION</Label>
                </Col>
                <Col span={12}>
                  <AlignSwitchRight
                    disabled={
                      freezeSettings ||
                      !assessmentSuperPowersRestrictQuestionBackNav
                    }
                    size="small"
                    checked={blockNavigationToAnsweredQuestions}
                    data-cy="restrict-backward-nav"
                    onChange={(value) =>
                      overRideSettings(
                        'blockNavigationToAnsweredQuestions',
                        value
                      )
                    }
                  />
                </Col>
              </StyledRow>
            </SettingContainer>
          )
          /* Restrict Question Navigation */
        }
        {!(isDocBased || isTestlet) &&
          isEssayWithRubricQuestion &&
          isAiEvaulationDistrict && (
            <SettingContainer>
              <DetailsTooltip
                title={i18translate('allowAutoEssayEvaluation.title')}
                content={i18translate('allowAutoEssayEvaluation.info')}
                premium={premium}
                warningText={`(${i18translate('rubric.infoText')})`}
              />
              <StyledRow gutter={16} mb="15px">
                <Col span={12}>
                  <Label>
                    {i18translate('allowAutoEssayEvaluation.title')}
                    <BetaTag2>BETA</BetaTag2>
                    <DollarPremiumSymbol premium={premium} />
                  </Label>
                </Col>
                <Col span={12}>
                  <AlignSwitchRight
                    data-cy="auto-essay-evaluation"
                    disabled={freezeSettings || !premium}
                    size="small"
                    defaultChecked={false}
                    checked={allowAutoEssayEvaluation}
                    onChange={(value) =>
                      overRideSettings('allowAutoEssayEvaluation', value)
                    }
                  />
                </Col>
              </StyledRow>
            </SettingContainer>
          )}
        {/* Show TTS for passage */}
        {!(isDocBased || isTestlet) && (
          <SettingContainer>
            <DetailsTooltip
              title={i18translate('showTtsForPassage.title')}
              content={i18translate('showTtsForPassage.info')}
              premium={premium}
            />
            <StyledRow gutter={16} mb="15px">
              <Col span={12}>
                <Label>{i18translate('showTtsForPassage.title')}</Label>
              </Col>
              <Col span={12}>
                <AlignSwitchRight
                  data-cy="showTtsForPassages"
                  disabled={freezeSettings || !premium}
                  size="small"
                  checked={showTtsForPassages}
                  onChange={(value) =>
                    overRideSettings('showTtsForPassages', value)
                  }
                  switchTextYesNo
                />
              </Col>
            </StyledRow>
          </SettingContainer>
        )}
        {/* Show TTS for passage */}

        {/* Timed TEST */}
        <SettingContainer>
          <DetailsTooltip
            title="TIMED TEST"
            content="The time can be modified in one minute increments. When the time limit is reached, students will be locked out of the assessment. If the student begins an assessment and exits with time remaining, upon returning, the timer will start up again where the student left off. This ensures that the student does not go over the allotted time."
            placement="rightTop"
            premium={assessmentSuperPowersTimedTest}
          />
          <StyledRow gutter={16} height="40">
            <Col span={12}>
              <Label>
                <span>TIMED TEST</span>
              </Label>
            </Col>
            <Col span={10} style={{ display: 'flex', flexDirection: 'column' }}>
              <Row style={{ display: 'flex', alignItems: 'center' }}>
                <AlignSwitchRight
                  data-cy="assignment-time-switch"
                  size="small"
                  defaultChecked={false}
                  disabled
                  checked={timedAssignment}
                  onChange={(value) =>
                    updateTimedTestAttrs('timedAssignment', value)
                  }
                />
                {timedAssignment && (
                  <>
                    {/* eslint-disable no-restricted-globals */}
                    <TimeSpentInput
                      onChange={(e) => {
                        if (
                          e.target.value.length <= 3 &&
                          e.target.value <= 300
                        ) {
                          updateTimedTestAttrs(
                            'allowedTime',
                            e.target.value * 60 * 1000
                          )
                        }
                      }}
                      size="large"
                      data-cy="assignment-time"
                      value={
                        !isNaN(allowedTime)
                          ? allowedTime / (60 * 1000) || ''
                          : 1
                      }
                      type="number"
                      min={1}
                      max={300}
                      step={1}
                      disabled={!assessmentSuperPowersTimedTest}
                    />
                    <Label>MINUTES</Label>
                    {/* eslint-enable no-restricted-globals */}
                  </>
                )}
              </Row>
              <Row>
                {timedAssignment && (
                  <CheckBoxWrapper>
                    <CheckboxLabel
                      disabled={
                        freezeSettings || !assessmentSuperPowersTimedTest
                      }
                      data-cy="exit-allowed"
                      checked={pauseAllowed}
                      onChange={(e) =>
                        updateTimedTestAttrs('pauseAllowed', e.target.checked)
                      }
                    >
                      <span>Allow student to save and continue later</span>
                    </CheckboxLabel>
                  </CheckBoxWrapper>
                )}
              </Row>
            </Col>
          </StyledRow>
        </SettingContainer>
        {/* Timed TEST */}

        {/* Show hints to students */}
        {!isDocBased && !isTestlet && (
          <SettingContainer>
            <DetailsTooltip
              title="SHOW HINTS TO STUDENTS"
              content="Students will be able to see the hint associated with an item while attempting the assignment"
              premium={premium}
            />
            <StyledRow gutter={16} mb="15p">
              <Col span={12}>
                <Label>SHOW HINTS TO STUDENTS</Label>
              </Col>
              <Col span={12}>
                <StyledRow borderBottom="none" padding="0px 0px 10px 0px">
                  <ShowHintsSwitch
                    disabled={freezeSettings || !premium}
                    checked={showHintsToStudents}
                    onChangeHandler={(value) =>
                      overRideSettings('showHintsToStudents', value)
                    }
                  />
                </StyledRow>
                {showHintsToStudents && (
                  <StyledRow borderBottom="none" padding="0px">
                    <RadioOptions
                      disabled={freezeSettings || !premium}
                      penaltyOnUsingHints={penaltyOnUsingHints}
                      updatePenaltyPoints={(value) =>
                        overRideSettings('penaltyOnUsingHints', value)
                      }
                      togglePenaltyOnUsingHints={togglePenaltyOnUsingHints}
                      isAssignPage
                    />
                  </StyledRow>
                )}
              </Col>
            </StyledRow>
          </SettingContainer>
        )}
        {/* Show hints to students */}

        {/* Answer on Paper */}
        <SettingContainer>
          <DetailsTooltip
            title="ANSWER ON PAPER"
            content="Use this option if you are administering this assessment on paper. If you use this option, you will have to manually grade student responses after the assessment is closed."
            premium={assessmentSuperPowersAnswerOnPaper}
          />
          <StyledRow gutter={16} mb="15p">
            <Col span={12}>
              <Label>ANSWER ON PAPER</Label>
            </Col>
            <Col span={12}>
              <AlignSwitchRight
                data-cy="ans-on-paper"
                disabled={
                  disableAnswerOnPaper ||
                  freezeSettings ||
                  !assessmentSuperPowersAnswerOnPaper
                }
                size="small"
                checked={answerOnPaper}
                onChange={(value) => overRideSettings('answerOnPaper', value)}
              />
            </Col>
          </StyledRow>
        </SettingContainer>
        {/* Answer on Paper */}

        {/* Prevent vq skipping */}
        <EduIf condition={isVideoQuiz}>
          <SettingContainer>
            <DetailsTooltip
              title="Prevent Skipping"
              content="If ON, Students won't be able to skip ahead in a video."
              premium={premium}
            />
            <StyledRow gutter={16} mb="15p">
              <Col span={12}>
                <Label>Prevent Skipping</Label>
              </Col>
              <Col span={12}>
                <AlignSwitchRight
                  data-cy="ans-on-paper"
                  disabled={freezeSettings || !premium}
                  size="small"
                  checked={vqPreventSkipping}
                  onChange={(value) =>
                    overRideSettings('vqPreventSkipping', value)
                  }
                />
              </Col>
            </StyledRow>
          </SettingContainer>
        </EduIf>
        {/* Prevent vq skipping */}

        {/* Multi language */}
        {showMultiLangSelection && (
          <StyledRow gutter={16}>
            <Col span={12}>
              <Label>Multi-Language</Label>
            </Col>
            <Col span={12}>
              <AlignSwitchRight
                data-cy="multi-language"
                size="small"
                defaultChecked={false}
                disabled={freezeSettings || !premium}
                checked={multiLanguageEnabled}
                onChange={(value) =>
                  overRideSettings('multiLanguageEnabled', value)
                }
              />
            </Col>
          </StyledRow>
        )}
        {/* Multi language */}

        {/* Require Password */}
        <SettingContainer>
          <DetailsTooltip
            title="REQUIRE PASSWORD"
            content="Require your students to type a password when opening the assessment."
            premium={assessmentSuperPowersRequirePassword}
          />
          <StyledRow gutter={16} mb="15px">
            <Col span={12}>
              <Label>REQUIRE PASSWORD</Label>
            </Col>
            <Col span={12}>
              <Row>
                <Col span={24}>
                  <SelectInputStyled
                    data-cy="password-policy"
                    disabled={
                      freezeSettings || !assessmentSuperPowersRequirePassword
                    }
                    placeholder="Please select"
                    cache="false"
                    value={passwordPolicy}
                    onChange={changeField('passwordPolicy')}
                    height="30px"
                  >
                    {Object.keys(passwordPolicyValues).map((item, index) => (
                      <Select.Option
                        data-cy="class"
                        key={index}
                        value={passwordPolicyValues[item]}
                      >
                        {passwordPolicyOptions[item]}
                      </Select.Option>
                    ))}
                  </SelectInputStyled>
                </Col>

                {passwordPolicy ===
                  test.passwordPolicy.REQUIRED_PASSWORD_POLICY_STATIC && (
                  <Col span={24}>
                    <Password
                      disabled={freezeSettings}
                      onChange={(e) =>
                        overRideSettings('assignmentPassword', e.target.value)
                      }
                      size="large"
                      value={assignmentPassword}
                      type="text"
                      placeholder="Enter Password"
                      data-cy="passwordTextBox"
                      color={passwordStatus.color}
                    />
                    <MessageSpan>{passwordStatus.message}</MessageSpan>
                  </Col>
                )}

                {passwordPolicy ===
                  test.passwordPolicy.REQUIRED_PASSWORD_POLICY_DYNAMIC && (
                  <Col span={24}>
                    <Input
                      disabled={freezeSettings}
                      required
                      type="number"
                      onChange={handleUpdatePasswordExpireIn}
                      value={passwordExpireIn / 60}
                      style={{ width: '100px' }}
                      max={999}
                      min={1}
                      step={1}
                    />{' '}
                    MINUTES
                  </Col>
                )}
              </Row>
            </Col>
            {passwordPolicy ===
              test.passwordPolicy.REQUIRED_PASSWORD_POLICY_STATIC && (
              <Col span={24} style={{ marginTop: '10px' }}>
                The password is entered by you and does not change. Students
                must enter this password before they can take the assessment.
              </Col>
            )}
            {passwordPolicy ===
              test.passwordPolicy.REQUIRED_PASSWORD_POLICY_DYNAMIC && (
              <Col span={24} style={{ marginTop: '10px' }}>
                Students must enter a password to take the assessment. The
                password is auto-generated and revealed only when the assessment
                is opened. If you select this method, you also need to specify
                the time in minutes after which the password would automatically
                expire. Use this method for highly sensitive and secure
                assessments. If you select this method, the teacher or the
                proctor must open the assessment manually and announce the
                password in class when the students are ready to take the
                assessment.
              </Col>
            )}
          </StyledRow>
        </SettingContainer>
        {/* Require Password */}
      </StyledDiv>
    </SettingsWrapper>
  )
}

const enhance = compose(
  withNamespaces('author'),
  withRouter,
  connect(
    (state) => ({
      userRole: getUserRole(state),
      disableAnswerOnPaper: getDisableAnswerOnPaperSelector(state),
      premium: state?.user?.user?.features?.premium,
      totalItems: state?.tests?.entity?.isDocBased
        ? state?.tests?.entity?.summary?.totalQuestions
        : state?.tests?.entity?.summary?.totalItems,
      freezeSettings: getIsOverrideFreezeSelector(state),
      features: state?.user?.user?.features,
      testItemsData: get(
        state,
        ['author_classboard_testActivity', 'data', 'testItemsData'],
        []
      ),
      userId: getUserIdSelector(state),
      lcbBultiLanguageEnabled: getmultiLanguageEnabled(state),
      allowedToSelectMultiLanguage: allowedToSelectMultiLanguageInTest(state),
      additionalData: getAdditionalDataSelector(state),
      isAiEvaulationDistrict: getIsAiEvaulationDistrictSelector(state),
    }),
    null
  )
)

export default enhance(Settings)
