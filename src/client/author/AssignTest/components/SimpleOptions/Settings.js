import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import {
  Row,
  Col,
  Radio,
  Select,
  Icon,
  Input,
  Tooltip,
  Modal,
  InputNumber,
} from 'antd'
import {
  green,
  red,
  blueBorder,
  themeColor,
  lightGrey9,
} from '@edulastic/colors'
import { test, roleuser } from '@edulastic/constants'
import {
  RadioBtn,
  CheckboxLabel,
  notification,
  SelectInputStyled,
  NumberInputStyled,
} from '@edulastic/common'
import { IconCaretDown, IconInfo } from '@edulastic/icons'
import { isUndefined } from 'lodash'
import { withRouter } from 'react-router-dom'
import FeaturesSwitch from '../../../../features/components/FeaturesSwitch'
import {
  AlignRight,
  AlignSwitchRight,
  StyledRowSettings,
  StyledRowSelect,
  SettingsWrapper,
  Password,
  StyledDiv,
  CheckBoxWrapper,
  MessageSpan,
  DivBlock,
  Label,
  AdvancedButton,
  Block,
  StyledRadioGroup,
  RadioWrapper,
  Title,
  TimeSpentInput,
  StyledCol,
  StyledRow,
} from './styled'
import StandardProficiencyTable from '../../../TestPage/components/Setting/components/Container/StandardProficiencyTable'
import SubscriptionsBlock from '../../../TestPage/components/Setting/components/Container/SubscriptionsBlock'

import PeformanceBand from '../../../TestPage/components/Setting/components/Container/PeformanceBand'

import { getUserRole, getUserFeatures } from '../../../src/selectors/user'
import TestTypeSelector from './TestTypeSelector'
import PlayerSkinSelector from './PlayerSkinSelector'
import {
  getDisableAnswerOnPaperSelector,
  getIsOverrideFreezeSelector,
} from '../../../TestPage/ducks'

