import {
  test as testConst,
  roleuser,
  assignmentPolicyOptions,
} from '@edulastic/constants'
import { Col, Select, Tooltip } from 'antd'
import * as moment from 'moment'
import React from 'react'
import { connect } from 'react-redux'
import { getUserRole } from '../../../src/selectors/user'
import selectsData from '../../../TestPage/components/common/selectsData'
import {
  Label,
  StyledDatePicker,
  StyledRow,
  StyledSelect,
} from './styled-components'
import { getIsOverrideFreezeSelector } from '../../../TestPage/ducks'

const {
  POLICY_CLOSE_MANUALLY_BY_ADMIN,
  POLICY_CLOSE_MANUALLY_IN_CLASS,
} = assignmentPolicyOptions

const DatePolicySelector = ({
  startDate,
  endDate,
  changeField,
  openPolicy: selectedOpenPolicy,
  closePolicy: selectedClosePolicy,
  userRole,
  passwordPolicy = testConst.passwordPolicy.REQUIRED_PASSWORD_POLICY_OFF,
}) => {
  const disabledStartDate = (_startDate) => {
    if (!_startDate || !endDate) {
      return false
    }
    return _startDate.valueOf() < Date.now()
  }

  const disabledEndDate = (_endDate) => {
    if (!_endDate || !startDate) {
      return false
    }
    return (
      _endDate.valueOf() < startDate.valueOf() ||
      _endDate.valueOf() < Date.now()
    )
  }

  let openPolicy = selectsData.openPolicy
  let closePolicy = selectsData.closePolicy
  const isAdmin =
    userRole === roleuser.DISTRICT_ADMIN || userRole === roleuser.SCHOOL_ADMIN
  if (isAdmin) {
    openPolicy = selectsData.openPolicyForAdmin
    closePolicy = selectsData.closePolicyForAdmin
  }

  return (
    <>
      <StyledRow gutter={24}>
        <Col xs={24} md={12} lg={6}>
          <Label>Open Date</Label>
          <Tooltip
            placement="top"
            title={
              passwordPolicy ===
              testConst.passwordPolicy.REQUIRED_PASSWORD_POLICY_DYNAMIC
                ? 'To modify set Dynamic Password as OFF'
                : null
            }
          >
            <StyledDatePicker
              allowClear={false}
              data-cy="startDate"
              style={{ width: '100%' }}
              size="large"
              disabledDate={disabledStartDate}
              showTime={{ use12Hours: true, format: 'hh:mm a' }}
              format="YYYY-MM-DD hh:mm a"
              value={moment(startDate)}
              placeholder="Open Date"
              onChange={changeField('startDate')}
              disabled={
                passwordPolicy ===
                testConst.passwordPolicy.REQUIRED_PASSWORD_POLICY_DYNAMIC
              }
            />
          </Tooltip>
        </Col>
        <Col xs={24} md={12} lg={6}>
          <Label>Close Date</Label>
          {[
            POLICY_CLOSE_MANUALLY_BY_ADMIN,
            POLICY_CLOSE_MANUALLY_IN_CLASS,
          ].includes(selectedClosePolicy) ? (
            <span style={{ lineHeight: '40px' }}>Close Manually by User</span>
          ) : (
            <StyledDatePicker
              allowClear={false}
              data-cy="closeDate"
              style={{ width: '100%' }}
              size="large"
              disabledDate={disabledEndDate}
              showTime={{ use12Hours: true, format: 'hh:mm a' }}
              format="YYYY-MM-DD hh:mm a"
              value={moment(endDate)}
              placeholder="Close Date"
              showToday={false}
              onChange={changeField('endDate')}
            />
          )}
        </Col>
        <Col xs={24} md={12} lg={6}>
          <Label>Open Policy</Label>
          <Tooltip
            placement="top"
            title={
              passwordPolicy ===
              testConst.passwordPolicy.REQUIRED_PASSWORD_POLICY_DYNAMIC
                ? 'To modify set Dynamic Password as OFF'
                : null
            }
          >
            <StyledSelect
              data-cy="selectOpenPolicy"
              placeholder="Please select"
              cache="false"
              value={selectedOpenPolicy}
              onChange={changeField('openPolicy')}
              disabled={
                passwordPolicy ===
                testConst.passwordPolicy.REQUIRED_PASSWORD_POLICY_DYNAMIC
              }
            >
              {openPolicy.map(({ value, text }, index) => (
                <Select.Option key={index} value={value} data-cy="open">
                  {text}
                </Select.Option>
              ))}
            </StyledSelect>
          </Tooltip>
        </Col>
        <Col xs={24} md={12} lg={6}>
          <Label>Close Policy</Label>
          <StyledSelect
            data-cy="selectClosePolicy"
            placeholder="Please select"
            cache="false"
            value={selectedClosePolicy}
            onChange={changeField('closePolicy')}
          >
            {closePolicy.map(({ value, text }, index) => (
              <Select.Option data-cy="class" key={index} value={value}>
                {text}
              </Select.Option>
            ))}
          </StyledSelect>
        </Col>
      </StyledRow>
    </>
  )
}

export default connect((state) => ({
  userRole: getUserRole(state),
  freezeSettings: getIsOverrideFreezeSelector(state),
}))(DatePolicySelector)
