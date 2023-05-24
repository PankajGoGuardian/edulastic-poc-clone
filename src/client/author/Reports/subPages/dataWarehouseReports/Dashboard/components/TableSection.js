import React, { useEffect, useState } from 'react'
import { isEmpty } from 'lodash'
import {
  EduIf,
  EduThen,
  EduElse,
  notification,
  SpinLoader,
} from '@edulastic/common'
import DashboardTableFilters from './TableFilters'
import DashboardTable from './Table'
import useTableFilters from '../hooks/useTableFilters'
import {
  academicSummaryFiltersTypes,
  districtAvgDimension,
  getTableApiQuery,
  tableFilterTypes,
} from '../utils'
import BackendPagination from '../../../../common/components/BackendPagination'
import { TableContainer } from './common/styledComponents'
import AddToGroupModal from '../../../../common/components/Popups/AddToGroupModal'
import FeaturesSwitch from '../../../../../../features/components/FeaturesSwitch'
import { StyledEmptyContainer } from '../../common/components/styledComponents'
import { isAddToStudentGroupEnabled } from '../../common/utils'

function TableSection({
  history,
  location,
  search,
  compareByOptions,
  selectedPerformanceBand,
  isCsvDownloading,
  settings,
  setSettings,
  selectedCompareBy,
  academicSummaryFilters,
  setAcademicSummaryFilters,
  fetchDashboardTableDataRequest,
  districtAveragesData,
  tableData,
  loadingTableData,
  tableDataRequestError,
  isSharedReport = false,
  availableTestTypes,
}) {
  const {
    tableFilters,
    setTableFilters,
    updateTableFiltersCB,
    onTableHeaderCellClick,
    getTableDrillDownUrl,
    setTablePagination,
  } = useTableFilters({
    history,
    location,
    search,
    defaultCompareBy: selectedCompareBy,
    settings,
    setSettings,
    availableTestTypes,
  })

  const [showAddToGroupModal, setShowAddToGroupModal] = useState(false)
  const [selectedRowKeys, onSelectChange] = useState([])
  const [checkedStudents, setCheckedStudents] = useState([])

  useEffect(() => {
    const profileId =
      academicSummaryFilters[academicSummaryFiltersTypes.PERFORMANCE_BAND]?.key
    const academicTestType =
      academicSummaryFilters[academicSummaryFiltersTypes.TEST_TYPE]?.key
    const q = getTableApiQuery(
      settings,
      tableFilters,
      profileId,
      academicTestType
    )
    if ((q.termId || q.reportId) && profileId) {
      fetchDashboardTableDataRequest({ ...q, districtAveragesRequired: true })
    }
  }, [
    settings.requestFilters,
    tableFilters[tableFilterTypes.COMPARE_BY]?.key,
    academicSummaryFilters[academicSummaryFiltersTypes.PERFORMANCE_BAND]?.key,
  ])

  useEffect(() => {
    const profileId =
      academicSummaryFilters[academicSummaryFiltersTypes.PERFORMANCE_BAND]?.key
    const academicTestType =
      academicSummaryFilters[academicSummaryFiltersTypes.TEST_TYPE]?.key
    const q = getTableApiQuery(
      settings,
      tableFilters,
      profileId,
      academicTestType
    )
    if (
      (q.termId || q.reportId) &&
      profileId &&
      !isEmpty(districtAveragesData)
    ) {
      fetchDashboardTableDataRequest({ ...q })
    }
  }, [
    tableFilters[tableFilterTypes.PAGE],
    tableFilters[tableFilterTypes.PAGE_SIZE],
    tableFilters[tableFilterTypes.SORT_KEY],
    tableFilters[tableFilterTypes.SORT_ORDER],
    tableFilters[tableFilterTypes.ABOVE_EQUAL_TO_AVG],
    tableFilters[tableFilterTypes.BELOW_AVG],
  ])

  useEffect(() => {
    const profileId =
      academicSummaryFilters[academicSummaryFiltersTypes.PERFORMANCE_BAND]?.key
    const academicTestType =
      academicSummaryFilters[academicSummaryFiltersTypes.TEST_TYPE]?.key
    const q = getTableApiQuery(
      settings,
      tableFilters,
      profileId,
      academicTestType
    )
    if (
      (q.termId || q.reportId) &&
      profileId &&
      !isEmpty(districtAveragesData) &&
      tableFilters[tableFilterTypes.ABOVE_EQUAL_TO_AVG] !==
        tableFilters[tableFilterTypes.BELOW_AVG]
    ) {
      fetchDashboardTableDataRequest({ ...q })
    }
  }, [academicSummaryFilters[academicSummaryFiltersTypes.TEST_TYPE]?.key])

  // handle add student to group
  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
    onSelect: ({ dimension }) => {
      return setCheckedStudents(
        checkedStudents.includes(dimension._id)
          ? checkedStudents.filter((i) => i !== dimension._id)
          : [...checkedStudents, dimension._id]
      )
    },
    onSelectAll: (flag) =>
      setCheckedStudents(
        flag ? tableData.metricInfo.map((d) => d.dimension._id) : []
      ),
    getCheckboxProps: ({ dimension }) => ({
      disabled: dimension === districtAvgDimension,
      name: dimension.name,
    }),
  }

  const { metricInfo = [] } = tableData

  const checkedStudentsForModal = metricInfo
    .filter(({ dimension }) => checkedStudents.includes(dimension._id))
    .map(({ dimension, username }) => {
      const name = dimension.name.split(',')
      return {
        _id: dimension._id,
        firstName: name[0],
        lastName: name?.[1],
        username,
      }
    })

  const handleAddToGroupClick = () => {
    if (checkedStudentsForModal.length) {
      setShowAddToGroupModal(true)
    } else {
      notification({ messageKey: 'selectOneOrMoreStudentsForGroup' })
    }
  }

  const showAddToStudentGroupBtn = isAddToStudentGroupEnabled(
    isSharedReport,
    tableFilters[tableFilterTypes.COMPARE_BY]?.key
  )

  const _rowSelection = showAddToStudentGroupBtn ? rowSelection : null

  const hasDistrictAveragesContent =
    !tableDataRequestError && !isEmpty(districtAveragesData?.metricInfo)
  const hasTableContent =
    !tableDataRequestError && !isEmpty(tableData?.metricInfo)

  const errorMsg = 'Error fetching data, please try again later'
  const emptyContainerDesc = tableDataRequestError
    ? errorMsg
    : 'No Data Available'

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
      <DashboardTableFilters
        tableFilters={tableFilters}
        updateTableFiltersCB={updateTableFiltersCB}
        handleAddToGroupClick={handleAddToGroupClick}
        showAddToStudentGroupBtn={showAddToStudentGroupBtn}
        compareByOptions={compareByOptions}
      />
      <TableContainer>
        <EduIf condition={loadingTableData}>
          <EduThen>
            <SpinLoader
              tip="Loading Table Data"
              height="250px"
              position="relative"
            />
          </EduThen>
          <EduElse>
            <EduIf condition={hasDistrictAveragesContent}>
              <EduThen>
                <DashboardTable
                  tableFilters={tableFilters}
                  setTableFilters={setTableFilters}
                  academicSummaryFilters={academicSummaryFilters}
                  setAcademicSummaryFilters={setAcademicSummaryFilters}
                  onTableHeaderCellClick={onTableHeaderCellClick}
                  getTableDrillDownUrl={getTableDrillDownUrl}
                  districtAveragesData={districtAveragesData}
                  tableData={tableData}
                  selectedPerformanceBand={selectedPerformanceBand}
                  rowSelection={_rowSelection}
                  loadingTableData={loadingTableData}
                  isCsvDownloading={isCsvDownloading}
                  availableTestTypes={availableTestTypes}
                  hasTableContent={hasTableContent}
                  emptyContainerDesc={emptyContainerDesc}
                />
                <EduIf condition={hasTableContent}>
                  <EduThen>
                    <BackendPagination
                      itemsCount={tableData.dimensionCount}
                      backendPagination={{
                        page: tableFilters.page,
                        pageSize: tableFilters.pageSize,
                      }}
                      setBackendPagination={setTablePagination}
                    />
                  </EduThen>
                </EduIf>
              </EduThen>
              <EduElse>
                <StyledEmptyContainer description={emptyContainerDesc} />
              </EduElse>
            </EduIf>
          </EduElse>
        </EduIf>
      </TableContainer>
    </>
  )
}

export default TableSection
