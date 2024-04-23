import React from 'react'
import { Select, InputNumber } from 'antd'
import { test } from '@edulastic/constants'
import {
  notification,
  SelectInputStyled,
  NumberInputStyled,
  RadioGrp,
  RadioBtn,
} from '@edulastic/common'
import { TEST_TYPE_SURVEY } from '@edulastic/constants/const/testTypes'
import {
  Label,
  StyledCol,
  StyledRow,
  RadioButtonWrapper,
} from '../SimpleOptions/styled'
import DetailsTooltip from './DetailsTooltip'
import SettingContainer from './SettingsContainer'

const { redirectPolicy } = test

const { ShowPreviousAttempt } = redirectPolicy

const QuestionDelivery = {
  [redirectPolicy.QuestionDelivery.ALL]: 'All',
  [redirectPolicy.QuestionDelivery.SKIPPED]: 'Skipped',
  [redirectPolicy.QuestionDelivery.SKIPPED_AND_WRONG]: 'Skipped and Wrong',
  [redirectPolicy.QuestionDelivery.SKIPPED_PARTIAL_AND_WRONG]:
    'Skipped, Partial and Wrong',
}

const AutoRedirectGroupContainer = ({
  assignmentSettings,
  freezeSettings,
  updateAssignmentSettings,
  featuresAvailable,
  tootltipWidth,
  testSettings,
  overRideSettings,
  isDocBased,
}) => {
  const {
    autoRedirect = false,
    autoRedirectSettings,
    maxAttempts = testSettings.maxAttempts,
    maxAnswerChecks = testSettings.maxAnswerChecks,
    testType = testSettings.testType,
  } = assignmentSettings

  const {
    assessmentSuperPowersAutoRedirect,
    maxAttemptAllowed,
    assessmentSuperPowersCheckAnswerTries,
  } = featuresAvailable

  const disableCheckAnsTries = [
    freezeSettings,
    !assessmentSuperPowersCheckAnswerTries,
    testType === TEST_TYPE_SURVEY,
  ].some((o) => !!o)

  const handleAutoRedirectChange = (e) => {
    const { value } = e.target
    const newSettingsState = {
      ...assignmentSettings,
      autoRedirect: value,
      ...(value
        ? {
            maxAttempts: 1,
            maxAnswerChecks: 0,
            autoRedirectSettings: {
              maxRedirects: 1,
              showPreviousAttempt: 'STUDENT_RESPONSE_AND_FEEDBACK',
              questionsDelivery: redirectPolicy.QuestionDelivery.ALL,
            },
          }
        : { maxAnswerChecks: 0 }),
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
    updateAssignmentSettings(newSettingsState)
  }

  return (
    <>
      <SettingContainer id="auto-redirect-setting">
        <DetailsTooltip
          width={tootltipWidth}
          title="Enable Auto Redirect"
          content="When selected, allows students to automatically retake a test when they scored below a set threshold. Enables students to practice and improve learning through multiple self-directed attempts."
          premium={assessmentSuperPowersAutoRedirect}
        />
        <StyledRow gutter={16}>
          <StyledCol span={10}>
            <Label>Enable Auto Redirect</Label>
          </StyledCol>
          <StyledCol span={14}>
            <RadioGrp
              style={{ display: 'flex' }}
              onChange={handleAutoRedirectChange}
              value={autoRedirect}
              disabled={freezeSettings || !assessmentSuperPowersAutoRedirect}
            >
              <RadioButtonWrapper>
                <RadioBtn data-cy="radioAllowMultipleAttempts" value={false} />
                <Label>Allow Multiple Attempts</Label>
              </RadioButtonWrapper>
              <RadioButtonWrapper style={{ marginLeft: '20px' }}>
                <RadioBtn data-cy="radioEnableAutoRedirect" value />
                <Label>Enable Auto-redirect</Label>
              </RadioButtonWrapper>
            </RadioGrp>
          </StyledCol>
        </StyledRow>
      </SettingContainer>

      {/* Auto Redirect */}
      {autoRedirect && (
        <>
          <SettingContainer>
            <DetailsTooltip
              width={tootltipWidth}
              title="SCORE THRESHOLD"
              content="If student scores below the selected percentage score, the student will automatically be given the option to retake the test."
              premium={assessmentSuperPowersAutoRedirect}
            />
            <StyledRow gutter={16}>
              <StyledCol span={10}>
                <Label>AUTO REDIRECT SCORE THRESHOLD</Label>
              </StyledCol>
              <StyledCol span={14}>
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
            <StyledCol span={10}>
              <Label>EXTRA ATTEMPTS ALLOWED</Label>
            </StyledCol>
            <StyledCol span={14}>
              <InputNumber
                data-cy="auto-redirect-max-attempts"
                min={1}
                max={3}
                value={autoRedirectSettings.maxRedirects}
                onChange={(value) =>
                  handleAutoRedirectSettingsChange('maxRedirects', value)
                }
              />
            </StyledCol>
          </StyledRow>

          {
            /* Check Answer Tries Per Question */
            !isDocBased && (
              <SettingContainer>
                <DetailsTooltip
                  width={tootltipWidth}
                  title="CHECK ANSWER TRIES/QUESTION/ATTEMPT"
                  content="Allow students to check their answer before moving on to the next question. Enter the number of attempts allowed per question."
                  premium={assessmentSuperPowersCheckAnswerTries}
                />
                <StyledRow gutter={16} mb="15px">
                  <StyledCol span={10}>
                    <Label>CHECK ANSWER TRIES/QUESTION/ATTEMPT</Label>
                  </StyledCol>
                  <StyledCol span={14}>
                    <InputNumber
                      disabled={disableCheckAnsTries}
                      onChange={(value) =>
                        overRideSettings('maxAnswerChecks', value)
                      }
                      value={maxAnswerChecks}
                      min={0}
                      placeholder="Number of tries"
                      data-cy="check-ans-tries"
                    />
                  </StyledCol>
                </StyledRow>
              </SettingContainer>
            )
            /* Check Answer Tries Per Question */
          }

          <SettingContainer>
            <DetailsTooltip
              width={tootltipWidth}
              title="QUESTIONS DELIVERY"
              content="Choose which questions students should see on redirected tests."
              premium={assessmentSuperPowersAutoRedirect}
            />
            <StyledRow gutter={16}>
              <StyledCol span={10}>
                <Label>QUESTIONS DELIVERY</Label>
              </StyledCol>
              <StyledCol span={14}>
                <SelectInputStyled
                  data-cy="auto-redirect-que-delivery"
                  disabled={
                    freezeSettings || !assessmentSuperPowersAutoRedirect
                  }
                  onChange={(value) => {
                    handleAutoRedirectSettingsChange('questionsDelivery', value)
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
              width={tootltipWidth}
              title="SHOW PREVIOUS ATTEMPT"
              content="Choose how much information students will see on redirected tests."
              premium={assessmentSuperPowersAutoRedirect}
              placement="rightTop"
            />
            <StyledRow gutter={16}>
              <StyledCol span={10}>
                <Label>SHOW PREVIOUS ATTEMPT</Label>
              </StyledCol>
              <StyledCol span={14}>
                <SelectInputStyled
                  data-cy="auto-redirect-poilcy"
                  disabled={
                    freezeSettings || !assessmentSuperPowersAutoRedirect
                  }
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

      {/* Maximum attempt */}
      {!autoRedirect && (
        <SettingContainer id="max-attempts-setting">
          <DetailsTooltip
            width={tootltipWidth}
            title="MAXIMUM ATTEMPTS ALLOWED"
            content="Select the number of times a student can attempt the test. Note, this can be overridden at a later time in the settings if necessary."
            premium={maxAttemptAllowed}
          />
          <StyledRow gutter={16} mb="15px">
            <StyledCol span={10}>
              <Label>MAXIMUM ATTEMPTS ALLOWED</Label>
            </StyledCol>
            <StyledCol span={14}>
              <NumberInputStyled
                disabled={freezeSettings || !maxAttemptAllowed}
                value={maxAttempts}
                onChange={(value) => overRideSettings('maxAttempts', value)}
                min={1}
                step={1}
                bg="white"
                width="20%"
                data-cy="max-attempts-allowed"
              />
            </StyledCol>
          </StyledRow>
        </SettingContainer>
      )}
      {/* Maximum attempt */}

      {
        /* Check Answer Tries Per Question */
        !isDocBased && !autoRedirect && (
          <SettingContainer id="check-answer-tries-setting">
            <DetailsTooltip
              width={tootltipWidth}
              title="CHECK ANSWER TRIES/QUESTION/ATTEMPT"
              content="Allow students to check their answer before moving on to the next question. Enter the number of attempts allowed per question."
              premium={assessmentSuperPowersCheckAnswerTries}
              placement="rightTop"
            />
            <StyledRow gutter={16} mb="15px">
              <StyledCol span={10}>
                <Label>CHECK ANSWER TRIES/QUESTION/ATTEMPT</Label>
              </StyledCol>
              <StyledCol span={14}>
                <NumberInputStyled
                  disabled={disableCheckAnsTries}
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
              </StyledCol>
            </StyledRow>
          </SettingContainer>
        )
        /* Check Answer Tries Per Question */
      }
    </>
  )
}

export default AutoRedirectGroupContainer
