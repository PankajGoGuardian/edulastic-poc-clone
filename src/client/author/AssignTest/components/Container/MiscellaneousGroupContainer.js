import React, { useState } from 'react'
import { Col, Radio } from 'antd'
import { test } from '@edulastic/constants'
import { isUndefined } from 'lodash'
import { EduButton } from '@edulastic/common'
import { withNamespaces } from '@edulastic/localization'
import {
  AlignSwitchRight,
  StyledRow,
  DivBlock,
  Label,
  Block,
  StyledRadioGroup,
  RadioWrapper,
  Title,
} from '../SimpleOptions/styled'
import StandardProficiencyTable from '../../../TestPage/components/Setting/components/Container/StandardProficiencyTable'
import PerformanceBand from '../../../TestPage/components/Setting/components/Container/PerformanceBand'
import PlayerSkinSelector from '../SimpleOptions/PlayerSkinSelector'
import DetailsTooltip from './DetailsTooltip'
import SettingContainer from './SettingsContainer'
import KeypadDropdown from './KeypadDropdown'
import { ConfirmationModal } from '../../../src/components/common/ConfirmationModal'

const { accessibilities, accessibilitySettings } = test
const {
  magnifier,
  scratchPad,
  skipAlert,
  immersiveReader,
} = accessibilitySettings