const completionTypeKeys = ['AUTOMATICALLY', 'MANUALLY']
const {
  calculatorKeys,
  calculators,
  calculatorTypes,
  releaseGradeTypes,
  evalTypes,
  evalTypeLabels,
  completionTypes,
  testContentVisibilityTypes,
  testContentVisibility: testContentVisibilityOptions,
  releaseGradeLabels,
  passwordPolicyOptions,
  passwordPolicy: passwordPolicyValues,
  accessibilities,
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
  gradeSubject,
  _releaseGradeKeys,
  userRole,
  isDocBased,
  forClassLevel = false,
  disableAnswerOnPaper,
  premium,
  totalItems,
  match,
  freezeSettings = false,
  features,
  hideTestLevelOptions = false,
  hideClassLevelOptions = false,
  calculatorProvider,
}) => {
  const [showPassword, setShowSebPassword] = useState(false)
  const [tempTestSettings, updateTempTestSettings] = useState({
    ...testSettings,
  })
  const [passwordStatus, setPasswordStatus] = useState({
    color: blueBorder,
    message: '',
  })
  const [showAdvancedOption, toggleAdvancedOption] = useState(false)
  const [timedTestConfirmed, setTimedtestConfirmed] = useState(false)

  const advancedHandler = () => toggleAdvancedOption(!showAdvancedOption)

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

  const updateTimedTestAttrs = (attr, value) => {
    console.log('match', match?.params, timedTestConfirmed)
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

  const handleAutoRedirectChange = (value) => {
    if (forClassLevel) return changeField('autoRedirect')(value)

    const newSettingsState = {
      ...assignmentSettings,
      autoRedirect: value,
      ...(value
        ? {
            autoRedirectSettings: {
              showPreviousAttempt: 'STUDENT_RESPONSE_AND_FEEDBACK',
              questionsDelivery: redirectPolicy.QuestionDelivery.ALL,
            },
          }
        : {}),
    }

    updateAssignmentSettings(newSettingsState)
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

    if (forClassLevel) {
      changeField('autoRedirect')(true)
      return changeField('autoRedirectSettings')(
        newSettingsState.autoRedirectSettings
      )
    }
    updateAssignmentSettings(newSettingsState)
  }

  const scoringType =
    assignmentSettings?.scoringType ||
    tempTestSettings?.scoringType ||
    evalTypes?.ITEM_LEVEL_EVALUATION
  const {
    markAsDone = tempTestSettings?.markAsDone,
    releaseScore = tempTestSettings.releaseScore,
    safeBrowser = tempTestSettings.safeBrowser,
    sebPassword = tempTestSettings.sebPassword,
    shuffleQuestions = tempTestSettings.shuffleQuestions,
    shuffleAnswers = tempTestSettings.shuffleAnswers,
    calcType = tempTestSettings.calcType,
    answerOnPaper = tempTestSettings.answerOnPaper,
    maxAnswerChecks = tempTestSettings.maxAnswerChecks,
    passwordPolicy = tempTestSettings.passwordPolicy,
    assignmentPassword = tempTestSettings.assignmentPassword,
    maxAttempts = tempTestSettings.maxAttempts,
    performanceBand = tempTestSettings.performanceBand,
    standardGradingScale = tempTestSettings.standardGradingScale,
    testContentVisibility = tempTestSettings.testContentVisibility ||
      testContentVisibilityOptions.ALWAYS,
    passwordExpireIn = tempTestSettings.passwordExpireIn || 15 * 60,
    showMagnifier = tempTestSettings.showMagnifier,
    timedAssignment = tempTestSettings.timedAssignment,
    allowedTime = tempTestSettings.allowedTime,
    pauseAllowed = tempTestSettings.pauseAllowed,
    enableScratchpad = tempTestSettings.enableScratchpad,
    autoRedirect = false,
    autoRedirectSettings,
  } = assignmentSettings
  const playerSkinType =
    assignmentSettings.playerSkinType || testSettings.playerSkinType
  const accessibilityData = [
    { key: 'showMagnifier', value: showMagnifier },
    { key: 'enableScratchpad', value: enableScratchpad },
  ].filter((a) => features[a.key])

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
        {forClassLevel && !hideTestLevelOptions ? (
          <>
            <TestTypeSelector
              userRole={userRole}
              testType={assignmentSettings?.testType}
              disabled={freezeSettings}
              onAssignmentTypeChange={changeField('testType')}
              fullwidth
              showTestTypeOption
            />
            <PlayerSkinSelector
              testType={assignmentSettings?.testType}
              userRole={userRole}
              playerSkinType={assignmentSettings?.playerSkinType}
              disabled={freezeSettings}
              onAssignmentTypeChange={changeField('playerSkinType')}
              fullwidth
            />
          </>
        ) : null}

        {/* Mark as done */}
        {!hideTestLevelOptions && (
          <FeaturesSwitch
            inputFeatures="assessmentSuperPowersMarkAsDone"
            actionOnInaccessible="hidden"
            key="assessmentSuperPowersMarkAsDone"
            gradeSubject={gradeSubject}
          >
            <StyledRowSettings gutter={16}>
              <Col span={12}>
                <Label>MARK AS DONE</Label>
              </Col>
              <Col span={12}>
                <AlignRight
                  disabled={forClassLevel || freezeSettings}
                  onChange={(e) =>
                    overRideSettings('markAsDone', e.target.value)
                  }
                  value={markAsDone}
                >
                  {completionTypeKeys.map((item) => (
                    <RadioBtn value={completionTypes[item]} key={item}>
                      <Label>{completionTypes[item]}</Label>
                    </RadioBtn>
                  ))}
                </AlignRight>
              </Col>
            </StyledRowSettings>
          </FeaturesSwitch>
        )}
        {/* Mark as done */}

        {/* Release score */}
        {!forClassLevel ? (
          <StyledRowSelect gutter={16}>
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
                noBorder
                height="30px"
              >
                {_releaseGradeKeys.map((item, index) => (
                  <Select.Option data-cy="class" key={index} value={item}>
                    {releaseGradeTypes[item]}
                  </Select.Option>
                ))}
              </SelectInputStyled>
            </Col>
          </StyledRowSelect>
        ) : null}
        {/* Release score */}

        {/* Maximum attempt */}
        {!hideClassLevelOptions && (
          <FeaturesSwitch
            inputFeatures="maxAttemptAllowed"
            actionOnInaccessible="hidden"
            key="maxAttemptAllowed"
            gradeSubject={gradeSubject}
          >
            <StyledRowSettings gutter={16}>
              <Col span={12}>
                <Label>MAXIMUM ATTEMPTS ALLOWED</Label>
              </Col>
              <Col span={12}>
                <NumberInputStyled
                  size="large"
                  disabled={freezeSettings}
                  value={maxAttempts}
                  onChange={(value) => overRideSettings('maxAttempts', value)}
                  min={1}
                  step={1}
                  bg="white"
                  width="20%"
                />
              </Col>
            </StyledRowSettings>
          </FeaturesSwitch>
        )}
        {/* Maximum attempt */}

        {/* Safe Exam Browser/Kiosk Mode */}
        {!hideTestLevelOptions && (
          <FeaturesSwitch
            inputFeatures="assessmentSuperPowersRequireSafeExamBrowser"
            actionOnInaccessible="hidden"
            key="assessmentSuperPowersRequireSafeExamBrowser"
            gradeSubject={gradeSubject}
          >
            <StyledRowSettings gutter={16}>
              <Col span={12}>
                <Label style={{ display: 'flex' }}>
                  Safe Exam Browser
                  <Tooltip
                    title="Ensure a secure testing environment by using Safe Exam Browser
                   to lockdown the student's device. To use this feature, Safe Exam Browser 
                   (on Windows/Mac/iPad) must be installed on the student device. The quit 
                   password can be used by teacher or proctor to safely exit Safe Exam Browser 
                   in the middle of an assessment. The quit password should not be revealed to 
                   the students. If you select this option, students must use devices (Windows, 
                   Mac or iPad) with Safe Exam Browser installed."
                  >
                    <IconInfo
                      color={lightGrey9}
                      style={{ cursor: 'pointer', marginLeft: '10px' }}
                    />
                  </Tooltip>
                </Label>
              </Col>
              <Col span={12}>
                <AlignSwitchRight
                  disabled={forClassLevel || freezeSettings}
                  checked={safeBrowser}
                  size="small"
                  onChange={(value) => overRideSettings('safeBrowser', value)}
                />
                {safeBrowser && (
                  <Password
                    disabled={forClassLevel || freezeSettings}
                    suffix={
                      <Icon
                        type={showPassword ? 'eye-invisible' : 'eye'}
                        theme="filled"
                        onClick={() =>
                          setShowSebPassword((prevState) => !prevState)
                        }
                      />
                    }
                    onChange={(e) =>
                      overRideSettings('sebPassword', e.target.value)
                    }
                    size="large"
                    value={sebPassword}
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Quit Password"
                  />
                )}
              </Col>
            </StyledRowSettings>
          </FeaturesSwitch>
        )}
        {/* Safe Exam Browser/Kiosk Mode */}

        {
          /* Shuffle Question */
          !isDocBased && !hideTestLevelOptions && (
            <FeaturesSwitch
              inputFeatures="assessmentSuperPowersShuffleQuestions"
              actionOnInaccessible="hidden"
              key="assessmentSuperPowersShuffleQuestions"
              gradeSubject={gradeSubject}
            >
              <StyledRowSettings gutter={16}>
                <Col span={12}>
                  <Label>SHUFFLE QUESTIONS</Label>
                </Col>
                <Col span={12}>
                  <AlignSwitchRight
                    disabled={forClassLevel || freezeSettings}
                    size="small"
                    checked={shuffleQuestions}
                    onChange={(value) =>
                      overRideSettings('shuffleQuestions', value)
                    }
                  />
                </Col>
              </StyledRowSettings>
            </FeaturesSwitch>
          )
          /* Shuffle Question */
        }

        {
          /* Shuffle Answer Choice */
          !isDocBased && !hideTestLevelOptions && (
            <FeaturesSwitch
              inputFeatures="assessmentSuperPowersShuffleAnswerChoice"
              actionOnInaccessible="hidden"
              key="assessmentSuperPowersShuffleAnswerChoice"
              gradeSubject={gradeSubject}
            >
              <StyledRowSettings gutter={16}>
                <Col span={12}>
                  <Label>SHUFFLE ANSWER CHOICE</Label>
                </Col>
                <Col span={12}>
                  <AlignSwitchRight
                    disabled={forClassLevel || freezeSettings}
                    size="small"
                    checked={shuffleAnswers}
                    onChange={(value) =>
                      overRideSettings('shuffleAnswers', value)
                    }
                  />
                </Col>
              </StyledRowSettings>
            </FeaturesSwitch>
          )
          /* Shuffle Answer Choice */
        }

        {/* Show Calculator */}
        {!hideClassLevelOptions && (
          <FeaturesSwitch
            inputFeatures="assessmentSuperPowersShowCalculator"
            actionOnInaccessible="hidden"
            key="assessmentSuperPowersShowCalculator"
            gradeSubject={gradeSubject}
          >
            <StyledRowSettings gutter={16}>
              <Col span={12}>
                <Label>SHOW CALCULATOR</Label>
              </Col>
              <Col span={12}>
                <AlignRight
                  disabled={freezeSettings}
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
            </StyledRowSettings>
          </FeaturesSwitch>
        )}
        {/* Show Calculator */}

        {/* Answer on Paper */}
        {!hideClassLevelOptions && (
          <FeaturesSwitch
            inputFeatures="assessmentSuperPowersAnswerOnPaper"
            actionOnInaccessible="hidden"
            key="assessmentSuperPowersAnswerOnPaper"
            gradeSubject={gradeSubject}
          >
            <StyledRowSettings gutter={16}>
              <Col span={12}>
                <Label>ANSWER ON PAPER</Label>
              </Col>
              <Col span={12}>
                <AlignSwitchRight
                  disabled={disableAnswerOnPaper || freezeSettings}
                  size="small"
                  checked={answerOnPaper}
                  onChange={(value) => overRideSettings('answerOnPaper', value)}
                />
              </Col>
            </StyledRowSettings>
          </FeaturesSwitch>
        )}
        {/* Answer on Paper */}

        {/* Require Password */}
        {!hideClassLevelOptions && (
          <FeaturesSwitch
            inputFeatures="assessmentSuperPowersRequirePassword"
            actionOnInaccessible="hidden"
            key="assessmentSuperPowersRequirePassword"
            gradeSubject={gradeSubject}
          >
            <StyledRowSelect gutter={16}>
              <Col span={12}>
                <Label>REQUIRE PASSWORD</Label>
              </Col>
              <Col span={12}>
                <Row>
                  <Col span={24}>
                    <SelectInputStyled
                      disabled={freezeSettings}
                      placeholder="Please select"
                      cache="false"
                      value={passwordPolicy}
                      onChange={changeField('passwordPolicy')}
                      noBorder
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
                  password is auto-generated and revealed only when the
                  assessment is opened. If you select this method, you also need
                  to specify the time in minutes after which the password would
                  automatically expire. Use this method for highly sensitive and
                  secure assessments. If you select this method, the teacher or
                  the proctor must open the assessment manually and announce the
                  password in class when the students are ready to take the
                  assessment.
                </Col>
              )}
            </StyledRowSelect>
          </FeaturesSwitch>
        )}
        {/* Require Password */}

        {
          /* Check Answer Tries Per Question */
          !isDocBased && !hideClassLevelOptions && (
            <FeaturesSwitch
              inputFeatures="assessmentSuperPowersCheckAnswerTries"
              actionOnInaccessible="hidden"
              key="assessmentSuperPowersCheckAnswerTries"
              gradeSubject={gradeSubject}
            >
              <StyledRowSettings gutter={16}>
                <Col span={12}>
                  <Label>CHECK ANSWER TRIES PER QUESTION</Label>
                </Col>
                <Col span={12}>
                  <NumberInputStyled
                    disabled={freezeSettings}
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
              </StyledRowSettings>
            </FeaturesSwitch>
          )
          /* Check Answer Tries Per Question */
        }

        {/* Evaluation Method */}
        {!hideTestLevelOptions && (
          <StyledRowSelect gutter={16}>
            <Col span={12}>
              <Label>EVALUATION METHOD</Label>
            </Col>
            <Col span={12}>
              <SelectInputStyled
                disabled={forClassLevel || freezeSettings}
                onChange={(value) => {
                  if (!forClassLevel && !freezeSettings) {
                    overRideSettings('scoringType', value)
                  }
                }}
                value={scoringType}
                noBorder
                height="30px"
              >
                {Object.keys(evalTypes).map((evalKey, index) => (
                  <Select.Option
                    value={evalKey}
                    data-cy={evalKey}
                    key={evalKey}
                  >
                    {Object.values(evalTypes)[index]}
                  </Select.Option>
                ))}
              </SelectInputStyled>
            </Col>
          </StyledRowSelect>
        )}
        {/* Evaluation Method */}

        {/* Timed TEST */}
        {!hideTestLevelOptions && (
          <FeaturesSwitch
            inputFeatures="assessmentSuperPowersTimedTest"
            actionOnInaccessible="hidden"
            key="assessmentSuperPowersTimedTest"
            gradeSubject={gradeSubject}
          >
            <StyledRowSettings gutter={16} height="40">
              <Col span={12}>
                <Label>
                  <span>TIMED TEST</span>
                  <Tooltip title="The time can be modified in one minute increments.  When the time limit is reached, students will be locked out of the assessment.  If the student begins an assessment and exits with time remaining, upon returning, the timer will start up again where the student left off.  This ensures that the student does not go over the allotted time.">
                    <IconInfo
                      color={lightGrey9}
                      style={{ cursor: 'pointer', marginLeft: '15px' }}
                    />
                  </Tooltip>
                </Label>
              </Col>
              <Col
                span={10}
                style={{ display: 'flex', flexDirection: 'column' }}
              >
                <Row style={{ display: 'flex', alignItems: 'center' }}>
                  <AlignSwitchRight
                    data-cy="assignment-time-switch"
                    size="small"
                    defaultChecked={false}
                    disabled={forClassLevel || freezeSettings}
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
                          !isNaN(allowedTime) ? allowedTime / (60 * 1000) : 1
                        }
                        type="number"
                        min={1}
                        max={300}
                        step={1}
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
                        disabled={freezeSettings}
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
            </StyledRowSettings>
          </FeaturesSwitch>
        )}
        {/* Timed TEST */}

        {/* Auto Redirect */}
        {!hideClassLevelOptions && (
          <FeaturesSwitch
            inputFeatures="assessmentSuperPowersAutoRedirect"
            actionOnInaccessible="hidden"
            key="assessmentSuperPowersAutoRedirect"
            gradeSubject={gradeSubject}
          >
            <StyledRowSettings gutter={16}>
              <Row>
                <StyledCol span={12} paddingLeft="8px" paddingRight="8px">
                  <Label>Enable Auto Redirect</Label>
                </StyledCol>
                <StyledCol
                  span={12}
                  display="flex"
                  flexDirection="column"
                  paddingLeft="8px"
                  paddingRight="8px"
                >
                  <Row>
                    <AlignSwitchRight
                      data-cy="assignment-auto-redirect-switch"
                      size="small"
                      defaultChecked={false}
                      disabled={freezeSettings}
                      checked={autoRedirect}
                      onChange={handleAutoRedirectChange}
                    />
                  </Row>
                  {autoRedirect && (
                    <>
                      <StyledRow mt="8px" mb="0px">
                        <InputNumber
                          min={1}
                          max={99}
                          value={autoRedirectSettings.scoreThreshold || ''}
                          onChange={(value) =>
                            handleAutoRedirectSettingsChange(
                              'scoreThreshold',
                              value
                            )
                          }
                        />{' '}
                        <span>SCORE THRESHOLD</span>
                      </StyledRow>
                      <StyledRow mt="8px" mb="0px">
                        <InputNumber
                          min={1}
                          max={3}
                          value={autoRedirectSettings.maxRedirects || ''}
                          onChange={(value) =>
                            handleAutoRedirectSettingsChange(
                              'maxRedirects',
                              value
                            )
                          }
                        />{' '}
                        <span>MAXIMUM ATTEMPTS ALLOWED</span>
                      </StyledRow>
                    </>
                  )}
                </StyledCol>
              </Row>
              {autoRedirect && (
                <>
                  <StyledRow mt="8px" mb="0px">
                    <StyledCol span={12} paddingLeft="8px" paddingRight="8px">
                      <Label>QUESTIONS DELIVERY</Label>
                    </StyledCol>
                    <StyledCol
                      span={12}
                      display="flex"
                      flexDirection="column"
                      paddingLeft="8px"
                      paddingRight="8px"
                    >
                      <SelectInputStyled
                        disabled={freezeSettings}
                        onChange={(value) => {
                          handleAutoRedirectSettingsChange(
                            'questionsDelivery',
                            value
                          )
                        }}
                        value={autoRedirectSettings.questionsDelivery || ''}
                        noBorder
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
                  <StyledRow mt="8px" mb="0px">
                    <StyledCol span={12} paddingLeft="8px" paddingRight="8px">
                      <Label>SHOW PREVIOUS ATTEMPT</Label>
                    </StyledCol>
                    <StyledCol
                      span={12}
                      display="flex"
                      flexDirection="column"
                      paddingLeft="8px"
                      paddingRight="8px"
                    >
                      <SelectInputStyled
                        disabled={freezeSettings}
                        onChange={(value) => {
                          handleAutoRedirectSettingsChange(
                            'showPreviousAttempt',
                            value
                          )
                        }}
                        value={autoRedirectSettings.showPreviousAttempt || ''}
                        noBorder
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
              <StyledRow mt="8px" mb="0px">
                <StyledCol span={24} paddingLeft="8px" paddingRight="8px">
                  Allow students to take the assignment multiple times to
                  practice and improve their learning
                </StyledCol>
              </StyledRow>
            </StyledRowSettings>
          </FeaturesSwitch>
        )}
        {/* Auto Redirect */}

        {/* Test Content visibility */}
        {(userRole === roleuser.DISTRICT_ADMIN ||
          userRole === roleuser.SCHOOL_ADMIN) &&
          !hideTestLevelOptions && (
            <StyledRowSettings gutter={16}>
              <Col span={12}>
                <Label>ITEM CONTENT VISIBILITY TO TEACHERS</Label>
              </Col>
              <Col span={12}>
                <AlignRight
                  disabled={forClassLevel || freezeSettings}
                  onChange={(e) =>
                    overRideSettings('testContentVisibility', e.target.value)
                  }
                  value={testContentVisibility}
                >
                  {testContentVisibilityTypes.map((item) => (
                    <RadioBtn value={item.key} key={item.key}>
                      {item.value}
                    </RadioBtn>
                  ))}
                </AlignRight>
              </Col>
            </StyledRowSettings>
          )}
        {/* Test Content visibility */}

        {!hideTestLevelOptions && (
          <>
            <FeaturesSwitch
              inputFeatures="performanceBands"
              actionOnInaccessible="hidden"
              key="performanceBands"
              gradeSubject={gradeSubject}
            >
              <DivBlock>
                <PeformanceBand
                  disabled={forClassLevel || freezeSettings}
                  setSettingsData={(val) =>
                    overRideSettings('performanceBand', val)
                  }
                  performanceBand={performanceBand}
                />
              </DivBlock>
            </FeaturesSwitch>
            {!premium && <SubscriptionsBlock />}
            <DivBlock>
              <StandardProficiencyTable
                disabled={forClassLevel || freezeSettings}
                standardGradingScale={standardGradingScale}
                setSettingsData={(val) =>
                  overRideSettings('standardGradingScale', val)
                }
              />
            </DivBlock>
            {premium && (
              <AdvancedButton
                data-cy="advanced-option"
                onClick={advancedHandler}
                show={showAdvancedOption}
              >
                {showAdvancedOption
                  ? 'HIDE ADVANCED OPTIONS'
                  : 'SHOW ADVANCED OPTIONS'}
                <IconCaretDown color={themeColor} width={11} height={6} />
              </AdvancedButton>
            )}
            {showAdvancedOption && (
              <div>
                <Block id="accessibility">
                  {!!accessibilityData.length && (
                    <>
                      <Title>Accessibility</Title>
                      {!isDocBased && (
                        <RadioWrapper
                          disabled={forClassLevel || freezeSettings}
                          style={{ marginTop: '29px', marginBottom: 0 }}
                        >
                          {accessibilityData.map(({ key, value }) => (
                            <StyledRowSettings
                              key={accessibilities[key]}
                              style={{ width: '100%' }}
                            >
                              <Col span={12}>
                                <span style={{ fontSize: 13, fontWeight: 600 }}>
                                  {accessibilities[key]}
                                </span>
                              </Col>
                              <Col span={12}>
                                <StyledRadioGroup
                                  disabled={forClassLevel || freezeSettings}
                                  onChange={(e) =>
                                    overRideSettings(key, e.target.value)
                                  }
                                  defaultValue={
                                    isUndefined(value) ? true : value
                                  }
                                >
                                  <Radio value>ENABLE</Radio>
                                  <Radio value={false}>DISABLE</Radio>
                                </StyledRadioGroup>
                              </Col>
                            </StyledRowSettings>
                          ))}
                        </RadioWrapper>
                      )}
                    </>
                  )}
                  {(assignmentSettings?.testType || testSettings.testType) !==
                    'testlet' &&
                    !testSettings.isDocBased && (
                      <FeaturesSwitch
                        inputFeatures="selectPlayerSkinType"
                        actionOnInaccessible="hidden"
                        key="selectPlayerSkin"
                        gradeSubject={gradeSubject}
                      >
                        <PlayerSkinSelector
                          userRole={userRole}
                          playerSkinType={playerSkinType}
                          onAssignmentTypeChange={changeField('playerSkinType')}
                          testType={
                            assignmentSettings?.testType ||
                            testSettings.testType
                          }
                          selectBackgroundWhite
                          disabled={freezeSettings}
                        />
                      </FeaturesSwitch>
                    )}
                </Block>
              </div>
            )}
          </>
        )}
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
    features: getUserFeatures(state),
  }),
  null
)(withRouter(Settings))
