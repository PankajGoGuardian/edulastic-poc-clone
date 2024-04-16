import React from 'react'
import { Link } from 'react-router-dom'

// components
import { Tooltip } from 'antd'
import { withNamespaces } from '@edulastic/localization'
import { extraDesktopWidthMax } from '@edulastic/colors'
import { StyledTable, StyledTableCell } from '../styled'

// constants
import { STATUS_LIST } from '../../transformers'
import NoDataNotification from '../../../../common/components/NoDataNotification'
import { EduElse, EduIf, EduThen } from '@edulastic/common'

const GradebookTable = ({
  dataSource,
  assessments,
  selectedRows,
  setSelectedRows,
  windowWidth,
  windowHeight,
  t,
}) => {
  const colWidth = windowWidth >= parseInt(extraDesktopWidthMax) ? 170 : 150
  const columns = [
    {
      title: 'Student',
      dataIndex: 'studentName',
      fixed: 'left',
      width: colWidth + 40,
      render: (data, row) => (
        <Tooltip title={data}>
          <Link
            to={`/author/gradebook/student/${row._id}`}
            data-cy="studentName"
          >
            {data || t('common.anonymous')}
          </Link>
        </Tooltip>
      ),
      sorter: (a, b) =>
        (a.studentName || '-')
          .toLowerCase()
          .localeCompare((b.studentName || '-').toLowerCase()),
      defaultSortOrder: 'descend',
    },
    {
      title: 'Class Name',
      dataIndex: 'className',
      width: colWidth + 80,
      render: (data) => <Tooltip title={data}>{data || '-'}</Tooltip>,
      sorter: (a, b) =>
        (a.className || '-')
          .toLowerCase()
          .localeCompare((b.className || '-').toLowerCase()),
    },
    ...assessments.map((ass) => ({
      title: ass.name,
      key: ass.id,
      align: 'center',
      width: colWidth,
      render: (_, row) => {
        const { classId, assessments: assMap } = row
        // assignmentId might not be equal to assessmentId (ass.id)
        // due to grouping of assignments by report key & name (check "../transformers")
        const {
          assignmentId,
          status,
          percentScore,
          testActivityId,
          isEnrolled,
          isAssigned,
        } = assMap[ass.id] || {}
        const color = STATUS_LIST.find((s) => s.id === status)?.color
        return assignmentId && classId && status !== 'UN ASSIGNED' ? (
          <EduIf condition={isEnrolled && isAssigned}>
            <EduThen>
              <Link
                to={`/author/classBoard/${assignmentId}/${classId}/test-activity/${testActivityId}`}
              >
                <StyledTableCell color={color} data-cy="percentScore">
                  {percentScore || '-'}
                </StyledTableCell>
              </Link>
            </EduThen>
            <EduElse>
              <StyledTableCell color={color} data-cy="percentScore">
                {percentScore || '-'}
              </StyledTableCell>
            </EduElse>
          </EduIf>
        ) : (
          <StyledTableCell>
            {percentScore || '-'}
          </StyledTableCell>
        )
      },
      sorter: (a, b) => {
        const percentScoreAStr = a.assessments[ass.id]?.percentScore;
        const percentScoreBStr = b.assessments[ass.id]?.percentScore;

        // handle the case where no value is provided
        if(!percentScoreAStr)return (percentScoreBStr ? -1 : 0);
        if(!percentScoreBStr)return 1;

        const percentScoreA = parseFloat(percentScoreAStr.substring(0, percentScoreAStr.length - 1) || '-1');
        const percentScoreB = parseFloat(percentScoreBStr.substring(0, percentScoreBStr.length - 1) || '-1');

        return percentScoreA - percentScoreB;
      }
    })),
  ]

  const NoDataMessage = (
    <>
      <p>There are no assignments found for the filter options selected.</p>
      <p>
        Something Wrong? Check the filters including the school year selected.
      </p>
    </>
  )

  if (dataSource.length < 1) {
    return (
      <NoDataNotification
        style={{ width: 'auto' }}
        heading="Assignments not available"
        description={NoDataMessage}
      />
    )
  }

  return (
    <StyledTable
      data-cy="gradeBookTable"
      rowKey={(row) => `${row._id}_${row.classId}`}
      columns={columns}
      dataSource={dataSource}
      rowSelection={{
        selectedRowKeys: selectedRows,
        onChange: setSelectedRows,
      }}
      pagination={false}
      scroll={{ x: '100%', y: windowHeight - 250 }}
    />
  )
}

export default withNamespaces('student')(GradebookTable)
