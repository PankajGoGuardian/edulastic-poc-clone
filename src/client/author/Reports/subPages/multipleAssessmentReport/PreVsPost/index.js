import React, { useEffect, useMemo, useState } from 'react'
import { get, isEmpty, mapValues } from 'lodash'
import { connect } from 'react-redux'
import { Row } from 'antd'

import { notification, SpinLoader } from '@edulastic/common'
import { roleuser } from '@edulastic/constants'

import { NoDataContainer, StyledCard, StyledH3 } from '../../../common/styled'
import FeaturesSwitch from '../../../../../features/components/FeaturesSwitch'
import DataSizeExceeded from '../../../common/components/DataSizeExceeded'
import AddToGroupModal from '../../../common/components/Popups/AddToGroupModal'
import PreVsPostMatrix from './components/Matrix'
import SummaryContainer from './components/SummaryContainer'
import PreVsPostTable from './components/Table'
import PreVsPostLegend from './components/Legend'

import { getUserRole } from '../../../../src/selectors/user'
import { getCsvDownloadingState } from '../../../ducks'
import { actions, selectors } from './ducks'

import dropDownData from './static/dropDownData.json'
import { getSummaryData, getTableData } from './utils'
import { StyledSpan } from './common/styled'

const { compareByOptions, analyseByOptions } = dropDownData

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

  const compareByDataFiltered = compareByOptions.filter(
    (option) => !option.hiddenFromRole?.includes(userRole)
  )

  // define states used in the report
  const [tableFilters, setTableFilters] = useState({
    compareBy:
      compareByDataFiltered.find(
        (o) => o.key === location?.state?.compareByKey
      ) || compareByDataFiltered[0],
    analyseBy: analyseByOptions[0],
  })
  const [cellBandInfo, setCellBandInfo] = useState({
    preBandScore: null,
    postBandScore: null,
  })
  const [showAddToGroupModal, setShowAddToGroupModal] = useState(false)
  const [selectedRowKeys, onSelectChange] = useState([])
  const [checkedStudents, setCheckedStudents] = useState([])

  // get report data
  useEffect(() => {
    const q = { ...settings.requestFilters, ...ddfilter }
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
    }
    if (settings.requestFilters.termId || settings.requestFilters.reportId) {
      fetchPreVsPostReportTableDataRequest(q)
      return () => toggleFilter(null, false)
    }
  }, [settings.requestFilters, tableFilters.compareBy])

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

  // get summary data
  const { summaryInfo, testInfo } = useMemo(() => {
    const summaryData = get(reportSummaryData, 'metricInfo', [])
    const testData = get(reportSummaryData, 'testInfo', [])
    return { summaryInfo: summaryData, testInfo: testData }
  }, [reportSummaryData])
  const { summary, preTestName, postTestName } = useMemo(
    () =>
      getSummaryData(
        summaryInfo,
        testInfo,
        sharedReportFilters || settings.requestFilters
      ),
    [summaryInfo, testInfo, settings.requestFilters, sharedReportFilters]
  )

  // get table data
  const { metricInfo = [] } = useMemo(() => reportTableData, [reportTableData])
  const { tableData } = useMemo(
    () =>
      getTableData(
        metricInfo,
        selectedPerformanceBand,
        tableFilters.compareBy.key,
        preTestName,
        postTestName,
        cellBandInfo,
        userRole
      ),
    [
      metricInfo,
      settings.requestFilters,
      cellBandInfo,
      tableFilters.compareBy,
      selectedPerformanceBand,
      userRole,
      preTestName,
      postTestName,
    ]
  )

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

  // Handle on matrix cell click
  const onCellClick = (preBandScore, postBandScore) => () => {
    if (userRole === roleuser.TEACHER) {
      setTableFilters({
        ...tableFilters,
        compareBy: { key: 'student', title: 'Student' },
      })
    }
    setCellBandInfo({ preBandScore, postBandScore })
  }

  if (loadingReportSummaryData || loadingReportTableData) {
    return (
      <SpinLoader
        tip="Please wait while we gather the required information..."
        position="fixed"
      />
    )
  }

  if (isEmpty(summaryInfo)) {
    return (
      <NoDataContainer>
        {settings.requestFilters?.termId ? 'No data available currently.' : ''}
      </NoDataContainer>
    )
  }

  if (error && error.dataSizeExceeded) {
    return <DataSizeExceeded />
  }
  return (
    <>
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
      <StyledCard style={{ marginTop: '-60px', width: '50%' }}>
        <Row type="flex" justify="start">
          <StyledH3 style={{ fontSize: '20px' }}>
            Pre vs Post Test Comparison
          </StyledH3>
        </Row>
        <Row>
          <span data-testid="description">
            This report compares the student performance on {preTestName} and{' '}
            {postTestName}.
            <br />
            <StyledSpan font="bold" color="#383838">
              Only students that have results for both assessments are included.
            </StyledSpan>
          </span>
        </Row>
      </StyledCard>
      <PreVsPostLegend selectedPerformanceBand={selectedPerformanceBand} />
      <SummaryContainer
        overallProficiency={summary}
        preTestName={preTestName}
        postTestName={postTestName}
      />
      <PreVsPostMatrix
        matrixData={summaryInfo}
        selectedPerformanceBand={selectedPerformanceBand}
        preTestName={preTestName}
        postTestName={postTestName}
        onCellClick={onCellClick}
      />
      <PreVsPostTable
        dataSource={tableData}
        selectedTableFilters={tableFilters}
        selectedPerformanceBand={selectedPerformanceBand}
        compareByOptions={compareByDataFiltered}
        analyseByOptions={analyseByOptions}
        rowSelection={rowSelection}
        setTableFilters={setTableFilters}
        setCellBandInfo={setCellBandInfo}
        isCsvDownloading={isCsvDownloading}
        handleAddToGroupClick={handleAddToGroupClick}
      />
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
