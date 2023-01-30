import React, { useEffect, useMemo, useState } from 'react'
import { get, isEmpty, mapValues } from 'lodash'
import { connect } from 'react-redux'
import { Row } from 'antd'

import { notification, SpinLoader } from '@edulastic/common'
import { roleuser } from '@edulastic/constants'
import { fadedBlack, themeColor } from '@edulastic/colors'

import { NoDataContainer, StyledCard, StyledH3 } from '../../../common/styled'
import FeaturesSwitch from '../../../../../features/components/FeaturesSwitch'
import DataSizeExceeded from '../../../common/components/DataSizeExceeded'
import AddToGroupModal from '../../../common/components/Popups/AddToGroupModal'
import SummaryContainer from './components/SummaryContainer'
import PerformanceMatrix from './components/PerformanceMatrix'
import PreVsPostTable from './components/Table'

import { getUserRole } from '../../../../src/selectors/user'
import { getCsvDownloadingState } from '../../../ducks'
import { actions, selectors } from './ducks'

import dropDownData from './static/dropDownData.json'
import {
  getTestNamesFromTestMetrics,
  getSummaryDataFromSummaryMetrics,
  getTableData,
} from './utils'
import {
  StyledSpan,
  StyledIconAlert,
  PreVsPostReportContainer,
} from './common/styledComponents'

const { compareByOptions: compareByOptionsRaw, analyseByOptions } = dropDownData

const PreVsPostReport = ({
  location,
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

  const compareByOptions = compareByOptionsRaw.filter(
    (option) => !option.hiddenFromRole?.includes(userRole)
  )

  // define states used in the report
  const [tableFilters, setTableFilters] = useState({
    compareBy:
      compareByOptions.find((o) => o.key === location?.state?.compareByKey) ||
      compareByOptions[0],
    analyseBy: analyseByOptions[0],
    preBandScore: '',
    postBandScore: '',
  })
  const [showAddToGroupModal, setShowAddToGroupModal] = useState(false)
  const [selectedRowKeys, onSelectChange] = useState([])
  const [checkedStudents, setCheckedStudents] = useState([])

  // reset report component on every render
  useEffect(() => {
    resetPreVsPostReport()
  }, [])

  // get report data
  useEffect(() => {
    const q = {
      ...settings.requestFilters,
      ...ddfilter,
    }
    if (settings.requestFilters.termId || settings.requestFilters.reportId) {
      fetchReportSummaryDataRequest(q)
      return () => toggleFilter(null, false)
    }
  }, [settings.requestFilters])

  useEffect(() => {
    const q = {
      ...settings.requestFilters,
      ...ddfilter,
      compareBy: tableFilters.compareBy.key,
      preBandScore: tableFilters.preBandScore,
      postBandScore: tableFilters.postBandScore,
    }
    if (settings.requestFilters.termId || settings.requestFilters.reportId) {
      fetchPreVsPostReportTableDataRequest(q)
      return () => toggleFilter(null, false)
    }
  }, [
    settings.requestFilters,
    tableFilters.compareBy.key,
    tableFilters.preBandScore,
    tableFilters.postBandScore,
  ])

  // extract selected performance band from MARFilterData
  const bandInfo = useMemo(
    () => get(MARFilterData, 'data.result.bandInfo', []),
    [MARFilterData]
  )
  const selectedPerformanceBand = (
    bandInfo.find(
      (x) =>
        x._id === (sharedReportFilters || settings.requestFilters).profileId
    ) || bandInfo[0]
  )?.performanceBand

  useMemo(
    () => selectedPerformanceBand?.sort((a, b) => b.threshold - a.threshold),
    [selectedPerformanceBand]
  )

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
    const _testNamesData = getTestNamesFromTestMetrics(
      _testInfo,
      sharedReportFilters || settings.requestFilters
    )
    const _summaryData = getSummaryDataFromSummaryMetrics(_summaryMetricInfo)
    return {
      summaryMetricInfo: _summaryMetricInfo,
      ..._testNamesData,
      ..._summaryData,
    }
  }, [reportSummaryData, settings.requestFilters, sharedReportFilters])

  // get table data
  const tableData = useMemo(() => {
    const { metricInfo: _tableMetricInfo = [] } = reportTableData
    const _tableData = getTableData(
      _tableMetricInfo,
      selectedPerformanceBand,
      tableFilters.compareBy.key,
      preTestName,
      postTestName
    )
    return _tableData
  }, [
    reportTableData,
    selectedPerformanceBand,
    tableFilters.compareBy.key,
    preTestName,
    postTestName,
  ])

  // Handle add to student group
  const rowSelection = {
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
      setCheckedStudents(flag ? tableData.map((d) => d.id) : []),
  }

  const checkedStudentsForModal = tableData
    .filter((d) => checkedStudents.includes(d.studentId))
    .map(({ studentId, rowTitle, lastName, username }) => ({
      _id: studentId,
      firstName: rowTitle,
      lastName,
      username,
    }))

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
    if (userRole === roleuser.TEACHER) {
      _tableFilters.compareBy = compareByOptions.find(
        (c) => c.key === 'student'
      )
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

  if (loadingReportSummaryData || loadingReportTableData) {
    return (
      <SpinLoader
        tip="Please wait while we gather the required information..."
        position="fixed"
      />
    )
  }

  if (isEmpty(summaryMetricInfo)) {
    return (
      <NoDataContainer>
        {settings.requestFilters?.termId
          ? error.msg === 'InvalidTestIds'
            ? ''
            : 'No data available currently.'
          : ''}
      </NoDataContainer>
    )
  }

  if (error && error.dataSizeExceeded) {
    return <DataSizeExceeded />
  }
  return (
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
          <StyledH3 style={{ fontSize: '20px' }}>
            Pre vs Post Test Comparison
          </StyledH3>
        </Row>
        <Row type="flex">
          <StyledIconAlert fill={themeColor} />
          <span style={{ fontSize: '12px' }}>
            This report compares the student performance on the choosen two
            assessments.
            <br />
            <StyledSpan font="bold" color={fadedBlack}>
              Only students that have results for both assessments are included.
            </StyledSpan>
          </span>
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
        onMatrixCellClick={onMatrixCellClick}
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
