import React, { useState, useEffect, useMemo } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { compose } from 'redux'
import { withNamespaces } from '@edulastic/localization'
import { Row, Col } from 'antd'
import { Redirect } from 'react-router-dom'
import qs from 'qs'
import { get, isEmpty } from 'lodash'

// components
import { report as reportTypes, reportUtils } from '@edulastic/constants'
import { EduButton, SpinLoader, notification } from '@edulastic/common'
import { IconPlusCircle } from '@edulastic/icons'

import { ABSENT } from '@edulastic/constants/const/testActivityStatus'
import CsvTable from '../../../common/components/tables/CsvTable'
import { StyledH3, StyledCard, NoDataContainer } from '../../../common/styled'
import {
  UpperContainer,
  StyledDropDownContainer,
  StyledTable,
  StyledCharWrapper,
} from './components/styled'
import DataSizeExceeded from '../../../common/components/DataSizeExceeded'
import { ControlDropDown } from '../../../common/components/widgets/controlDropDown'
import SimpleBarChartContainer from './components/charts/SimpleBarChartContainer'
import AddToGroupModal from '../../../common/components/Popups/AddToGroupModal'
import FeaturesSwitch from '../../../../../features/components/FeaturesSwitch'
import PerformanceBandPieChart from './components/charts/StudentPerformancePie'

// ducks & helpers
import {
  getPerformanceByStudentsRequestAction,
  getReportsPerformanceByStudents,
  getReportsPerformanceByStudentsLoader,
  getReportsPerformanceByStudentsError,
  resetPerformanceByStudentsAction,
} from './ducks'
import { getUserRole } from '../../../../../student/Login/ducks'
import { getCsvDownloadingState, generateCSVAction } from '../../../ducks'
import { setPerformanceBandProfileAction } from '../common/filterDataDucks'

import { getColumns } from './util/transformers'
import { getAssessmentName } from '../../../common/util'

const { downloadCSV } = reportUtils.common

const {
  getProficiencyBandData,
  parseData,
  getTableData,
} = reportUtils.performanceByStudents

const onCsvConvert = (data) => downloadCSV(`Performance by Students.csv`, data)

