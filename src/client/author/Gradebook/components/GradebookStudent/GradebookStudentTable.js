import React from 'react'
import { Link } from 'react-router-dom'
import { keyBy, round } from 'lodash'
import moment from 'moment'

// components
import { Tooltip } from 'antd'
import { FlexContainer } from '@edulastic/common'
import { withNamespaces } from '@edulastic/localization'
import {
  StyledTable,
  StyledTag,
  Icon,
  TestThumbnail,
  AssignmentTD,
  TestTypeIcon,
} from '../styled'
import presentationIcon from '../../../Assignments/assets/presentation.svg'

// constants
import { STATUS_LIST, TEST_TYPE_COLOR } from '../../transformers'

const statusMap = keyBy(STATUS_LIST, 'id')

const GradebookStudentTable = ({ t, dataSource = [], windowHeight }) => {
  // set default value for endDate (due date) and laDate (submitted date)
  // set laDate = 0 for TA with status "not started" or "in progress"
  dataSource.forEach((d) => {
    d.laDate = (!['NOT STARTED', 'START'].includes(d.status) && d.laDate) || 0
    d.endDate = d.endDate || 0
  })

  const data = dataSource.filter((el) => el.status !== 'UN ASSIGNED')

  const columns = [
    {
      title: 'Test Name',
      dataIndex: 'name',
      width: '25%',
      render: (data, row) => (
        <FlexContainer justifyContent="unset" alignItems="center">
          <TestThumbnail src={row.thumbnail} />
          <Tooltip placement="top" title={data}>
            <AssignmentTD>{data}</AssignmentTD>
          </Tooltip>
          <Tooltip title={t(`common.toolTip.${row.testType}`)}>
            <TestTypeIcon bgColor={TEST_TYPE_COLOR[row.testType]}>
              {t(`common.${row.testType?.split(' ')?.[0] || 'assessment'}`)}
            </TestTypeIcon>
          </Tooltip>
        </FlexContainer>
      ),
      sorter: (a, b) =>
        a.name.toLowerCase().localeCompare(b.name.toLowerCase()),
    },
    {
      title: 'Close Date',
      dataIndex: 'endDate',
      width: '18%',
      render: (data) =>
        data ? moment(data).format('MMM Do, YYYY h:mm A') : '-',
      sorter: (a, b) => a.endDate - b.endDate || a.laDate - b.laDate,
    },
    {
      title: 'Submitted Date',
      dataIndex: 'laDate',
      width: '18%',
      render: (data) =>
        data ? moment(data).format('MMM Do, YYYY h:mm A') : '-',
      sorter: (a, b) => a.laDate - b.laDate || a.endDate - b.endDate,
      defaultSortOrder: 'descend',
    },
    {
      title: 'Score',
      align: 'center',
      render: (_, row) => (
        <>
          <div>
            {row.maxScore
              ? `${round(row.score || 0, 2)}/${row.maxScore || 1}`
              : '-'}
          </div>
          {row.archived.map((ta) => (
            <div style={{ paddingTop: '5px' }}>
              {ta.maxScore
                ? `${round(ta.score || 0, 2)}/${ta.maxScore || 1}`
                : '-'}
            </div>
          ))}
        </>
      ),
      sorter: (a, b) => {
        const aScore = a.score || 0
        const bScore = b.score || 0
        const aMaxScore = a.maxScore || 0
        const bMaxScore = b.maxScore || 0
        return (
          aScore * bMaxScore - bScore * aMaxScore ||
          aScore - bScore ||
          aMaxScore - bMaxScore
        )
      },
    },
    {
      title: 'Percentage',
      dataIndex: 'percentScore',
      align: 'center',
      render: (data, row) => (
        <>
          <div>{data?.trim() ? data : '-'}</div>
          {row.archived.map((ta) => (
            <div style={{ paddingTop: '5px' }}>
              {ta.percentScore?.trim() ? ta.percentScore : '-'}
            </div>
          ))}
        </>
      ),
      sorter: (a, b) => {
        const aScore = a.score || 0
        const bScore = b.score || 0
        const aMaxScore = a.maxScore || 0
        const bMaxScore = b.maxScore || 0
        return (
          aScore * bMaxScore - bScore * aMaxScore ||
          aScore - bScore ||
          aMaxScore - bMaxScore
        )
      },
    },
    {
      title: 'Status',
      dataIndex: 'status',
      align: 'center',
      render: (data) =>
        data ? (
          <StyledTag
            bgColor={statusMap[data].color}
            textColor={statusMap[data].fgColor}
          >
            {statusMap[data].name}
          </StyledTag>
        ) : (
          '-'
        ),
      sorter: (a, b) => statusMap[a.status].idx - statusMap[b.status].idx,
    },
    {
      dataIndex: 'id',
      align: 'center',
      width: '6%',
      render: (_, row) => (
        <Link to={`/author/classBoard/${row.id}/${row.classId}`}>
          <Icon src={presentationIcon} alt="Images" />
        </Link>
      ),
    },
  ]
  return (
    <StyledTable
      columns={columns}
      dataSource={data}
      pagination={false}
      scroll={{ y: windowHeight - 350 }}
      urlHasStudent
    />
  )
}

export default withNamespaces('assignmentCard')(GradebookStudentTable)
