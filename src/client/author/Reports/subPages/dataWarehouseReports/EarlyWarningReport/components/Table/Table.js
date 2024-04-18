import React, { useMemo } from 'react'
import {
  EduIf,
  EduThen,
  EduElse,
  SpinLoader,
  useApiQuery,
} from '@edulastic/common'
import { stringifyArrayFilters } from '@edulastic/constants/reportUtils/common'
import { dataWarehouseApi } from '@edulastic/api'
import { isEmpty } from 'lodash'
import CsvTable from '../../../../../common/components/tables/CsvTable'
import BackendPagination from '../../../../../common/components/BackendPagination'
import {
  compareByStudentColumns,
  getTableColumns,
  tableColumnsData,
  tableFilterTypes,
  transformTableData,
} from '../../utils'
import {
  StyledEarlyWarningTable,
  StyledStudentTable,
  TableContainer,
} from '../common/styledComponents'
import TableFilters from './Filters'
import { StyledEmptyContainer } from '../../../common/components/styledComponents'
import useErrorNotification from '../../../../../common/hooks/useErrorNotification'
import {
  compareByKeys,
  isAddToStudentGroupEnabled,
} from '../../../common/utils'
import FeaturesSwitch from '../../../../../../../features/components/FeaturesSwitch'
import AddToGroupModal from '../../../../../common/components/Popups/AddToGroupModal'
import useRowSelection from '../../../../../common/hooks/useRowSelection'

const EarlyWarningTable = ({
  location,
  settings,
  tableFilters,
  setTableFilters,
  getTableDrillDownUrl,
  setTablePagination,
  compareByOptions,
  isSharedReport = false,
  feedTypes,
}) => {
  const query = useMemo(
    () =>
      stringifyArrayFilters({
        ...settings.requestFilters,
        ...tableFilters,
        [tableFilterTypes.COMPARE_BY]:
          tableFilters[tableFilterTypes.COMPARE_BY]?.key,
        [tableFilterTypes.RISK]: tableFilters[tableFilterTypes.RISK],
      }),
    [settings.requestFilters, tableFilters]
  )

  const { data, loading, error } = useApiQuery(
    dataWarehouseApi.getEarlyWarningDetails,
    [query],
    {
      enabled: !isEmpty(settings.requestFilters) && !isEmpty(tableFilters),
      deDuplicate: false,
    }
  )

  const isStudentCompareBy = useMemo(
    () =>
      tableFilters[tableFilterTypes.COMPARE_BY].key === compareByKeys.STUDENT,
    [tableFilters[tableFilterTypes.COMPARE_BY]]
  )

  const { metrics: tableData = [], rowsCount = 0, hasNextPage } =
    data?.result || {}

  const tableDataToUse = useMemo(
    () => (isStudentCompareBy ? transformTableData(tableData) : tableData),
    [isStudentCompareBy, tableData, tableFilters]
  )

  const tableColumns = useMemo(
    () =>
      getTableColumns({
        compareBy: tableFilters[tableFilterTypes.COMPARE_BY],
        getTableDrillDownUrl,
        filters: settings.requestFilters,
        isStudentCompareBy,
        tableColumnsData: isStudentCompareBy
          ? compareByStudentColumns
          : tableColumnsData,
        tableData: tableDataToUse,
        feedTypes,
      }),
    [
      tableFilters[tableFilterTypes.COMPARE_BY],
      location,
      settings.requestFilters,
      isStudentCompareBy,
      tableDataToUse,
      feedTypes,
    ]
  )

  const showAddToStudentGroupBtn = isAddToStudentGroupEnabled(
    isSharedReport,
    tableFilters[tableFilterTypes.COMPARE_BY]?.key
  )

  const {
    rowSelection,
    showAddToGroupModal,
    setShowAddToGroupModal,
    checkedStudentsForModal,
    handleAddToGroupClick,
  } = useRowSelection(tableDataToUse, showAddToStudentGroupBtn)

  const tableToRender = isStudentCompareBy
    ? StyledStudentTable
    : StyledEarlyWarningTable

  const hasContent = !loading && !error && tableDataToUse.length

  const errorMsg =
    error?.response?.status === 400
      ? error?.message
      : 'Sorry, you have hit an unexpected error.'
  const emptyContainerDesc = error ? errorMsg : 'No Data Available'
  useErrorNotification(errorMsg, error)

  return (
    <TableContainer>
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
      <TableFilters
        tableFilters={tableFilters}
        setTableFilters={setTableFilters}
        compareByOptions={compareByOptions}
        showAddToStudentGroupBtn={showAddToStudentGroupBtn}
        handleAddToGroupClick={handleAddToGroupClick}
      />
      <EduIf condition={loading}>
        <EduThen>
          <SpinLoader
            tip="Loading table data, it may take a while"
            height="120px"
            position="relative"
          />
        </EduThen>
        <EduElse>
          <EduIf condition={hasContent}>
            <EduThen>
              <CsvTable
                dataSource={tableDataToUse}
                columns={tableColumns}
                tableToRender={tableToRender}
                onCsvConvert={() => {}}
                isCsvDownloading={false}
                rowSelection={rowSelection}
                bordered
                rowKey={({ dimension }) => dimension._id}
                pagination={false}
              />
              <BackendPagination
                itemsCount={rowsCount}
                backendPagination={{
                  page: tableFilters.page,
                  pageSize: tableFilters.pageSize,
                }}
                setBackendPagination={setTablePagination}
                hasNextPage={hasNextPage}
              />
            </EduThen>
            <EduElse>
              <StyledEmptyContainer
                margin="0"
                description={emptyContainerDesc}
              />
            </EduElse>
          </EduIf>
        </EduElse>
      </EduIf>
    </TableContainer>
  )
}

export default EarlyWarningTable
