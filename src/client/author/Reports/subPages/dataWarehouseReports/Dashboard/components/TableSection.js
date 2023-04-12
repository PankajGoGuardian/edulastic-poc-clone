import React, { useEffect, useState } from 'react'
import { isEmpty } from 'lodash'
import { Spin } from 'antd'
import { EduIf, EduThen, EduElse, notification } from '@edulastic/common'
import DashboardTableFilters from './TableFilters'
import DashboardTable from './Table'
import useTableFilters from '../hooks/useTableFilters'
import {
  academicSummaryFiltersTypes,
  compareByKeys,
  getTableApiQuery,
  tableFilterTypes,
} from '../utils'
import BackendPagination from '../../../../common/components/BackendPagination'
import {
  DataSizeExceededContainer,
  TableContainer,
} from './common/styledComponents'
import AddToGroupModal from '../../../../common/components/Popups/AddToGroupModal'
import FeaturesSwitch from '../../../../../../features/components/FeaturesSwitch'
import { StyledEmptyContainer } from '../../common/components/styledComponents'

function TableSection({
  location,
  compareByOptions,
  selectedPerformanceBand,
  isCsvDownloading,
  settings,
  setSettings,
  selectedCompareBy,
  academicSummaryFilters,
  fetchDashboardTableDataRequest,
  tableData,
  loadingTableData,
  tableDataRequestError,
  isSharedReport = false,
}) {
  const {
    tableFilters,
    setTableFilters,
    updateTableFiltersCB,
    onTableHeaderCellClick,
    getTableDrillDownUrl,
    setTablePagination,
  } = useTableFilters({
    location,
    defaultCompareBy: selectedCompareBy,
    settings,
    setSettings,
  })

  const [showAddToGroupModal, setShowAddToGroupModal] = useState(false)
  const [selectedRowKeys, onSelectChange] = useState([])
  const [checkedStudents, setCheckedStudents] = useState([])

  useEffect(() => {
    const profileId =
      academicSummaryFilters[academicSummaryFiltersTypes.PERFORMANCE_BAND]?.key
    const q = getTableApiQuery(settings, tableFilters, profileId)
    if ((q.termId || q.reportId) && profileId) {
      fetchDashboardTableDataRequest(q)
    }
  }, [
    settings.requestFilters,
    tableFilters,
    academicSummaryFilters[academicSummaryFiltersTypes.PERFORMANCE_BAND],
  ])

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
      notification({ messageKey: 'selectOneOrMoreStudentsForGroup' })
    } else {
      setShowAddToGroupModal(true)
    }
  }

  const addToStudentGroupEnabled =
    !isSharedReport &&
    tableFilters[tableFilterTypes.COMPARE_BY].key === compareByKeys.STUDENT

  const _rowSelection = addToStudentGroupEnabled ? rowSelection : null

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
        addToStudentGroupEnabled={addToStudentGroupEnabled}
        compareByOptions={compareByOptions}
      />
      <TableContainer>
        <Spin spinning={loadingTableData}>
          <EduIf condition={!loadingTableData}>
            <EduThen>
              <EduIf
                condition={
                  !tableDataRequestError && !isEmpty(tableData?.metricInfo)
                }
              >
                <EduThen>
                  <DashboardTable
                    tableFilters={tableFilters}
                    setTableFilters={setTableFilters}
                    onTableHeaderCellClick={onTableHeaderCellClick}
                    getTableDrillDownUrl={getTableDrillDownUrl}
                    tableData={tableData}
                    selectedPerformanceBand={selectedPerformanceBand}
                    rowSelection={_rowSelection}
                    loadingTableData={loadingTableData}
                    isCsvDownloading={isCsvDownloading}
                  />
                  <BackendPagination
                    itemsCount={tableData.dimensionCount}
                    backendPagination={{
                      page: tableFilters.page,
                      pageSize: tableFilters.pageSize,
                    }}
                    setBackendPagination={setTablePagination}
                  />
                </EduThen>
                <EduElse>
                  <EduIf condition={tableDataRequestError?.dataSizeExceeded}>
                    <EduThen>
                      <DataSizeExceededContainer>
                        {tableDataRequestError?.message}
                      </DataSizeExceededContainer>
                    </EduThen>
                    <EduElse>
                      <StyledEmptyContainer />
                    </EduElse>
                  </EduIf>
                </EduElse>
              </EduIf>
            </EduThen>
            <EduElse>
              <StyledEmptyContainer />
            </EduElse>
          </EduIf>
        </Spin>
      </TableContainer>
    </>
  )
}

export default TableSection
