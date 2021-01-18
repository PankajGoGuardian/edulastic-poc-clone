import React from 'react'
import { connect } from 'react-redux'
import { compose } from 'redux'
// import { get } from 'lodash'

// import { SpinLoader } from '@edulastic/common'
import DataSizeExceeded from '../../../common/components/DataSizeExceeded'
import { NoDataContainer } from '../../../common/styled'

import { getCsvDownloadingState } from '../../../ducks'
import { getReportsStandardsFilters } from '../common/filterDataDucks'
import {
  getReportsStandardsProgress,
  getReportsStandardsProgressLoader,
  getStandardsProgressRequestAction,
  getReportsStandardsProgressError,
} from './ducks'

const StandardsProgress = ({
  // loading,
  error,
  // isCsvDownloading,
  // standardsFilters,
  // standardsProgress,
  // getStandardsProgressRequest,
  // location,
  // pageTitle,
  // ddfilter,
  // userRole,
  // sharedReport,
}) => {
  // if (loading) {
  //   return <SpinLoader position="fixed" />
  // }

  if (error && error.dataSizeExceeded) {
    return <DataSizeExceeded />
  }

  return <NoDataContainer>No data available currently.</NoDataContainer>
}

const enhance = compose(
  connect(
    (state) => ({
      loading: getReportsStandardsProgressLoader(state),
      error: getReportsStandardsProgressError(state),
      isCsvDownloading: getCsvDownloadingState(state),
      standardsFilters: getReportsStandardsFilters(state),
      standardsProgress: getReportsStandardsProgress(state),
    }),
    {
      getStandardsProgressRequest: getStandardsProgressRequestAction,
    }
  )
)

export default enhance(StandardsProgress)
