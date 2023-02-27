import {
  greyLight1,
  lightGrey9,
  secondaryTextColor,
  themeColorBlue,
} from '@edulastic/colors'
import { Switch } from 'antd'
import styled from 'styled-components'

export const ChartWrapper = styled.div`
  border: 1px solid #dedede;
  width: ${({ width }) => width || '100%'};
  border-radius: 10px;
  padding: 24px;
  margin-bottom: 16px;
`

export const Title = styled.div`
  font-size: 16px;
  color: ${secondaryTextColor};
  font-weight: bold;
  flex: 1;
`

export const LegendWrap = styled.div`
  display: flex;
  gap: 0 15px;
  border-right: 1px solid ${greyLight1};
  margin-right: 15px;
`

export const CustomLegend = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 15px;
`

export const LegendSymbol = styled.span`
  width: 10px;
  height: 10px;
  background: ${(props) => props.color};
  display: flex;
  border-radius: 50%;
  margin-right: 10px;
`

export const LegendName = styled.span`
  font-size: 11px;
  color: #4b4b4b;
`

export const CheckBoxWrapper = styled.div`
  display: flex;
  justify-content: flex-start;
  .ant-checkbox-inner::after {
    left: 22% !important;
  }
`

export const SwitchStyled = styled(Switch)`
  margin-top: 3px;
  &.ant-switch {
    width: 75px;
    line-height: 16px;
    &.ant-switch-checked {
      background: ${themeColorBlue};
    }
  }
  .ant-switch-inner {
    font-weight: 900;
    font-size: 10px;
    margin: 0 10px;
  }
`

export const CheckboxText = styled.span`
  font: normal normal normal 11px/22px Open Sans;
  letter-spacing: 0.2px;
  color: ${lightGrey9};
`

export const FlexWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  flex: ${({ flex }) => flex};
  margin-bottom: 15px;
`
