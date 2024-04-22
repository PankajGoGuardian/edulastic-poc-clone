import { SpinLoader, EduIf, EduElse, EduThen } from '@edulastic/common'
import { Col, Row, Pagination } from 'antd'
import qs from 'qs'
import next from 'immer'
import { isEmpty } from 'lodash'
import PropTypes from 'prop-types'
import React, { useEffect, useMemo, useRef, useState } from 'react'
import { connect } from 'react-redux'
import { compose } from 'redux'
import { report as reportTypes, reportUtils } from '@edulastic/constants'

import { getUserRole } from '../../../../src/selectors/user'
import { ControlDropDown } from '../../../common/components/widgets/controlDropDown'
import dropDownFormat from '../../../common/static/json/dropDownFormat.json'
import {
  StyledCard,
  StyledH3,
  StyledSignedBarContainer,
  NoDataContainer,
  StyledDropDownContainer,
} from '../../../common/styled'
import DataSizeExceeded from '../../../common/components/DataSizeExceeded'
import { generateCSVAction, getCsvDownloadingState } from '../../../ducks'
import {
  getSAFFilterPerformanceBandProfiles,
  setPerformanceBandProfileAction,
} from '../common/filterDataDucks'
import { SignedStackedBarChartContainer } from './components/charts/signedStackedBarChartContainer'
import { SimpleStackedBarChartContainer } from './components/charts/simpleStackedBarChartContainer'
import { TableContainer, UpperContainer } from './components/styled'
import PeerPerformanceTable from './components/table/peerPerformanceTable'
import ExternalDemographicFilter from './components/ExternalDemographicFilter'
import {
  getPeerPerformanceRequestAction,
  getReportsPeerPerformance,
  getReportsPeerPerformanceLoader,
  getReportsPeerPerformanceError,
  resetPeerPerformanceAction,
} from './ducks'
import {
  idToName,
  compareByKeyMaps,
  sortKeyMaps,
  sortOrderMap,
  transformExtAttributes,
  transformExtAttributeFilters,
  getFormattedName,
  extAttributeIdToName,
} from './util/transformers'
import { getAssessmentName } from '../../../common/util'
import { TABLE_PAGINATION_STYLE } from '../../../../../common/styled'

const {
  analyseByOptions,
  transformData,
  getColumns,
} = reportUtils.peerPerformance

const pageSize = 200
// -----|-----|-----|-----|-----| COMPONENT BEGIN |-----|-----|-----|-----|----- //

