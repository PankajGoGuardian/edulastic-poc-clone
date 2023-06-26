import React, { useRef, useMemo } from 'react'
import { filter, includes, omit } from 'lodash'
import styled from 'styled-components'

const defaultPagination = {
  hideOnSinglePage: true,
  pageSize: 50,
}

const CsvTable = ({
  tableToRender,
  dataSource,
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

    __columns = filter(__columns, (column) =>
      column.visibleOn ? includes(column.visibleOn, 'browser') : true
    )

    if (pagination && typeof __pagination.pageSize === 'undefined') {
      __pagination.pageSize = 50
    }

    if (pagination && typeof __pagination.hideOnSinglePage === 'undefined') {
      __pagination.hideOnSinglePage = true
    }

    return [__pagination, __columns]
  }, [columns, restProps.isPrinting, pagination, dataSource])

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
  }

  .ant-table-layout-fixed .ant-table-scroll .ant-table-body {
    overflow-x: hidden !important;
  }
`

export default CsvTable
