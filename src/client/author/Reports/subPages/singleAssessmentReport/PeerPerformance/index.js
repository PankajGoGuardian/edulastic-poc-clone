import { SpinLoader } from '@edulastic/common'
import { Col, Row } from 'antd'
import next from 'immer'
import PropTypes from 'prop-types'
import React, { useEffect, useMemo, useState } from 'react'
import { connect } from 'react-redux'
import { compose } from 'redux'
import { isEmpty, uniq } from 'lodash'

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
import { getCsvDownloadingState } from '../../../ducks'
import {
  getSAFFilterPerformanceBandProfiles,
  setPerformanceBandProfileAction,
} from '../common/filterDataDucks'
import { SignedStackedBarChartContainer } from './components/charts/signedStackedBarChartContainer'
import { SimpleStackedBarChartContainer } from './components/charts/simpleStackedBarChartContainer'
import { TableContainer, UpperContainer } from './components/styled'
import { PeerPerformanceTable } from './components/table/peerPerformanceTable'
import ExternalDemographicFilter from './components/ExternalDemographicFilter'
import {
  getPeerPerformanceRequestAction,
  getReportsPeerPerformance,
  getReportsPeerPerformanceLoader,
  getReportsPeerPerformanceError,
  resetPeerPerformanceAction,
} from './ducks'
import {
  parseAndNormalizeExtAttributes,
  idToName,
  parseData,
  createExtDemographicGroupedData,
} from './util/transformers'
import { getColumns } from './util/tableColumns'
import { getAssessmentName } from '../../../common/util'

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
  filters,
  sharedReport,
  setPerformanceBandProfile,
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
  const peerPerformance = useMemo(() => {
    const peerPerf = { ..._peerPerformance }
    if (peerPerf.metricInfo) {
      peerPerf.metricInfo = _peerPerformance.metricInfo?.map((mi) => {
        const extAttributes = parseAndNormalizeExtAttributes(mi.extAttributes)
        return { ...mi, extAttributes, ...extAttributes }
      })
    }
    return peerPerf
  }, [_peerPerformance])
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
      peerPerformance?.bandInfo?.performanceBand ||
      [],
    [settings.requestFilters, peerPerformance]
  )

  const [ddfilter, setDdFilter] = useState({
    ...filters,
    analyseBy: 'score(%)',
    compareBy: userRole === 'teacher' ? 'groupId' : 'schoolId',
  })
  const [chartFilter, setChartFilter] = useState({})

  const [extDemographicData, setExtDemographicData] = useState({})
  const [extDemogaphicFilters, setExtDemographicFilters] = useState([])

  useEffect(() => () => resetPeerPerformance(), [])

  useEffect(() => {
    setDdFilter({
      ...ddfilter,
      ...filters,
    })
  }, [filters])

  useEffect(() => {
    if (settings.selectedTest && settings.selectedTest.key) {
      const q = {
        requestFilters: { ...settings.requestFilters },
        testId: settings.selectedTest.key,
      }
      getPeerPerformance(q)
    }
    if (settings.requestFilters.termId || settings.requestFilters.reportId) {
      return () => toggleFilter(null, false)
    }
  }, [settings.selectedTest?.key, settings.requestFilters])

  useEffect(() => {
    setPerformanceBandProfile(peerPerformance?.bandInfo || {})
    setExtDemographicFilters([])
    if (
      (settings.requestFilters.termId || settings.requestFilters.reportId) &&
      !loading &&
      !isEmpty(peerPerformance) &&
      !peerPerformance.metricInfo.length
    ) {
      toggleFilter(null, true)
    }
  }, [peerPerformance])

  let { compareByDropDownData } = dropDownFormat
  compareByDropDownData = next(
    dropDownFormat.compareByDropDownData,
    (tempCompareBy) => {
      tempCompareBy.splice(3, 0, { key: 'group', title: 'Student Group' })
      if (userRole === 'teacher') {
        tempCompareBy.splice(0, 2)
      }
      const _extAttributes = uniq(
        peerPerformance.metricInfo
          ?.map((mi) => Object.keys(mi.extAttributes || {}))
          .flat()
          .sort()
      ).map((eA) => ({
        key: eA,
        title: idToName(eA),
      }))
      tempCompareBy.push(..._extAttributes)
    }
  )

  useEffect(() => {
    if (
      !compareByDropDownData.map((dd) => dd.key).includes(ddfilter.compareBy)
    ) {
      setDdFilter((prevDdFilter) => ({
        ...prevDdFilter,
        compareBy: compareByDropDownData[0].key,
      }))
    }
  }, [peerPerformance])

  const res = useMemo(() => ({ ...peerPerformance, bandInfo }), [
    peerPerformance,
    bandInfo,
  ])
  const parsedData = useMemo(() => {
    return {
      data: parseData(res, ddfilter, extDemogaphicFilters),
      columns: getColumns(ddfilter),
    }
  }, [res, ddfilter, extDemogaphicFilters])

  useEffect(() => {
    // External Demographic Filter data should be constructed after all filters are applied.
    if (!isEmpty(res.metricInfo)) {
      const extDemographicGroupedData = createExtDemographicGroupedData(
        res.metricInfo,
        ddfilter
      )
      setExtDemographicData(extDemographicGroupedData)
    }
  }, [res, ddfilter])

  const updateAnalyseByCB = (event, selected) => {
    setDdFilter({
      ...ddfilter,
      analyseBy: selected.key,
    })
    setChartFilter({})
  }

  const updateCompareByCB = (event, selected) => {
    setDdFilter({
      ...ddfilter,
      compareBy: selected.key,
    })
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
            <div>
              {ddfilter.analyseBy === 'score(%)' ||
              ddfilter.analyseBy === 'rawScore' ? (
                // simple stacked bar-chart
                <SimpleStackedBarChartContainer
                  data={parsedData.data}
                  analyseBy={ddfilter.analyseBy}
                  compareBy={ddfilter.compareBy}
                  filter={chartFilter}
                  assessmentName={assessmentName}
                  onBarClickCB={onBarClickCB}
                  onResetClickCB={onResetClickCB}
                  bandInfo={bandInfo}
                  role={userRole}
                />
              ) : (
                // signed stacked bar-chart
                <SignedStackedBarChartContainer
                  data={parsedData.data}
                  analyseBy={ddfilter.analyseBy}
                  compareBy={ddfilter.compareBy}
                  filter={chartFilter}
                  assessmentName={assessmentName}
                  onBarClickCB={onBarClickCB}
                  onResetClickCB={onResetClickCB}
                  bandInfo={bandInfo}
                  role={userRole}
                />
              )}
            </div>
          </StyledSignedBarContainer>
        </StyledCard>
      </UpperContainer>
      <TableContainer>
        <StyledCard>
          <PeerPerformanceTable
            isCsvDownloading={isCsvDownloading}
            columns={parsedData.columns}
            dataSource={parsedData.data}
            rowKey="compareBylabel"
            filter={chartFilter}
            analyseBy={ddfilter.analyseBy}
            compareBy={ddfilter.compareBy}
            assessmentName={assessmentName}
            bandInfo={bandInfo}
            role={userRole}
          />
        </StyledCard>
      </TableContainer>
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
    }
  )
)

export default enhance(PeerPerformance)

// -----|-----|-----|-----|-----| COMPONENT ENDED |-----|-----|-----|-----|----- //
