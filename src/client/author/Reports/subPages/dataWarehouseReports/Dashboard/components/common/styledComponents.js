import {
  greyThemeLighter,
  themeLightGrayColor,
  lightGrey9,
  themeColorLighter1,
  white,
} from '@edulastic/colors'
import { Row } from 'antd'
import styled from 'styled-components'
import { DashedHr } from '../../../../../common/styled'
import { cellStyles } from '../../utils'

export const MasonGrid = styled.div`
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
  height: ${({ small }) => (small ? '220px' : '450px')};
  border-radius: 20px;
  background-color: ${white};
  padding-top: 10px;
  box-shadow: 0px 3px 6px #00000029;
  .title {
    font-size: 15px;
    font-weight: bold;
    padding: 11px 16px;
    background-color: ${themeColorLighter1};
    border-radius: 20px 0px;
  }
  .external-link {
    float: right;
    padding-inline: 11px 16px;
  }
`
export const ContentWrapper = styled.div`
  display: flex;
  margin-block: 20px;
  justify-content: space-between;
  align-items: center;
  padding-inline: 50px;
  font-weight: bold;
  font-size: 13px;
  text-align: center;
  .right-content {
    display: flex;
    justify-content: center;
    margin-right: 20px;
    gap: 10;
  }
  .small-header {
    margin-top: -14px;
    font-size: 11px;
  }
`
export const StyledCell = styled.div`
  padding: ${(props) => cellStyles[props.cellType].padding};
  width: fit-content;
  font-size: ${(props) => cellStyles[props.cellType].font};
  margin-inline: ${(props) => cellStyles[props.cellType].margin};
  margin-block: 10px;
  background-color: ${(props) => (props.fill ? props.color : '')};
  border: ${(props) => (!props.fill ? `2px solid ${props.color}` : '')};
  border-radius: 10px;
`
export const DashedVR = styled.div`
  border-left: 1px dashed ${themeLightGrayColor};
  height: ${(props) => props.height || '280px'};
`

export const StyledDashedHr = styled(DashedHr)`
  margin-block: 20px;
  width: 150px;
  justify: center;
`
export const StyledRow = styled(Row)`
  justify-content: space-between;
  align-items: center;
  padding-inline: 80px;
  margin-top: 40px;
`
export const StyledLabel = styled.span`
  font-size: 11px;
  font-color: #6a737f;
  margin-right: 2px;
`
export const Footer = styled.div`
  font-size: 18px;
  margin-bottom: ${(props) => props.margin};
`
export const SubFooter = styled.div`
  font-size: ${(props) => props.font || '12px'};
  color: ${lightGrey9};
`
export const DashboardReportContainer = styled.div`
  margin: 0;
  padding: 0;
  @media print {
    -webkit-print-color-adjust: exact;
    color-adjust: exact;
  }
`
