import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import { Row, Col, Select, Input, InputNumber } from 'antd'
import { green, red, blueBorder } from '@edulastic/colors'
import { test } from '@edulastic/constants'
import {
  RadioBtn,
  notification,
  SelectInputStyled,
  NumberInputStyled,
} from '@edulastic/common'
import { withRouter } from 'react-router-dom'
import {
  AlignRight,
  AlignSwitchRight,
  SettingsWrapper,
  Password,
  StyledDiv,
  MessageSpan,
  Label,
  StyledCol,
  StyledRow,
} from './styled'
import { getUserRole } from '../../../src/selectors/user'
import {
  getDisableAnswerOnPaperSelector,
  getIsOverrideFreezeSelector,
} from '../../../TestPage/ducks'
import DetailsTooltip from '../Container/DetailsTooltip'
import { SettingContainer } from '../Container/styled'

const {
  calculatorKeys,
  calculators,
  calculatorTypes,
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
  [redirectPolicy.QuestionDelivery.SKIPPED_AND_WRONG]: 'Skipped and Wrong',
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
  calculatorProvider,
  features,
}) => {
  const [tempTestSettings, updateTempTestSettings] = useState({
    ...testSettings,
  })
  const [passwordStatus, setPasswordStatus] = useState({
    color: blueBorder,
    message: '',
  })

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

  const {
    assessmentSuperPowersAutoRedirect,
    assessmentSuperPowersCheckAnswerTries,
    assessmentSuperPowersRequirePassword,
    assessmentSuperPowersAnswerOnPaper,
    assessmentSuperPowersShowCalculator,
    assessmentSuperPowersTimedTest,
    assessmentSuperPowersRestrictQuestionBackNav,
  } = features

  const {
    releaseScore = tempTestSettings.releaseScore,
    calcType = tempTestSettings.calcType,
    answerOnPaper = tempTestSettings.answerOnPaper,
    maxAnswerChecks = tempTestSettings.maxAnswerChecks,
    passwordPolicy = tempTestSettings.passwordPolicy,
    assignmentPassword = tempTestSettings.assignmentPassword,
    maxAttempts = tempTestSettings.maxAttempts,
    passwordExpireIn = tempTestSettings.passwordExpireIn || 15 * 60,
    autoRedirect = false,
    autoRedirectSettings,
    blockNavigationToAnsweredQuestions = tempTestSettings.blockNavigationToAnsweredQuestions,
  } = assignmentSettings

  const checkForCalculator = premium && calculatorProvider !== 'DESMOS'
  const calculatorKeysAvailable =
    (checkForCalculator &&
      calculatorKeys.filter((i) =>
        [calculatorTypes.NONE, calculatorTypes.BASIC].includes(i)
      )) ||
    calculatorKeys

  return (
    <SettingsWrapper isAdvanced={isAdvanced}>
      <StyledDiv>
        {/* Release score */}
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
        {/* Release score */}

        {/* Maximum attempt */}
        <SettingContainer>
          <DetailsTooltip
            title="MAXIMUM ATTEMPTS ALLOWED"
            content="Control the number of times a student can take the assignment."
            premium={assessmentSuperPowersTimedTest}
          />
          <StyledRow gutter={16} mb="15px">
            <Col span={12}>
              <Label>MAXIMUM ATTEMPTS ALLOWED</Label>
            </Col>
            <Col span={12}>
              <NumberInputStyled
                size="large"
                disabled={freezeSettings || !assessmentSuperPowersTimedTest}
                value={maxAttempts}
                onChange={(value) => overRideSettings('maxAttempts', value)}
                min={1}
                step={1}
                bg="white"
                width="20%"
              />
            </Col>
          </StyledRow>
        </SettingContainer>
        {/* Maximum attempt */}

        {/* Show Calculator */}
        <SettingContainer>
          <DetailsTooltip
            title="SHOW CALCULATOR"
            content="Choose if student can use a calculator, also select the type of calculator that would be shown to the students."
            premium={assessmentSuperPowersShowCalculator}
          />
          <StyledRow gutter={16} mb="15px">
            <Col span={12}>
              <Label>SHOW CALCULATOR</Label>
            </Col>
            <Col span={12}>
              <AlignRight
                disabled={
                  freezeSettings || !assessmentSuperPowersShowCalculator
                }
                value={calcType}
                onChange={(e) => overRideSettings('calcType', e.target.value)}
              >
                {calculatorKeysAvailable.map((item) => (
                  <RadioBtn data-cy={item} value={item} key={item}>
                    <Label>{calculators[item]}</Label>
                  </RadioBtn>
                ))}
              </AlignRight>
            </Col>
          </StyledRow>
        </SettingContainer>
        {/* Show Calculator */}

        {/* Answer on Paper */}
        <SettingContainer>
          <DetailsTooltip
            title="ANSWER ON PAPER"
            content="Use this option if you are administering this assessment on paper. If you use this option, you will have to manually grade student responses after the assessment is closed."
            placement="rightBottom"
            premium={assessmentSuperPowersAnswerOnPaper}
          />
          <StyledRow gutter={16} mb="15p">
            <Col span={12}>
              <Label>ANSWER ON PAPER</Label>
            </Col>
            <Col span={12}>
              <AlignSwitchRight
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

        {/* Require Password */}
        <SettingContainer>
          <DetailsTooltip
            title="REQUIRE PASSWORD"
            content="Require your students to type a password when opening the assessment. Password ensures that your students can access this assessment only in the classroom."
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

        {
          /* Check Answer Tries Per Question */
          !isDocBased && (
            <SettingContainer>
              <DetailsTooltip
                title="CHECK ANSWER TRIES PER QUESTION"
                content="Control whether student can check in answer during attempt or not. Value mentioned will be equivalent to number of attempts allowed per student."
                premium={assessmentSuperPowersTimedTest}
              />
              <StyledRow gutter={16} mb="15px">
                <Col span={12}>
                  <Label>CHECK ANSWER TRIES PER QUESTION</Label>
                </Col>
                <Col span={12}>
                  <NumberInputStyled
                    disabled={
                      freezeSettings || !assessmentSuperPowersCheckAnswerTries
                    }
                    onChange={(value) =>
                      overRideSettings('maxAnswerChecks', value)
                    }
                    size="large"
                    value={maxAnswerChecks}
                    min={0}
                    placeholder="Number of tries"
                    bg="white"
                  />
                </Col>
              </StyledRow>
            </SettingContainer>
          )
          /* Check Answer Tries Per Question */
        }

        {/* Auto Redirect */}
        <SettingContainer>
          <DetailsTooltip
            title="Enable Auto Redirect"
            content="Allow students to take the assignment multiple times to practice and improve their learning."
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
          {autoRedirect && (
            <>
              <StyledRow gutter={16}>
                <StyledCol span={12}>
                  <Label>SCORE THRESHOLD</Label>
                </StyledCol>
                <StyledCol span={12}>
                  <InputNumber
                    min={1}
                    max={99}
                    value={autoRedirectSettings.scoreThreshold || ''}
                    onChange={(value) =>
                      handleAutoRedirectSettingsChange('scoreThreshold', value)
                    }
                  />
                </StyledCol>
              </StyledRow>

              <StyledRow gutter={16}>
                <StyledCol span={12}>
                  <Label>MAXIMUM ATTEMPTS ALLOWED</Label>
                </StyledCol>
                <StyledCol span={12}>
                  <InputNumber
                    min={1}
                    max={3}
                    value={autoRedirectSettings.maxRedirects || ''}
                    onChange={(value) =>
                      handleAutoRedirectSettingsChange('maxRedirects', value)
                    }
                  />
                </StyledCol>
              </StyledRow>

              <StyledRow gutter={16}>
                <StyledCol span={12}>
                  <Label>QUESTIONS DELIVERY</Label>
                </StyledCol>
                <StyledCol span={12}>
                  <SelectInputStyled
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

              <StyledRow gutter={16}>
                <StyledCol span={12}>
                  <Label>SHOW PREVIOUS ATTEMPT</Label>
                </StyledCol>
                <StyledCol span={12}>
                  <SelectInputStyled
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
            </>
          )}
        </SettingContainer>
        {/* Auto Redirect */}

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
      </StyledDiv>
    </SettingsWrapper>
  )
}

export default connect(
  (state) => ({
    userRole: getUserRole(state),
    disableAnswerOnPaper: getDisableAnswerOnPaperSelector(state),
    premium: state?.user?.user?.features?.premium,
    calculatorProvider: state?.user?.user?.features?.calculatorProvider,
    totalItems: state?.tests?.entity?.isDocBased
      ? state?.tests?.entity?.summary?.totalQuestions
      : state?.tests?.entity?.summary?.totalItems,
    freezeSettings: getIsOverrideFreezeSelector(state),
    features: state?.user?.user?.features,
  }),
  null
)(withRouter(Settings))