const MiscellaneousGroupContainer = ({
  assignmentSettings,
  changeField,
  testSettings,
  isDocBased,
  freezeSettings,
  overRideSettings,
  userRole,
  disableAnswerOnPaper,
  featuresAvailable,
  tootltipWidth,
  premium,
  isEnterpriseUser,
  t: translate,
}) => {
  const {
    answerOnPaper = testSettings.answerOnPaper,
    performanceBand = testSettings.performanceBand,
    standardGradingScale = testSettings.standardGradingScale,
    showMagnifier = testSettings.showMagnifier,
    enableScratchpad = testSettings.enableScratchpad,
    multiLanguageEnabled = !!testSettings.multiLanguageEnabled,
    keypad: keyPadData = testSettings.keypad || {},
    enableSkipAlert = testSettings.enableSkipAlert,
    showImmersiveReader = !!testSettings.showImmersiveReader,
  } = assignmentSettings

  const [selectedKeypad, setKeypad] = useState(null)
  const [warningKeypadSelection, setKeypadWarning] = useState(false)

  const handleKeypadSelection = (value) => {
    if (!value) {
      return
    }
    if (value.type === 'item-level') {
      overRideSettings('keypad', value)
    } else {
      setKeypad(value)
      setKeypadWarning(true)
    }
  }

  const confirmKeypadSelection = (confirm = false) => {
    if (confirm === true && selectedKeypad && selectedKeypad.type) {
      overRideSettings('keypad', selectedKeypad)
    }
    setKeypadWarning(false)
  }

  const playerSkinType =
    assignmentSettings.playerSkinType || testSettings.playerSkinType

  const accessibilityData = [
    {
      key: magnifier.key,
      value: showMagnifier,
      description: translate('accessibilitySettings.magnifier.description'),
      id: magnifier.id,
    },
    {
      key: scratchPad.key,
      value: enableScratchpad,
      description: translate('accessibilitySettings.scratchPad.description'),
      id: scratchPad.id,
    },
    {
      key: skipAlert.key,
      value: enableSkipAlert,
      description: translate('accessibilitySettings.skipAlert.description'),
      id: skipAlert.id,
    },
  ]
  if (isEnterpriseUser) {
    accessibilityData.unshift({
      key: immersiveReader.key,
      value: showImmersiveReader,
      description: translate(
        'accessibilitySettings.immersiveReader.description'
      ),
      id: immersiveReader.id,
    })
  }

  const {
    assessmentSuperPowersAnswerOnPaper,
    performanceBands,
    selectPlayerSkinType,
  } = featuresAvailable

  const showMultiLangSelection = !!testSettings.multiLanguageEnabled

  return (
    <>
      {/* Answer on Paper */}
      <SettingContainer id="answer-on-paper-setting">
        <DetailsTooltip
          width={tootltipWidth}
          title="ANSWER ON PAPER"
          content=" Use this option if students will be taking the assessment on paper. When ON, teachers must manually enter paper-based responses after the assessment is closed. Students who do not submit electronically, will NOT be marked as absent."
          placement="rightBottom"
          premium={assessmentSuperPowersAnswerOnPaper}
        />
        <StyledRow gutter={16} mb="15p">
          <Col span={10}>
            <Label>ANSWER ON PAPER</Label>
          </Col>
          <Col span={14}>
            <AlignSwitchRight
              disabled={
                disableAnswerOnPaper ||
                freezeSettings ||
                !assessmentSuperPowersAnswerOnPaper
              }
              size="small"
              checked={answerOnPaper}
              onChange={(value) => overRideSettings('answerOnPaper', value)}
              data-cy="ans-on-paper"
            />
          </Col>
        </StyledRow>
      </SettingContainer>
      {/* Answer on Paper */}

      {/* Multi language */}
      {showMultiLangSelection && (
        <SettingContainer>
          <DetailsTooltip
            width={tootltipWidth}
            title="Multi-Language"
            content="Select ON , If you want to enable multiple languages for the assignment."
            premium={premium}
          />
          <StyledRow gutter={16} mb="15p">
            <Col span={10}>
              <Label>
                <span>Multi-Language</span>
              </Label>
            </Col>
            <Col span={14}>
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
        </SettingContainer>
      )}
      {/* Multi language */}

      {/* Performance Bands */}
      <SettingContainer id="performance-bands-setting">
        <DetailsTooltip
          width={tootltipWidth}
          title="Performance Bands"
          content="Performance bands are set by district or school admins. Teachers can choose from the different profiles created by the admin."
          premium={performanceBands}
          placement="rightBottom"
        />
        <DivBlock>
          <PerformanceBand
            disabled={freezeSettings || !performanceBands}
            setSettingsData={(val) => overRideSettings('performanceBand', val)}
            performanceBand={performanceBand || {}}
            isFeatureAvailable={performanceBands}
            fromAssignments
          />
        </DivBlock>
      </SettingContainer>
      {/* Performance Bands */}

      {/* Standards Based Grading Scale */}
      <SettingContainer id="standards-mastery-setting">
        <DetailsTooltip
          width={tootltipWidth}
          title="Standards Based Grading Scale"
          content="Standards based scales are set by district or school admins. Teachers can choose from the different profiles created by the admin."
          premium={premium}
          placement="rightBottom"
          fromAssignments
        />
        <DivBlock>
          <StandardProficiencyTable
            disabled={freezeSettings || !premium}
            standardGradingScale={standardGradingScale || {}}
            setSettingsData={(val) =>
              overRideSettings('standardGradingScale', val)
            }
            isFeatureAvailable={premium}
            fromAssignments
          />
        </DivBlock>
      </SettingContainer>
      {/* Standards Based Grading Scale */}

      <div>
        <Block smallSize id="accessibility">
          {!!accessibilityData.length && (
            <>
              <Title>Accessibility</Title>
              {!isDocBased && (
                <RadioWrapper
                  disabled={freezeSettings}
                  style={{ marginTop: '10px', marginBottom: 0 }}
                >
                  {accessibilityData.map(({ key, value, description, id }) => (
                    <SettingContainer id={id}>
                      <DetailsTooltip
                        width={tootltipWidth}
                        title={accessibilities[key]}
                        content={description}
                        premium={featuresAvailable[key]}
                        placement="rightTop"
                      />
                      <StyledRow
                        key={accessibilities[key]}
                        style={{ width: '100%' }}
                      >
                        <Col span={10}>
                          <span style={{ fontSize: 12, fontWeight: 600 }}>
                            {accessibilities[key]}
                          </span>
                        </Col>
                        <Col span={14}>
                          <StyledRadioGroup
                            disabled={
                              freezeSettings ||
                              (key === immersiveReader.key
                                ? !isEnterpriseUser
                                : !featuresAvailable[key])
                            }
                            onChange={(e) =>
                              overRideSettings(key, e.target.value)
                            }
                            value={isUndefined(value) ? true : value}
                          >
                            <Radio value data-cy={`${key}-enable`}>
                              ENABLE
                            </Radio>
                            <Radio value={false} data-cy={`${key}-disable`}>
                              DISABLE
                            </Radio>
                          </StyledRadioGroup>
                        </Col>
                      </StyledRow>
                    </SettingContainer>
                  ))}
                </RadioWrapper>
              )}
            </>
          )}
          {/* Keypad settings starts */}
          <SettingContainer id="keypad-setting">
            <DetailsTooltip
              width={tootltipWidth}
              title="Keypad"
              content="Select keypad to apply current selection to all questions in the test"
              premium={premium}
              placement="right"
            />
            <StyledRow gutter={16} mb="15p">
              <Col span={10}>
                <span
                  style={{
                    fontSize: 12,
                    fontWeight: 600,
                    textTransform: 'uppercase',
                  }}
                >
                  Keypad
                </span>{' '}
              </Col>
              <Col span={12}>
                <KeypadDropdown
                  keypadData={keyPadData}
                  handleKeypadSelection={handleKeypadSelection}
                  testKeypadData={testSettings.keypad}
                  disabled={freezeSettings || !premium}
                />
              </Col>
              <ConfirmationModal
                centered
                visible={warningKeypadSelection}
                footer={[
                  <EduButton
                    isGhost
                    onClick={() => confirmKeypadSelection(false)}
                  >
                    CANCEL
                  </EduButton>,
                  <EduButton onClick={() => confirmKeypadSelection(true)}>
                    PROCEED
                  </EduButton>,
                ]}
                textAlign="center"
                onCancel={() => () => confirmKeypadSelection(false)}
              >
                <p>
                  <b>{translate('keypadSettings.warning')}</b>
                </p>
              </ConfirmationModal>
            </StyledRow>
          </SettingContainer>
          {/* Keypad settings ends */}

          {(assignmentSettings?.testType || testSettings.testType) !==
            'testlet' &&
            !testSettings.isDocBased && (
              <SettingContainer id="player-skin-setting">
                <DetailsTooltip
                  width={tootltipWidth}
                  title="Test Interface"
                  content="Teachers can change the look and feel of the assessments to more closely align with formats similar to state and nationally administered assessments. If you don’t see your state, select the generic option, Edulastic Test."
                  premium={selectPlayerSkinType}
                  placement="rightTop"
                />
                <PlayerSkinSelector
                  userRole={userRole}
                  playerSkinType={playerSkinType}
                  onAssignmentTypeChange={changeField('playerSkinType')}
                  testType={
                    assignmentSettings?.testType || testSettings.testType
                  }
                  selectBackgroundWhite
                  disabled={freezeSettings || !selectPlayerSkinType}
                  fullwidth
                />
              </SettingContainer>
            )}
        </Block>
      </div>
    </>
  )
}

export default withNamespaces('author')(MiscellaneousGroupContainer)
