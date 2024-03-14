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
import { isEmpty } from 'lodash'
import { TestLabel, RiskLabel, TestDetailContainer } from '../../common/styled'
import { getSubjectRiskTooltipData } from '../../utils'
import { CustomWhiteBackgroundTooltip } from '../../../../../common/components/customTableTooltip'
import RiskTooltip from './RiskTooltip'

const { RISK_BAND } = reportUtils.common
const { TEST_TYPE_LABELS } = testTypesConstants

const TestRiskScoreList = ({ riskData }) => (
  <>
    {riskData.map((testRisk) => {
      const { type, score, riskBandLabel, isExternalTest } = testRisk
      const tooltipData = getSubjectRiskTooltipData(testRisk)
      const scoreLabel = getScoreLabel(score, testRisk)
      const tooltipTitle = `${
        isExternalTest ? type : TEST_TYPE_LABELS[type]
      }: ${scoreLabel}`
      const testType = isExternalTest
        ? type.replace(EXTERNAL_TEST_KEY_SEPARATOR, ' - ')
        : type
      const testName = isExternalTest
        ? `${testType}`
        : `${TEST_TYPE_LABELS[testType]}`
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
          <RiskLabel $color={RISK_BAND[riskBandLabel].secondaryColor}>
            <span>{RISK_BAND[riskBandLabel].label}</span>
            <EduIf condition={tooltipData.some((item) => !isEmpty(item))}>
              <CustomWhiteBackgroundTooltip
                data={<RiskTooltip data={tooltipData} />}
                str={
                  <IconInfo fill={themeColor} style={{ marginTop: '3px' }} />
                }
              />
            </EduIf>
          </RiskLabel>
        </FlexContainer>
      )
    })}
  </>
)

export default TestRiskScoreList
