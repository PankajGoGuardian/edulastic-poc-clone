import {
  authorAssignment,
  desktopWidth,
  extraDesktopWidthMax,
  largeDesktopWidth,
  lightGreySecondary,
  mediumDesktopExactWidth,
  mobileWidth,
  testTypeColor,
  themeColor,
  title,
  white,
  themeColorBlue,
} from '@edulastic/colors'
import { testActivity } from '@edulastic/constants'
import { IconDownEmptyArrow } from '@edulastic/icons'
import { Button, Table, Tag } from 'antd'
import styled from 'styled-components'
import { EduTableStyled } from '@edulastic/common'

const { assignmentStatusBg, lightBlue } = authorAssignment
const {
  authorAssignmentConstants: {
    assignmentStatus: {
      NOT_OPEN,
      IN_PROGRESS,
      IN_GRADING,
      NOT_GRADED,
      GRADES_HELD,
      DONE,
      IN_PROGRESS_PAUSED,
      IN_GRADING_PAUSED,
      NOT_GRADED_PAUSED,
      GRADES_HELD_PAUSED,
    },
  },
} = testActivity

const defineStatusBg = (status) => {
  switch (status) {
    case NOT_OPEN:
      return assignmentStatusBg.NOT_OPEN
    case IN_PROGRESS:
      return assignmentStatusBg.IN_PROGRESS
    case IN_PROGRESS_PAUSED:
      return assignmentStatusBg.IN_PROGRESS
    case IN_GRADING:
      return assignmentStatusBg.IN_GRADING
    case IN_GRADING_PAUSED:
      return assignmentStatusBg.IN_GRADING
    case NOT_GRADED:
      return assignmentStatusBg.NOT_GRADED
    case NOT_GRADED_PAUSED:
      return assignmentStatusBg.NOT_GRADED
    case GRADES_HELD:
      return assignmentStatusBg.GRADES_HELD
    case GRADES_HELD_PAUSED:
      return assignmentStatusBg.GRADES_HELD
    case DONE:
      return assignmentStatusBg.DONE
    default:
      return ''
  }
}

export const Container = styled.div`
  padding-left: 30px;
  left: 0;
  right: 0;
  height: 100%;
  width: 100%;
`

export const Icon = styled.img`
  width: 15px;
  height: 15px;

  @media (min-width: ${mediumDesktopExactWidth}) {
    width: 18px;
    height: 18px;
  }
`

export const TableData = styled(EduTableStyled)`
  .ant-table-body {
    .ant-table-thead > tr {
      & > th {
        @media (min-width: ${mediumDesktopExactWidth}) {
          font-size: ${(props) => props.theme.linkFontSize};
        }
        @media (min-width: ${extraDesktopWidthMax}) {
          font-size: ${(props) => props.theme.smallFontSize};
        }
      }
    }
    .ant-table-tbody {
      & > tr {
        &.ant-table-expanded-row {
          background: transparent;
          &:hover {
            background: transparent;
          }
          & > td {
            text-align: center;
            padding: 0px 0px 10px;
            border-bottom: none;
            & > .ant-table-wrapper {
              margin: 0;
            }
          }
        }
      }
      @media (min-width: ${mediumDesktopExactWidth}) {
        font-size: ${(props) => props.theme.smallFontSize};
      }
    }
  }

  .ant-table-body .ant-table-thead > tr > th {
    &.assignment-actions {
      padding: 5px 0px 8px;
    }
  }

  .ant-table-thead > tr > th,
  .ant-table-tbody > tr > td {
    max-width: 50px;
  }
`

export const TestThumbnail = styled.img`
  border-radius: 4px;
  width: 32px;
  height: 24px;
  margin-right: 5px;

  @media (min-width: ${mediumDesktopExactWidth}) {
    width: 50px;
  }
`

export const AssignmentTD = styled.div`
  text-align: left;
  padding-left: 0px !important;
  padding-right: 0px !important;
  width: 85%;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  font-size: ${(props) => props.theme.linkFontSize};

  @media (min-width: ${mediumDesktopExactWidth}) {
    font-size: ${(props) => props.theme.bodyFontSize};
  }
  @media (min-width: ${extraDesktopWidthMax}) {
    font-size: ${(props) => props.theme.standardFont};
  }
`

