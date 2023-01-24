import React, { useEffect, useMemo, useState } from 'react'
import { get, isEmpty, mapValues } from 'lodash'
import { connect } from 'react-redux'
import { notification, SpinLoader } from '@edulastic/common'
import { Row } from 'antd'
import { roleuser } from '@edulastic/constants'
import PreVsPostTable from './components/Table'
import { getSummaryData, getTableData } from './utils'
import dropDownData from './static/dropDownData.json'
import PreVsPostMatrix from './components/Matrix'
import SummaryContainer from './components/SummaryContainer'
import PreVsPostLegend from './components/Legend'
import { actions, selectors } from './ducks'
import { NoDataContainer, StyledCard, StyledH3 } from '../../../common/styled'
import DataSizeExceeded from '../../../common/components/DataSizeExceeded'
import { getUserRole } from '../../../../src/selectors/user'
import AddToGroupModal from '../../../common/components/Popups/AddToGroupModal'
import FeaturesSwitch from '../../../../../features/components/FeaturesSwitch'
import { getCsvDownloadingState } from '../../../ducks'

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
  const compareByDataFiltered = compareByOptions.filter(
    (option) => !option.hiddenFromRole?.includes(userRole)
  )

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
  const sharedReportFilters = useMemo(
    () =>
      sharedReport?._id
        ? { ...sharedReport.filters, reportId: sharedReport._id }
        : null,
    [sharedReport]
  )
  const summaryData = useMemo(() => get(reportSummaryData, 'metricInfo'), [
    reportSummaryData,
  ])
  //   useEffect(() => resetPreVsPostReport())
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
  const bandInfo = get(MARFilterData, 'data.result.bandInfo', [])
  const selectedPerformanceBand = (
    bandInfo.find(
      (x) =>
        x._id === (sharedReportFilters || settings.requestFilters).profileId
    ) || bandInfo[0]
  )?.performanceBand
  selectedPerformanceBand?.sort((a, b) => b.threshold - a.threshold)
  const { metricInfo = [] } = useMemo(() => reportTableData, [reportTableData])
  const preTestName = get(settings, 'tagsData.preTestId.title')
  const postTestName = get(settings, 'tagsData.postTestId.title')
  const { tableData, totalStudents } = useMemo(
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
    ]
  )
  const summary = getSummaryData(summaryData)

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

  if (isEmpty(summaryData)) {
    return (
      <NoDataContainer>
        {settings.requestFilters?.termId ? 'No data available currently.' : ''}
      </NoDataContainer>
    )
  }

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
            This report compares the student performance on the chosen two
            assessments.
            <br />
            Only students that have results for both assessments are included.
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
        matrixData={summaryData}
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
