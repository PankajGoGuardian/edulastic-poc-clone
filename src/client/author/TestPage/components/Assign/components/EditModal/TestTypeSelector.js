import React from 'react'
import { Select, Col, Row } from 'antd'
import { testTypes as testTypesConstants } from '@edulastic/constants'
import { connect } from 'react-redux'
import { StyledRow, StyledRowLabel, TestTypeDropDown } from './styled'
import { StyledSelect } from '../../../../../AssignTest/components/SimpleOptions/styled'
import {
  getAvailableTestTypesForUser,
  includeCommonOnTestType,
} from '../../../../../../common/utils/testTypeUtils'
import { isPremiumUserSelector } from '../../../../../src/selectors/user'

const generateReportTypes = {
  YES: {
    val: 'Yes',
    type: true,
  },
  NO: {
    val: 'No',
    type: false,
  },
}

const TestTypeSelector = ({
  testType,
  onAssignmentTypeChange,
  generateReport,
  userRole,
  onGenerateReportFieldChange,
  isPremiumUser,
}) => {
  const availableTestTypes = getAvailableTestTypesForUser({
    isPremium: isPremiumUser,
    role: userRole,
  })
  const testTypes = includeCommonOnTestType(availableTestTypes, testType)

  return (
    <>
      <StyledRowLabel gutter={16}>
        <Col span={12}>Test Type</Col>
      </StyledRowLabel>
      <Row gutter={32}>
        <Col span={12}>
          <StyledSelect
            defaultValue={testType}
            onChange={(value) => onAssignmentTypeChange(value)}
            getPopupContainer={(triggerNode) => triggerNode.parentNode}
          >
            {Object.keys(testTypes).map((key) => (
              <Select.Option key={key} value={key}>
                {key === 'assessment' && userRole !== 'teacher'
                  ? 'Common Assessment'
                  : testTypes[key]}
              </Select.Option>
            ))}
          </StyledSelect>
        </Col>
      </Row>
      <Col span={12}>
        {testTypesConstants.TEST_TYPES.PRACTICE.includes(testType) && (
          <>
            <StyledRowLabel>
              <Col span={24}>Generate Report</Col>
            </StyledRowLabel>
            <StyledRow>
              <Col span={24}>
                <TestTypeDropDown
                  defaultValue={generateReport}
                  onChange={onGenerateReportFieldChange}
                  getPopupContainer={(triggerNode) => triggerNode.parentNode}
                >
                  {Object.keys(generateReportTypes).map((key) => (
                    <Select.Option
                      key={key}
                      value={generateReportTypes[key].type}
                    >
                      {generateReportTypes[key].val}
                    </Select.Option>
                  ))}
                </TestTypeDropDown>
              </Col>
            </StyledRow>
          </>
        )}
      </Col>
    </>
  )
}

export default connect((state) => ({
  isPremiumUser: isPremiumUserSelector(state),
}))(TestTypeSelector)
