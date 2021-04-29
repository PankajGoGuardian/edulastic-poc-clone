import { SpinLoader } from '@edulastic/common'
import { Col, Row } from 'antd'
import next from 'immer'
import {
  capitalize,
  filter as filterArr,
  find,
  indexOf,
  isEmpty,
  get,
} from 'lodash'
import PropTypes from 'prop-types'
import React, { useEffect, useMemo, useState } from 'react'
import { connect } from 'react-redux'
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
import { getCsvDownloadingState, getTestListSelector } from '../../../ducks'
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
import {
  analysisParseData,
  analyzeByMode,
  compareByMode,
  viewByMode,
} from './util/transformers'

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
  testList,
  role,
  isCsvDownloading,
  standardProficiencyProfiles,
  location,
  pageTitle,
  filters,
  sharedReport,
  setStandardMasteryProfile,
  toggleFilter,
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
  const [standardId, setStandardId] = useState('')
  const [selectedStandards, setSelectedStandards] = useState([])
  const [selectedDomains, setSelectedDomains] = useState([])

  const isViewByStandards = viewBy === viewByMode.STANDARDS

  const selectedTest = testList.find(
    (t) => t._id === settings.selectedTest.key
  ) || { _id: '', title: '' }
  const assessmentName = `${
    selectedTest.title
  } (ID:${selectedTest._id.substring(selectedTest._id.length - 5)})`

  const reportWithFilteredSkills = useMemo(
    () =>
      next(report, (draftReport) => {
        draftReport.skillInfo = filterArr(
          draftReport.skillInfo,
          (skill) => String(skill.curriculumId) === String(standardId)
        )
        draftReport.scaleInfo = scaleInfo
      }),
    [report, standardId, scaleInfo]
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
          ...Object.keys(filters).reduce((reqFilter, key) => {
            reqFilter[key] = filters[key] === 'all' ? '' : filters[key]
            return reqFilter
          }, {}),
        },
        testId: settings.selectedTest.key,
      }
      getPerformanceByStandards(q)
      setSummaryStats(false)
    }
  }, [pageFilters])

  const setSelectedData = ({ defaultStandardId }) => {
    const _defaultStandardId =
      standardsDropdownData.find((s) => `${s.key}` === `${defaultStandardId}`)
        ?.key ||
      standardsDropdownData?.[0]?.key ||
      ''
    setStandardId(_defaultStandardId)
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

  const handleStandardIdChange = (selected) => {
    setStandardId(selected.key)
  }

  const [tableData, totalPoints] = analysisParseData(
    reportWithFilteredSkills,
    viewBy,
    compareBy,
    filters
  )

  const selectedStandardId = standardsDropdownData.find(
    (s) => `${s.key}` === `${standardId}`
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
              <StyledDropDownContainer xs={24} sm={24} md={8} lg={8} xl={8}>
                <ControlDropDown
                  prefix="View By"
                  by={viewBy}
                  selectCB={handleViewByChange}
                  data={dropDownFormat.viewByDropDownData}
                />
              </StyledDropDownContainer>
              <StyledDropDownContainer xs={24} sm={24} md={7} lg={7} xl={7}>
                <ControlDropDown
                  prefix="Analyze By"
                  by={analyzeBy}
                  selectCB={handleAnalyzeByChange}
                  data={dropDownFormat.analyzeByDropDownData}
                />
              </StyledDropDownContainer>
              <StyledDropDownContainer xs={24} sm={24} md={7} lg={7} xl={7}>
                <ControlDropDown
                  prefix="Standard Set"
                  by={selectedStandardId || { key: '', title: '' }}
                  selectCB={handleStandardIdChange}
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
            filter={filters}
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
          <CardDropdownWrapper>
            <ControlDropDown
              prefix="Compare By"
              by={compareBy}
              selectCB={handleCompareByChange}
              data={filteredDropDownData}
            />
          </CardDropdownWrapper>
        </CardHeader>
        <PerformanceAnalysisTable
          tableData={tableData}
          report={reportWithFilteredSkills}
          viewBy={viewBy}
          analyzeBy={analyzeBy}
          compareBy={compareBy}
          selectedStandards={selectedStandards}
          selectedDomains={selectedDomains}
          totalPoints={totalPoints}
          isCsvDownloading={isCsvDownloading}
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
    testList: getTestListSelector(state),
  }),
  {
    getPerformanceByStandards: getPerformanceByStandardsAction,
    setStandardMasteryProfile: setStandardMasteryProfileAction,
    resetPerformanceByStandards: resetPerformanceByStandardsAction,
  }
)

export default enhance(PerformanceByStandards)