export const IconArrowDown = styled.img`
  color: ${themeColor};
  margin-right: 5px;
  width: 6px;
`

export const BtnAction = styled(Button)`
  color: ${themeColor};
  border: none;
  box-shadow: 0px 2px 4px 0 rgba(201, 208, 219, 0.5);
  height: 28px;
  font-size: ${(props) => props.theme.linkFontSize};
  font-weight: 600;
  width: 100%;
  padding: 0px;
  text-align: center;
  &:hover,
  &:focus {
    background-color: ${themeColor};
    color: ${white};
  }
`

export const AssignedImg = styled.img`
  color: ${lightBlue};
`

export const TypeIcon = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
  float: right;
  width: 18px;
  height: 18px;
  max-width: 18px;
  background: ${(props) =>
    props.type === 'p'
      ? testTypeColor.practice
      : props.type === 'c'
      ? testTypeColor.common
      : testTypeColor.assessment};
  color: ${white};
  border-radius: 50%;
  font-weight: 600;
  font-size: ${(props) => props.theme.bodyFontSize};
  align-self: center;
`

export const TypeWrapper = styled.span`
  width: ${(props) => props.width || '90px'};
  display: flex;
  align-items: center;
  justify-content: ${(props) => props.justify || 'center'};
  margin: auto;
  padding-left: ${({ paddingLeft }) => paddingLeft || '25px'};
  @media (min-width: ${mediumDesktopExactWidth}) {
    width: ${(props) => props.width || '110px'};
  }
  @media (min-width: ${extraDesktopWidthMax}) {
    width: ${(props) => props.width || '125px'};
  }
`

export const TimedTestIndicator = styled.span`
  width: 30px;
  margin-right: -10px;
  padding-left: 5px;
  display: flex;
  align-items: center;
`

export const IndicatorText = styled.div`
  display: inline-block;
`

export const ExpandDivdier = styled.div`
  color: ${themeColor};
  cursor: pointer;
  font-size: ${(props) => props.theme.standardFont};
`

export const TitleCase = styled.div`
  text-transform: Capitalize;
`

export const ActionDiv = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  flex: 1;
`

export const ActionsWrapper = styled.div`
  display: flex;
  justify-content: space-around;
`

export const GreyFont = styled.div`
  max-width: ${(props) => (props.showEllipsis ? '100px' : 'auto')};
  color: ${title};
  font-size: ${(props) => props.theme.linkFontSize};
  position: relative;
  left: ${({ left }) => left || 0}px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  width: 100%;
  &.class-column {
    white-space: initial;
    text-align: right;
    /* padding-right: 20px; */
    word-break: break-word;
    /* @media (min-width: ${largeDesktopWidth}) {
      padding-right: 50px;
    } */
  }

  @media (min-width: ${mediumDesktopExactWidth}) {
    font-size: ${(props) => props.theme.bodyFontSize};
  }
`

export const StatusLabel = styled(Tag)`
  border-width: 1px;
  background-color: ${({ status }) => defineStatusBg(status)};
  border-color: ${({ status }) => defineStatusBg(status)};
  color: ${white};
  font-size: 9px;
  min-width: 90px;
  border-radius: 5px;

  @media (min-width: ${mediumDesktopExactWidth}) {
    font-size: 0.7em;
  }
`

export const ExpandedTable = styled(Table)`
  @media (max-width: ${desktopWidth}) {
    margin-left: 13px;
    width: 97%;
    float: right;
    .ant-table-tbody tr td > div {
      text-align: right;
      width: 90%;
    }
  }

  .ant-table-thead th {
    display: none;
  }

  .ant-table-tbody tr {
    background-color: ${lightGreySecondary};
  }

  @media (max-width: ${mobileWidth}) {
    display: none;
  }
`

export const IconExpand = styled(IconDownEmptyArrow)`
  cursor: pointer;
`
