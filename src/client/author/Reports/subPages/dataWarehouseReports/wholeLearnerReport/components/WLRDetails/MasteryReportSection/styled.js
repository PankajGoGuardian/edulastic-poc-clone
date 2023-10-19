import { FlexContainer } from '@edulastic/common'
import styled from 'styled-components'
import { themeColor, themeColorBlue, white } from '@edulastic/colors'
import { Button } from 'antd'
import { StyledCard } from '../../../../../../common/styled'

export const ReStyledCard = styled(StyledCard)`
  margin: 0px;
  padding: 20px;
  border: 1px solid #dadae4;
`
export const FilterRow = styled(FlexContainer)`
  @media print {
    display: none;
  }
`
export const DropdownContainer = styled.div`
  display: flex;

  .control-dropdown {
    .ant-btn {
      width: 100%;
    }
  }
  .control-dropdown {
    margin-left: 10px;
  }
  .control-dropown:first-child {
    margin-left: 0px;
  }
`
export const StyledButton = styled(Button)`
  float: right;
  margin: 5px;
  padding-left: 8px;
  padding-right: 0px;
  text-align: center;
  font: 11px/15px Open Sans;
  font-weight: 600;
  letter-spacing: 0.2px;
  color: ${themeColor};
  border-color: ${themeColor};
  &:hover {
    background: ${themeColorBlue};
    color: ${white};
    border-color: ${themeColorBlue};
    svg > * {
      fill: ${white};
    }
  }
  &:focus {
    color: ${themeColor};
  }
  .button-label {
    padding: 0px 20px;
  }
`
