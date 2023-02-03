import React, { useEffect, useMemo, useState } from 'react'
import { get, isEmpty, mapValues } from 'lodash'
import { connect } from 'react-redux'
import { Row } from 'antd'

import { notification, SpinLoader, EduIf } from '@edulastic/common'
import { fadedBlack, themeColor } from '@edulastic/colors'

import { NoDataContainer, StyledCard, StyledH3 } from '../../../common/styled'
import FeaturesSwitch from '../../../../../features/components/FeaturesSwitch'
import DataSizeExceeded from '../../../common/components/DataSizeExceeded'
import AddToGroupModal from '../../../common/components/Popups/AddToGroupModal'
import { SummaryContainer } from './components/Summary'
import PerformanceMatrix from './components/PerformanceMatrix'
import { PreVsPostTable } from './components/Table'

import { getUserRole } from '../../../../src/selectors/user'
import { getCsvDownloadingState } from '../../../ducks'
import { actions, selectors } from './ducks'

import {
  compareByOptions as compareByOptionsRaw,
  analyseByOptions,
  matrixDisplayOptionTypes,
  getTestNamesFromTestMetrics,
  getSummaryDataFromSummaryMetrics,
  getTableData,
} from './utils'
import {
  StyledSpan,
  StyledIconAlert,
  PreVsPostReportContainer,
} from './common/styledComponents'

