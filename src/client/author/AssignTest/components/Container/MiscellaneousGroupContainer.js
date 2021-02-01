import React from 'react'
import { Row, Col, Radio, Tooltip } from 'antd'
import { test } from '@edulastic/constants'
import { isUndefined } from 'lodash'
import { lightGrey9 } from '@edulastic/colors'
import FeaturesSwitch from '../../../../features/components/FeaturesSwitch'
import {
  AlignSwitchRight,
  StyledRow,
  DivBlock,
  Label,
  Block,
  StyledRadioGroup,
  RadioWrapper,
  Title,
  StyledInfoIcon,
} from '../SimpleOptions/styled'
import StandardProficiencyTable from '../../../TestPage/components/Setting/components/Container/StandardProficiencyTable'
import PeformanceBand from '../../../TestPage/components/Setting/components/Container/PeformanceBand'
import PlayerSkinSelector from '../SimpleOptions/PlayerSkinSelector'
import DollarPremiumSymbol from './DollarPremiumSymbol'
import DetailsTooltip from './DetailsTooltip'
import { SettingContainer } from './styled'

const { accessibilities } = test

const MiscellaneousGroupContainer = ({
  assignmentSettings,
  changeField,
  testSettings,
  gradeSubject,
  isDocBased,
  freezeSettings,
  overRideSettings,
  userRole,
  disableAnswerOnPaper,
  actionOnFeatureInaccessible,
  featuresAvailable,
  tootltipWidth,
}) => {
  const {
    answerOnPaper = testSettings.answerOnPaper,
    performanceBand = testSettings.performanceBand,
    standardGradingScale = testSettings.standardGradingScale,
    showMagnifier = testSettings.showMagnifier,
    enableScratchpad = testSettings.enableScratchpad,
    multiLanguageEnabled = !!testSettings.multiLanguageEnabled,
  } = assignmentSettings

  const playerSkinType =
    assignmentSettings.playerSkinType || testSettings.playerSkinType

  const accessibilityData = [
    { key: 'showMagnifier', value: showMagnifier },
    { key: 'enableScratchpad', value: enableScratchpad },
  ]

  const {
    assessmentSuperPowersAnswerOnPaper,
    performanceBands,
    selectPlayerSkinType,
    premium,
  } = featuresAvailable

  const showMultiLangSelection = !!testSettings.multiLanguageEnabled

  return (
    <>
      {/* Answer on Paper */}
      <SettingContainer>
        <DetailsTooltip
          width={tootltipWidth}
          title="ANSWER ON PAPER"
          content="Use this option if you are administering this assessment on paper. If you use this option, you will have to manually grade student responses after the assessment is closed."
          placement="rightBottom"
          premium={assessmentSuperPowersAnswerOnPaper}
        />
        <StyledRow gutter={16} mb="15p">
          <Col span={12}>
            <Label>
              ANSWER ON PAPER
              <DollarPremiumSymbol
                premium={assessmentSuperPowersAnswerOnPaper}
              />
            </Label>
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
            title="Multi-Language"
            content="Select ON , If you want to enable multiple languages for the test."
            premium={premium}
          />
          <StyledRow gutter={16} mb="15px" height="40">
            <Col span={12}>
              <Label>
                <span>Multi-Language</span>
                <Tooltip title="Select ON , If you want to enable multiple languages for the assignment.">
                  <StyledInfoIcon color={lightGrey9} mL="15px" />
                </Tooltip>
              </Label>
            </Col>
            <Col span={10} style={{ display: 'flex', flexDirection: 'column' }}>
              <Row style={{ display: 'flex', alignItems: 'center' }}>
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
              </Row>
            </Col>
          </StyledRow>
        </SettingContainer>
      )}
      {/* Multi language */}
      <FeaturesSwitch
        inputFeatures="performanceBands"
        actionOnInaccessible={actionOnFeatureInaccessible}
        key="performanceBands"
        gradeSubject={gradeSubject}
      >
        <DivBlock>
          <PeformanceBand
            disabled={freezeSettings || !performanceBands}
            setSettingsData={(val) => overRideSettings('performanceBand', val)}
            performanceBand={performanceBand}
            isFeatureAvailable={performanceBands}
          />
        </DivBlock>
      </FeaturesSwitch>
      <DivBlock>
        <StandardProficiencyTable
          disabled={freezeSettings}
          standardGradingScale={standardGradingScale}
          setSettingsData={(val) =>
            overRideSettings('standardGradingScale', val)
          }
        />
      </DivBlock>

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
                  {accessibilityData.map(({ key, value }) => (
                    <StyledRow
                      key={accessibilities[key]}
                      style={{ width: '100%' }}
                    >
                      <Col span={12}>
                        <span style={{ fontSize: 12, fontWeight: 600 }}>
                          {accessibilities[key]}
                          <DollarPremiumSymbol
                            premium={featuresAvailable[key]}
                          />
                        </span>
                      </Col>
                      <Col span={12}>
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
                actionOnInaccessible={actionOnFeatureInaccessible}
                key="selectPlayerSkin"
                gradeSubject={gradeSubject}
              >
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
              </FeaturesSwitch>
            )}
        </Block>
      </div>
    </>
  )
}

export default MiscellaneousGroupContainer