const PerformanceByStudents = ({
  loading,
  error,
  isCsvDownloading,
  role,
  performanceByStudents,
  getPerformanceByStudents,
  resetPerformanceByStudents,
  settings,
  location = { pathname: '' },
  pageTitle,
  demographicFilters,
  t,
  customStudentUserId,
  isCliUser,
  sharedReport,
  setPerformanceBandProfile,
  toggleFilter,
  generateCSV,
}) => {
  const [userRole, isSharedReport] = useMemo(
    () => [sharedReport?.sharedBy?.role || role, !!sharedReport?._id],
    [sharedReport]
  )
  const assessmentName = getAssessmentName(
    performanceByStudents?.meta?.test || settings.selectedTest
  )

  const { res, proficiencyBandData } = useMemo(() => {
    const bandInfo = get(performanceByStudents, 'bandInfo.performanceBand', [])
    return {
      res: { ...performanceByStudents, bandInfo },
      proficiencyBandData: getProficiencyBandData(bandInfo),
    }
  }, [performanceByStudents])

  const generateCSVRequired = error && error.dataSizeExceeded

  const [showAddToGroupModal, setShowAddToGroupModal] = useState(false)
  const [selectedProficiency, setProficiency] = useState(proficiencyBandData[0])
  const [selectedRowKeys, onSelectChange] = useState([])
  const [checkedStudents, setCheckedStudents] = useState({})
  const [range, setRange] = useState({
    left: '',
    right: '',
  })
  const [pagination, setPagination] = useState({
    defaultPageSize: 50,
    current: 0,
  })

  useEffect(() => () => resetPerformanceByStudents(), [])

  useEffect(() => {
    if (settings.selectedTest && settings.selectedTest.key) {
      const q = {
        requestFilters: { ...settings.requestFilters },
        testId: settings.selectedTest.key,
      }
      getPerformanceByStudents(q)
    }
    if (settings.requestFilters.termId || settings.requestFilters.reportId) {
      return () => toggleFilter(null, false)
    }
  }, [settings.selectedTest?.key, settings.requestFilters])

  useEffect(() => {
    if (
      isCsvDownloading &&
      generateCSVRequired &&
      settings.selectedTest &&
      settings.selectedTest.key
    ) {
      const q = {
        reportType: reportTypes.reportNavType.PERFORMANCE_BY_STUDENTS,
        reportFilters: {
          ...settings.requestFilters,
          testId: settings.selectedTest.key,
        },
        reportExtras: {
          isCliUser,
          demographicFilters,
        },
      }
      generateCSV(q)
    }
  }, [isCsvDownloading])

  useEffect(() => {
    setPagination({ ...pagination, current: 0 })
  }, [range.left, range.right])

  useEffect(() => {
    setPerformanceBandProfile(performanceByStudents?.bandInfo || {})
    if (
      (settings.requestFilters.termId || settings.requestFilters.reportId) &&
      !loading &&
      !isEmpty(performanceByStudents) &&
      !performanceByStudents.studentMetricInfo.length
    ) {
      toggleFilter(null, true)
    }
  }, [performanceByStudents])

  const barChartData = useMemo(() => parseData(res, demographicFilters), [
    res,
    demographicFilters,
  ])

  // Ref: https://snapwiz.atlassian.net/browse/EV-32647
  // We need to filter absent students data for pie chart calculation based on proficiency bands.
  const pieChartData = useMemo(
    () =>
      getTableData(res, demographicFilters, range).filter(
        (d) => d.progressStatus !== ABSENT
      ),
    [res, demographicFilters]
  )

  const tableData = useMemo(
    () => getTableData(res, demographicFilters, range, selectedProficiency.key),
    [res, demographicFilters, range, selectedProficiency.key]
  )

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
    onSelect: ({ studentId, testActivityId }) => {
      let tids = checkedStudents[studentId]
      if (tids?.length) {
        if (tids.includes(testActivityId)) {
          tids = tids.filter((tid) => tid !== testActivityId)
          setCheckedStudents({ ...checkedStudents, [studentId]: tids })
        } else {
          setCheckedStudents({
            ...checkedStudents,
            [studentId]: [...tids, testActivityId],
          })
        }
      } else {
        setCheckedStudents({
          ...checkedStudents,
          [studentId]: [testActivityId],
        })
      }
    },
    onSelectAll: (flag) => {
      if (flag) {
        const _res = {}
        tableData.forEach((ele) => {
          if (_res[ele.studentId]) {
            _res[ele.studentId].push(ele.testActivityId)
          } else {
            _res[ele.studentId] = [ele.testActivityId]
          }
        })
        setCheckedStudents(_res)
      } else {
        setCheckedStudents({})
      }
    },
  }

  const columns = getColumns(
    assessmentName,
    userRole,
    location,
    pageTitle,
    isSharedReport,
    t
  ).filter((col) => !(isCliUser && col.title === 'Due Date'))

  const checkedStudentsForModal = tableData
    .filter(
      (d) =>
        checkedStudents[d.studentId] &&
        checkedStudents[d.studentId][0] === d.testActivityId
    )
    .map(({ studentId, firstName, lastName, username }) => ({
      _id: studentId,
      firstName,
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

  // if custom_student_user_id passed as params then
  // it will check if student have assignment for this test
  // then redirect to lcb student veiw
  // or show notification
  if (customStudentUserId && !loading && !isSharedReport) {
    const studentData = tableData.find(
      (d) => d.externalId === customStudentUserId
    )
    if (studentData) {
      const { pathname, search } = window.location
      const parseSearch = qs.parse(search, { ignoreQueryPrefix: true })
      delete parseSearch.customStudentUserId
      const { assignmentId, groupId, testActivityId } = studentData
      return (
        <Redirect
          to={{
            pathname: `/author/classboard/${assignmentId}/${groupId}/test-activity/${testActivityId}`,
            state: { from: `${pathname}?${qs.stringify(parseSearch)}` },
          }}
        />
      )
    }
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
    return <DataSizeExceeded isDownloadable />
  }

  if (
    !performanceByStudents.studentMetricInfo?.length ||
    !settings.selectedTest.key
  ) {
    return (
      <NoDataContainer>
        {settings.requestFilters?.termId ? 'No data available currently.' : ''}
      </NoDataContainer>
    )
  }

  return (
    <>
      <UpperContainer>
        <FeaturesSwitch
          inputFeatures="studentGroups"
          actionOnInaccessible="hidden"
        >
          <AddToGroupModal
            groupType="custom"
            visible={showAddToGroupModal}
            onCancel={() => setShowAddToGroupModal(false)}
            checkedStudents={checkedStudentsForModal}
            allowTestAssign
          />
        </FeaturesSwitch>
        <StyledCharWrapper>
          <StyledCard>
            <Row type="flex" justify="start">
              <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                <StyledH3>Students in Performance Bands(%)</StyledH3>
              </Col>
            </Row>
            <Row type="flex" justify="start">
              <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                <PerformanceBandPieChart
                  bands={res.bandInfo}
                  data={pieChartData}
                  onSelect={setProficiency}
                />
              </Col>
            </Row>
          </StyledCard>
          <StyledCard style={{ width: '100%' }}>
            <Row type="flex" justify="start">
              <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                <StyledH3>
                  Student score distribution | {assessmentName}
                </StyledH3>
              </Col>
            </Row>
            <Row type="flex" justify="start">
              <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                <SimpleBarChartContainer
                  data={barChartData}
                  setRange={setRange}
                  range={range}
                />
              </Col>
            </Row>
          </StyledCard>
        </StyledCharWrapper>
        <StyledCard>
          <Row type="flex" justify="start">
            <Col xs={24} sm={24} md={12} lg={12} xl={12}>
              <StyledH3>Student Performance | {assessmentName}</StyledH3>
            </Col>
            <Col
              xs={24}
              sm={24}
              md={12}
              lg={12}
              xl={12}
              className="dropdown-container"
            >
              {!isCliUser && !isSharedReport && (
                <FeaturesSwitch
                  inputFeatures="studentGroups"
                  actionOnInaccessible="hidden"
                >
                  <StyledDropDownContainer>
                    <EduButton
                      style={{
                        height: '31px',
                        padding: '0 15px 0 10px',
                        marginRight: '5px',
                      }}
                      onClick={handleAddToGroupClick}
                    >
                      <IconPlusCircle /> Add To Student Group
                    </EduButton>
                  </StyledDropDownContainer>
                </FeaturesSwitch>
              )}
              <StyledDropDownContainer>
                <ControlDropDown
                  prefix="Performance Band - "
                  data={proficiencyBandData}
                  by={selectedProficiency}
                  selectCB={(e, selected) => setProficiency(selected)}
                />
              </StyledDropDownContainer>
            </Col>
          </Row>
          <Row type="flex" justify="start">
            <Col xs={24} sm={24} md={24} lg={24} xl={24}>
              <CsvTable
                isCsvDownloading={generateCSVRequired ? null : isCsvDownloading}
                onCsvConvert={onCsvConvert}
                columns={columns}
                dataSource={tableData}
                rowSelection={rowSelection}
                colouredCellsNo={4}
                rightAligned={6}
                pagination={pagination}
                onChange={setPagination}
                tableToRender={StyledTable}
                location={location}
                scroll={{ x: '100%' }}
                pageTitle={pageTitle}
              />
            </Col>
          </Row>
        </StyledCard>
      </UpperContainer>
    </>
  )
}

const reportPropType = PropTypes.shape({
  districtAvg: PropTypes.number,
  districtAvgPerf: PropTypes.number,
  schoolMetricInfo: PropTypes.array,
  studentMetricInfo: PropTypes.array,
  metaInfo: PropTypes.array,
  metricInfo: PropTypes.array,
  bandInfo: PropTypes.object,
})

PerformanceByStudents.propTypes = {
  loading: PropTypes.bool.isRequired,
  isCsvDownloading: PropTypes.bool.isRequired,
  role: PropTypes.string.isRequired,
  performanceByStudents: reportPropType.isRequired,
  getPerformanceByStudents: PropTypes.func.isRequired,
  settings: PropTypes.object.isRequired,
}

const withConnect = connect(
  (state) => ({
    loading: getReportsPerformanceByStudentsLoader(state),
    error: getReportsPerformanceByStudentsError(state),
    isCsvDownloading: getCsvDownloadingState(state),
    role: getUserRole(state),
    performanceByStudents: getReportsPerformanceByStudents(state),
  }),
  {
    getPerformanceByStudents: getPerformanceByStudentsRequestAction,
    setPerformanceBandProfile: setPerformanceBandProfileAction,
    resetPerformanceByStudents: resetPerformanceByStudentsAction,
    generateCSV: generateCSVAction,
  }
)

export default compose(
  withConnect,
  withNamespaces('student')
)(PerformanceByStudents)
