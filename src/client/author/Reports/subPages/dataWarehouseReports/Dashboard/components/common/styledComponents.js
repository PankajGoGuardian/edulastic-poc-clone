import {
  greyThemeLighter,
  themeLightGrayColor,
  lightGrey9,
} from '@edulastic/colors'
import { Row } from 'antd'
import styled from 'styled-components'
import { DashedHr } from '../../../../../common/styled'

export const StyledGrid = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  padding: 40px 30px;
  gap: 30px;
  flex-wrap: wrap;
  background-color: ${greyThemeLighter};
`
export const Widget = styled.div`
  width: 765px;
  height: ${({ small }) => (small ? '230px' : '450px')};
  border-radius: 20px;
  padding-top: 10px;
  box-shadow: 0px 3px 6px #00000029;
  .title {
    font-size: 15px;
    font-weight: bold;
    padding: 11px 16px;
    background-color: #dcf4e3;
    border-radius: 20px 0px;
  }
  .external-link {
    float: right;
    padding-inline: 11px 16px;
  }
`

export const WidgetFilterDropdown = styled.div`
  display: flex;
  width: fit-content;
  margin-top: 30px;
  font-size: 11px;
  font-color: #6a737f;
  .filter-label {
    margin: auto 10px;
  }
  .bold {
    font-weight: bold;
  }
`

export const ContentWrapper = styled.div`
  display: flex;
  margin-block: 30px;
  justify-content: space-between;
  align-items: center;
  padding-inline: 50px;
  font-weight: bold;
  font-size: 13px;
  text-align: center;
  .performance-band-name {
    font-size: 10px;
  }
  .medium {
    font-size: 13px;
    color: ${lightGrey9};
    margin-top: 5px;
  }
  .large {
    font-size: 18px;
  }
`
export const StyledCell = styled.div`
  padding: ${(props) => (props.largeCell ? '15px 35px' : '10px 20px')};
  width: fit-content;
  font-size: 20px;
  margin-inline: auto;
  margin-block: 10px;
  background-color: ${(props) => (props.fill ? props.color : '')};
  border: ${(props) => (!props.fill ? `2px solid ${props.color}` : '')};
  border-radius: 10px;
`
export const DashedVR = styled.div`
  border-left: 1px dashed ${themeLightGrayColor};
  height: ${(props) => props.height || '300px'};
`

export const StyledDashedHr = styled(DashedHr)`
  margin-block: 30px;
  width: 150px;
  justify: center;
`
export const StyledRow = styled(Row)`
  justify-content: space-between;
  align-items: center;
  padding-inline: 80px;
`
export const StyledDiv = styled.div`
  display: flex;
`
export const SubFooter = styled.div`
  font-size: 12px;
  color: ${lightGrey9};
`
