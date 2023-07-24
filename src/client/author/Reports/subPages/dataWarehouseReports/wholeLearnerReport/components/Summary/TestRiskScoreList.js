import React from 'react'

import { FlexContainer } from '@edulastic/common'
import { EXTERNAL_TEST_KEY_SEPARATOR } from '@edulastic/constants/reportUtils/common'
import { IconInfo } from '@edulastic/icons'
import { themeColor } from '@edulastic/colors'
import {
  reportUtils,
  testTypes as testTypesConstants,
} from '@edulastic/constants'
import { Tooltip } from 'antd'
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
    {riskData.map(
      ({ type, score, riskBandLabel, subjectData, isExternalTest }) => {
        const tooltipTexts = getSubjectRiskText(subjectData, isExternalTest)
        const tooltipTitle = `${type}: ${score}`
        const testType = isExternalTest
          ? type.replace(EXTERNAL_TEST_KEY_SEPARATOR, ' - ')
          : type
        const testName = isExternalTest
          ? `${testType}`
          : `${TEST_TYPE_LABELS[testType].split(' ')[0]}`
        const scoreText = isExternalTest ? score : `${score}%`
        return (
<<<<<<< HEAD
          <FlexContainer justifyContent="space-between" key={testName}>
            <Tooltip title={tooltipTitle}>
              <TestDetailContainer>
                <TestLabel>{testName}</TestLabel>
=======
          <FlexContainer
            justifyContent="space-between"
            alignItems="baseline"
            key={testName}
          >
            <Tooltip title={tooltipTitle}>
              <TestDetailContainer>
                <TestLabel fontSize="14px">{testName}</TestLabel>
>>>>>>> edulasticv2-e34.1.0
                <span>{scoreText}</span>
              </TestDetailContainer>
            </Tooltip>
            <RiskLabel
<<<<<<< HEAD
              color={RISK_BAND_COLOR_INFO[riskBandLabel]}
              fontSize="10px"
=======
              $color={RISK_BAND_COLOR_INFO[riskBandLabel]}
              fontSize="14px"
>>>>>>> edulasticv2-e34.1.0
            >
              <span>{riskBandLabel}</span>
              <Tooltip title={renderTooltip(tooltipTexts)}>
                <IconInfo fill={themeColor} />
              </Tooltip>
            </RiskLabel>
          </FlexContainer>
        )
      }
    )}
  </>
)

export default TestRiskScoreList
