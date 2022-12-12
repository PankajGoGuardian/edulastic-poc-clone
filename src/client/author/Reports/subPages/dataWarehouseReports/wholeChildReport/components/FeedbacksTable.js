import { userApi } from '@edulastic/api'
import { notification } from '@edulastic/common'
import { formatDate } from '@edulastic/constants/reportUtils/common'
import { Row, Spin, Typography } from 'antd'
import { omit } from 'lodash'
import React, { useEffect, useState } from 'react'
import { compose } from 'redux'
import CsvTable from '../../../../common/components/tables/CsvTable'
import { CustomStyledTable, DashedLine } from '../../common/styled'

const columns = [
  {
    title: 'Date',
    dataIndex: 'createdAt',
    align: 'left',
    width: 150,
    render: (value) => formatDate(value) || '-',
  },
  {
    title: 'Type',
    dataIndex: 'type',
    align: 'left',
    width: 150,
  },
  {
    title: 'Teacher',
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
    title: 'Feedback',
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
  const { studentId, termId } = props
  const [params, setParams] = useState(null)
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState([])

  const loadData = async () => {
    const response = await userApi.getFeedbacks(
      params.studentId,
      omit(params, ['studentId'])
    )
    console.log(response)
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
          Feedbacks
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
