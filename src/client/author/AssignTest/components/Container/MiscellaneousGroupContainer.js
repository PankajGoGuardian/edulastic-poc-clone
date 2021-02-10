import React from 'react'
import { Col, Radio } from 'antd'
import { test } from '@edulastic/constants'
import { isUndefined } from 'lodash'
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
import PeformanceBand from '../../../TestPage/components/Setting/components/Container/PeformanceBand'
import PlayerSkinSelector from '../SimpleOptions/PlayerSkinSelector'
import DetailsTooltip from './DetailsTooltip'
import { SettingContainer } from './styled'

const { accessibilities } = test

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
}) => {
  const {
    answerOnPaper = testSettings.answerOnPaper,
    performanceBand = testSettings.performanceBand,
    standardGradingScale = testSettings.standardGradingScale,
    showMagnifier = testSettings.showMagnifier,
    enableScratchpad = testSettings.enableScratchpad,
  } = assignmentSettings

  const playerSkinType =
    assignmentSettings.playerSkinType || testSettings.playerSkinType

  const accessibilityData = [
    {
      key: 'showMagnifier',
      value: showMagnifier,
      description:
        'This tool provides visual assistance. When enabled, students can move the magnifier around the page to enlarge areas of their screen.',
    },
    {
      key: 'enableScratchpad',
      value: enableScratchpad,
      description:
        'When enabled, a student can open ScratchPad to show their work. The tool contains options for text, drawing, shapes, rulers, and more.',
    },
  ]

  const {
    assessmentSuperPowersAnswerOnPaper,
    performanceBands,
    selectPlayerSkinType,
  } = featuresAvailable

  return (
    <>
      {/* Answer on Paper */}
      <SettingContainer>
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

      {/* Performance Bands */}
      <SettingContainer>
        <DetailsTooltip
          width={tootltipWidth}
          title="Performance Bands"
          content="Performance bands are set by district or school admins. Teachers can modify cut scores/thresholds for class assignments."
          premium={performanceBands}
          placement="rightBottom"
        />
        <DivBlock>
          <PeformanceBand
            disabled={freezeSettings || !performanceBands}
            setSettingsData={(val) => overRideSettings('performanceBand', val)}
            performanceBand={performanceBand}
            isFeatureAvailable={performanceBands}
            fromAssignments
          />
        </DivBlock>
      </SettingContainer>
      {/* Performance Bands */}

      {/* Standards Based Grading Scale */}
      <SettingContainer>
        <DetailsTooltip
          width={tootltipWidth}
          title="Standards Based Grading Scale"
          content="Standards based scales are set by district or school admins. Teachers can modify performance threshold scores for class assignments to track mastery by standards assessed."
          premium={premium}
          placement="rightBottom"
          fromAssignments
        />
        <DivBlock>
          <StandardProficiencyTable
            disabled={freezeSettings}
            standardGradingScale={standardGradingScale}
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
                  {accessibilityData.map(({ key, value, description }) => (
                    <SettingContainer>
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
                            disabled={freezeSettings || !featuresAvailable[key]}
                            onChange={(e) =>
                              overRideSettings(key, e.target.value)
                            }
                            defaultValue={isUndefined(value) ? true : value}
                          >
                            <Radio value>ENABLE</Radio>
                            <Radio value={false}>DISABLE</Radio>
                          </StyledRadioGroup>
                        </Col>
                      </StyledRow>
                    </SettingContainer>
                  ))}
                </RadioWrapper>
              )}
            </>
          )}

          {(assignmentSettings?.testType || testSettings.testType) !==
            'testlet' &&
            !testSettings.isDocBased && (
              <SettingContainer>
                <DetailsTooltip
                  width={tootltipWidth}
                  title="Student Player Skin"
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
                  isFeatureAvailable={selectPlayerSkinType}
                  fullwidth
                />
              </SettingContainer>
            )}
        </Block>
      </div>
    </>
  )
}

export default MiscellaneousGroupContainer
