import React, { useState, useEffect, useMemo } from 'react'
import { connect } from 'react-redux'
import { compose } from 'redux'
import { isEmpty, get, capitalize } from 'lodash'

// components
import { Link } from 'react-router-dom'
import { Spin, Pagination, Row, Avatar, Tooltip } from 'antd'
import {
  MainHeader,
  MainContentWrapper,
  EduButton,
  withWindowSizes,
  notification,
  EduIf,
  EduThen,
  EduElse,
  toggleChatDisplay,
} from '@edulastic/common'
import {
  IconInterface,
  IconFilter,
  IconPlusCircle,
  IconCloseFilter,
  IconBarChart,
} from '@edulastic/icons'
import { themeColorBlue } from '@edulastic/colors'
import QueryString from 'qs'
import { segmentApi } from '@edulastic/api'
import GradebookFilters from './Gradebook/GradebookFilters'
import GradebookTable from './Gradebook/GradebookTable'
import GradebookStatusColors from './Gradebook/GradebookStatusColors'
import {
  StudentLabel,
  FilterButton,
  TableHeader,
  TableContainer,
  TableFooter,
  ScrollbarContainer,
  LeftArrow,
  RightArrow,
  TableInnerSpin,
  StyledNewFeatureIndicator,
} from './styled'
import AddToGroupModal from '../../Reports/common/components/Popups/AddToGroupModal'
import Breadcrumb from '../../src/components/Breadcrumb'
import ArrowFilter from './ArrowFilter/ArrowFilter'
import GradebookStudentTable from './GradebookStudent/GradebookStudentTable'

// ducks
import { actions, selectors } from '../ducks'
import { getCurrentTerm } from '../../src/selectors/user'

// transformers & constants
import {
  curateFiltersData,
  curateGradebookData,
  INITIAL_FILTERS,
  PAGE_DETAIL,
} from '../transformers'
import { NoDataContainer, StyledEduButton } from '../../Reports/common/styled'

const parseInitialsFromName = (name) =>
  (name || '')
    .split(' ')
    .map((w) => w.trim()[0] || '')
    .join('')

