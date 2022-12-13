import { userApi } from '@edulastic/api'
import { notification } from '@edulastic/common'
import { formatDate } from '@edulastic/constants/reportUtils/common'
import { themeColor } from '@edulastic/colors'
import { Row, Spin, Typography } from 'antd'
import { omit } from 'lodash'
import React, { useEffect, useState } from 'react'
import { compose } from 'redux'
import { MdInsertEmoticon, MdDateRange } from 'react-icons/md'
import CsvTable from '../../../../common/components/tables/CsvTable'
import { CustomStyledTable, DashedLine } from '../../common/styled'

export const FEEDBACK_TYPE_TO_ICONS = {
  General: (
    <svg
      fontSize="16px"
      stroke={themeColor}
      fill={themeColor}
      strokeWidth="0"
      viewBox="0 0 24 24"
      height="1em"
      width="1em"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path fill="none" d="M0 0h24v24H0V0z" />
      <path d="M15 4v7H5.17L4 12.17V4h11m1-2H3c-.55 0-1 .45-1 1v14l4-4h10c.55 0 1-.45 1-1V3c0-.55-.45-1-1-1zm5 4h-2v9H6v2c0 .55.45 1 1 1h11l4 4V7c0-.55-.45-1-1-1z" />
    </svg>
  ),
  Academic: (
    <svg
      fontSize="16px"
      stroke={themeColor}
      fill={themeColor}
      strokeWidth="0"
      viewBox="0 0 24 24"
      height="1em"
      width="1em"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path fill="none" d="M0 0h24v24H0V0z" />
      <path d="M12 3L1 9l4 2.18v6L12 21l7-3.82v-6l2-1.09V17h2V9L12 3zm6.82 6L12 12.72 5.18 9 12 5.28 18.82 9zM17 15.99l-5 2.73-5-2.73v-3.72L12 15l5-2.73v3.72z" />
    </svg>
  ),
  Behavioural: <MdInsertEmoticon size={16} color={themeColor} />,
  Attendance: <MdDateRange size={16} color={themeColor} />,
  Engagement: (
    <svg
      fontSize="16px"
      stroke={themeColor}
      fill={themeColor}
      strokeWidth="0"
      viewBox="0 0 24 24"
      height="1em"
      width="1em"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path fill="none" d="M0 0h24v24H0V0z" />
      <path d="M9 13.75c-2.34 0-7 1.17-7 3.5V19h14v-1.75c0-2.33-4.66-3.5-7-3.5zM4.34 17c.84-.58 2.87-1.25 4.66-1.25s3.82.67 4.66 1.25H4.34zM9 12c1.93 0 3.5-1.57 3.5-3.5S10.93 5 9 5 5.5 6.57 5.5 8.5 7.07 12 9 12zm0-5c.83 0 1.5.67 1.5 1.5S9.83 10 9 10s-1.5-.67-1.5-1.5S8.17 7 9 7zm7.04 6.81c1.16.84 1.96 1.96 1.96 3.44V19h4v-1.75c0-2.02-3.5-3.17-5.96-3.44zM15 12c1.93 0 3.5-1.57 3.5-3.5S16.93 5 15 5c-.54 0-1.04.13-1.5.35.63.89 1 1.98 1 3.15s-.37 2.26-1 3.15c.46.22.96.35 1.5.35z" />
    </svg>
  ),
}

const columns = [
  {
    // icon
    dataIndex: 'type',
    align: 'center  ',
    width: '80px',
    render: (value) => FEEDBACK_TYPE_TO_ICONS[value] || '',
  },
  {
    title: 'FEEDBACK TYPE',
    dataIndex: 'type',
    align: 'left',
    width: 150,
  },
  {
    title: 'TEACHER',
    dataIndex: 'givenBy',
    align: 'left',
    width: 200,
    render: (value) => {
      return (
        [value.firstName, value.middleName, value.lastName]
          .filter(Boolean)
          .join(' ') || '-'
      )
    },
  },
  {
    title: 'DATE',
    dataIndex: 'createdAt',
    align: 'left',
    width: 150,
    render: (value) => formatDate(value) || '-',
  },
  {
    title: 'FEEDBACK',
    dataIndex: 'feedback',
    align: 'left',
    width: 300,
    render: (value) => {
      return (
        <Typography.Paragraph style={{ whiteSpace: 'pre-line' }}>
          {value}
        </Typography.Paragraph>
      )
    },
  },
]

const FeedbacksTable = (props) => {
  const { studentId, termId, label = 'Feedbacks' } = props
  const [params, setParams] = useState(null)
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState([])

  const loadData = async () => {
    const response = await userApi.getFeedbacks(
      params.studentId,
      omit(params, ['studentId'])
    )
    return response.result.map((d) => ({
      ...d,
    }))
  }

  useEffect(() => {
    setLoading(false)
    setData([])
    if (studentId && termId) {
      setParams({
        studentId,
        termId,
      })
    }
  }, [studentId, termId])

  useEffect(() => {
    if (!params) return
    setLoading(true)
    loadData()
      .then((d) => setData(d))
      .catch((err) => {
        notification({
          type: 'error',
          msg: `Failed to get feedbacks: ${err}`,
        })
      })
      .finally(() => setLoading(false))
  }, [params])

  return (
    <>
      <Row type="flex" style={{ margin: '32px 0', alignItems: 'center' }}>
        <Typography.Title style={{ margin: 0 }} level={3}>
          {label}
        </Typography.Title>
        <DashedLine />
      </Row>
      <Spin spinning={loading}>
        <CsvTable
          dataSource={data}
          columns={columns}
          tableToRender={CustomStyledTable}
          pagination={{
            hideOnSinglePage: true,
            pageSize: 5,
          }}
        />
      </Spin>
    </>
  )
}

const enhance = compose()

export default enhance(FeedbacksTable)
