import React from 'react'
import { Checkbox, Switch } from 'antd'
import { FlexContainer } from '@edulastic/common'
import {
  StyledDivider,
  CheckboxContainer,
  TimeframeSwitchContainer,
  TimeframeText,
} from '../../common/styledComponents'
import { timeframeFilterKeys } from '../../../utils'

const RiskTimelineFilters = ({ filters, setWidgetFilters }) => {
  const { showCumulativeData, timeframe } = filters
  const handleCheckboxOnChange = (e) => {
    setWidgetFilters({
      ...filters,
      showCumulativeData: e.target.checked,
    })
  }

  const handleSwitchOnChange = (checked) => {
    setWidgetFilters({
      ...filters,
      timeframe: checked
        ? timeframeFilterKeys.QUARTERLY
        : timeframeFilterKeys.MONTHLY,
    })
  }

  const getIsChecked = (timeframeKey) => timeframeKey === timeframe

  return (
    <FlexContainer padding="10px 50px 10px 0px">
      <CheckboxContainer>
        <Checkbox
          checked={showCumulativeData}
          onChange={handleCheckboxOnChange}
        >
          <span>CUMULATIVE</span>
        </Checkbox>
      </CheckboxContainer>
      <StyledDivider type="vertical" />
      <TimeframeSwitchContainer>
        <TimeframeText checked={getIsChecked(timeframeFilterKeys.MONTHLY)}>
          MONTHLY
        </TimeframeText>
        <Switch
          checked={getIsChecked(timeframeFilterKeys.QUARTERLY)}
          onChange={handleSwitchOnChange}
        />
        <TimeframeText checked={getIsChecked(timeframeFilterKeys.QUARTERLY)}>
          QUARTERLY
        </TimeframeText>
      </TimeframeSwitchContainer>
    </FlexContainer>
  )
}

export default RiskTimelineFilters
