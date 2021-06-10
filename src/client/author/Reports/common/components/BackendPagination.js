import React from 'react'
import { Pagination } from 'antd'

const BackendPagination = ({
  itemsCount,
  backendPagination,
  setBackendPagination,
}) => (
  <Pagination
    style={{ margin: '10px' }}
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
