import React, { useState, useMemo } from 'react'
import { FlexContainer } from '@edulastic/common'
import { Label, HalfWidthContainer, StyledButton } from '../../common/styled'
import TestRiskScoreList from './TestRiskScoreList'
import TestRiskListPopup from './TestRiskListPopup'
import { getTestRiskTableData } from '../../utils'

const AcademicRisk = ({ internalAssessmentRisk, externalAssessmentRisk }) => {
  const [isTestListPopupVisible, setIsTestListPopupVisible] = useState(false)

  const hideTestListPopup = () => {
    setIsTestListPopupVisible(false)
  }

  const showTestListPopup = () => {
    setIsTestListPopupVisible(true)
  }

  const testRiskTableData = useMemo(
    () =>
      getTestRiskTableData([
        ...internalAssessmentRisk,
        ...externalAssessmentRisk,
      ]),
    [internalAssessmentRisk, externalAssessmentRisk]
  )

  const shouldShowSeeAllButton = externalAssessmentRisk.length > 2

  return (
    <>
      <TestRiskListPopup
        visible={isTestListPopupVisible}
        onCancel={hideTestListPopup}
        tableData={testRiskTableData}
      />
      <HalfWidthContainer>
        <Label $margin="0 0 10px 0" $fontSize="16px">
          ACADEMIC PROFICIENCY AND RISK
        </Label>
        <FlexContainer justifyContent="space-between">
          <HalfWidthContainer $marginRight="20px">
            <Label $fontSize="16px">EDULASTIC</Label>
            <TestRiskScoreList riskData={internalAssessmentRisk} />
          </HalfWidthContainer>
          <HalfWidthContainer>
            <TestRiskScoreList riskData={externalAssessmentRisk.slice(0, 3)} />
            <StyledButton
              $isVisible={shouldShowSeeAllButton}
              onClick={showTestListPopup}
            >
              See All
            </StyledButton>
          </HalfWidthContainer>
        </FlexContainer>
      </HalfWidthContainer>
    </>
  )
}

export default AcademicRisk
