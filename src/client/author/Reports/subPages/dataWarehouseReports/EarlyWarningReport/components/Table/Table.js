import React, { useMemo } from 'react'
import {
  EduIf,
  EduThen,
  EduElse,
  SpinLoader,
  useApiQuery,
} from '@edulastic/common'
import { dataWarehouseApi } from '@edulastic/api'
import { isEmpty } from 'lodash'
import CsvTable from '../../../../../common/components/tables/CsvTable'
import BackendPagination from '../../../../../common/components/BackendPagination'
import useTableFilters from '../../hooks.js/useTableFilters'
import { getTableColumns, tableFilterTypes } from '../../utils'
import {
  StyledEarlyWarningTable,
  TableContainer,
} from '../common/styledComponents'
import TableFilters from './Filters'
import { StyledEmptyContainer } from '../../../common/components/styledComponents'
import useErrorNotification from '../../../../../common/hooks/useErrorNotification'

const EarlyWarningTable = ({
  location,
  settings,
  selectedCompareBy,
  compareByOptions,
}) => {
  const {
    tableFilters,
    setTableFilters,
    getTableDrillDownUrl,
    setTablePagination,
  } = useTableFilters({
    defaultCompareBy: selectedCompareBy,
    location,
    settings,
  })

  const query = useMemo(
    () => ({
      ...settings.requestFilters,
      ...tableFilters,
      compareBy: tableFilters.compareBy?.key,
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

  const tableColumns = useMemo(
    () =>
      getTableColumns(
        tableFilters[tableFilterTypes.COMPARE_BY],
        getTableDrillDownUrl,
        settings.requestFilters
      ),
    [
      tableFilters[tableFilterTypes.COMPARE_BY],
      location,
      settings.requestFilters,
    ]
  )

  const metrics = data?.result?.metrics
  const tableData = metrics || []

  const hasContent = !loading && !error && tableData.length

  const errorMsg = 'Error fetching Table data.'
  const emptyContainerDesc = error ? errorMsg : 'No Data Available'
  useErrorNotification(errorMsg, error)

  return (
    <TableContainer>
      <TableFilters
        tableFilters={tableFilters}
        setTableFilters={setTableFilters}
        compareByOptions={compareByOptions}
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
                dataSource={tableData}
                columns={tableColumns}
                tableToRender={StyledEarlyWarningTable}
                onCsvConvert={() => {}}
                isCsvDownloading={false}
                bordered
                rowKey={({ dimension }) => dimension._id}
              />
              <BackendPagination
                itemsCount={data?.result?.totalRows || 0}
                backendPagination={{
                  page: tableFilters.page,
                  pageSize: tableFilters.pageSize,
                }}
                setBackendPagination={setTablePagination}
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