const PeerPerformance = ({
  loading,
  error,
  isCsvDownloading,
  role,
  performanceBandProfiles,
  peerPerformance: _peerPerformance,
  getPeerPerformance,
  resetPeerPerformance,
  settings,
  location,
  demographicFilters,
  setAdditionalUrlParams,
  sharedReport,
  setPerformanceBandProfile,
  toggleFilter,
  generateCSV,
}) => {
  const urlSearch = qs.parse(location.search, {
    ignoreQueryPrefix: true,
    indices: true,
  })
  const [userRole, sharedReportFilters] = useMemo(
    () => [
      sharedReport?.sharedBy?.role || role,
      sharedReport?._id
        ? { ...sharedReport.filters, reportId: sharedReport._id }
        : null,
    ],
    [sharedReport]
  )
  const [ddfilter, setDdFilter] = useState({
    analyseBy: urlSearch.analyseBy || analyseByOptions.scorePerc,
    compareBy: urlSearch?.compareBy
      ? urlSearch.compareBy
      : userRole === 'teacher'
      ? 'class'
      : 'school',
  })
  const [chartFilter, setChartFilter] = useState({})
  const [pageNo, setPageNo] = useState(Number(urlSearch.pageNo) || 1)
  const [sortKey, setSortKey] = useState(
    urlSearch.sortKey || sortKeyMaps.DIM_SCORE_PERC
  )
  const [sortOrder, setSortOrder] = useState(urlSearch.sortOrder || undefined)
  const [extDemographicData, setExtDemographicData] = useState({})
  const [extDemogaphicFilters, setExtDemographicFilters] = useState([])
  const [chartBackNavigation, setChartBackNavigation] = useState(false)
  const _firstLoadRef = useRef(true)

  useEffect(() => () => resetPeerPerformance(), [])

  const onSetPageNo = (value) => {
    setAdditionalUrlParams((oldState) => ({
      ...oldState,
      pageNo: value,
    }))
    setPageNo(value)
  }
  const onSetSortKey = (value) => {
    setAdditionalUrlParams((oldState) => ({
      ...oldState,
      sortKey: value,
    }))
    setSortKey(value)
  }
  const onSetSortOrder = (value) => {
    setAdditionalUrlParams((oldState) => ({
      ...oldState,
      sortOrder: value,
    }))
    setSortOrder(value)
  }

  const fetPeerPerformanceData = (recompute) => {
    const q = {
      requestFilters: {
        ...settings.requestFilters,
        ...demographicFilters,
        externalAttributes: transformExtAttributeFilters(extDemogaphicFilters),
        compareBy: ddfilter.compareBy,
        analyzeBy: ddfilter.analyseBy,
        sortKey,
        sortOrder: sortOrderMap[sortOrder],
        page: pageNo,
        pageSize,
        recompute,
      },
      testId: settings.selectedTest.key,
    }
    getPeerPerformance(q)
    _firstLoadRef.current = false
  }

  useEffect(() => {
    if (settings.selectedTest && settings.selectedTest.key) {
      fetPeerPerformanceData(_firstLoadRef.current)
    }
  }, [ddfilter.analyseBy, pageNo, extDemogaphicFilters, sortKey, sortOrder])

  useEffect(() => {
    if (settings.selectedTest && settings.selectedTest.key) {
      fetPeerPerformanceData(true)
    }
    if (settings.requestFilters.termId || settings.requestFilters.reportId) {
      return () => toggleFilter(null, false)
    }
  }, [settings.selectedTest?.key, settings.requestFilters, ddfilter.compareBy])

  useEffect(() => {
    setPerformanceBandProfile(_peerPerformance?.bandInfo || {})
    if (
      (settings.requestFilters.termId || settings.requestFilters.reportId) &&
      !loading &&
      !isEmpty(_peerPerformance) &&
      !_peerPerformance.metricInfo.length
    ) {
      toggleFilter(null, true)
    }
  }, [_peerPerformance])

  useEffect(() => {
    if (_peerPerformance?.extAttributes) {
      setExtDemographicData(
        transformExtAttributes(_peerPerformance?.extAttributes)
      )
    }
  }, [_peerPerformance, ddfilter, loading])

  const [peerPerformance, transformedData] = useMemo(() => {
    const peerPerf = { ..._peerPerformance }
    const _transformedData = transformData(
      ddfilter,
      _peerPerformance?.bandInfo,
      _peerPerformance?.metricInfo
    )
    return [peerPerf, _transformedData]
  }, [_peerPerformance, ddfilter, loading])
  const assessmentName = getAssessmentName(
    peerPerformance?.meta?.test || settings.selectedTest
  )

  const bandInfo = useMemo(
    () =>
      performanceBandProfiles.find(
        (profile) =>
          profile._id ===
          (sharedReportFilters || settings.requestFilters).profileId
      )?.performanceBand ||
      _peerPerformance?.bandInfo?.performanceBand ||
      [],
    [settings.requestFilters, _peerPerformance]
  )

  const compareByDropDownData = useMemo(() => {
    let _compareByDropDownData = [...compareByKeyMaps]
    _compareByDropDownData = next(_compareByDropDownData, (tempCompareBy) => {
      if (userRole === 'teacher') {
        tempCompareBy.splice(0, 2)
      }
      if (_peerPerformance.extAttributes) {
        const keysAndTitles = _peerPerformance.extAttributes.map((obj) => ({
          key: `extAttr_${obj?.name}`,
          title: extAttributeIdToName[obj?.name] || getFormattedName(obj?.name),
        }))
        if (keysAndTitles?.length) {
          tempCompareBy.push(...keysAndTitles)
        }
      }
    })
    return _compareByDropDownData
  }, [userRole, _peerPerformance.extAttributes])

  useEffect(() => {
    if (
      !compareByDropDownData.map((dd) => dd.key).includes(ddfilter.compareBy)
    ) {
      setAdditionalUrlParams((prevDdFilter) => ({
        ...prevDdFilter,
        compareBy: compareByDropDownData[0].key,
      }))
      setDdFilter((prevDdFilter) => ({
        ...prevDdFilter,
        compareBy: compareByDropDownData[0].key,
      }))
    }
  }, [peerPerformance])
  const parsedData = useMemo(() => {
    return {
      columns: getColumns(ddfilter, bandInfo),
    }
  }, [ddfilter, bandInfo])
  const updateAnalyseByCB = (event, selected) => {
    setAdditionalUrlParams((prevDdFilter) => ({
      ...prevDdFilter,
      analyseBy: selected.key,
    }))
    setDdFilter({
      ...ddfilter,
      analyseBy: selected.key,
    })
    onSetPageNo(1)
    setChartFilter({})
  }

  const updateCompareByCB = (event, selected) => {
    setAdditionalUrlParams((prevDdFilter) => ({
      ...prevDdFilter,
      compareBy: selected.key,
    }))
    setDdFilter({
      ...ddfilter,
      compareBy: selected.key,
    })
    onSetPageNo(1)
    setChartFilter({})
  }

  const onBarClickCB = (key) => {
    const _chartFilter = { ...chartFilter }
    if (_chartFilter[key]) {
      delete _chartFilter[key]
    } else {
      _chartFilter[key] = true
    }
    setChartFilter(_chartFilter)
  }

  const updateExtDemographicFilters = (filterData) => {
    setExtDemographicFilters(filterData)
  }

  const onResetClickCB = () => {
    setChartFilter({})
  }

  const generateCSVRequired = useMemo(
    () => [(peerPerformance?.totalRows || 0) > pageSize].some(Boolean),
    [peerPerformance.totalRows]
  )

  useEffect(() => {
    if (isCsvDownloading && generateCSVRequired) {
      const params = {
        reportType: reportTypes.reportNavType.PEER_PERFORMANCE,
        reportFilters: {
          ...settings.requestFilters,
          ...demographicFilters,
          externalAttributes: transformExtAttributeFilters(
            extDemogaphicFilters
          ),
          compareBy: ddfilter.compareBy,
          analyzeBy: ddfilter.analyseBy,
          sortKey,
          sortOrder: sortOrderMap[sortOrder],
          testId: settings.selectedTest.key,
        },
        reportExtras: {},
      }
      generateCSV(params)
    }
  }, [isCsvDownloading])

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

  if (!peerPerformance?.metricInfo?.length || !settings.selectedTest.key) {
    return (
      <NoDataContainer>
        {settings.requestFilters?.termId ? 'No data available currently.' : ''}
      </NoDataContainer>
    )
  }
  const chartProps = {
    setPageNo: onSetPageNo,
    pageNo,
    tablePageSize: pageSize,
    totalRows: peerPerformance.totalRows,
    chartBackNavigation,
    setChartBackNavigation,
    carousel: true,
  }

  return (
    <div>
      <UpperContainer>
        <StyledCard>
          <StyledSignedBarContainer>
            <Row type="flex" justify="start">
              <Col xs={24} sm={24} md={12} lg={8} xl={12}>
                <StyledH3 data-testid="barChart">
                  Assessment Performance by {idToName(ddfilter.compareBy)} |{' '}
                  {assessmentName}
                </StyledH3>
              </Col>
              <Col
                className="dropdown-container"
                xs={24}
                sm={24}
                md={12}
                lg={8}
                xl={12}
              >
                <Row className="control-dropdown-row" style={{ flex: 1 }}>
                  <StyledDropDownContainer
                    data-cy="external-demographic-filter"
                    xs={24}
                    sm={24}
                    md={8}
                    lg={8}
                    xl={8}
                  >
                    {!isEmpty(extDemographicData) && (
                      <ExternalDemographicFilter
                        extDemographicData={extDemographicData}
                        updateFilters={updateExtDemographicFilters}
                        extDemogaphicFilters={extDemogaphicFilters}
                      />
                    )}
                  </StyledDropDownContainer>
                  <StyledDropDownContainer
                    data-cy="analyzeBy"
                    xs={24}
                    sm={24}
                    md={8}
                    lg={8}
                    xl={8}
                  >
                    <ControlDropDown
                      prefix="Analyze by"
                      by={ddfilter.analyseBy}
                      selectCB={updateAnalyseByCB}
                      data={dropDownFormat.analyseByDropDownData}
                    />
                  </StyledDropDownContainer>
                  <StyledDropDownContainer
                    data-cy="compareBy"
                    xs={24}
                    sm={24}
                    md={8}
                    lg={8}
                    xl={8}
                  >
                    <ControlDropDown
                      prefix="Compare by"
                      style={{ marginLeft: 8 }}
                      by={ddfilter.compareBy}
                      selectCB={updateCompareByCB}
                      data={compareByDropDownData}
                    />
                  </StyledDropDownContainer>
                </Row>
              </Col>
            </Row>
            <EduIf condition={!loading && !error}>
              <EduThen>
                <div>
                  <EduIf
                    condition={
                      ddfilter.analyseBy === analyseByOptions.scorePerc ||
                      ddfilter.analyseBy === analyseByOptions.rawScore
                    }
                  >
                    <EduThen>
                      <SimpleStackedBarChartContainer
                        data={transformedData}
                        analyseBy={ddfilter.analyseBy}
                        compareBy={ddfilter.compareBy}
                        filter={chartFilter}
                        assessmentName={assessmentName}
                        onBarClickCB={onBarClickCB}
                        onResetClickCB={onResetClickCB}
                        role={userRole}
                        chartProps={chartProps}
                      />
                    </EduThen>
                    <EduElse>
                      <SignedStackedBarChartContainer
                        data={transformedData}
                        analyseBy={ddfilter.analyseBy}
                        compareBy={ddfilter.compareBy}
                        filter={chartFilter}
                        assessmentName={assessmentName}
                        onBarClickCB={onBarClickCB}
                        onResetClickCB={onResetClickCB}
                        bandInfo={bandInfo}
                        role={userRole}
                        chartProps={chartProps}
                      />
                    </EduElse>
                  </EduIf>
                </div>
              </EduThen>
              <EduElse>
                <NoDataContainer>
                  No data available for selected option
                </NoDataContainer>
              </EduElse>
            </EduIf>
          </StyledSignedBarContainer>
        </StyledCard>
      </UpperContainer>
      <EduIf condition={!loading && !error}>
        <TableContainer>
          <StyledCard>
            <PeerPerformanceTable
              isCsvDownloading={generateCSVRequired ? false : isCsvDownloading}
              columns={parsedData.columns}
              dataSource={transformedData}
              rowKey={(_, i) => `compareBylabel-${i}`}
              filter={chartFilter}
              analyseBy={ddfilter.analyseBy}
              compareBy={ddfilter.compareBy}
              assessmentName={assessmentName}
              bandInfo={bandInfo}
              role={userRole}
              setSortKey={onSetSortKey}
              setSortOrder={onSetSortOrder}
              sortKey={sortKey}
              sortOrder={sortOrder}
              setPageNo={onSetPageNo}
            />
            <EduIf condition={peerPerformance.totalRows > pageSize}>
              <Pagination
                style={TABLE_PAGINATION_STYLE}
                onChange={onSetPageNo}
                current={pageNo}
                pageSize={pageSize}
                total={peerPerformance.totalRows}
              />
            </EduIf>
          </StyledCard>
        </TableContainer>
      </EduIf>
    </div>
  )
}