const PreVsPostReport = ({
  userRole,
  settings,
  isCsvDownloading,
  ddfilter,
  MARFilterData,
  sharedReport,
  toggleFilter,
  loadingReportSummaryData,
  loadingReportTableData,
  reportSummaryData,
  reportTableData,
  resetPreVsPostReport,
  error,
  fetchReportSummaryDataRequest,
  fetchPreVsPostReportTableDataRequest,
}) => {
  const sharedReportFilters = useMemo(
    () =>
      sharedReport?._id
        ? { ...sharedReport.filters, reportId: sharedReport._id }
        : null,
    [sharedReport]
  )

  const reportFilters = sharedReportFilters || settings.requestFilters

  const compareByOptions = compareByOptionsRaw.filter(
    (option) => !option.hiddenFromRole?.includes(userRole)
  )

  const [defaultCompareBy] = compareByOptions
  const [defaultAnalyseBy] = analyseByOptions

  // define states used in the report
  const [tableFilters, setTableFilters] = useState({
    compareBy: defaultCompareBy,
    analyseBy: defaultAnalyseBy,
    preBandScore: '',
    postBandScore: '',
  })
  const [matrixDisplayKey, setMatrixDisplayKey] = useState(
    matrixDisplayOptionTypes.NUMBER
  )
  const [showAddToGroupModal, setShowAddToGroupModal] = useState(false)
  const [selectedRowKeys, onSelectChange] = useState([])
  const [checkedStudents, setCheckedStudents] = useState([])

  useEffect(() => () => resetPreVsPostReport(), [])

  // get report data
  useEffect(() => {
    const q = {
      ...settings.requestFilters,
      ...ddfilter,
    }
    if (settings.requestFilters.termId || settings.requestFilters.reportId) {
      setTableFilters({ ...tableFilters, preBandScore: '', postBandScore: '' })
      fetchReportSummaryDataRequest(q)
      return () => toggleFilter(null, false)
    }
  }, [settings.requestFilters])

  useEffect(() => {
    const q = {
      ...settings.requestFilters,
      ...ddfilter,
      compareBy: tableFilters.compareBy.key,
    }
    if (settings.requestFilters.termId || settings.requestFilters.reportId) {
      fetchPreVsPostReportTableDataRequest(q)
      return () => toggleFilter(null, false)
    }
  }, [settings.requestFilters, tableFilters.compareBy.key])

  // extract selected performance band from MARFilterData
  const bandInfo = useMemo(
    () => get(MARFilterData, 'data.result.bandInfo', []),
    [MARFilterData]
  )
  const selectedPerformanceBand = (
    bandInfo.find((x) => x._id === reportFilters.profileId) || bandInfo[0]
  )?.performanceBand?.sort((a, b) => b.threshold - a.threshold)

  // get summary metrics and performance matrix data
  const {
    summaryMetricInfo,
    preTestName,
    postTestName,
    totalStudentCount,
    summaryData,
  } = useMemo(() => {
    const {
      metricInfo: _summaryMetricInfo = [],
      testInfo: _testInfo = [],
    } = reportSummaryData
    const _testNamesData = getTestNamesFromTestMetrics(_testInfo, reportFilters)
    const _summaryData = getSummaryDataFromSummaryMetrics(_summaryMetricInfo)
    return {
      summaryMetricInfo: _summaryMetricInfo,
      ..._testNamesData,
      ..._summaryData,
    }
  }, [reportSummaryData, reportFilters])

  const [tableData, rowSelection, checkedStudentsForModal] = useMemo(() => {
    const { metricInfo: _tableMetricInfo = [] } = reportTableData
    const _tableData = getTableData(
      _tableMetricInfo,
      selectedPerformanceBand,
      tableFilters,
      preTestName,
      postTestName
    )
    const _rowSelection = {
      selectedRowKeys,
      onChange: onSelectChange,
      onSelect: ({ studentId }) => {
        return setCheckedStudents(
          checkedStudents.includes(studentId)
            ? checkedStudents.filter((i) => i !== studentId)
            : [...checkedStudents, studentId]
        )
      },
      onSelectAll: (flag) =>
        setCheckedStudents(flag ? _tableData.map((d) => d.studentId) : []),
    }

    const _checkedStudentsForModal = _tableData
      .filter((d) => checkedStudents.includes(d.studentId))
      .map(({ studentId, firstName, lastName, username }) => ({
        _id: studentId,
        firstName,
        lastName,
        username,
      }))
    return [_tableData, _rowSelection, _checkedStudentsForModal]
  }, [
    reportTableData,
    selectedPerformanceBand,
    tableFilters.compareBy.key,
    tableFilters.preBandScore,
    tableFilters.postBandScore,
    preTestName,
    postTestName,
    checkedStudents,
  ])

  // Handle add to student group
  const handleAddToGroupClick = () => {
    if (checkedStudentsForModal.length < 1) {
      notification({ messageKey: 'selectOneOrMoreStudentsForGroup' })
    } else {
      setShowAddToGroupModal(true)
    }
  }

  // handle matrix cell click
  const onMatrixCellClick = (preBandScore = '', postBandScore = '') => () => {
    const _tableFilters = {
      ...tableFilters,
      preBandScore: `${preBandScore}`,
      postBandScore: `${postBandScore}`,
    }
    if (
      tableFilters.preBandScore === _tableFilters.preBandScore &&
      tableFilters.postBandScore === _tableFilters.postBandScore
    ) {
      _tableFilters.preBandScore = ''
      _tableFilters.postBandScore = ''
    }
    setTableFilters(_tableFilters)
  }

  const noDataContainerText = settings.requestFilters?.termId
    ? error.msg === 'InvalidTestIds'
      ? 'Please select the Pre and Post Assessment to generate the report.'
      : 'No data available currently.'
    : ''

  return (
    <>
      <EduIf condition={loadingReportSummaryData || loadingReportTableData}>
        <SpinLoader
          tip="Please wait while we gather the required information..."
          position="fixed"
        />
      </EduIf>
      <EduIf
        condition={
          !loadingReportSummaryData &&
          !loadingReportTableData &&
          isEmpty(summaryMetricInfo)
        }
      >
        <NoDataContainer>{noDataContainerText}</NoDataContainer>
      </EduIf>
      <EduIf
        condition={
          !loadingReportSummaryData &&
          !loadingReportTableData &&
          !isEmpty(summaryMetricInfo) &&
          error &&
          error.dataSizeExceeded
        }
      >
        <DataSizeExceeded />
      </EduIf>
      <EduIf
        condition={
          !loadingReportSummaryData &&
          !loadingReportTableData &&
          !isEmpty(summaryMetricInfo) &&
          !error
        }
      >
        <PreVsPostReportContainer>
          <FeaturesSwitch
            inputFeatures="studentGroups"
            actionOnInaccessible="hidden"
          >
            <AddToGroupModal
              groupType="custom"
              visible={showAddToGroupModal}
              onCancel={() => setShowAddToGroupModal(false)}
              checkedStudents={checkedStudentsForModal}
            />
          </FeaturesSwitch>
          <StyledCard>
            <Row type="flex" justify="start">
              <StyledH3 fontSize="20px">Pre vs Post Comparison</StyledH3>
            </Row>
            <Row type="flex">
              <StyledIconAlert fill={themeColor} />
              <StyledSpan fontSize="13px" color={fadedBlack}>
                This report compares the student performance on the choosen two
                assessments.{' '}
                <StyledSpan font="bold" color={fadedBlack}>
                  Only students that have results for both assessments are
                  included.
                </StyledSpan>
              </StyledSpan>
            </Row>
          </StyledCard>
          <SummaryContainer
            summary={summaryData}
            preTestName={preTestName}
            postTestName={postTestName}
            totalStudentCount={totalStudentCount}
            selectedPerformanceBand={selectedPerformanceBand}
          />
          <PerformanceMatrix
            preTestName={preTestName}
            postTestName={postTestName}
            totalStudentCount={totalStudentCount}
            summaryMetricInfo={summaryMetricInfo}
            selectedPerformanceBand={selectedPerformanceBand}
            tableFilters={tableFilters}
            onMatrixCellClick={onMatrixCellClick}
            matrixDisplayKey={matrixDisplayKey}
            setMatrixDisplayKey={setMatrixDisplayKey}
          />
          <PreVsPostTable
            dataSource={tableData}
            selectedTableFilters={tableFilters}
            selectedPerformanceBand={selectedPerformanceBand}
            compareByOptions={compareByOptions}
            analyseByOptions={analyseByOptions}
            rowSelection={rowSelection}
            setTableFilters={setTableFilters}
            isCsvDownloading={isCsvDownloading}
            handleAddToGroupClick={handleAddToGroupClick}
          />
        </PreVsPostReportContainer>
      </EduIf>
    </>
  )
}

const enhance = connect(
  (state) => ({
    ...mapValues(selectors, (selector) => selector(state)),
    userRole: getUserRole(state),
    isCsvDownloading: getCsvDownloadingState(state),
  }),
  {
    ...actions,
  }
)

export default enhance(PreVsPostReport)
