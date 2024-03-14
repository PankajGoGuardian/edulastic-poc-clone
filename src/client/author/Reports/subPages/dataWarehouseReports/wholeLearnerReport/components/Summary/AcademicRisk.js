import React, { useState, useMemo } from 'react'
import { isEmpty } from 'lodash'
import { Empty } from 'antd'
import { FlexContainer, EduIf, EduElse, EduThen } from '@edulastic/common'
import {
  Label,
  AcademicRiskListContainer,
  StyledButton,
} from '../../common/styled'
import TestRiskScoreList from './TestRiskScoreList'
import TestRiskListPopup from './TestRiskListPopup'
import { getTestRiskTableData } from '../../utils'
import { StyledEmptyContainer } from '../../../common/components/styledComponents'
import { RISK_LABEL_SUFFIX } from '../../../common/utils'

const labelText = `ACADEMIC PROFICIENCY AND RISK ${RISK_LABEL_SUFFIX.toUpperCase()}`

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
  const hasContent = !isEmpty([
    ...internalAssessmentRisk,
    ...externalAssessmentRisk,
  ])

  return (
    <>
      <TestRiskListPopup
        visible={isTestListPopupVisible}
        onCancel={hideTestListPopup}
        tableData={testRiskTableData}
      />
      <AcademicRiskListContainer>
        <Label $margin="0 0 10px 0" $fontSize="14px">
          {labelText}
        </Label>
        <EduIf condition={hasContent}>
          <EduThen>
            <FlexContainer justifyContent="space-between">
              <AcademicRiskListContainer $marginRight="20px" $width="50%">
                <Label $fontSize="14px" $margin="0px 0 5px 0">
                  PEAR ASSESSMENT
                </Label>
                <TestRiskScoreList riskData={internalAssessmentRisk} />
              </AcademicRiskListContainer>
              <AcademicRiskListContainer $width="50%">
                <TestRiskScoreList
                  riskData={externalAssessmentRisk.slice(0, 3)}
                />
                <StyledButton
                  $isVisible={shouldShowSeeAllButton}
                  onClick={showTestListPopup}
                >
                  See All
                </StyledButton>
              </AcademicRiskListContainer>
            </FlexContainer>
          </EduThen>
          <EduElse>
            <StyledEmptyContainer
              margin="20px 0"
              description="No Academic Risk Available."
              image={Empty.PRESENTED_IMAGE_SIMPLE}
            />
          </EduElse>
        </EduIf>
      </AcademicRiskListContainer>
    </>
  )
}

export default AcademicRisk
