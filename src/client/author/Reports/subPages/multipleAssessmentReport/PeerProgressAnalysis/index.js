import { SpinLoader } from '@edulastic/common'
import { capitalize, get, head, isEmpty } from 'lodash'
import React, { useEffect, useState, useMemo } from 'react'
import { connect } from 'react-redux'
import { getUserRole } from '../../../../../student/Login/ducks'
import TableTooltipRow from '../../../common/components/tooltip/TableTooltipRow'
import DataSizeExceeded from '../../../common/components/DataSizeExceeded'
import { downloadCSV } from '../../../common/util'
import { NoDataContainer } from '../../../common/styled'
import { getCsvDownloadingState } from '../../../ducks'
import TrendStats from '../common/components/trend/TrendStats'
import TrendTable from '../common/components/trend/TrendTable'
import {
  compareByMap,
  getCompareByOptions,
  parseTrendData,
} from '../common/utils/trend'
import Filters from './components/table/Filters'
import {
  getPeerProgressAnalysisRequestAction,
  getReportsPeerProgressAnalysis,
  getReportsPeerProgressAnalysisLoader,
  getReportsPeerProgressAnalysisError,
} from './ducks'

import dropDownData from './static/json/dropDownData.json'

// -----|-----|-----|-----|-----| COMPONENT BEGIN |-----|-----|-----|-----|----- //

const options = [
  {
    key: 'race',
    title: 'Race',
  },
  {
    key: 'gender',
    title: 'Gender',
  },
  {
    key: 'ellStatus',
    title: 'ELL Status',
  },
  {
    key: 'iepStatus',
    title: 'IEP Status',
  },
  {
    key: 'frlStatus',
    title: 'FRL Status',
  },
]

const PeerProgressAnalysis = ({
  getPeerProgressAnalysisRequest,
  peerProgressAnalysis,
  isCsvDownloading,
  ddfilter,
  settings,
  loading,
  error,
  role,
  sharedReport,
  toggleFilter,
}) => {
  const userRole = useMemo(() => sharedReport?.sharedBy?.role || role, [
    sharedReport,
  ])
  const compareByData = [...getCompareByOptions(userRole), ...options]
  const [analyseBy, setAnalyseBy] = useState(head(dropDownData.analyseByData))
  const [compareBy, setCompareBy] = useState(head(compareByData))
  const [selectedTrend, setSelectedTrend] = useState('')
  // support for pagination from backend
  const [pageFilters, setPageFilters] = useState({
    page: 1,
    pageSize: 25,
  })

  useEffect(() => {
    setPageFilters({ ...pageFilters, page: 1 })
  }, [settings, ddfilter, compareBy.key])

  useEffect(() => {
    const { termId, reportId } = settings.requestFilters
    if (termId || reportId) {
      getPeerProgressAnalysisRequest({
        compareBy: compareBy.key,
        ...settings.requestFilters,
        ...ddfilter,
        ...pageFilters,
      })
    }
  }, [pageFilters])

  const { metricInfo = [], metaInfo = [], testsCount = 0 } = useMemo(
    () => get(peerProgressAnalysis, 'data.result', {}),
    [peerProgressAnalysis]
  )

  useEffect(() => {
    const metrics = get(peerProgressAnalysis, 'data.result.metricInfo', [])
    if (
      (settings.requestFilters.termId || settings.requestFilters.reportId) &&
      !loading &&
      !metrics.length
    ) {
      toggleFilter(null, true)
    }
  }, [peerProgressAnalysis])

  const [parsedData, trendCount] = parseTrendData(
    metricInfo,
    compareBy.key,
    metaInfo,
    selectedTrend
  )

  const onTrendSelect = (trend) =>
    setSelectedTrend(trend === selectedTrend ? '' : trend)
  const onFilterChange = (key, selectedItem) => {
    switch (key) {
      case 'compareBy':
        setCompareBy(selectedItem)
        break
      case 'analyseBy':
        setAnalyseBy(selectedItem)
        break
      default:
    }
  }

  const onCsvConvert = (data) => downloadCSV(`Peer Progress.csv`, data)

  if (loading) {
    return <SpinLoader position="fixed" />
  }

  if (isEmpty(metricInfo)) {
    return <NoDataContainer>No data available currently.</NoDataContainer>
  }

  if (error && error.dataSizeExceeded) {
    return <DataSizeExceeded />
  }

  const studentColumn = {
    key: 'studentCount',
    title: 'Student#',
    className: 'studentCount',
    align: 'center',
    width: 70,
    dataIndex: 'studentCount',
  }

  return (
    <>
      <TrendStats
        heading="Distribution of student subgroup as per progress trend ?"
        trendCount={trendCount}
        selectedTrend={selectedTrend}
        onTrendSelect={onTrendSelect}
        renderFilters={() => (
          <Filters
            compareByOptions={compareByData}
            onFilterChange={onFilterChange}
            compareBy={compareBy}
            analyseBy={analyseBy}
          />
        )}
      />
      <TrendTable
        onCsvConvert={onCsvConvert}
        isCsvDownloading={isCsvDownloading}
        heading="How well are student sub-groups progressing ?"
        data={parsedData}
        compareBy={compareBy}
        analyseBy={analyseBy}
        ddfilter={ddfilter}
        rawMetric={metricInfo}
        customColumns={[studentColumn]}
        backendPagination={{
          ...pageFilters,
          itemsCount: testsCount,
        }}
        setBackendPagination={setPageFilters}
        toolTipContent={(record) => (
          <>
            <TableTooltipRow
              title="Student Count: "
              value={record.studentCount}
            />
            <TableTooltipRow
              title={`${capitalize(compareBy.title)} : `}
              value={record[compareByMap[compareBy.key]] || '-'}
            />
          </>
        )}
      />
    </>
  )
}

const enhance = connect(
  (state) => ({
    peerProgressAnalysis: getReportsPeerProgressAnalysis(state),
    loading: getReportsPeerProgressAnalysisLoader(state),
    error: getReportsPeerProgressAnalysisError(state),
    role: getUserRole(state),
    isCsvDownloading: getCsvDownloadingState(state),
  }),
  {
    getPeerProgressAnalysisRequest: getPeerProgressAnalysisRequestAction,
  }
)

export default enhance(PeerProgressAnalysis)

// -----|-----|-----|-----|-----| COMPONENT ENDED |-----|-----|-----|-----|----- //
