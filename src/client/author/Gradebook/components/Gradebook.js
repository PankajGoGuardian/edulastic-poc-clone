import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import { compose } from 'redux'
import { isEmpty, get, capitalize } from 'lodash'

// components
import { Link } from 'react-router-dom'
import { Spin, Pagination, Row, Avatar } from 'antd'
import {
  MainHeader,
  MainContentWrapper,
  EduButton,
  withWindowSizes,
  notification,
} from '@edulastic/common'
import {
  IconInterface,
  IconFilter,
  IconPlusCircle,
  IconCloseFilter,
} from '@edulastic/icons'
import { themeColorBlue } from '@edulastic/colors'
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
} from './styled'
import AddToGroupModal from '../../Reports/common/components/Popups/AddToGroupModal'
import Breadcrumb from '../../src/components/Breadcrumb'
import ArrowFilter from './ArrowFilter/ArrowFilter'
import GradebookStudentTable from './GradebookStudent/GradebookStudentTable'

// ducks
import { actions, selectors } from '../ducks'
import { getCurrentTerm } from '../../src/selectors/user'
import itemsHistoryCard from '../../PinBoard/itemsHistoryCard';
// transformers & constants
import {
  curateFiltersData,
  curateGradebookData,
  INITIAL_FILTERS,
  PAGE_DETAIL,
} from '../transformers'

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

  const handlePagination = (paginationData) =>
    filters.status || urlHasStudent
      ? setPseudoPageDetail(paginationData)
      : setPageDetail(paginationData)

  const handleAddToGroupClick = () => {
    if (selectedRows.length > 0 || (urlHasStudent && studentId)) {
      setShowAddToGroupModal(true)
    } else {
      notification({ messageKey: 'selectOneOrMoreStudentsForGroup' })
    }
  }

  useEffect(() => {
    fetchFiltersData()
    setOnComponentLoad(false)
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
    if (!onComponentLoad) {
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

  useEffect(() => setLoading(false), [gradebookData])

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
          <itemsHistoryCard />
          <Link to="/author/assignments">
            <EduButton isBlue isGhost>
              VIEW ASSIGNMENTS
            </EduButton>
          </Link>
          <EduButton isBlue onClick={handleAddToGroupClick}>
            <IconPlusCircle />
            Add to Student Group
          </EduButton>
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
        <MainContentWrapper style={{ display: 'inline-flex' }}>
          {showFilter && (
            <ScrollbarContainer height={windowHeight - 120}>
              <GradebookFilters
                data={curatedFiltersData}
                filters={filters}
                updateFilters={setFilters}
                clearFilters={setInitialFilters}
                onNewGroupClick={handleAddToGroupClick}
              />
            </ScrollbarContainer>
          )}
          <FilterButton showFilter={showFilter} onClick={toggleShowFilter}>
            {showFilter ? (
              <IconCloseFilter
                data-test={showFilter ? 'expanded' : 'collapsed'}
                data-cy="smart-filter"
              />
            ) : (
              <IconFilter
                width={20}
                height={20}
                data-test={showFilter ? 'expanded' : 'collapsed'}
                data-cy="smart-filter"
              />
            )}
          </FilterButton>
          {loading ? (
            <TableContainer showFilter={showFilter}>
              <Spin />
            </TableContainer>
          ) : (
            <TableContainer showFilter={showFilter}>
              <TableHeader>
                <LeftArrow
                  onClick={() =>
                    handlePagination({
                      ...pagination,
                      assignmentPage: pagination.assignmentPage - 1,
                    })
                  }
                  disabled={pagination.assignmentPage === 1}
                />
                <RightArrow
                  onClick={() =>
                    handlePagination({
                      ...pagination,
                      assignmentPage: pagination.assignmentPage + 1,
                    })
                  }
                  disabled={
                    assignmentsCount === 0 ||
                    pagination.assignmentPage ===
                      Math.ceil(
                        assignmentsCount / pagination.assignmentPageSize
                      )
                  }
                />
              </TableHeader>
              <GradebookTable
                dataSource={curatedData}
                assessments={assessmentsData}
                selectedRows={selectedRows}
                setSelectedRows={setSelectedRows}
                windowWidth={windowWidth}
                windowHeight={windowHeight}
              />
              <TableFooter>
                <GradebookStatusColors />
                {/* NOTE: When status filter is set for Gradebook, assignment pagination is dependent on student pagination */}
                <Pagination
                  current={pagination.studentPage}
                  pageSize={pagination.studentPageSize}
                  onChange={(studentPage) =>
                    handlePagination({
                      ...pagination,
                      ...(filters.status ? { assignmentPage: 1 } : {}),
                      studentPage,
                    })
                  }
                  onShowSizeChange={(_, studentPageSize) =>
                    handlePagination({
                      ...pagination,
                      ...(filters.status ? { assignmentPage: 1 } : {}),
                      studentPage: 1,
                      studentPageSize,
                    })
                  }
                  total={studentsCount}
                  showSizeChanger={false}
                />
              </TableFooter>
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
