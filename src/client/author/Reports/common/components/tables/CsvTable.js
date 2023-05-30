import React, { useRef, useEffect, useMemo } from 'react'
import { filter, includes, omit } from 'lodash'
import styled from 'styled-components'
import { connect } from 'react-redux'
import { convertTableToCSV } from '../../util'
import { getPrintingState } from '../../../ducks'

const defaultPagination = {
  hideOnSinglePage: true,
  pageSize: 50,
}

const CsvTable = ({
  onCsvConvert,
  isCsvDownloading,
  tableToRender,
  dataSource,
  getColumnHeaders,
  columns,
  pagination = defaultPagination,
  ...restProps
}) => {
  const Component = tableToRender
  const childrenRef = useRef(null)

  const [_pagination, _columns] = useMemo(() => {
    let __columns = columns.map((c) =>
      omit(c, restProps.isPrinting ? ['fixed'] : [])
    )
    const __pagination = pagination ? { ...pagination } : pagination

    if (isCsvDownloading) {
      if (__pagination) __pagination.pageSize = dataSource.length
      __columns = filter(__columns, (column) =>
        column.visibleOn ? includes(column.visibleOn, 'csv') : true
      )
    } else {
      __columns = filter(__columns, (column) =>
        column.visibleOn ? includes(column.visibleOn, 'browser') : true
      )
    }

    if (pagination && typeof __pagination.pageSize === 'undefined') {
      __pagination.pageSize = 50
    }

    if (pagination && typeof __pagination.hideOnSinglePage === 'undefined') {
      __pagination.hideOnSinglePage = true
    }

    return [__pagination, __columns]
  }, [columns, restProps.isPrinting, pagination, isCsvDownloading, dataSource])

  useEffect(() => {
    if (isCsvDownloading && childrenRef.current) {
      const { csvText, csvRawData } = convertTableToCSV(
        childrenRef.current,
        getColumnHeaders
      )
      onCsvConvert(csvText, csvRawData)
    }
  }, [isCsvDownloading])

  return (
    <StyledTableWrapper ref={childrenRef}>
      <Component
        {...restProps}
        dataSource={dataSource}
        pagination={_pagination}
        columns={_columns}
      />
    </StyledTableWrapper>
  )
}

const StyledTableWrapper = styled.div`
  @media print {
    colgroup {
      display: none;
    }
    table {
      overflow-wrap: break-word;
    }
    .ant-table-layout-fixed .ant-table-scroll .ant-table-body {
      overflow-x: hidden !important;
    }
  }
`

export default connect(
  (state) => ({
    isPrinting: getPrintingState(state),
  }),
  null
)(CsvTable)
