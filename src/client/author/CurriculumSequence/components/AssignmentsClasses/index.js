import React from 'react'
import styled from 'styled-components'
import { Table } from 'antd'
import {
  titleColor,
  white,
  mediumDesktopExactWidth,
  cardTitleColor,
  extraDesktopWidthMax,
} from '@edulastic/colors'
import { notification, TestTypeIcon } from '@edulastic/common'
import { withNamespaces } from '@edulastic/localization'
import { Tooltip } from '../../../../common/utils/helpers'
import additemsIcon from '../../../Assignments/assets/add-items.svg'
import piechartIcon from '../../../Assignments/assets/pie-chart.svg'
import presentationIcon from '../../../Assignments/assets/presentation.svg'
import { StatusLabel } from '../../../Assignments/components/TableList/styled'

const AssignmentsClasses = ({
  moduleId,
  contentId,
  assignmentRows,
  handleActionClick,
  moduleData,
  t,
}) => {
  const data = assignmentRows?.map((assignment, index) => ({
    key: index,
    ...assignment,
  }))

  const hasRandomQuestions = moduleData.find(
    (modData) => modData.contentId === contentId
  ).hasRandomQuestions

  const renderTextCell = (text) => (
    <StyledLabel>
      <Tooltip placement="bottomLeft" title={text}>
        <span>{text}</span>
      </Tooltip>
    </StyledLabel>
  )

  const columns = [
    {
      title: 'Class',
      dataIndex: 'name',
      render: (text) => renderTextCell(text),
      sorter: (a, b) => a.name - b.name,
    },
    {
      title: 'Type',
      width: '60px',
      dataIndex: 'testType',
      render: (testType) => <TestTypeIcon testType={testType} />,
      sorter: (a, b) => a.testType - b.testType,
    },
    {
      title: 'Assigned By',
      dataIndex: 'assignedBy',
      render: (text) => renderTextCell(text),
      sorter: (a, b) => a.assignedBy - b.assignedBy,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      width: '90px',
      render: (text) => (
        <StyledStatusLabel status={text}>{text}</StyledStatusLabel>
      ),
      sorter: (a, b) => a.status - b.status,
    },
    {
      title: 'Submitted',
      dataIndex: 'submittedCount',
      render: (text, row) =>
        renderTextCell(`${text || 0} of ${row?.assignedCount || 0}`),
      sorter: (a, b) => a.submittedCount - b.submittedCount,
    },
    {
      title: 'Graded',
      dataIndex: 'gradedNumber',
      render: (text) => renderTextCell(text),
      sorter: (a, b) => a.gradedNumber - b.gradedNumber,
    },
    {
      title: '',
      dataIndex: 'action',
      width: '80px',
      render: (_, assignment) => (
        <ActionsWrapper data-cy="PresentationIcon">
          <Tooltip placement="bottom" title="Live Class Board">
            <BtnContainer
              onClick={(e) =>
                handleActionClick(
                  e,
                  'classboard',
                  assignment?.assignmentId,
                  assignment?.classId,
                  moduleId,
                  contentId
                )
              }
            >
              <img src={presentationIcon} alt="Images" />
            </BtnContainer>
          </Tooltip>

          <Tooltip
            placement="bottom"
            title={
              hasRandomQuestions
                ? t('common.randomItemsDisableMessage')
                : 'Express Grader'
            }
          >
            <BtnContainer
              disabled={hasRandomQuestions}
              onClick={(e) =>
                hasRandomQuestions
                  ? notification({
                      type: 'warn',
                      msg: t('common.randomItemsDisableMessage'),
                    })
                  : handleActionClick(
                      e,
                      'expressgrader',
                      assignment?.assignmentId,
                      assignment?.classId,
                      moduleId,
                      contentId
                    )
              }
            >
              <img src={additemsIcon} alt="Images" />
            </BtnContainer>
          </Tooltip>

          <Tooltip placement="bottom" title="Reports">
            <BtnContainer
              onClick={(e) =>
                handleActionClick(
                  e,
                  'standardsBasedReport',
                  assignment?.assignmentId,
                  assignment?.classId,
                  moduleId,
                  contentId
                )
              }
            >
              <img src={piechartIcon} alt="Images" />
            </BtnContainer>
          </Tooltip>
        </ActionsWrapper>
      ),
    },
  ]
  return (
    <>
      {data.length > 0 && (
        <AssignmentsClassesContainer
          onClick={(e) => {
            e.preventDefault()
            e.stopPropagation()
          }}
        >
          <TableData columns={columns} dataSource={data} pagination={false} />
        </AssignmentsClassesContainer>
      )}
    </>
  )
}

export default withNamespaces('assignmentCard')(AssignmentsClasses)

const AssignmentsClassesContainer = styled.div`
  background: ${white};
  width: 100%;
  display: block;
  margin-bottom: 25px;
`

const ActionsWrapper = styled.div`
  display: flex;
  width: 80px;
  align-items: center;
  justify-content: space-evenly;
  margin-right: 0px;
`

const BtnContainer = styled.div`
  ${({ disabled }) =>
    disabled ? 'opacity: 0.4; cursor: not-allowed;' : 'cursor: pointer;'};
  background: transparent;
  img {
    width: 18px;
    height: 18px;
  }
`

const StyledStatusLabel = styled(StatusLabel)`
  display: flex;
  justify-content: center;
  font-size: 10px;
`

export const TableData = styled(Table)`
  text-align: center;
  width: calc(100% - 52px);
  & .ant-table-thead > tr > th,
  .ant-table-tbody > tr > td {
    white-space: nowrap;
    padding: 12px 0px 5px;
    text-align: center;

    &:first-child > div,
    &:first-child {
      text-align: left;
      padding-left: 12px;
    }
  }

  .ant-table-body {
    tr {
      &:hover {
        cursor: pointer;
      }
    }
    .ant-table-thead > tr {
      & > th {
        background: ${white};
        padding: 5px 0px;
        border-bottom: none;
        font-weight: bold;
        text-transform: uppercase;
        color: ${cardTitleColor};
        white-space: nowrap;
        font-size: ${(props) => props.theme.headerFilterFontSize};

        &:first-child {
          padding-left: 24px;
        }

        @media (min-width: ${mediumDesktopExactWidth}) {
          font-size: ${(props) => props.theme.linkFontSize};
        }
        @media (min-width: ${extraDesktopWidthMax}) {
          font-size: ${(props) => props.theme.smallFontSize};
        }

        &.assignment-name {
          text-align: left !important;
        }
        &.ant-table-column-has-actions.ant-table-column-has-sorters:hover,
        & .ant-table-header-column .ant-table-column-sorters::before {
          background: ${white};
        }
        &.ant-table-column-has-actions.ant-table-column-has-filters
          &.ant-table-column-has-actions.ant-table-column-has-sorters {
          text-align: center;
        }
        .ant-table-column-sorters {
          display: flex;
          justify-content: center;

          .ant-table-column-sorter-inner {
            &.ant-table-column-sorter-inner-full {
              margin-top: 0em;
            }
            .ant-table-column-sorter {
              &-up,
              &-down {
                font-size: ${(props) => props.theme.headerFilterFontSize};
              }
            }
          }
        }
      }
    }
  }
`

const StyledLabel = styled.div`
  text-align: center;
  color: ${titleColor};
  font-size: 10px;
  font-weight: 600;
  text-overflow: ellipsis;
  overflow: hidden;
  max-width: calc(100% - 4px);

  @media (min-width: ${extraDesktopWidthMax}) {
    font-size: 12px;
  }
`
