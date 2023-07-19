import React, { useState, useEffect, useMemo } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { compose } from 'redux'
import { withNamespaces } from '@edulastic/localization'
import { Row, Col, Pagination } from 'antd'
import { Redirect } from 'react-router-dom'
import qs from 'qs'
import { get } from 'lodash'

// components
import { report as reportTypes, reportUtils } from '@edulastic/constants'
import {
  EduButton,
  SpinLoader,
  notification,
  EduIf,
  EduElse,
  EduThen,
} from '@edulastic/common'
import { IconPlusCircle } from '@edulastic/icons'

import { StyledH3, StyledCard, NoDataContainer } from '../../../common/styled'
import {
  UpperContainer,
  StyledDropDownContainer,
  StyledCharWrapper,
} from './components/styled'
import { ControlDropDown } from '../../../common/components/widgets/controlDropDown'
import SimpleBarChartContainer from './components/charts/SimpleBarChartContainer'
import AddToGroupModal from '../../../common/components/Popups/AddToGroupModal'
import FeaturesSwitch from '../../../../../features/components/FeaturesSwitch'
import PerformanceBandPieChart from './components/charts/StudentPerformancePie'
import StudentPerformanceTable from './components/table/studentPerformanceTable'

// ducks & helpers
import { getUserRole } from '../../../../../student/Login/ducks'
import { getCsvDownloadingState, generateCSVAction } from '../../../ducks'

import { getColumns } from './util/transformers'
import { getAssessmentName } from '../../../common/util'

import {
  usePerformanceByStudentsDetailsFetch,
  usePerformanceByStudentsSummaryFetch,
} from './hooks/useFetch'

import { sortOrderMap } from './constants'

const {
  getProficiencyBandData,
  getBarChartData,
  getPieChartData,
  getTableData,
  getThresholdFromBandName,
  sortKeysMap,
} = reportUtils.performanceByStudents
const PAGE_SIZE = 200

