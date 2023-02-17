import React, { useState, useRef } from 'react'
import { Row, Col, Select, Input, Icon, InputNumber, Radio } from 'antd'
import { SelectInputStyled, RadioBtn } from '@edulastic/common'
import { blueBorder, red, green } from '@edulastic/colors'
import { test } from '@edulastic/constants'
import Styled from 'styled-components'
import { withNamespaces } from '@edulastic/localization'
import {
  AlignSwitchRight,
  StyledRow,
  Label,
  Password,
  MessageSpan,
} from '../SimpleOptions/styled'
import DetailsTooltip from './DetailsTooltip'
import SettingContainer from './SettingsContainer'
import { safeModeI18nTranslation } from '../../../authUtils'

const { passwordPolicyOptions, passwordPolicy: passwordPolicyValues } = test

const AntiCheatingGroupContainer = ({
  assignmentSettings,
  changeField,
  testSettings,
  isDocBased,
  freezeSettings,
  overRideSettings,
  featuresAvailable,
  tootltipWidth,
  t,
}) => {
  const [passwordStatus, setPasswordStatus] = useState({
    color: blueBorder,
    message: '',
  })
  const [showPassword, setShowSebPassword] = useState(false)
  const {
    safeBrowser = testSettings.safeBrowser,
    sebPassword = testSettings.sebPassword,
    shuffleQuestions = testSettings.shuffleQuestions,
    shuffleAnswers = testSettings.shuffleAnswers,
    passwordPolicy = testSettings.passwordPolicy,
    assignmentPassword = testSettings.assignmentPassword,
    passwordExpireIn = testSettings.passwordExpireIn || 15 * 60,
    blockNavigationToAnsweredQuestions = testSettings.blockNavigationToAnsweredQuestions,
    blockSaveAndContinue = testSettings.blockSaveAndContinue,
    restrictNavigationOut = testSettings.restrictNavigationOut,
    restrictNavigationOutAttemptsThreshold = testSettings.restrictNavigationOutAttemptsThreshold,
  } = assignmentSettings

  const navigationThresholdMoreThan1 =
    restrictNavigationOut === 'warn-and-report-after-n-alerts' &&
    restrictNavigationOutAttemptsThreshold > 1

  const {
    assessmentSuperPowersShuffleQuestions,
    assessmentSuperPowersShuffleAnswerChoice,
    assessmentSuperPowersRequirePassword,
    assessmentSuperPowersRestrictQuestionBackNav,
    assessmentSuperPowersRequireSafeExamBrowser,
    premium,
  } = featuresAvailable

  const numInputRef = useRef()
  const validateAndUpdatePassword = (_assignmentPassword) => {
    overRideSettings('assignmentPassword', _assignmentPassword)
    if (_assignmentPassword.split(' ').length > 1) {
      setPasswordStatus({
        color: red,
        message: 'Password must not contain space',
      })
      return
    }
    if (_assignmentPassword.length >= 6 && _assignmentPassword.length <= 25) {
      setPasswordStatus({
        color: green,
        message: '',
      })
      return
    }
    let validationMessage =
      'Password is too short - must be at least 6 characters'
    if (_assignmentPassword.length > 25)
      validationMessage = 'Password is too long'
    setPasswordStatus({
      color: red,
      message: validationMessage,
    })
  }

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

  return (
    <>
      {
        /* Shuffle Question */
        !isDocBased && (
          <SettingContainer id="shuffle-items-setting">
            <DetailsTooltip
              width={tootltipWidth}
              title="SHUFFLE ITEMS"
              content="If ON, then order of questions will be different for each student."
              premium={assessmentSuperPowersShuffleQuestions}
            />
            <StyledRow gutter={16} mb="15px">
              <Col span={10}>
                <Label>SHUFFLE ITEMS</Label>
              </Col>
              <Col span={14}>
                <AlignSwitchRight
                  disabled={
                    freezeSettings || !assessmentSuperPowersShuffleQuestions
                  }
                  size="small"
                  checked={shuffleQuestions}
                  data-cy="shuffle-questions"
                  onChange={(value) =>
                    overRideSettings('shuffleQuestions', value)
                  }
                />
              </Col>
            </StyledRow>
          </SettingContainer>
        )
        /* Shuffle Question */
      }

      {
        /* Shuffle Answer Choice */
        !isDocBased && (
          <SettingContainer id="shuffle-answer-choice-setting">
            <DetailsTooltip
              width={tootltipWidth}
              title="SHUFFLE ANSWER CHOICE"
              content="If set to ON, answer choices for multiple choice and multiple select questions will be randomly shuffled for students."
              premium={assessmentSuperPowersShuffleAnswerChoice}
            />
            <StyledRow gutter={16} mb="15px">
              <Col span={10}>
                <Label>SHUFFLE ANSWER CHOICE</Label>
              </Col>
              <Col span={14}>
                <AlignSwitchRight
                  disabled={
                    freezeSettings || !assessmentSuperPowersShuffleAnswerChoice
                  }
                  size="small"
                  checked={shuffleAnswers}
                  data-cy="shuffle-choices"
                  onChange={(value) =>
                    overRideSettings('shuffleAnswers', value)
                  }
                />
              </Col>
            </StyledRow>
          </SettingContainer>
        )
        /* Shuffle Answer Choice */
      }

      {/* Require Password */}
      <SettingContainer id="require-password-setting">
        <DetailsTooltip
          width={tootltipWidth}
          title="REQUIRE PASSWORD"
          content="Require your students to type a password when opening the assessment."
          premium={assessmentSuperPowersRequirePassword}
        />
        <StyledRow gutter={16} mb="15px">
          <Col span={10}>
            <Label>REQUIRE PASSWORD</Label>
          </Col>
          <Col span={14}>
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
                  data-cy="password-policy"
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
                    disabled={
                      freezeSettings || !assessmentSuperPowersRequirePassword
                    }
                    onChange={(e) => validateAndUpdatePassword(e.target.value)}
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
                    disabled={
                      freezeSettings || !assessmentSuperPowersRequirePassword
                    }
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
              The password is entered by you and does not change. Students must
              enter this password before they can take the assessment.
            </Col>
          )}
          {passwordPolicy ===
            test.passwordPolicy.REQUIRED_PASSWORD_POLICY_DYNAMIC && (
            <Col span={24} style={{ marginTop: '10px' }}>
              Students must enter a password to take the assessment. The
              password is auto-generated and revealed only when the assessment
              is opened. If you select this method, you also need to specify the
              time in minutes after which the password would automatically
              expire. Use this method for highly sensitive and secure
              assessments. If you select this method, the teacher or the proctor
              must open the assessment manually and announce the password in
              class when the students are ready to take the assessment.
            </Col>
          )}
        </StyledRow>
      </SettingContainer>
      {/* Require Password */}

      {
        /* BLOCK SAVE AND CONTINUE starts */
        <SettingContainer id="block-saveandcontinue-setting">
          <DetailsTooltip
            width={tootltipWidth}
            title="Complete test in one sitting"
            content="If ON, then students will not be allowed to exit the test without submitting. In case they close the app they will be paused and the instructor will need to manually resume."
            placement="rightTop"
            premium={premium}
          />
          <StyledRow gutter={16} mb="15px">
            <Col span={10}>
              <Label>Complete test in one sitting</Label>
            </Col>
            <Col span={14}>
              <AlignSwitchRight
                disabled={freezeSettings || !premium}
                size="small"
                checked={!premium ? false : blockSaveAndContinue}
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
            width={tootltipWidth}
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
            <Col span={10}>
              <Label>Restrict Navigation Out Of Test</Label>
            </Col>
            <Col span={14}>
              <StyledRadioGroupWrapper
                value={
                  !premium ? undefined : restrictNavigationOut || undefined
                }
                disabled={freezeSettings || !premium || safeBrowser}
                onChange={(e) => {
                  overRideSettings('restrictNavigationOut', e.target.value)
                }}
              >
                <RadioBtn
                  value={undefined}
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
        <SettingContainer id="restrict-question-nav-setting">
          <DetailsTooltip
            width={tootltipWidth}
            title="Restrict question navigation"
            content="If ON, then students will be restricted from navigating back to the previous question that they have answered. It is recommended to use this along with Shuffle Questions for preventing cheating among students. (This setting is not applicable for SnapQuiz)"
            placement="rightTop"
            premium={assessmentSuperPowersRestrictQuestionBackNav}
          />
          <StyledRow gutter={16} mb="15px">
            <Col span={10}>
              <Label>Restrict Question Navigation</Label>
            </Col>
            <Col span={14}>
              <AlignSwitchRight
                disabled={
                  freezeSettings ||
                  !assessmentSuperPowersRestrictQuestionBackNav ||
                  isDocBased
                }
                size="small"
                checked={blockNavigationToAnsweredQuestions}
                data-cy="restrict-backward-nav"
                onChange={(value) =>
                  overRideSettings('blockNavigationToAnsweredQuestions', value)
                }
              />
            </Col>
          </StyledRow>
        </SettingContainer>
        /* Restrict Question Navigation */
      }

      {/* Safe Exam Browser/Kiosk Mode */}
      <SettingContainer id="safe-exam-browser-setting">
        <DetailsTooltip
          width={tootltipWidth}
          title={safeModeI18nTranslation(t, 'title')}
          content={safeModeI18nTranslation(t, 'info')}
          placement="rightTop"
          premium={assessmentSuperPowersRequireSafeExamBrowser}
        />
        <StyledRow gutter={16} mb="15px">
          <Col span={10}>
            <Label style={{ display: 'flex' }}>
              Require Safe Exam Browser / Kiosk Mode
            </Label>
          </Col>
          <Col span={14}>
            <AlignSwitchRight
              disabled={
                freezeSettings || !assessmentSuperPowersRequireSafeExamBrowser
              }
              checked={safeBrowser}
              size="small"
              onChange={(value) => overRideSettings('safeBrowser', value)}
              data-cy="seb"
            />
            {safeBrowser && (
              <Password
                disabled={
                  freezeSettings || !assessmentSuperPowersRequireSafeExamBrowser
                }
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
                data-cy="seb-password"
              />
            )}
          </Col>
        </StyledRow>
      </SettingContainer>
      {/* Safe Exam Browser/Kiosk Mode */}
    </>
  )
}

const InputNumberStyled = Styled(InputNumber)`
    width: 60px;
`

const StyledRadioGroupWrapper = Styled(Radio.Group)`
    padding-top:15px;
    .ant-radio-wrapper span:nth-child(2){
      font-size:12px;
    }
`

const Styled2ndLine = Styled.div`
  padding-left:24px;
`

export default withNamespaces('author')(AntiCheatingGroupContainer)
