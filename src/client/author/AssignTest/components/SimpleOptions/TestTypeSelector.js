import { FieldLabel, SelectInputStyled } from '@edulastic/common'
import { Col, Select } from 'antd'
import React from 'react'
import { getTestTypeFullNames } from '../../../../common/utils/testTypeUtils'

const TestTypeSelector = ({
  testType,
  onAssignmentTypeChange,
  userRole,
  isAdvanceView,
  disabled = false,
  fullwidth = false,
  paddingTop,
}) => {
  const testTypes = getTestTypeFullNames(testType, userRole)

  const SelectOption = (
    <SelectInputStyled
      style={{ textTransform: 'capitalize' }}
      data-cy="testType"
      onChange={onAssignmentTypeChange}
      value={testType}
      disabled={disabled}
      height="30px"
      getPopupContainer={(node) => node.parentNode}
    >
      {Object.keys(testTypes).map((key) => {
        return (
          <Select.Option key={key} value={key}>
            {testTypes[key]}
          </Select.Option>
        )
      })}
    </SelectInputStyled>
  )

  return fullwidth ? (
    <>
      <Col span={9}>
        <FieldLabel>TEST TYPE</FieldLabel>
      </Col>
      <Col span={12}>{SelectOption}</Col>
    </>
  ) : (
    <>
      <>
        {!isAdvanceView && (
          <Col span={10}>
            <FieldLabel top={paddingTop}>TEST TYPE</FieldLabel>
          </Col>
        )}
        <Col span={14}>{SelectOption}</Col>
      </>
    </>
  )
}

export default TestTypeSelector
