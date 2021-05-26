import { SpinLoader } from '@edulastic/common'
import { Col, Row } from 'antd'
import next from 'immer'
import { capitalize, find, indexOf, isEmpty, get } from 'lodash'
import PropTypes from 'prop-types'
import React, { useEffect, useMemo, useState } from 'react'
import { connect } from 'react-redux'

import { report as reportTypes, reportUtils } from '@edulastic/constants'

import { getUserRole } from '../../../../src/selectors/user'
import { ControlDropDown } from '../../../common/components/widgets/controlDropDown'
import BackendPagination from '../../../common/components/BackendPagination'
import {
  StyledCard,
  StyledDropDownContainer,
  StyledH3,
  StyledSignedBarContainer,
  NoDataContainer,
} from '../../../common/styled'
import DataSizeExceeded from '../../../common/components/DataSizeExceeded'

import { getCsvDownloadingState, generateCSVAction } from '../../../ducks'
import {
  getSAFFilterStandardsProficiencyProfiles,
  setStandardMasteryProfileAction,
} from '../common/filterDataDucks'
import CardHeader, {
  CardDropdownWrapper,
  CardTitle,
} from './common/CardHeader/CardHeader'
import SignedStackedBarChartContainer from './components/charts/SignedStackedBarChartContainer'
import SimpleStackedBarChartContainer from './components/charts/SimpleStackedBarChartContainer'
import PerformanceAnalysisTable from './components/table/performanceAnalysisTable'
import {
  getPerformanceByStandardsAction,
  getPerformanceByStandardsLoadingSelector,
  getPerformanceByStandardsReportSelector,
  getPerformanceByStandardsErrorSelector,
  resetPerformanceByStandardsAction,
} from './ducks'
import dropDownFormat from './static/json/dropDownFormat.json'

const {
  viewByMode,
  analyzeByMode,
  compareByMode,
  getReportWithFilteredSkills,
} = reportUtils.performanceByStandards

const findCompareByTitle = (key = '') => {
  if (!key) return ''

  const { title = '' } =
    find(dropDownFormat.compareByDropDownData, (item) => item.key === key) || {}

  return title
}

