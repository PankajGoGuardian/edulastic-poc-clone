import React from 'react'
import { Select, InputNumber } from 'antd'
import { test } from '@edulastic/constants'
import { notification, SelectInputStyled } from '@edulastic/common'
import {
  AlignSwitchRight,
  Label,
  StyledCol,
  StyledRow,
} from '../SimpleOptions/styled'
import DollarPremiumSymbol from './DollarPremiumSymbol'
import DetailsTooltip from './DetailsTooltip'
import { SettingContainer } from './styled'

const { redirectPolicy } = test

const { ShowPreviousAttempt } = redirectPolicy

const QuestionDelivery = {
  [redirectPolicy.QuestionDelivery.ALL]: 'All',
  [redirectPolicy.QuestionDelivery.SKIPPED_AND_WRONG]: 'Skipped and Wrong',
}

const AutoRedirectGroupContainer = ({
  assignmentSettings,
  freezeSettings,
  updateAssignmentSettings,
  featuresAvailable,
  tootltipWidth,
}) => {
  const { autoRedirect = false, autoRedirectSettings } = assignmentSettings

  const { assessmentSuperPowersAutoRedirect } = featuresAvailable

  const handleAutoRedirectChange = (value) => {
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
    updateAssignmentSettings(newSettingsState)
  }

  return (
    <>
      {/* Auto Redirect */}
      <SettingContainer>
        <DetailsTooltip
          width={tootltipWidth}
          title="Enable Auto Redirect"
          content="Allow students to take the assignment multiple times to practice and improve their learning."
          premium={assessmentSuperPowersAutoRedirect}
        />
        <StyledRow gutter={16}>
          <StyledCol span={12}>
            <Label>
              Enable Auto Redirect
              <DollarPremiumSymbol
                premium={assessmentSuperPowersAutoRedirect}
              />
            </Label>
          </StyledCol>
          <StyledCol span={12}>
            <AlignSwitchRight
              data-cy="assignment-auto-redirect-switch"
              size="small"
              defaultChecked={false}
              disabled={freezeSettings || !assessmentSuperPowersAutoRedirect}
              checked={autoRedirect}
              onChange={handleAutoRedirectChange}
            />
          </StyledCol>
        </StyledRow>
        {autoRedirect && (
          <>
            <StyledRow>
              <StyledCol span={12}>
                <Label>SCORE THRESHOLD</Label>
              </StyledCol>
              <StyledCol span={12}>
                <InputNumber
                  data-cy="auto-redirect-score-threshold"
                  min={1}
                  max={99}
                  value={autoRedirectSettings.scoreThreshold || ''}
                  onChange={(value) =>
                    handleAutoRedirectSettingsChange('scoreThreshold', value)
                  }
                />
              </StyledCol>
            </StyledRow>

            <StyledRow>
              <StyledCol span={12}>
                <Label>MAXIMUM ATTEMPTS ALLOWED</Label>
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

            <StyledRow>
              <StyledCol span={12}>
                <Label>QUESTIONS DELIVERY</Label>
              </StyledCol>
              <StyledCol span={12}>
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

            <StyledRow gutter={16}>
              <StyledCol span={12}>
                <Label>SHOW PREVIOUS ATTEMPT</Label>
              </StyledCol>
              <StyledCol span={12}>
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
          </>
        )}
      </SettingContainer>
      <StyledRow>
        Allow students to take the assignment multiple times to practice and
        improve their learning
      </StyledRow>
      {/* Auto Redirect */}
    </>
  )
}

export default AutoRedirectGroupContainer
