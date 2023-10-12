import React, { useEffect } from 'react'
import { Button, Spin } from 'antd'
import { compose } from 'redux'
import { connect } from 'react-redux'
import styled from 'styled-components'
import { EduButton, FlexContainer } from '@edulastic/common'
import { IconAddItems, IconTrash } from '@edulastic/icons'
import { TableContainer, StyledTable } from '../../../common/styled'
import {
  getReportDefinitionsAction,
  deleteReportDefinitionAction,
  getReportsSelector,
  isReportsLoadingSelector,
} from '../ducks'
import { SubHeader } from '../../Reports/common/components/Header'

const ReportDefinitionList = ({
  history,
  isLoading,
  reports,
  getReports,
  deleteReport,
  breadcrumbData,
  isCliUser,
}) => {
  /** @type {import('antd/lib/table').ColumnProps[]} */
  const columns = [
    {
      title: 'Report Definitions',
      dataIndex: 'title',
      key: 'title',
      align: 'left',
      width: '30%',
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
      align: 'left',
      width: '50%',
    },
    {
      title: 'Action',
      dataIndex: '_id',
      key: '_id',
      width: '20%',
      render: (_id) => (
        <Button
          key="delete-button"
          style={{ border: 'none', background: 'transparent' }}
          onClick={() => deleteReport(_id)}
        >
          <IconTrash style={{ height: '25px' }} />
        </Button>
      ),
    },
  ]

  const tableData = (
    <TableContainer>
      <StyledTable
        columns={columns}
        dataSource={reports}
        onRow={(report) => ({
          onClick: () => {
            history.push(
              `/author/reports/report-builder/definition/${report._id}`
            )
          },
        })}
      />
    </TableContainer>
  )

  useEffect(() => {
    getReports()
  }, [])

  return (
    <StyledDiv>
      <FlexContainer justifyContent="space-between">
        <SubHeader breadcrumbData={breadcrumbData} isCliUser={isCliUser} />
        <EduButton
          key="add-report-button"
          type="primary"
          onClick={() => {
            history.push('/author/reports/report-builder/explore')
          }}
        >
          <IconAddItems /> Add Report
        </EduButton>
      </FlexContainer>
      <Spin spinning={isLoading}>{tableData} </Spin>
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
  width: 100%;
`