const reportPropType = PropTypes.shape({
  districtAvg: PropTypes.number,
  districtAvgPerf: PropTypes.number,
  metricInfo: PropTypes.array,
  studentGroupInfo: PropTypes.array,
})

PeerPerformance.propTypes = {
  loading: PropTypes.bool.isRequired,
  isCsvDownloading: PropTypes.bool.isRequired,
  role: PropTypes.string.isRequired,
  peerPerformance: reportPropType.isRequired,
  performanceBandProfiles: PropTypes.array.isRequired,
  getPeerPerformance: PropTypes.func.isRequired,
  settings: PropTypes.object.isRequired,
}

const enhance = compose(
  connect(
    (state) => ({
      loading: getReportsPeerPerformanceLoader(state),
      error: getReportsPeerPerformanceError(state),
      isCsvDownloading: getCsvDownloadingState(state),
      role: getUserRole(state),
      performanceBandProfiles: getSAFFilterPerformanceBandProfiles(state),
      peerPerformance: getReportsPeerPerformance(state),
    }),
    {
      getPeerPerformance: getPeerPerformanceRequestAction,
      resetPeerPerformance: resetPeerPerformanceAction,
      setPerformanceBandProfile: setPerformanceBandProfileAction,
      generateCSV: generateCSVAction,
    }
  )
)

export default enhance(PeerPerformance)

// -----|-----|-----|-----|-----| COMPONENT ENDED |-----|-----|-----|-----|----- //
