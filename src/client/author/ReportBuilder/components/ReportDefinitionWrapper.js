import React, { useCallback, useEffect, useState } from 'react'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { Spin, Button, Typography } from 'antd'
import { Link } from 'react-router-dom'
import ReportDefinition from './ReportDefinition'
import {
  getReportDataAction,
  getActiveReportSelector,
  isReportDefinitionLoadingSelector,
  updateReportDefinitionAction,
} from '../ducks'
import PageHeader from './PageHeader'

const ReportDefinitionWrapper = (props, updateReport) => {
  const { isLoading, report, getReportData, match } = props
  const { id } = match.params
  const [currentReport, setCurrentReport] = useState(report)
  useEffect(() => {
    setCurrentReport(report)
  }, [report])

  useEffect(() => {
    if (id) {
      getReportData(id)
    }
  }, [id])

  // TODO maybe implement autosave using setTimeout also ?
  const saveReport = useCallback(() => {
    if (!currentReport || currentReport === report) return
    updateReport({
      updateDoc: {
        $set: currentReport,
      },
      isReportDefinitionPage: true,
      definitionId: report._id,
    })
  }, [currentReport])

  if (isLoading) {
    return (
      <Spin spinning={isLoading}>
        <div
          style={{
            textAlign: 'center',
            padding: 12,
          }}
        >
          <h2>Loading</h2>
        </div>
      </Spin>
    )
  }

  const Empty = () => (
    <div
      style={{
        textAlign: 'center',
        padding: 12,
      }}
    >
      <h2>There are no Widgets on this Report</h2>
      <Link
        to={`/author/reportBuilder/explore/definition/${currentReport?._id}`}
      >
        <Button type="primary" size="large" icon="plus">
          Add Widget to Report
        </Button>
      </Link>
    </div>
  )

  return currentReport?.widgets?.length ? (
    <div>
      <PageHeader
        title={
          <Typography.Title level={4}>{currentReport.title}</Typography.Title>
        }
        button={
          <>
            <Button type="primary" onClick={saveReport}>
              Save Report
            </Button>
            <Link
              to={`/author/reportBuilder/explore/definition/${currentReport._id}`}
            >
              <Button type="primary">Add Widget to Report</Button>
            </Link>
          </>
        }
      />
      <ReportDefinition
        report={currentReport}
        setCurrentReport={setCurrentReport}
      />
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
      updateReport: updateReportDefinitionAction,
    }
  )
)

export default enhance(ReportDefinitionWrapper)
