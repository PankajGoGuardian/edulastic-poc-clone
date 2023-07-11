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
import { Checkbox, Button } from 'antd'
import { FlexContainer } from '@edulastic/common'

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

export const DemographicsWrapper = styled.div`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  justify-content: center;
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
    span {
      font-weight: bold;
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
  align-items: baseline;
  justify-content: center;
  height: 100%;
  margin-left: 10px;
  color: ${greyThemeDark1};
  .schools-name .grades-name {
    margin-bottom: 10px;
    font-size: 12px;
  }
  .student-name {
    font-weight: bold;
    font-size: 16px;
    margin-bottom: 10px;
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
`
export const RiskLabel = styled(Label)`
  text-transform: uppercase;
  display: flex;
  align-items: center;
  span {
    margin-right: 8px;
  }
`

export const TestDetailContainer = styled.div`
  display: flex;
  width: 70%;
  align-items: baseline;
  justify-content: space-between;
`

export const AcademicRiskListContainer = styled.div`
  margin-right: ${({ $marginRight }) => $marginRight || '0'};
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
