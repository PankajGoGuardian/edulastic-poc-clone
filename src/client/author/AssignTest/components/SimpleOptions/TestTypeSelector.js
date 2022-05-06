import { FieldLabel, SelectInputStyled } from '@edulastic/common'
import { roleuser, test } from '@edulastic/constants'
import { Col, Select } from 'antd'
import React from 'react'
import { connect } from 'react-redux'

const { type } = test
const { ASSESSMENT, PRACTICE, COMMON } = type

const TestTypeSelector = ({
  testType,
  onAssignmentTypeChange,
  userRole,
  isAdvanceView,
  disabled = false,
  fullwidth = false,
  districtPermissions = [],
  paddingTop,
}) => {
  const isAdmin =
    userRole === roleuser.DISTRICT_ADMIN || userRole === roleuser.SCHOOL_ADMIN
  const testTypes = {
    [ASSESSMENT]: 'Class Assessment',
    [PRACTICE]: isAdmin ? 'Practice' : 'Practice Assessment',
  }

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
      {isAdmin && !districtPermissions.includes('publisher') && (
        <Select.Option key={COMMON} value={COMMON}>
          Common Assessment
        </Select.Option>
      )}
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

export default connect((state) => ({
  districtPermissions:
    state?.user?.user?.orgData?.districts?.[0]?.districtPermissions,
}))(TestTypeSelector)
