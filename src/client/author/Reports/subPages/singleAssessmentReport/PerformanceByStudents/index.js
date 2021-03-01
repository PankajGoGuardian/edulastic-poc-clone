import React, { useState, useEffect, useMemo } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { compose } from 'redux'
import { withNamespaces } from '@edulastic/localization'
import { Row, Col } from 'antd'
import { Redirect } from 'react-router-dom'
import qs from 'qs'

// components
import { EduButton, SpinLoader, notification } from '@edulastic/common'
import { IconPlusCircle } from '@edulastic/icons'

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
  parseData,
  getTableData,
  getColumns,
  getProficiencyBandData,
} from './util/transformers'
import { downloadCSV } from '../../../common/util'
import {
  getPerformanceByStudentsRequestAction,
  getReportsPerformanceByStudents,
  getReportsPerformanceByStudentsLoader,
  getReportsPerformanceByStudentsError,
} from './ducks'
import { getUserRole } from '../../../../../student/Login/ducks'
import { getCsvDownloadingState, getTestListSelector } from '../../../ducks'
import {
  getSAFFilterPerformanceBandProfiles,
  setPerformanceBandProfileAction,
} from '../common/filterDataDucks'

import columns from './static/json/tableColumns.json'

const PerformanceByStudents = ({
  loading,
  error,
  isCsvDownloading,
  role,
  performanceBandProfiles,
  performanceByStudents,
  getPerformanceByStudents,
  settings,
  testList,
  location = { pathname: '' },
  pageTitle,
  filters,
  t,
  customStudentUserId,
  isCliUser,
  sharedReport,
  setPerformanceBandProfile,
  toggleFilter,
}) => {
  const [userRole, sharedReportFilters, isSharedReport] = useMemo(
    () => [
      sharedReport?.sharedBy?.role || role,
      sharedReport?._id
        ? { ...sharedReport.filters, reportId: sharedReport._id }
        : null,
      !!sharedReport?._id,
    ],
    [sharedReport]
  )
  const selectedTest = testList?.find(
    (test) => test._id === settings.selectedTest.key
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
      performanceByStudents?.bandInfo?.performanceBand ||
      [],
    [settings, performanceByStudents]
  )

  useEffect(() => {
    setPerformanceBandProfile(performanceByStudents?.bandInfo || {})
    if (
      (settings.requestFilters.termId || settings.requestFilters.reportId) &&
      !loading &&
      !performanceByStudents.studentMetricInfo.length
    ) {
      toggleFilter(null, true)
    }
  }, [performanceByStudents])

  const [showAddToGroupModal, setShowAddToGroupModal] = useState(false)
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

  useEffect(() => {
    if (settings.selectedTest && settings.selectedTest.key) {
      const q = {
        requestFilters: { ...settings.requestFilters },
        testId: settings.selectedTest.key,
      }
      getPerformanceByStudents(q)
    }
  }, [settings])

  useEffect(() => {
    setPagination({ ...pagination, current: 0 })
  }, [range.left, range.right])

  const res = { ...performanceByStudents, bandInfo }

  const proficiencyBandData = getProficiencyBandData(res && res.bandInfo)
  const [selectedProficiency, setProficiency] = useState(proficiencyBandData[0])

  const parsedData = useMemo(() => parseData(res, filters), [res, filters])

  const tableData = useMemo(
    () => getTableData(res, filters, range, selectedProficiency.key),
    [res, filters, range, selectedProficiency.key]
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

  const updateProficiencyFilter = (_, selected) => {
    setProficiency(selected)
  }

  const onCsvConvert = (data) =>
    downloadCSV(`Performance by Students.csv`, data)

  const _columns = getColumns(
    columns,
    assessmentName,
    userRole,
    location,
    pageTitle,
    isSharedReport,
    t
  )

  const columnData = isCliUser
    ? _columns.filter((col) => col.title !== 'Due Date')
    : _columns

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

  const chartData = useMemo(() => getTableData(res, filters, range), [
    res,
    filters,
  ])

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
    return <SpinLoader position="fixed" />
  }

  if (error && error.dataSizeExceeded) {
    return <DataSizeExceeded />
  }

  if (
    !performanceByStudents.studentMetricInfo?.length ||
    !settings.selectedTest.key
  ) {
    return <NoDataContainer>No data available currently.</NoDataContainer>
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
                  bands={bandInfo}
                  data={chartData}
                  onSelect={updateProficiencyFilter}
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
                  data={parsedData}
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
                  prefix="Proficiency Band - "
                  data={proficiencyBandData}
                  by={selectedProficiency}
                  selectCB={updateProficiencyFilter}
                />
              </StyledDropDownContainer>
            </Col>
          </Row>
          <Row type="flex" justify="start">
            <Col xs={24} sm={24} md={24} lg={24} xl={24}>
              <CsvTable
                isCsvDownloading={isCsvDownloading}
                onCsvConvert={onCsvConvert}
                columns={columnData}
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
})

PerformanceByStudents.propTypes = {
  loading: PropTypes.bool.isRequired,
  isCsvDownloading: PropTypes.bool.isRequired,
  role: PropTypes.string.isRequired,
  performanceBandProfiles: PropTypes.array.isRequired,
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
    performanceBandProfiles: getSAFFilterPerformanceBandProfiles(state),
    performanceByStudents: getReportsPerformanceByStudents(state),
    testList: getTestListSelector(state),
  }),
  {
    getPerformanceByStudents: getPerformanceByStudentsRequestAction,
    setPerformanceBandProfile: setPerformanceBandProfileAction,
  }
)

export default compose(
  withConnect,
  withNamespaces('student')
)(PerformanceByStudents)
