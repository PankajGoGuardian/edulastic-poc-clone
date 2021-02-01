import React, { useState } from 'react'
import {
  Row,
  Col,
  Select,
  Tooltip,
  Input,
  Icon,
  InputNumber,
  Radio,
} from 'antd'
import { SelectInputStyled } from '@edulastic/common'
import { blueBorder, lightGrey9, red, green } from '@edulastic/colors'
import { test } from '@edulastic/constants'
import Styled from 'styled-components'
import {
  AlignSwitchRight,
  StyledRow,
  Label,
  StyledInfoIcon,
  Password,
  MessageSpan,
} from '../SimpleOptions/styled'
import DollarPremiumSymbol from './DollarPremiumSymbol'
import DetailsTooltip from './DetailsTooltip'
import { SettingContainer } from './styled'

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

  const {
    assessmentSuperPowersShuffleQuestions,
    assessmentSuperPowersShuffleAnswerChoice,
    assessmentSuperPowersRequirePassword,
    assessmentSuperPowersRestrictQuestionBackNav,
    assessmentSuperPowersRequireSafeExamBrowser,
    premium,
  } = featuresAvailable

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
          <SettingContainer>
            <DetailsTooltip
              width={tootltipWidth}
              title="SHUFFLE QUESTIONS"
              content="If ON, then order of questions will be different for each student."
              premium={assessmentSuperPowersShuffleQuestions}
            />
            <StyledRow gutter={16} mb="15px">
              <Col span={12}>
                <Label>
                  SHUFFLE QUESTIONS
                  <DollarPremiumSymbol
                    premium={assessmentSuperPowersShuffleQuestions}
                  />
                </Label>
              </Col>
              <Col span={12}>
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
          <SettingContainer>
            <DetailsTooltip
              width={tootltipWidth}
              title="SHUFFLE ANSWER CHOICE"
              content="If set to ON, answer choices for multiple choice and multiple select questions will be randomly shuffled for students. Text to speech does not work when the answer choices are shuffled."
              premium={assessmentSuperPowersShuffleAnswerChoice}
            />
            <StyledRow gutter={16} mb="15px">
              <Col span={12}>
                <Label>
                  SHUFFLE ANSWER CHOICE
                  <DollarPremiumSymbol
                    premium={assessmentSuperPowersShuffleAnswerChoice}
                  />
                </Label>
              </Col>
              <Col span={12}>
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
      <SettingContainer>
        <DetailsTooltip
          width={tootltipWidth}
          title="REQUIRE PASSWORD"
          content="Require your students to type a password when opening the assessment. Password ensures that your students can access this assessment only in the classroom."
          premium={assessmentSuperPowersRequirePassword}
        />
        <StyledRow gutter={16} mb="15px">
          <Col span={12}>
            <Label>
              REQUIRE PASSWORD
              <DollarPremiumSymbol
                premium={assessmentSuperPowersRequirePassword}
              />
            </Label>
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
        <SettingContainer>
          <DetailsTooltip
            width={tootltipWidth}
            title="ALLOW STUDENT TO SAVE AND CONTINUE LATER"
            content="If OFF, will force the students to take the test in single sitting"
            placement="rightTop"
            premium={premium}
          />
          <StyledRow gutter={16} mb="15px">
            <Col span={12}>
              <Label>
                ALLOW STUDENT TO SAVE AND CONTINUE LATER
                <DollarPremiumSymbol premium={premium} />
                <Tooltip title="If OFF, will force the students to take the test in single sitting">
                  <StyledInfoIcon color={lightGrey9} mL="10px" />
                </Tooltip>
              </Label>
            </Col>
            <Col span={12}>
              <AlignSwitchRight
                disabled={freezeSettings || !premium}
                size="small"
                checked={!blockSaveAndContinue}
                onChange={(value) =>
                  overRideSettings('blockSaveAndContinue', !value)
                }
              />
            </Col>
          </StyledRow>
        </SettingContainer>
        /* BLOCK SAVE AND CONTINUE ends */
      }

      {
        /* Restrict navigation out starts */
        <SettingContainer>
          <DetailsTooltip
            width={tootltipWidth}
            title="Restrict Navigation Out Of Test"
            content={`Students will be shown an alert
              if they navigate away from edulastic tab and if
              specific number of alerts exceeded, the assignment
              will be paused and the instructor will need to
              manually resume`}
            placement="rightTop"
            premium={premium}
          />
          <StyledRow gutter={16} mb="15px">
            <Col span={12}>
              <Label>
                Restrict Navigation Out Of Test
                <DollarPremiumSymbol premium={premium} />
                <Tooltip
                  title={`If ON, then students will be shown an alert
                    if they navigate away from edulastic tab and if
                    specific number of alerts exceeded, the assignment
                    will be paused and the instructor will need to
                    manually resume`}
                >
                  <StyledInfoIcon color={lightGrey9} mL="10px" />
                </Tooltip>
              </Label>
            </Col>

            <Col span={12}>
              <StyledRadioGroupWrapper
                value={restrictNavigationOut || undefined}
                disabled={freezeSettings}
                onChange={(e) => {
                  overRideSettings('restrictNavigationOut', e.target.value)
                }}
              >
                <Radio value={undefined}>DISABLED</Radio>
                <br />
                <Radio value="warn-and-report">WARN AND REPORT ONLY</Radio>
                <br />
                <Radio value="warn-and-report-after-n-alerts">
                  WARN AND BLOCK TEST AFTER{' '}
                  <InputNumberStyled
                    size="small"
                    min={1}
                    value={
                      restrictNavigationOut
                        ? restrictNavigationOutAttemptsThreshold
                        : undefined
                    }
                    onChange={(v) => {
                      overRideSettings(
                        'restrictNavigationOutAttemptsThreshold',
                        v
                      )
                    }}
                    disabled={
                      !(
                        restrictNavigationOut ===
                        'warn-and-report-after-n-alerts'
                      ) || freezeSettings
                    }
                  />{' '}
                  ALERTS
                </Radio>
              </StyledRadioGroupWrapper>
            </Col>
          </StyledRow>
        </SettingContainer>
        /* Restrict navigation ends */
      }

      {
        /* Restrict Question Navigation */
        <SettingContainer>
          <DetailsTooltip
            width={tootltipWidth}
            title="Restrict question navigation"
            content="If ON, then students will be restricted from navigating back to the previous question that they have answered. It is recommended to use this along with Shuffle Questions for preventing cheating among students. (This setting is not applicable for SnapQuiz)"
            placement="rightTop"
            premium={assessmentSuperPowersRestrictQuestionBackNav}
          />
          <StyledRow gutter={16} mb="15px">
            <Col span={12}>
              <Label>
                Restrict Question Navigation
                <DollarPremiumSymbol
                  premium={assessmentSuperPowersRestrictQuestionBackNav}
                />
                <Tooltip
                  title="If ON, then students will be restricted from navigating back to the previous question. 
                      Recommended to use along with Shuffle Questions for preventing cheating among students.
                      (This setting is not applicable for SnapQuiz)"
                >
                  <StyledInfoIcon color={lightGrey9} mL="10px" />
                </Tooltip>
              </Label>
            </Col>
            <Col span={12}>
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
      <SettingContainer>
        <DetailsTooltip
          width={tootltipWidth}
          title="Require Safe Exam Browser"
          content="Ensure secure testing environment by using Safe Exam Browser to lockdown the student's device. To use this feature Safe Exam Browser (on Windows/Mac only) must be installed on the student devices."
          placement="rightTop"
          premium={assessmentSuperPowersRequireSafeExamBrowser}
        />
        <StyledRow gutter={16} mb="15px">
          <Col span={12}>
            <Label style={{ display: 'flex' }}>
              Require Safe Exam Browser
              <DollarPremiumSymbol
                premium={assessmentSuperPowersRequireSafeExamBrowser}
              />
              <Tooltip
                title="Ensure a secure testing environment by using Safe Exam Browser
                   to lockdown the student's device. To use this feature, Safe Exam Browser 
                   (on Windows/Mac/iPad) must be installed on the student device. The quit 
                   password can be used by teacher or proctor to safely exit Safe Exam Browser 
                   in the middle of an assessment. The quit password should not be revealed to 
                   the students. If you select this option, students must use devices (Windows, 
                   Mac or iPad) with Safe Exam Browser installed."
              >
                <StyledInfoIcon color={lightGrey9} mL="10px" />
              </Tooltip>
            </Label>
          </Col>
          <Col span={12}>
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

export default AntiCheatingGroupContainer
