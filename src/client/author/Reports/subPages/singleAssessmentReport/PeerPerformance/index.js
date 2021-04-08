import { SpinLoader } from '@edulastic/common'
import { Col, Row } from 'antd'
import next from 'immer'
import PropTypes from 'prop-types'
import React, { useEffect, useMemo, useState } from 'react'
import { connect } from 'react-redux'
import { compose } from 'redux'
import { isEmpty } from 'lodash'

import { getUserRole } from '../../../../src/selectors/user'
import { ControlDropDown } from '../../../common/components/widgets/controlDropDown'
import dropDownFormat from '../../../common/static/json/dropDownFormat.json'
import {
  StyledCard,
  StyledH3,
  StyledSignedBarContainer,
  NoDataContainer,
} from '../../../common/styled'
import DataSizeExceeded from '../../../common/components/DataSizeExceeded'
import { getCsvDownloadingState, getTestListSelector } from '../../../ducks'
import {
  getSAFFilterPerformanceBandProfiles,
  setPerformanceBandProfileAction,
} from '../common/filterDataDucks'
import { SignedStackedBarChartContainer } from './components/charts/signedStackedBarChartContainer'
import { SimpleStackedBarChartContainer } from './components/charts/simpleStackedBarChartContainer'
import { TableContainer, UpperContainer } from './components/styled'
import { PeerPerformanceTable } from './components/table/peerPerformanceTable'
import {
  getPeerPerformanceRequestAction,
  getReportsPeerPerformance,
  getReportsPeerPerformanceLoader,
  getReportsPeerPerformanceError,
  resetPeerPerformanceAction,
} from './ducks'
import columns from './static/json/tableColumns.json'
import { idToName, parseData } from './util/transformers'

// -----|-----|-----|-----|-----| COMPONENT BEGIN |-----|-----|-----|-----|----- //

const PeerPerformance = ({
  loading,
  error,
  isCsvDownloading,
  role,
  performanceBandProfiles,
  peerPerformance,
  getPeerPerformance,
  resetPeerPerformance,
  settings,
  testList,
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
  const selectedTest = testList.find(
    (t) => t._id === settings.selectedTest.key
  ) || { _id: '', title: '' }
  const assessmentName = `${
    selectedTest.title
  } (ID:${selectedTest._id.substring(selectedTest._id.length - 5)})`

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
  }, [settings.selectedTest, settings.requestFilters])

  useEffect(() => {
    setPerformanceBandProfile(peerPerformance?.bandInfo || {})
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
    }
  )

  const getColumns = () =>
    columns.columns[ddfilter.analyseBy][
      ddfilter.compareBy === 'group' ? 'groupId' : ddfilter.compareBy
    ]

  const res = { ...peerPerformance, bandInfo }
  const parsedData = useMemo(() => {
    return {
      data: parseData(res, ddfilter),
      columns: getColumns(),
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
    return <NoDataContainer>No data available currently.</NoDataContainer>
  }
  return (
    <div>
      <UpperContainer>
        <StyledCard>
          <StyledSignedBarContainer>
            <Row type="flex" justify="start">
              <Col xs={24} sm={24} md={12} lg={8} xl={12}>
                <StyledH3>
                  Assessment Performance by {idToName[ddfilter.compareBy]} |{' '}
                  {assessmentName}
                </StyledH3>
              </Col>
              <Col
                className="dropdown-container"
                xs={24}
                sm={24}
                md={12}
                lg={16}
                xl={12}
              >
                <ControlDropDown
                  prefix="Analyze by"
                  by={ddfilter.analyseBy}
                  selectCB={updateAnalyseByCB}
                  data={dropDownFormat.analyseByDropDownData}
                />
                <ControlDropDown
                  prefix="Compare by"
                  style={{ marginLeft: 8 }}
                  by={ddfilter.compareBy}
                  selectCB={updateCompareByCB}
                  data={compareByDropDownData}
                />
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
      testList: getTestListSelector(state),
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