const PerformanceByStandards = ({
  loading,
  error,
  report = {},
  getPerformanceByStandards,
  resetPerformanceByStandards,
  settings,
  demographicFilters,
  role,
  isCsvDownloading,
  standardProficiencyProfiles,
  location,
  pageTitle,
  sharedReport,
  setStandardMasteryProfile,
  toggleFilter,
  generateCSV,
}) => {
  const [userRole, sharedReportFilters] = useMemo(
    () => [
      sharedReport?.sharedBy?.role || role,
      sharedReport?._id
        ? { ...sharedReport.filters, reportId: sharedReport._id }
        : null,
    ],
    [sharedReport]
  )
  const scaleInfo = useMemo(
    () =>
      (
        standardProficiencyProfiles.find(
          (s) =>
            s._id ===
            (sharedReportFilters || settings.requestFilters)
              .standardsProficiencyProfile
        ) || report?.scaleInfo
      )?.scale,
    [settings, report]
  )

  useEffect(() => {
    setStandardMasteryProfile(report?.scaleInfo || {})
  }, [report])

  const itemsCount = get(report, 'totalCount', 0)
  const [pageFilters, setPageFilters] = useState({
    page: 0, // set to 0 initially to prevent multiple api request on tab change
    pageSize: 50,
  })
  const [summaryStats, setSummaryStats] = useState(true)
  const [viewBy, setViewBy] = useState(viewByMode.STANDARDS)
  const [analyzeBy, setAnalyzeBy] = useState(analyzeByMode.SCORE)
  const [compareBy, setCompareBy] = useState(
    userRole === 'teacher' ? compareByMode.STUDENTS : compareByMode.SCHOOL
  )
  const [curriculumId, setCurriculumId] = useState('')
  const [selectedStandards, setSelectedStandards] = useState([])
  const [selectedDomains, setSelectedDomains] = useState([])

  const isViewByStandards = viewBy === viewByMode.STANDARDS

  const assessmentName = `${
    settings.selectedTest.title
  } (ID:${settings.selectedTest.key.substring(
    settings.selectedTest.key.length - 5
  )})`

  const reportWithFilteredSkills = useMemo(
    () => getReportWithFilteredSkills(report, scaleInfo, curriculumId),
    [report, curriculumId, scaleInfo]
  )

  const standardsDropdownData = useMemo(() => {
    const { standardsMap = {} } = reportWithFilteredSkills
    const standardsMapArr = Object.keys(standardsMap).map((item) => ({
      key: +item,
      title: standardsMap[item],
    }))
    return standardsMapArr || []
  }, [reportWithFilteredSkills])

  const filteredDropDownData = dropDownFormat.compareByDropDownData.filter(
    (o) => {
      if (o.allowedRoles) {
        return o.allowedRoles.includes(userRole)
      }
      return true
    }
  )

  useEffect(() => () => resetPerformanceByStandards(), [])

  useEffect(() => {
    setSummaryStats(true)
    setPageFilters({ ...pageFilters, page: 1 })
    if (settings.requestFilters.termId || settings.requestFilters.reportId) {
      return () => toggleFilter(null, false)
    }
    /**
     * NOTE: demographicFilters are updated along with requestFilters
     * hence, removed demographic filters dependency from useEffect
     * to prevent duplicate API from being fired
     */
  }, [settings.selectedTest, settings.requestFilters])

  useEffect(() => {
    setPageFilters({ ...pageFilters, page: 1 })
  }, [compareBy])

  useEffect(() => {
    if (
      settings.selectedTest &&
      settings.selectedTest.key &&
      pageFilters.page
    ) {
      const q = {
        requestFilters: {
          ...settings.requestFilters,
          compareBy,
          summaryStats,
          ...pageFilters,
          ...demographicFilters,
        },
        testId: settings.selectedTest.key,
      }
      getPerformanceByStandards(q)
      setSummaryStats(false)
    }
  }, [pageFilters])

  useEffect(() => {
    if (
      isCsvDownloading &&
      itemsCount > pageFilters.pageSize &&
      settings.selectedTest &&
      settings.selectedTest.key
    ) {
      const q = {
        reportType: reportTypes.reportNavType.PERFORMANCE_BY_STANDARDS,
        reportFilters: {
          ...settings.requestFilters,
          compareBy,
          ...pageFilters,
          ...demographicFilters,
          testId: settings.selectedTest.key,
        },
        reportExtras: {
          scaleInfo,
          viewBy,
          analyzeBy,
          curriculumId,
          selectedStandards,
          selectedDomains,
        },
      }
      generateCSV(q)
    }
  }, [isCsvDownloading])

  const setSelectedData = ({ defaultCurriculumId }) => {
    const _defaultCurriculumId =
      standardsDropdownData.find((s) => `${s.key}` === `${defaultCurriculumId}`)
        ?.key ||
      standardsDropdownData?.[0]?.key ||
      ''
    setCurriculumId(_defaultCurriculumId)
    setSelectedStandards([])
    setSelectedDomains([])
  }

  useEffect(() => {
    setSelectedData(reportWithFilteredSkills)
    if (
      (settings.requestFilters.termId || settings.requestFilters.reportId) &&
      !loading &&
      !isEmpty(report) &&
      !report.performanceSummaryStats.length &&
      (!report.metricInfo.length || !report.studInfo.length)
    ) {
      toggleFilter(null, true)
    }
  }, [report])

  const handleResetSelection = () => {
    setSelectedData(report)
  }

  const handleToggleSelectedData = (item) => {
    const dataField = isViewByStandards ? 'standardId' : 'domainId'
    const stateHandler = isViewByStandards
      ? setSelectedStandards
      : setSelectedDomains

    stateHandler((prevState) => {
      const newState = next(prevState, (draftState) => {
        const index = indexOf(prevState, item[dataField])
        if (index > -1) {
          draftState.splice(index, 1)
        } else {
          draftState.push(item[dataField])
        }
      })

      return newState
    })
  }

  const handleViewByChange = (event, selected) => {
    setViewBy(selected.key)
  }

  const handleAnalyzeByChange = (event, selected) => {
    setAnalyzeBy(selected.key)
  }

  const handleCompareByChange = (event, selected) => {
    setCompareBy(selected.key)
  }

  const handleCurriculumIdChange = (selected) => {
    setCurriculumId(selected.key)
  }

  const selectedCurriculumId = standardsDropdownData.find(
    (s) => `${s.key}` === `${curriculumId}`
  )

  const selectedItems = isViewByStandards ? selectedStandards : selectedDomains

  const BarToRender =
    analyzeBy === analyzeByMode.SCORE || analyzeBy === analyzeByMode.RAW_SCORE
      ? SimpleStackedBarChartContainer
      : SignedStackedBarChartContainer

  if (loading) {
    return (
      <SpinLoader
        tip="Please wait while we gather the required information..."
        position="fixed"
      />
    )
  }

  if (error && error.dataSizeExceeded) {
    return <DataSizeExceeded />
  }

  if (!report.performanceSummaryStats?.length) {
    return (
      <NoDataContainer>
        {settings.requestFilters?.termId ? 'No data available currently.' : ''}
      </NoDataContainer>
    )
  }

  return (
    <>
      <StyledCard>
        <Row type="flex" justify="start">
          <Col xs={24} sm={24} md={12} lg={8} xl={12}>
            <StyledH3>
              Performance by {capitalize(`${viewBy}s`)} | {assessmentName}
            </StyledH3>
          </Col>
          <Col xs={24} sm={24} md={12} lg={16} xl={12}>
            <Row type="flex" justify="end" gutter={[5, 10]}>
              <StyledDropDownContainer
                data-cy="viewBy"
                xs={24}
                sm={24}
                md={8}
                lg={8}
                xl={8}
              >
                <ControlDropDown
                  prefix="View by"
                  by={viewBy}
                  selectCB={handleViewByChange}
                  data={dropDownFormat.viewByDropDownData}
                />
              </StyledDropDownContainer>
              <StyledDropDownContainer
                data-cy="analyzeBy"
                xs={24}
                sm={24}
                md={7}
                lg={7}
                xl={7}
              >
                <ControlDropDown
                  prefix="Analyze by"
                  by={analyzeBy}
                  selectCB={handleAnalyzeByChange}
                  data={dropDownFormat.analyzeByDropDownData}
                />
              </StyledDropDownContainer>
              <StyledDropDownContainer
                data-cy="standardSet"
                xs={24}
                sm={24}
                md={7}
                lg={7}
                xl={7}
              >
                <ControlDropDown
                  prefix="Standard Set"
                  by={selectedCurriculumId || { key: '', title: '' }}
                  selectCB={handleCurriculumIdChange}
                  data={standardsDropdownData}
                  showPrefixOnSelected={false}
                />
              </StyledDropDownContainer>
            </Row>
          </Col>
        </Row>
        <StyledSignedBarContainer>
          <BarToRender
            report={reportWithFilteredSkills}
            viewBy={viewBy}
            analyzeBy={analyzeBy}
            onBarClick={handleToggleSelectedData}
            selectedData={selectedItems}
            onResetClick={handleResetSelection}
          />
        </StyledSignedBarContainer>
      </StyledCard>
      <StyledCard style={{ marginTop: '20px' }}>
        <CardHeader>
          <CardTitle>
            {capitalize(viewBy)} Performance Analysis by{' '}
            {findCompareByTitle(compareBy)} | {assessmentName}
          </CardTitle>
          <CardDropdownWrapper data-cy="compareBy">
            <ControlDropDown
              prefix="Compare by"
              by={compareBy}
              selectCB={handleCompareByChange}
              data={filteredDropDownData}
            />
          </CardDropdownWrapper>
        </CardHeader>
        <PerformanceAnalysisTable
          report={reportWithFilteredSkills}
          viewBy={viewBy}
          analyzeBy={analyzeBy}
          compareBy={compareBy}
          selectedStandards={selectedStandards}
          selectedDomains={selectedDomains}
          isCsvDownloading={
            itemsCount < pageFilters.pageSize ? isCsvDownloading : null
          }
          location={location}
          pageTitle={pageTitle}
        />
        <BackendPagination
          itemsCount={itemsCount}
          backendPagination={pageFilters}
          setBackendPagination={setPageFilters}
        />
      </StyledCard>
    </>
  )
}

