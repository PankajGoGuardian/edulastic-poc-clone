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
import { setStandardMasteryProfileAction } from '../common/filterDataDucks'
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
import { getAssessmentName } from '../../../common/util'

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
  location,
  pageTitle,
  sharedReport,
  setStandardMasteryProfile,
  toggleFilter,
  generateCSV,
}) => {
  const userRole = useMemo(() => sharedReport?.sharedBy?.role || role, [
    sharedReport,
  ])

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

  const assessmentName = getAssessmentName(
    report?.meta?.test || settings.selectedTest
  )

  const reportWithFilteredSkills = useMemo(
    () => getReportWithFilteredSkills(report, curriculumId),
    [report, curriculumId]
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

  const generateCSVRequired =
    itemsCount > pageFilters.pageSize || (error && error.dataSizeExceeded)

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
  }, [settings.selectedTest?.key, settings.requestFilters])

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
      generateCSVRequired &&
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
    setStandardMasteryProfile(report?.scaleInfo || {})
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
    return <DataSizeExceeded isDownloadable />
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
        <Row type="flex" gutter={[5, 10]} justify="start">
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
                md={12}
                lg={8}
                xl={8}
              >
                <ControlDropDown
                  prefix="View by"
                  by={viewBy}
                  selectCB={handleViewByChange}
                  data={dropDownFormat.viewByDropDownData}
                  isPageFilter
                />
              </StyledDropDownContainer>
              <StyledDropDownContainer
                data-cy="analyzeBy"
                xs={24}
                sm={24}
                md={12}
                lg={8}
                xl={8}
              >
                <ControlDropDown
                  prefix="Analyze by"
                  by={analyzeBy}
                  selectCB={handleAnalyzeByChange}
                  data={dropDownFormat.analyzeByDropDownData}
                  isPageFilter
                />
              </StyledDropDownContainer>
              <StyledDropDownContainer
                data-cy="standardSet"
                xs={24}
                sm={24}
                md={24}
                lg={8}
                xl={8}
              >
                <ControlDropDown
                  prefix="Standard Set"
                  by={selectedCurriculumId || { key: '', title: '' }}
                  selectCB={handleCurriculumIdChange}
                  data={standardsDropdownData}
                  showPrefixOnSelected={false}
                  isPageFilter
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
        <Row type="flex" gutter={[5, 10]} justify="start">
          <Col xs={24} sm={12} md={16} lg={18} xl={20}>
            <StyledH3>
              {capitalize(viewBy)} Performance Analysis by{' '}
              {findCompareByTitle(compareBy)} | {assessmentName}
            </StyledH3>
          </Col>
          <StyledDropDownContainer
            data-cy="compareBy"
            xs={24}
            sm={12}
            md={8}
            lg={6}
            xl={4}
          >
            <ControlDropDown
              prefix="Compare by"
              by={compareBy}
              selectCB={handleCompareByChange}
              data={filteredDropDownData}
              isPageFilter
            />
          </StyledDropDownContainer>
        </Row>
        <PerformanceAnalysisTable
          report={reportWithFilteredSkills}
          viewBy={viewBy}
          analyzeBy={analyzeBy}
          compareBy={compareBy}
          selectedStandards={selectedStandards}
          selectedDomains={selectedDomains}
          isCsvDownloading={generateCSVRequired ? null : isCsvDownloading}
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
  skillInfo: PropTypes.array,
  metricInfo: PropTypes.array,
  studInfo: PropTypes.array,
  standardsMap: PropTypes.object,
  scaleInfo: PropTypes.object,
})

PerformanceByStandards.propTypes = {
  loading: PropTypes.bool.isRequired,
  settings: PropTypes.object.isRequired,
  report: reportPropType.isRequired,
  isCsvDownloading: PropTypes.bool.isRequired,
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
  }),
  {
    getPerformanceByStandards: getPerformanceByStandardsAction,
    setStandardMasteryProfile: setStandardMasteryProfileAction,
    resetPerformanceByStandards: resetPerformanceByStandardsAction,
    generateCSV: generateCSVAction,
  }
)

export default enhance(PerformanceByStandards)
