import React, { useEffect } from 'react'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { Spin, Button, Typography } from 'antd'
import { Link } from 'react-router-dom'
import ReportDefinition from './ReportDefinition'
import {
  getReportDataAction,
  getActiveReportSelector,
  isReportDefinitionLoadingSelector,
} from '../ducks'
import PageHeader from './PageHeader'

const ReportDefinitionWrapper = (props) => {
  const { isLoading, report, getReportData, match } = props
  const { id } = match.params

  useEffect(() => {
    if (id) {
      getReportData(id)
    }
  }, [id])

  if (isLoading) {
    return <Spin />
  }

  const Empty = () => (
    <div
      style={{
        textAlign: 'center',
        padding: 12,
      }}
    >
      <h2>There are no Widgets on this Report</h2>
      <Link to={`/author/reportBuilder/explore/definition/${report?._id}`}>
        <Button type="primary" size="large" icon="plus">
          Add Widget to Report
        </Button>
      </Link>
    </div>
  )

  return report?.widgets?.length ? (
    <div>
      <PageHeader
        title={<Typography.Title level={4}>Report Definition</Typography.Title>}
        button={
          <Link to={`/author/reportBuilder/explore/definition/${report._id}`}>
            <Button type="primary">Add Widget to Report</Button>
          </Link>
        }
      />
      <ReportDefinition report={report} />
    </div>
  ) : (
    <Empty />
  )
}

const enhance = compose(
  connect(
    (state) => ({
      isLoading: isReportDefinitionLoadingSelector(state),
      report: getActiveReportSelector(state),
    }),
    {
      getReportData: getReportDataAction,
    }
  )
)

export default enhance(ReportDefinitionWrapper)
