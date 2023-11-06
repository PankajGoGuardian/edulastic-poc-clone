import React, { useEffect, useMemo } from 'react'
import { Result, Spin } from 'antd'
import { connect } from 'react-redux'
import CustomReportCard from './customReportCard/customReportCard'

import {
  getCustomReportAction,
  getCustomReportList,
  getCustomReportLoader,
} from './ducks'
import { getUserOrgId } from '../../../src/selectors/user'
import { CUSTOM_TO_STATE_REPORTS_DISTRICT_IDS } from '../../common/constants/customReports'

const CustomReportsWrapper = ({
  isLoading,
  customReportList = [],
  getCustomReport,
  showReport,
  districtId,
}) => {
  useEffect(() => {
    if (customReportList.length === 0) {
      getCustomReport()
    }
  }, [])
  const showLoader = () => <Spin size="small" />

  // NOTE: changes for demo district data with custom report titled "Data Studio"
  // ref. EV-40723
  const reportCards = useMemo(
    () =>
      CUSTOM_TO_STATE_REPORTS_DISTRICT_IDS.includes(districtId)
        ? [
            customReportList.find(({ title }) => title === 'Data Studio'),
            ...customReportList.filter(({ title }) => title !== 'Data Studio'),
          ]
        : customReportList,
    [districtId, customReportList]
  )

  return (
    <>
      {isLoading ? (
        showLoader()
      ) : customReportList.length > 0 ? (
        <CustomReportCard reportCards={reportCards} showReport={showReport} />
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
    districtId: getUserOrgId(state),
  }),
  {
    getCustomReport: getCustomReportAction,
  }
)

export default enhance(CustomReportsWrapper)