const PerformanceByStudents = ({
  isCsvDownloading,
  role,
  settings,
  location = { pathname: '' },
  pageTitle,
  demographicFilters,
  t,
  customStudentUserId,
  isCliUser,
  sharedReport,
  toggleFilter,
  generateCSV,
  setAdditionalUrlParams,
}) => {
  const urlSearch = qs.parse(location.search, {
    ignoreQueryPrefix: true,
    indices: true,
  })
  const [userRole, isSharedReport] = useMemo(
    () => [sharedReport?.sharedBy?.role || role, !!sharedReport?._id],
    [sharedReport]
  )

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
  const [page, setPage] = useState(Number(urlSearch.page) || 1)
  const [sortOrder, setSortOrder] = useState(urlSearch.sortOrder || 'ascend')
  const [sortKey, setSortKey] = useState(
    urlSearch.sortKey || sortKeysMap.STUDENT_SCORE
  )
  const [selectedProficiency, setProficiency] = useState()
  const [recompute, setRecompute] = useState(true)
  const [totalRowCount, setTotalRowCount] = useState(0)

  useEffect(() => {
    setRecompute(true)
    setPage(1)
    setAdditionalUrlParams((oldState) => ({
      ...oldState,
      page: 1,
    }))
  }, [demographicFilters, settings, selectedProficiency, range])

  const [
    details,
    detailsLoading,
    detailsError,
  ] = usePerformanceByStudentsDetailsFetch({
    settings,
    demographicFilters,
    toggleFilter,
    sortKey,
    sortOrder,
    page,
    pageSize: PAGE_SIZE,
    recompute,
    selectedProficiency,
    range,
  })

  const [
    summary,
    summaryLoading,
    summaryError,
  ] = usePerformanceByStudentsSummaryFetch({
    settings,
    demographicFilters,
  })
  const itemsCount = get(details, 'totalRows', totalRowCount)
  const performanceByStudents = useMemo(() => {
    return { ...summary, ...details }
  }, [details, summary])
  const generateCSVRequired = useMemo(
    () => [(itemsCount || 0) > PAGE_SIZE].some(Boolean),
    [itemsCount]
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

  useEffect(() => {
    if (
      [isCsvDownloading, generateCSVRequired, settings.selectedTest?.key].every(
        Boolean
      )
    ) {
      const q = {
        reportType: reportTypes.reportNavType.PERFORMANCE_BY_STUDENTS,
        reportFilters: {
          ...settings.requestFilters,
          ...demographicFilters,
          page,
          pageSize: PAGE_SIZE,
          sortKey,
          sortOrder: sortOrderMap[sortOrder],
          testId: settings.selectedTest.key,
          bandThreshold: selectedProficiency?.threshold,
          range,
        },
        reportExtras: {
          isCliUser,
        },
      }
      generateCSV(q)
    }
  }, [isCsvDownloading])

  useEffect(() => {
    setPagination({ ...pagination, current: 0 })
  }, [range.left, range.right])

  const barChartData = useMemo(() => getBarChartData(res), [res])

  // Ref: https://snapwiz.atlassian.net/browse/EV-32647
  // We need to filter absent students data for pie chart calculation based on proficiency bands.
  const pieChartData = useMemo(() => getPieChartData(res), [res])

  const tableData = useMemo(() => getTableData(res), [res])

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
    t,
    sortKey,
    sortOrder
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
  if (customStudentUserId && !detailsLoading && !isSharedReport) {
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
  const onSetPage = (value) => {
    setRecompute(false)
    setTotalRowCount(itemsCount)
    setAdditionalUrlParams((oldState) => ({
      ...oldState,
      page: value,
    }))
    setPage(value)
  }
  const onSetProficiency = (_selected) => {
    const selected = {
      key: _selected.key,
      title: _selected.title,
      threshold: getThresholdFromBandName(res.bandInfo, _selected.key),
    }
    setProficiency(selected)
  }

  const hasNoData =
    !details.studentMetricInfo?.length || detailsError || summaryError

  return (
    <>
      <EduIf condition={!summaryLoading}>
        <EduThen>
          <EduIf condition={!hasNoData}>
            <EduThen>
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
                      <StyledH3>
                        Student Performance | {assessmentName}
                      </StyledH3>
                    </Col>
                    <Col
                      xs={24}
                      sm={24}
                      md={12}
                      lg={12}
                      xl={12}
                      className="dropdown-container"
                    >
                      <EduIf condition={!isCliUser && !isSharedReport}>
                        <EduThen>
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
                        </EduThen>
                      </EduIf>
                      <StyledDropDownContainer>
                        <ControlDropDown
                          prefix="Performance Band - "
                          data={proficiencyBandData}
                          by={selectedProficiency}
                          selectCB={(e, selected) => onSetProficiency(selected)}
                        />
                      </StyledDropDownContainer>
                    </Col>
                  </Row>
                  <EduIf condition={!detailsLoading}>
                    <EduThen>
                      <Row type="flex" justify="start">
                        <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                          <StudentPerformanceTable
                            report={tableData}
                            isCsvDownloading={
                              generateCSVRequired ? null : isCsvDownloading
                            }
                            columns={columns}
                            rowSelection={rowSelection}
                            location={location}
                            pageTitle={pageTitle}
                            setSortKey={onSetSortKey}
                            setSortOrder={onSetSortOrder}
                            setPageNo={onSetPage}
                          />
                        </Col>
                      </Row>
                      <EduIf condition={itemsCount > PAGE_SIZE}>
                        <Pagination
                          style={{ marginTop: '10px' }}
                          onChange={onSetPage}
                          current={page}
                          pageSize={PAGE_SIZE}
                          total={itemsCount}
                        />
                      </EduIf>
                    </EduThen>
                    <EduElse>
                      <SpinLoader tip="Loading Students data, it may take a while..." />
                    </EduElse>
                  </EduIf>
                </StyledCard>
              </UpperContainer>
            </EduThen>
            <EduElse>
              <NoDataContainer>
                {settings.requestFilters?.termId
                  ? 'No data available currently.'
                  : ''}
              </NoDataContainer>
            </EduElse>
          </EduIf>
        </EduThen>
        <EduElse>
          <SpinLoader
            tip="Please wait while we gather the required information..."
            position="fixed"
          />
        </EduElse>
      </EduIf>
    </>
  )
}

PerformanceByStudents.propTypes = {
  isCsvDownloading: PropTypes.bool.isRequired,
  role: PropTypes.string.isRequired,
  settings: PropTypes.object.isRequired,
}

const withConnect = connect(
  (state) => ({
    isCsvDownloading: getCsvDownloadingState(state),
    role: getUserRole(state),
  }),
  {
    generateCSV: generateCSVAction,
  }
)

export default compose(
  withConnect,
  withNamespaces('student')
)(PerformanceByStudents)