const reportPropType = PropTypes.shape({
  teacherInfo: PropTypes.array,
  scaleInfo: PropTypes.array,
  skillInfo: PropTypes.array,
  metricInfo: PropTypes.array,
  studInfo: PropTypes.array,
  standardsMap: PropTypes.object,
})

PerformanceByStandards.propTypes = {
  loading: PropTypes.bool.isRequired,
  settings: PropTypes.object.isRequired,
  report: reportPropType.isRequired,
  isCsvDownloading: PropTypes.bool.isRequired,
  standardProficiencyProfiles: PropTypes.array.isRequired,
  getPerformanceByStandards: PropTypes.func.isRequired,
  role: PropTypes.string.isRequired,
}

const enhance = connect(
  (state) => ({
    loading: getPerformanceByStandardsLoadingSelector(state),
    error: getPerformanceByStandardsErrorSelector(state),
    role: getUserRole(state),
    report: getPerformanceByStandardsReportSelector(state),
    isCsvDownloading: getCsvDownloadingState(state),
    standardProficiencyProfiles: getSAFFilterStandardsProficiencyProfiles(
      state
    ),
  }),
  {
    getPerformanceByStandards: getPerformanceByStandardsAction,
    setStandardMasteryProfile: setStandardMasteryProfileAction,
    resetPerformanceByStandards: resetPerformanceByStandardsAction,
    generateCSV: generateCSVAction,
  }
)

export default enhance(PerformanceByStandards)
