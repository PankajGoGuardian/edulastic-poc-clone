import styled from 'styled-components'
import { IconStudent } from '@edulastic/icons'
import {
  fadedGrey,
  themeLightGrayBgColor,
  greyThemeDark1,
  themeColor,
  themeLightGrayColor,
} from '@edulastic/colors'

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
export const Details = styled.div`
  width: 100%;
  display: flex;
  padding: 10px 5px;
  justify-content: center;
  align-items: center;
`

export const DetailsWrapper = styled.div`
  padding: 10px 5px;
  background-color: ${themeLightGrayBgColor};
  border-radius: 10px 10px 0px 0px;
`

export const Demographics = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  padding: 20px 5px;
  background-color: ${fadedGrey};
  border-radius: 0px 0px 10px 10px;
  & > div.demographic-item {
    display: flex;
    margin: 0px 30px;
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

export const StudentName = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  padding-left: 20px;
  margin-right: 20px;
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
  flex-wrap: wrap;
  color: ${greyThemeDark1};
  & > div {
    padding-left: 20px;
    & > span:first-child {
      text-align: left;
      font: normal normal normal 12px/17px Open Sans;
      letter-spacing: 0px;
    }
    & > span:last-child {
      text-align: left;
      font: normal normal bold 12px/17px Open Sans;
      letter-spacing: 0px;
    }
  }
  .schools-name,
  .grades-name {
    max-width: 250px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
`

export const StyledLine = styled.div`
  border-left: 4px solid ${themeLightGrayColor};
  height: 25px;
  border-radius: 1px;
`

export const StyledIcon = styled(IconStudent)`
  margin-right: 10px;
  align-self: center;
  color: ${themeColor};
`

export const UserIcon = styled.div`
  width: 30px;
  height: 30px;
  ${({ src }) => (src ? `background-image: url(${src});` : '')}
  border-radius: 50%;
  background-position: center;
  background-size: cover;
  background-repeat: no-repeat;
`
