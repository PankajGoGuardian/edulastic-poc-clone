import styled from 'styled-components'
import { Table, Button } from 'antd'
import { testActivity } from '@edulastic/constants'
import {
  white,
  cardTitleColor,
  secondaryTextColor,
  authorAssignment,
  tabletWidth,
  themeColorBlue,
  lightGrey4,
  lightGrey5,
  lightFadedBlack,
  black,
} from '@edulastic/colors'

const { assignmentStatusBg } = authorAssignment
const {
  authorAssignmentConstants: {
    assignmentStatus: {
      NOT_OPEN,
      IN_PROGRESS,
      IN_PROGRESS_PAUSED,
      IN_GRADING,
      IN_GRADING_PAUSED,
      NOT_GRADED,
      NOT_GRADED_PAUSED,
      GRADES_HELD,
      GRADES_HELD_PAUSED,
      DONE,
      SUBMITTED,
      SUBMITTED_PAUSED,
      NOT_STARTED,
    },
  },
} = testActivity

const defineStatusBg = (status) => {
  switch (status) {
    case NOT_OPEN:
      return assignmentStatusBg.NOT_OPEN
    case IN_PROGRESS:
    case IN_PROGRESS_PAUSED:
      return assignmentStatusBg.IN_PROGRESS
    case IN_GRADING:
    case IN_GRADING_PAUSED:
      return assignmentStatusBg.IN_GRADING
    case NOT_GRADED:
    case NOT_GRADED_PAUSED:
      return assignmentStatusBg.NOT_GRADED
    case GRADES_HELD:
    case GRADES_HELD_PAUSED:
      return assignmentStatusBg.GRADES_HELD
    case SUBMITTED:
    case SUBMITTED_PAUSED:
      return assignmentStatusBg.SUBMITTED
    case NOT_STARTED:
      return assignmentStatusBg.NOT_STARTED
    case DONE:
      return assignmentStatusBg.DONE
    default:
      return ''
  }
}

export const Container = styled.div`
  padding: 30;
  left: 0;
  right: 0;
  height: 100%;
  width: 100%;
`

export const TableData = styled(Table)`
  color: ${secondaryTextColor};
  width: auto;
  cursor: pointer;
  .ant-table-thead {
    > tr > th {
      font-weight: bold;
      font-size: 12px;
      text-transform: uppercase;
      color: ${cardTitleColor};
      white-space: nowrap;
      padding: 0px 16px 24px;
      background: transparent;
      border-bottom: none;
      text-align: center;

      &:first-child {
        text-align: left;
      }

      .ant-table-column-sorter {
        vertical-align: baseline;
      }
    }
  }

  .ant-table-tbody {
    > tr > td {
      padding: 8px 16px;
      font-weight: 600;
      text-align: center;

      &:first-child {
        text-align: left;
      }
    }
  }

  @media (max-width: ${tabletWidth}) {
    display: none;
  }

  @media (max-width: 1300px) and (min-width: 980px) {
    .ant-table-thead > tr > th .ant-table-column-sorters {
      padding-left: 0px;
      padding-right: 0px;
    }
  }
`

export const BtnStatus = styled(Button)`
  color: ${white};
  border: 0px;
  font-size: 0.7em;
  font-weight: bold;
  width: 140px;
  height: 26px;
  text-align: center;
  border-radius: 4px;
  background-color: ${(props) => defineStatusBg(props.status)};
`

export const ActionsWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0;
  width: 80px;
  svg {
    @media (max-width: 1300px) {
      width: 18px;
      height: 18px;
    }
    @media (max-width: 920px) {
      width: 15px;
      height: 15px;
    }
  }
`

export const GreyFont = styled.span`
  color: grey;
  font-size: 14px;
`

export const BulkActionsWrapper = styled.div`
  display: flex;
  & > div:first-child {
    display: flex;
    align-items: center;
    text-transform: uppercase;
    font-size: 12px;
    font-weight: 600;
    & > span:first-child {
      display: inline-block;
      padding: 3px 4px;
      min-width: 70px;
      text-align: center;
      border-radius: 10px;
      margin-right: 10px;
      background: ${lightGrey4};
    }
  }
`

export const BulkActionsButtonContainer = styled.div`
  display: flex;
`

export const MoreOption = styled.div`
  padding: 0px 12px;
  height: 30px;
  cursor: ${({ disabled }) => (disabled ? 'not-allowed' : 'pointer')};
  font-size: 12px;
  font-weight: 600;
  display: flex;
  align-items: center;
  color: ${({ disabled }) => (disabled ? lightFadedBlack : black)};
  & :hover {
    color: ${white};
    background: ${themeColorBlue};
  }
`

export const AssessmentTypeWrapper = styled.div`
  display: flex;
  justify-content: center;
`
export const ClassNameCell = styled.div`
  display: flex;
  flex-direction: column;
  > .schoolName {
    font-weight: 500;
    color: ${lightGrey5};
  }
`
