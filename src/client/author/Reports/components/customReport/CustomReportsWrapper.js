import React, { useEffect } from 'react'
import { Result, Spin } from 'antd'
import { connect } from 'react-redux'
import CustomReportCard from './customReportCard/customReportCard'

import {
  getCustomReportAction,
  getCustomReportList,
  getCustomReportLoader,
} from './ducks'

const CustomReportsWrapper = ({
  isLoading,
  customReportList = [],
  getCustomReport,
  showReport,
}) => {
  useEffect(() => {
    if (customReportList.length === 0) {
      getCustomReport()
    }
  }, [])
  const showLoader = () => <Spin size="small" />
  return (
    <>
      {isLoading ? (
        showLoader()
      ) : customReportList.length > 0 ? (
        <CustomReportCard
          reportCards={customReportList}
          showReport={showReport}
        />
      ) : (
        <Result title="No report found" />
      )}
    </>
  )
}

const enhance = connect(
  (state) => ({
    isLoading: getCustomReportLoader(state),
    customReportList: getCustomReportList(state),
  }),
  {
    getCustomReport: getCustomReportAction,
  }
)

export default enhance(CustomReportsWrapper)
