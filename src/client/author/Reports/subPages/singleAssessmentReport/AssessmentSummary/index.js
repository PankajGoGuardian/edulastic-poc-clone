import { SpinLoader } from '@edulastic/common'
import { Col, Empty } from 'antd'
import PropTypes from 'prop-types'
import React, { useEffect, useMemo } from 'react'
import { connect } from 'react-redux'
import { compose } from 'redux'
import { withRouter } from 'react-router-dom'
import { getUserRole, getUser } from '../../../../src/selectors/user'
import { NoDataContainer, StyledCard, StyledH3 } from '../../../common/styled'
import DataSizeExceeded from '../../../common/components/DataSizeExceeded'
import {
  getCsvDownloadingState,
  getPrintingState,
  getTestListSelector,
} from '../../../ducks'
import { SimplePieChart } from './components/charts/pieChart'
import { Stats } from './components/stats'
import {
  StyledAssessmentStatisticTable,
  TableContainer,
  UpperContainer,
} from './components/styled'
import {
  getAssessmentSummaryRequestAction,
  getReportsAssessmentSummary,
  getReportsAssessmentSummaryLoader,
  setReportsAssesmentSummaryLoadingAction,
  getReportsAssessmentSummaryError,
} from './ducks'
import { setPerformanceBandProfileAction } from '../common/filterDataDucks'

const CustomCliEmptyComponent = () => (
  <Empty
    description="Reports are not available for this test yet. Please try again later..."
    style={{ marginTop: '25vh' }}
  />
)

const AssessmentSummary = ({
  loading,
  error,
  isPrinting,
  isCsvDownloading,
  role,
  assessmentSummary,
  getAssessmentSummary,
  settings,
  testList,
  user,
  match,
  setShowHeader,
  preventHeaderRender,
  setAssesmentSummaryLoading,
  sharedReport,
  setPerformanceBandProfile,
}) => {
  const userRole = useMemo(() => sharedReport?.sharedBy?.role || role, [
    sharedReport,
  ])
  const selectedTest = testList.find(
    (t) => t._id === settings.selectedTest.key
  ) || { _id: '', title: '' }
  const assessmentName = `${
    selectedTest.title
  } (ID:${selectedTest._id.substring(selectedTest._id.length - 5)})`

  useEffect(() => {
    if (settings.selectedTest && settings.selectedTest.key) {
      const q = {
        requestFilters: { ...settings.requestFilters },
        testId: settings.selectedTest.key,
      }
      if (settings.cliUser && q.testId) {
        const { testId } = match.params
        if (testId !== q.testId) {
          setAssesmentSummaryLoading(false)
          setShowHeader(false)
          preventHeaderRender(true)
          return
        }
      }
      getAssessmentSummary(q)
    } else if (settings.cliUser) {
      // On first teacher launch no data is available to teacher
      // Hide header tab(s) for cliUsers
      setAssesmentSummaryLoading(false)
      setShowHeader(false)
      preventHeaderRender(true)
    } else if (settings.selectedTest && !settings.selectedTest.key) {
      setAssesmentSummaryLoading(false)
    }
  }, [settings])

  useEffect(() => {
    setPerformanceBandProfile(assessmentSummary?.bandInfo || {})
  }, [assessmentSummary])

  const { bandInfo, metricInfo } = assessmentSummary

  if (loading) {
    return <SpinLoader position="fixed" />
  }
  if (settings.cliUser && !metricInfo?.length) {
    return <CustomCliEmptyComponent />
  }

  if (error && error.dataSizeExceeded) {
    return <DataSizeExceeded />
  }

  if (!metricInfo?.length || !settings.selectedTest.key) {
    return <NoDataContainer>No data available currently.</NoDataContainer>
  }
  return (
    <>
      <UpperContainer type="flex">
        <StyledCard className="sub-container district-statistics">
          <Stats
            name={assessmentName}
            data={metricInfo}
            role={userRole}
            user={user}
          />
        </StyledCard>
        <StyledCard className="sub-container chart-container">
          <StyledH3 textAlign="center">
            Students in Performance Bands (%)
          </StyledH3>
          <SimplePieChart data={bandInfo.performanceBand} />
        </StyledCard>
      </UpperContainer>
      <TableContainer>
        <Col>
          <StyledCard>
            {userRole ? (
              <StyledAssessmentStatisticTable
                name={assessmentName}
                data={metricInfo}
                role={userRole}
                isPrinting={isPrinting}
                isCsvDownloading={isCsvDownloading}
              />
            ) : (
              ''
            )}
          </StyledCard>
        </Col>
      </TableContainer>
    </>
  )
}

const reportPropType = PropTypes.shape({
  bandInfo: PropTypes.array,
  metricInfo: PropTypes.array,
})

AssessmentSummary.propTypes = {
  loading: PropTypes.bool.isRequired,
  isPrinting: PropTypes.bool.isRequired,
  isCsvDownloading: PropTypes.bool.isRequired,
  role: PropTypes.string.isRequired,
  assessmentSummary: reportPropType.isRequired,
  getAssessmentSummary: PropTypes.func.isRequired,
  settings: PropTypes.object.isRequired,
}

const enhance = compose(
  withRouter,
  connect(
    (state) => ({
      loading: getReportsAssessmentSummaryLoader(state),
      error: getReportsAssessmentSummaryError(state),
      isPrinting: getPrintingState(state),
      isCsvDownloading: getCsvDownloadingState(state),
      role: getUserRole(state),
      assessmentSummary: getReportsAssessmentSummary(state),
      user: getUser(state),
      testList: getTestListSelector(state),
    }),
    {
      getAssessmentSummary: getAssessmentSummaryRequestAction,
      setAssesmentSummaryLoading: setReportsAssesmentSummaryLoadingAction,
      setPerformanceBandProfile: setPerformanceBandProfileAction,
    }
  )
)

export default enhance(AssessmentSummary)