const Gradebook = ({
  windowWidth,
  windowHeight,
  fetchFiltersData,
  loadingFilters,
  filtersData,
  fetchGradebookData,
  gradebookData,
  showFilter,
  toggleShowFilter,
  filters,
  setFilters,
  pageDetail,
  setPageDetail,
  termId,
  urlHasStudent,
  match,
}) => {
  const [onComponentLoad, setOnComponentLoad] = useState(true)
  const [loading, setLoading] = useState(false)
  const [fullTableLoad, setFullTableLoad] = useState(true)
  const [selectedRows, setSelectedRows] = useState([])
  const [showAddToGroupModal, setShowAddToGroupModal] = useState(false)
  const [pseudoPageDetail, setPseudoPageDetail] = useState({ ...PAGE_DETAIL })

  const studentId = get(match.params, 'studentId', '')

  const pagination =
    filters.status || urlHasStudent ? pseudoPageDetail : pageDetail
  const curatedFiltersData = curateFiltersData(filtersData, filters)
  const {
    curatedData,
    assessmentsData,
    studentsCount,
    assignmentsCount,
    countByStatus,
  } = curateGradebookData(
    gradebookData,
    filtersData,
    pagination,
    filters.status,
    urlHasStudent
  )

  const setInitialFilters = () => setFilters({ ...INITIAL_FILTERS, termId })

  const handlePagination = (paginationData, _fullTableLoad = true) => {
    setFullTableLoad(_fullTableLoad)
    filters.status || urlHasStudent
      ? setPseudoPageDetail(paginationData)
      : setPageDetail(paginationData)
  }

  const handleAddToGroupClick = () => {
    if (selectedRows.length > 0 || (urlHasStudent && studentId)) {
      setShowAddToGroupModal(true)
    } else {
      notification({ messageKey: 'selectOneOrMoreStudentsForGroup' })
    }
  }

  useEffect(() => {
    setInitialFilters()
    fetchFiltersData()
    setOnComponentLoad(false)
    toggleChatDisplay('hide')

    return () => {
      toggleChatDisplay('show')
    }
  }, [])

  // reset status filter when switching to gradebook student and back
  useEffect(
    () => () => setFilters({ ...INITIAL_FILTERS, ...filters, status: '' }),
    [studentId]
  )

  useEffect(() => {
    if (!isEmpty(filters)) {
      setPageDetail({ ...PAGE_DETAIL })
      setPseudoPageDetail({ ...PAGE_DETAIL })
    } else {
      setInitialFilters()
    }
  }, [filters])

  useEffect(() => {
    if (
      !onComponentLoad &&
      (filters.classIds?.length || urlHasStudent || filters.groupId)
    ) {
      const assessmentIds = curatedFiltersData.assessments
        .filter((a) => filters.assessmentIds.includes(a.id))
        .flatMap((a) => a.assessmentIds)
      fetchGradebookData({
        filters: { ...filters, assessmentIds },
        studentId,
        pageDetail,
      })
      setLoading(true)
    }
  }, [pageDetail])

  useEffect(() => {
    setFullTableLoad(true)
    setLoading(false)
  }, [gradebookData])

  // select unique students for AddToGroupModal
  const { students = [], studentThumbnail } = gradebookData
  const selectedStudentIds = Array.from(
    new Set(selectedRows.map((r) => r.split('_')[0]))
  )
  const selectedStudents =
    urlHasStudent && studentId
      ? students
      : students.filter((s) => selectedStudentIds.includes(s._id))
  const firstStudentName =
    urlHasStudent && !loading
      ? `${capitalize(students?.[0]?.firstName || '')} ${capitalize(
          students?.[0]?.lastName || ''
        )}`
      : ''

  // breadcrumb data
  const breadcrumbData = [
    {
      title: 'GRADEBOOK',
      to: '/author/gradebook',
    },
    {
      title: firstStudentName,
      to: `/author/gradebook/student/${studentId}`,
    },
  ]

  const advancedGradebookLink = useMemo(() => {
    const {
      termId: _termId,
      testType,
      assessmentIds = [],
      subjects = [],
      grades = [],
      classIds = [],
    } = filters

    const linkUrl = `/author/reports/student-progress?${QueryString.stringify({
      termId: _termId,
      assessmentTypes: testType,
      testIds: assessmentIds
        .map(
          (assessmentId) =>
            filtersData.assessments.find(({ _id }) => _id === assessmentId)
              .testId
        )
        .join(','),
      subjects: subjects.join(','),
      grades: grades.join(','),
      courseId: 'All',
      classIds: classIds.join(','),
      assignedBy: 'anyone',
    })}`

    return linkUrl
  }, [filters])

  return (
    <div>
      <AddToGroupModal
        groupType="custom"
        visible={showAddToGroupModal}
        onCancel={() => setShowAddToGroupModal(false)}
        checkedStudents={selectedStudents}
      />
      <MainHeader
        Icon={IconInterface}
        headingText="Gradebook"
        titleMinWidth="auto"
        justify="space-between"
        headingSubContent={
          urlHasStudent && (
            <StudentLabel>
              {studentThumbnail ? (
                <Avatar
                  style={{ marginRight: '10px' }}
                  src={studentThumbnail}
                />
              ) : (
                <Avatar
                  style={{
                    marginRight: '10px',
                    backgroundColor: themeColorBlue,
                  }}
                >
                  {parseInitialsFromName(firstStudentName)}
                </Avatar>
              )}
              <span style={{ marginRight: '15px' }}>{firstStudentName}</span>
            </StudentLabel>
          )
        }
      >
        <Row type="flex">
          <Link to="/author/assignments">
            <EduButton isBlue isGhost>
              VIEW ASSIGNMENTS
            </EduButton>
          </Link>
          <EduButton isBlue isGhost onClick={handleAddToGroupClick}>
            <IconPlusCircle />
            Add to Student Group
          </EduButton>
          <Tooltip title="Access Enhanced Features: Download CSV, View Raw Scores, Performance Bands, Trends, Advanced Filters, and More!">
            <Link to={advancedGradebookLink}>
              <EduButton
                isBlue
                onClick={() =>
                  segmentApi.genericEventTrack(
                    'View_Advanced_Gradebook_buttonClick'
                  )
                }
              >
                <IconBarChart />
                ADVANCED GRADEBOOK
                <StyledNewFeatureIndicator />
              </EduButton>
            </Link>
          </Tooltip>
        </Row>
      </MainHeader>

      {loadingFilters ? (
        <MainContentWrapper>
          <Spin />
        </MainContentWrapper>
      ) : urlHasStudent ? (
        <MainContentWrapper>
          <Row
            type="flex"
            justify="space-between"
            align="middle"
            style={{ marginBottom: '20px' }}
          >
            <Breadcrumb data={breadcrumbData} style={{ position: 'unset' }} />
            <ArrowFilter
              data={curatedFiltersData?.statusList?.map((s) => ({
                ...s,
                count: countByStatus?.[s.id] || 0,
              }))}
              selected={filters.status}
              onClick={(selected) =>
                setFilters({ ...filters, status: selected })
              }
            />
          </Row>
          {loading ? (
            <TableContainer showFilter={showFilter}>
              <Spin />
            </TableContainer>
          ) : (
            <TableContainer>
              <GradebookStudentTable
                dataSource={curatedData}
                windowHeight={windowHeight}
              />
              <Pagination
                current={pagination.assignmentPage}
                pageSize={pagination.assignmentPageSize}
                onChange={(assignmentPage) =>
                  handlePagination({
                    ...pagination,
                    studentPage: 1,
                    assignmentPage,
                  })
                }
                onShowSizeChange={(_, assignmentPageSize) =>
                  handlePagination({
                    ...pagination,
                    studentPage: 1,
                    assignmentPage: 1,
                    assignmentPageSize,
                  })
                }
                total={assignmentsCount}
                showSizeChanger={false}
              />
            </TableContainer>
          )}
        </MainContentWrapper>
      ) : (
        <MainContentWrapper
          style={{ display: 'inline-flex', paddingRight: '5px' }}
        >
          {showFilter && (
            <ScrollbarContainer height={windowHeight - 122}>
              <GradebookFilters
                data={curatedFiltersData}
                filters={filters}
                updateFilters={setFilters}
                clearFilters={setInitialFilters}
                onNewGroupClick={handleAddToGroupClick}
              />
            </ScrollbarContainer>
          )}
          <EduIf condition={showFilter}>
            <EduThen>
              <FilterButton showFilter={showFilter} onClick={toggleShowFilter}>
                <IconCloseFilter
                  data-test={showFilter ? 'expanded' : 'collapsed'}
                  data-cy="smart-filter"
                />
              </FilterButton>
            </EduThen>
          </EduIf>
          {loading && fullTableLoad ? (
            <TableContainer showFilter={showFilter}>
              <Spin />
            </TableContainer>
          ) : (
            <TableContainer showFilter={showFilter}>
              <EduIf condition={loading && !fullTableLoad}>
                <TableInnerSpin />
              </EduIf>
              <EduIf condition={!showFilter}>
                <StyledEduButton
                  data-cy="smart-filter"
                  isGhost={showFilter}
                  onClick={toggleShowFilter}
                  style={{
                    height: '24px',
                    margin: '-15px 0px 5px 18px',
                    borderRadius: '15px',
                  }}
                >
                  <IconFilter width={15} height={15} />
                  FILTERS
                </StyledEduButton>
              </EduIf>
              <EduIf
                condition={
                  filters.groupId ||
                  (filters.classIds && filters.classIds.length > 0)
                }
              >
                <EduThen>
                  <GradebookTable
                    dataSource={curatedData}
                    assessments={assessmentsData}
                    selectedRows={selectedRows}
                    setSelectedRows={setSelectedRows}
                    windowWidth={windowWidth}
                    windowHeight={windowHeight}
                  />
                  {curatedData?.length > 0 && (
                    <>
                      <TableHeader>
                        <Tooltip title="Load previous 10 tests">
                          <LeftArrow
                            onClick={() =>
                              handlePagination(
                                {
                                  ...pagination,
                                  assignmentPage: pagination.assignmentPage - 1,
                                },
                                false
                              )
                            }
                            disabled={pagination.assignmentPage === 1}
                          />
                        </Tooltip>
                        <Tooltip title="Load next 10 tests" placement="topLeft">
                          <RightArrow
                            onClick={() =>
                              handlePagination(
                                {
                                  ...pagination,
                                  assignmentPage: pagination.assignmentPage + 1,
                                },
                                false
                              )
                            }
                            disabled={
                              assignmentsCount === 0 ||
                              pagination.assignmentPage ===
                                Math.ceil(
                                  assignmentsCount /
                                    pagination.assignmentPageSize
                                )
                            }
                          />
                        </Tooltip>
                      </TableHeader>
                      <TableFooter>
                        <GradebookStatusColors />
                        {/* NOTE: When status filter is set for Gradebook, assignment pagination is dependent on student pagination */}
                        <EduIf
                          condition={studentsCount > pagination.studentPageSize}
                        >
                          <Pagination
                            current={pagination.studentPage}
                            pageSize={pagination.studentPageSize}
                            onChange={(studentPage) =>
                              handlePagination({
                                ...pagination,
                                ...(filters.status
                                  ? { assignmentPage: 1 }
                                  : {}),
                                studentPage,
                              })
                            }
                            onShowSizeChange={(_, studentPageSize) =>
                              handlePagination({
                                ...pagination,
                                ...(filters.status
                                  ? { assignmentPage: 1 }
                                  : {}),
                                studentPage: 1,
                                studentPageSize,
                              })
                            }
                            total={studentsCount}
                            showSizeChanger={false}
                          />
                        </EduIf>
                      </TableFooter>
                    </>
                  )}
                </EduThen>
                <EduElse>
                  <NoDataContainer>
                    Select a class in the filters to the left to view the
                    gradebook
                  </NoDataContainer>
                </EduElse>
              </EduIf>
            </TableContainer>
          )}
        </MainContentWrapper>
      )}
    </div>
  )
}

const enhance = compose(
  withWindowSizes,
  connect(
    (state) => ({
      loadingFilters: selectors.loadingFilters(state),
      filtersData: selectors.filtersData(state),
      gradebookData: selectors.gradebookData(state),
      showFilter: selectors.showFilter(state),
      filters: selectors.selectedFilters(state),
      pageDetail: selectors.pageDetail(state),
      termId: getCurrentTerm(state),
    }),
    {
      fetchFiltersData: actions.fetchGradebookFiltersRequest,
      fetchGradebookData: actions.fetchStudentPerformanceRequest,
      toggleShowFilter: actions.toggleShowFilter,
      setFilters: actions.setSelectedFilters,
      setPageDetail: actions.setPageDetail,
    }
  )
)

export default enhance(Gradebook)
