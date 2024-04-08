import styled from 'styled-components'
import { IconStudent } from '@edulastic/icons'
import {
  fadedGrey,
  fadedGrey2,
  themeLightGrayBgColor,
  greyThemeDark1,
  themeColor,
  themeLightGrayColor,
  greyThemeLighter,
  fadedBlack,
} from '@edulastic/colors'
import { Checkbox, Button, Row } from 'antd'
import { FlexContainer } from '@edulastic/common'
import { CustomStyledTable } from '../../common/components/styledComponents'

export const AssessmentNameContainer = styled.div`
  .test-name-container {
    font-weight: bold;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
  }
  @media print {
    .test-name-container {
      display: block;
      -webkit-line-clamp: unset;
      -webkit-box-orient: unset;
    }
  }
`
export const SummaryWrapper = styled.div`
  background-color: ${themeLightGrayBgColor};
  display: flex;
  min-height: 200px;
`

export const DetailsWrapper = styled.div`
  width: 30%;
  display: flex;
  padding: 10px 5px;
  justify-content: center;
  align-items: center;
  background: ${fadedGrey2};
`

export const RightContentWrapper = styled.div`
  width: 70%;
  display: flex;
  flex-direction: column;
`

export const RiskSummaryWrapper = styled(FlexContainer)`
  height: 180px;
  background: ${greyThemeLighter};
`

export const StyledDiv = styled.div`
  position: relative;
`

export const BlurEffect = styled.div`
  position: absolute;
  bottom: 0px;
  left: 0px;
  height: 130px;
  width: 100%;
  backdrop-filter: blur(7px);
`

export const LimitationTextWrapper = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  height: 180px;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10;
  font-weight: bold;
`

export const ExclamationIcon = styled.i`
  color: #000;
  font-size: 18px;
  margin-right: 5px;
`

export const DemographicsWrapper = styled.div`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  justify-content: space-around;
  font-weight: bold;
  height: 60px;
  background-color: ${fadedGrey};
  .demographic-item {
    display: flex;
    margin: 0px 10px;
    align-items: center;
    white-space: nowrap;
    svg {
      font-size: 16px;
      margin-right: 10px;
    }
    .title {
      font-weight: normal;
    }
  }
`

export const StudentThumbnail = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  width: 50%;
  height: 100%;
  gap: 24px;
  & > span {
    text-align: left;
    font: normal normal bold 18px/24px Open Sans;
    letter-spacing: 0px;
    color: ${greyThemeDark1};
  }
`
export const StudentMetaData = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  align-items: baseline;
  justify-content: center;
  height: 100%;
  margin-left: 10px;
  color: ${greyThemeDark1};
  .schools-name,
  .grades-name {
    display: flex;
    align-items: center;
    gap: 5px;
    font-size: 13px;
    svg {
      margin-top: 5px;
    }
  }
  .student-name {
    font-weight: bold;
    font-size: 16px;
  }
  .value {
    font-weight: bold;
  }
`

export const StyledLine = styled.div`
  border-left: 4px solid ${themeLightGrayColor};
  height: 25px;
  border-radius: 1px;
`

export const StyledIcon = styled(IconStudent)`
  width: 100%;
  height: 100%;
  align-self: center;
  color: ${themeColor};
`

export const UserIcon = styled.div`
  width: 150px;
  height: 150px;
  ${({ src }) => (src ? `background-image: url(${src});` : '')}
  border-radius: 50%;
  background-position: center;
  background-size: cover;
  background-repeat: no-repeat;
`

export const StyleCheckBox = styled(Checkbox)`
  span {
    position: relative;
    svg {
      position: absolute;
      right: -12px;
      top: 4px;
    }
  }
`

export const Label = styled.div`
  color: ${({ $color }) => $color || fadedBlack};
  font-size: ${({ $fontSize }) => $fontSize || '13px'};
  font-weight: bold;
  margin: ${({ $margin }) => $margin || '0'};
`
export const TestLabel = styled(Label)`
  white-space: nowrap;
  width: 120px;
  text-overflow: ellipsis;
  overflow: hidden;
  margin-bottom: 5px;

  @media print {
    white-space: nowrap;
    width: 120px;
    text-overflow: ellipsis;
    overflow: hidden !important;
  }
`
export const RiskLabel = styled(Label)`
  text-transform: uppercase;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  margin-left: 10px;
  span {
    margin-right: 8px;
  }
  width: 80px;
  p {
    color: ${({ $color }) => $color || fadedBlack} !important;
    font-weight: bold !important;
  }
`

export const TestDetailContainer = styled.div`
  display: flex;
  width: 60%;
  align-items: baseline;
  justify-content: space-between;
`

export const AcademicRiskListContainer = styled.div`
  margin-right: ${({ $marginRight }) => $marginRight || '0'};
  width: ${({ $width }) => $width || '50%'};
`

export const StyledButton = styled(Button)`
  display: ${({ $isVisible }) => ($isVisible ? 'block' : 'none')};
  background: transparent;
  font-size: 12px;
  font-weight: bold;
  color: ${themeColor};
  border: 0px;
  box-shadow: none;
  padding: 0px;
  :hover,
  :active,
  :focus {
    color: ${themeColor};
    background: transparent;
  }
`
export const ClaimsRow = styled(Row)`
  gap: 8px;
  flex-wrap: nowrap;
  @media print {
    flex-wrap: wrap;
  }
`

export const styledTable = styled(CustomStyledTable)`
  table {
    tbody {
      tr {
        td {
          font-weight: 700;
        }
      }
    }
  }
`
