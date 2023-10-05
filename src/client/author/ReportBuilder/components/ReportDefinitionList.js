import React, { useEffect } from 'react'
import { Table, Button, Spin } from 'antd'
import { compose } from 'redux'
import { connect } from 'react-redux'
import styled from 'styled-components'
import {
  getReportDefinitionsAction,
  deleteReportDefinitionAction,
  getReportsSelector,
  isReportsLoadingSelector,
} from '../ducks'

const ReportDefinitionList = ({
  history,
  isLoading,
  reports,
  getReports,
  deleteReport,
}) => {
  /** @type {import('antd/lib/table').ColumnProps[]} */
  const columns = [
    {
      title: 'Report Definitions',
      dataIndex: 'title',
      key: 'title',
      align: 'left',
      width: 300,
    },
    {
      title: 'Action',
      dataIndex: '_id',
      key: '_id',
      width: 150,
      render: (_id) => (
        <Button
          key="delete-button"
          type="danger"
          style={{ border: 'none' }}
          onClick={() => deleteReport(_id)}
        >
          Delete Report
        </Button>
      ),
    },
  ]

  const tableData = (
    <Table
      style={{ marginBottom: '20px' }}
      columns={columns}
      dataSource={reports}
      pagination={false}
      onRow={(row) => ({
        onClick: () => {
          history.push(`/author/reportBuilder/definition/${row._id}`)
        },
      })}
    />
  )

  useEffect(() => {
    getReports()
  }, [])

  return (
    <StyledDiv>
      <h1>Report Definition List</h1>
      <Spin spinning={isLoading}>{tableData} </Spin>
      <Button
        key="add-report-button"
        type="primary"
        onClick={() => {
          history.push('/author/reportBuilder/explore')
        }}
      >
        Add Report
      </Button>
    </StyledDiv>
  )
}

const enhance = compose(
  connect(
    (state) => ({
      isLoading: isReportsLoadingSelector(state),
      reports: getReportsSelector(state),
    }),
    {
      getReports: getReportDefinitionsAction,
      deleteReport: deleteReportDefinitionAction,
    }
  )
)

export default enhance(ReportDefinitionList)

const StyledDiv = styled.div`
  padding: 30px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`
