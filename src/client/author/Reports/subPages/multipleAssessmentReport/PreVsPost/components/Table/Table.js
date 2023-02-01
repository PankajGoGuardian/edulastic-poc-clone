import React from 'react'
import PropTypes from 'prop-types'
import { Typography } from 'antd'
import { darkGrey } from '@edulastic/colors'

import CsvTable from '../../../../../common/components/tables/CsvTable'
import TableFilters from '../filters/TableFilters'

import { StyledCard, DashedLine } from '../../../../../common/styled'
import { StyledTable, StyledRow } from '../../common/styledComponents'
import { compareByKeys } from '../../utils'
import { getTableColumns, onCsvConvert } from './utils'

const PreVsPostTable = ({
  dataSource,
  compareByOptions,
  analyseByOptions,
  rowSelection,
  selectedTableFilters,
  setTableFilters,
  handleAddToGroupClick,
  selectedPerformanceBand,
  isCsvDownloading,
}) => {
  // get table columns
  const tableColumns = getTableColumns(
    selectedTableFilters.compareBy.key,
    selectedTableFilters.analyseBy.key,
    selectedPerformanceBand,
    dataSource
  )
  return (
    <StyledCard>
      <StyledRow type="flex" justify="space-between" margin="20px">
        <Typography.Title style={{ margin: 0, fontSize: '18px' }} level={4}>
          Performance Change By {selectedTableFilters.compareBy.title}
        </Typography.Title>
        <DashedLine margin="15px 24px" dashColor={darkGrey} />
        <TableFilters
          setTableFilters={setTableFilters}
          compareByOptions={compareByOptions}
          analyseByOptions={analyseByOptions}
          handleAddToGroupClick={handleAddToGroupClick}
          selectedTableFilters={selectedTableFilters}
        />
      </StyledRow>
      <CsvTable
        dataSource={dataSource}
        columns={tableColumns}
        rowSelection={
          selectedTableFilters.compareBy.key === compareByKeys.STUDENT
            ? rowSelection
            : null
        }
        tableToRender={StyledTable}
        pagination={{ hideOnSinglePage: true, pageSize: 25 }}
        onCsvConvert={onCsvConvert}
        isCsvDownloading={isCsvDownloading}
        scroll={{ x: '100%' }}
      />
    </StyledCard>
  )
}

PreVsPostTable.propTypes = {
  dataSource: PropTypes.array.isRequired,
  isCsvDownloading: PropTypes.bool.isRequired,
}

export default PreVsPostTable
