import React from 'react'

import { EduIf, FlexContainer } from '@edulastic/common'
import { EXTERNAL_TEST_KEY_SEPARATOR } from '@edulastic/constants/reportUtils/common'
import { IconInfo } from '@edulastic/icons'
import { themeColor } from '@edulastic/colors'
import {
  reportUtils,
  testTypes as testTypesConstants,
} from '@edulastic/constants'
import { Tooltip } from 'antd'
import { getScoreLabel } from '@edulastic/constants/const/dataWarehouse'
import { TestLabel, RiskLabel, TestDetailContainer } from '../../common/styled'
import { getSubjectRiskText } from '../../utils'

const { RISK_BAND_COLOR_INFO } = reportUtils.common
const { TEST_TYPE_LABELS } = testTypesConstants

const renderTooltip = (tooltipTexts) => (
  <>
    {tooltipTexts.map((text) => (
      <p key={text}>{text}</p>
    ))}
  </>
)

const TestRiskScoreList = ({ riskData }) => (
  <>
    {riskData.map((testRisk) => {
      const { type, score, riskBandLabel, isExternalTest } = testRisk
      const tooltipTexts = getSubjectRiskText(testRisk)
      const scoreLabel = getScoreLabel(score, testRisk)
      const tooltipTitle = `${type}: ${scoreLabel}`
      const testType = isExternalTest
        ? type.replace(EXTERNAL_TEST_KEY_SEPARATOR, ' - ')
        : type
      const testName = isExternalTest
        ? `${testType}`
        : `${TEST_TYPE_LABELS[testType].split(' ')[0]}`
      return (
        <FlexContainer
          justifyContent="space-between"
          alignItems="baseline"
          key={testName}
        >
          <Tooltip title={tooltipTitle}>
            <TestDetailContainer>
              <TestLabel fontSize="14px">{testName}</TestLabel>
              <span>{scoreLabel}</span>
            </TestDetailContainer>
          </Tooltip>
          <RiskLabel $color={RISK_BAND_COLOR_INFO[riskBandLabel]}>
            <span>{riskBandLabel}</span>
            <EduIf condition={tooltipTexts.some((text) => !!text)}>
              <Tooltip title={renderTooltip(tooltipTexts)}>
                <IconInfo fill={themeColor} />
              </Tooltip>
            </EduIf>
          </RiskLabel>
        </FlexContainer>
      )
    })}
  </>
)

export default TestRiskScoreList
