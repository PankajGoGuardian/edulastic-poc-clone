import { SpinLoader } from '@edulastic/common'
import { Col, Empty } from 'antd'
import PropTypes from 'prop-types'
import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import { compose } from 'redux'
import { withRouter } from 'react-router-dom'
import { getUserRole, getUser } from '../../../../src/selectors/user'
import { NoDataContainer, StyledCard, StyledH3 } from '../../../common/styled'
import { getCsvDownloadingState, getPrintingState } from '../../../ducks'
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
} from './ducks'
import { getTestListSelector } from '../common/filterDataDucks'

const CustomCliEmptyComponent = () => (
  <Empty
    description="Reports are not available for this test yet. Please try again later..."
    style={{ marginTop: '25vh' }}
  />
)

const AssessmentSummary = ({
  loading,
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
}) => {
  const selectedTest = testList.find(
    (t) => t._id === settings.selectedTest.key
  ) || { _id: '', title: '' }
  const assessmentName = `${
    selectedTest.title
  } (ID:${selectedTest._id.substring(selectedTest._id.length - 5)})`

  useEffect(() => {
    if (settings.selectedTest && settings.selectedTest.key) {
      const q = {}
      q.testId = settings.selectedTest.key
      const {
        performanceBandProfile,
        ...requestFilters
      } = settings.requestFilters
      q.requestFilters = {
        ...requestFilters,
        profileId: performanceBandProfile,
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

  const { bandInfo, metricInfo } = assessmentSummary

  if (loading) {
    return <SpinLoader position="fixed" />
  }
  if (settings.cliUser && !metricInfo?.length) {
    return <CustomCliEmptyComponent />
  }
  if (!metricInfo?.length) {
    return <NoDataContainer>No data available currently.</NoDataContainer>
  }
  return (
    <>
      <UpperContainer type="flex">
        <StyledCard className="sub-container district-statistics">
          <Stats
            name={assessmentName}
            data={metricInfo}
            role={role}
            user={user}
          />
        </StyledCard>
        <StyledCard className="sub-container chart-container">
          <StyledH3 textAlign="center">
            Students in Performance Bands (%)
          </StyledH3>
          <SimplePieChart data={bandInfo} />
        </StyledCard>
      </UpperContainer>
      <TableContainer>
        <Col>
          <StyledCard>
            {role ? (
              <StyledAssessmentStatisticTable
                name={assessmentName}
                data={metricInfo}
                role={role}
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
    }
  )
)

export default enhance(AssessmentSummary)
