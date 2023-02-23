/* eslint-disable react/prop-types */
import React from 'react'
// import PropTypes from "prop-types";
import PropTypes from 'prop-types'
import {
  test as testConst,
  assignmentStatusOptions,
  assignmentPolicyOptions,
} from '@edulastic/constants'
import { Tooltip } from 'antd'
import {
  FieldLabel,
  DatePickerStyled,
  RadioBtn,
  RadioGrp,
} from '@edulastic/common'
import { withNamespaces } from '@edulastic/localization'
import { StyledRow, Label, RadioButtonWrapper, StyledCol } from './styled'
import DetailsTooltip from '../Container/DetailsTooltip'
import SettingContainer from '../Container/SettingsContainer'

const {
  POLICY_CLOSE_MANUALLY_BY_ADMIN,
  POLICY_CLOSE_MANUALLY_IN_CLASS,
  POLICY_AUTO_ON_STARTDATE,
} = assignmentPolicyOptions

const DateSelector = ({
  startDate,
  endDate,
  changeField,
  passwordPolicy,
  forClassLevel,
  status,
  dueDate,
  changeRadioGrop,
  selectedOption,
  showOpenDueAndCloseDate,
  t,
  hasStartDate,
  tootltipWidth,
  paddingTop,
  closePolicy = POLICY_AUTO_ON_STARTDATE,
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

  const handleDisableDueDate = (currentDate) => {
    if (!currentDate || !endDate || !startDate) return false
    return (
      currentDate.valueOf() > endDate.valueOf() ||
      currentDate.valueOf() < startDate.valueOf()
    )
  }
  const showDueDatePicker = forClassLevel
    ? dueDate
    : showOpenDueAndCloseDate && selectedOption

  return (
    <>
      {!forClassLevel && showOpenDueAndCloseDate && (
        <SettingContainer id="open-close-due-radio">
          <DetailsTooltip
            width={tootltipWidth}
            title="Open, Close and Due Dates"
            content="When Use Open and Close Date is selected, this restricts the test window to these dates. If you want to allow late submissions, choose the Use Open, Due, and Close Date option.  Selecting this gives the option to set a “due” date within the test window and doesn’t restrict late submissions (e.g. from absent students). Note: the Close date can be adjusted if needed on the Live Class Board, Settings."
            premium
          />
          <StyledRow gutter={16}>
            <StyledCol span={24}>
              <RadioGrp
                style={{ display: 'flex' }}
                onChange={changeRadioGrop}
                value={selectedOption}
              >
                <RadioButtonWrapper>
                  <RadioBtn data-cy="radioOpenCloseDate" value={false} />
                  <Label>
                    {t('common.assignTest.dateRadioGroup.openClose')}
                  </Label>
                </RadioButtonWrapper>

                <RadioButtonWrapper style={{ marginLeft: '50px' }}>
                  <RadioBtn data-cy="radioOpenDueCloseDate" value />
                  <Label>
                    {t('common.assignTest.dateRadioGroup.openCloseDue')}{' '}
                    <span style={{ fontWeight: 'normal' }}>
                      &nbsp;(Allows Late Submissions)
                    </span>
                  </Label>
                </RadioButtonWrapper>
              </RadioGrp>
            </StyledCol>
          </StyledRow>
        </SettingContainer>
      )}

      {hasStartDate && (
        <SettingContainer id="open-date-setting">
          <DetailsTooltip
            width={tootltipWidth}
            title="Open date"
            content="Open Date indicates when the test window begins. It is the earliest day and time that the students can access the test. You can set it to the day, hour, and minute."
            premium
          />
          <StyledRow mb="15px" gutter={16}>
            <StyledCol span={forClassLevel ? 12 : 10}>
              <FieldLabel>{t('common.assignTest.openDateTitle')}</FieldLabel>
            </StyledCol>
            <StyledCol span={forClassLevel ? 12 : 14}>
              <Tooltip
                placement="top"
                title={
                  passwordPolicy ===
                  testConst.passwordPolicy.REQUIRED_PASSWORD_POLICY_DYNAMIC
                    ? 'To modify set Dynamic Password as OFF'
                    : null
                }
              >
                <DatePickerStyled
                  allowClear={false}
                  data-cy="startDate"
                  size="large"
                  style={{ width: '100%' }}
                  disabledDate={disabledStartDate}
                  showTime={{ use12Hours: true, format: 'hh:mm a' }}
                  format="YYYY-MM-DD hh:mm a"
                  value={startDate}
                  placeholder={t('common.assignTest.openDatePlaceholder')}
                  onChange={changeField('startDate')}
                  disabled={
                    passwordPolicy ===
                      testConst.passwordPolicy
                        .REQUIRED_PASSWORD_POLICY_DYNAMIC ||
                    (forClassLevel &&
                      status !== assignmentStatusOptions.NOT_OPEN)
                  }
                />
              </Tooltip>
            </StyledCol>
          </StyledRow>
        </SettingContainer>
      )}
      {!!showDueDatePicker && (
        <StyledRow mb="15px" gutter={16}>
          <StyledCol span={forClassLevel ? 12 : 10}>
            <FieldLabel>{t('common.assignTest.dueDateTitle')}</FieldLabel>
          </StyledCol>
          <StyledCol span={forClassLevel ? 12 : 14}>
            <DatePickerStyled
              allowClear={false}
              data-cy="dueDate"
              size="large"
              style={{ width: '100%' }}
              showTime={{ use12Hours: true, format: 'hh:mm a' }}
              format="YYYY-MM-DD hh:mm a"
              value={dueDate}
              placeholder={t('common.assignTest.dueDatePlaceholder')}
              onChange={changeField('dueDate')}
              disabled={
                forClassLevel && status === assignmentStatusOptions.DONE
              }
              disabledDate={handleDisableDueDate}
            />
          </StyledCol>
        </StyledRow>
      )}

      <SettingContainer id="close-date-setting">
        <DetailsTooltip
          width={tootltipWidth}
          title="Close date"
          content="The Close Date indicates the last time the test is available to students. You can set it to the day, hour, and minute.  Once closed, the data from the test will flow to the Insight reports. You may adjust this close date on the Live Class Board Settings at any time."
          premium
        />
        <StyledRow mb="15px" gutter={16}>
          <StyledCol span={forClassLevel ? 12 : 10}>
            <FieldLabel top={paddingTop}>
              {t('common.assignTest.closeDateTitle')}
            </FieldLabel>
          </StyledCol>
          <StyledCol span={forClassLevel ? 12 : 14}>
            {[
              POLICY_CLOSE_MANUALLY_BY_ADMIN,
              POLICY_CLOSE_MANUALLY_IN_CLASS,
            ].includes(closePolicy) ? (
              'Close Manually by User'
            ) : (
              <DatePickerStyled
                allowClear={false}
                data-cy="closeDate"
                style={{ width: '100%' }}
                size="large"
                disabledDate={disabledEndDate}
                showTime={{ use12Hours: true, format: 'hh:mm a' }}
                format="YYYY-MM-DD hh:mm a"
                value={endDate}
                placeholder={t('common.assignTest.closeDatePlaceholder')}
                showToday={false}
                onChange={changeField('endDate')}
                disabled={
                  forClassLevel && status === assignmentStatusOptions.DONE
                }
              />
            )}
          </StyledCol>
        </StyledRow>
      </SettingContainer>
    </>
  )
}

DateSelector.propTypes = {
  hasStartDate: PropTypes.bool,
}

DateSelector.defaultProps = {
  hasStartDate: true,
}
export default withNamespaces('author')(DateSelector)
