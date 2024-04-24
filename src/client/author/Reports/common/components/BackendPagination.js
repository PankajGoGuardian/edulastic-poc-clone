import React from 'react'
import { Pagination } from 'antd'
import { TABLE_PAGINATION_STYLE } from '../../../../common/styled'

const BackendPagination = ({
  itemsCount,
  backendPagination,
  setBackendPagination,
}) => (
  <Pagination
    style={TABLE_PAGINATION_STYLE}
    current={backendPagination.page}
    pageSize={backendPagination.pageSize}
    onChange={(page) =>
      setBackendPagination({
        ...backendPagination,
        page,
      })
    }
    onShowSizeChange={(_, pageSize) =>
      setBackendPagination({
        ...backendPagination,
        pageSize,
      })
    }
    total={
      itemsCount ||
      backendPagination.itemsCount ||
      backendPagination.pageCount * backendPagination.pageSize ||
      1 // default count of items to hide pagination when count is 0
    }
    showSizeChanger={false}
    hideOnSinglePage
  />
)

export default BackendPagination
