import React from 'react'
import Pagination from "antd/es/Pagination";

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
      backendPagination.pageCount * backendPagination.pageSize
    }
    showSizeChanger={false}
    hideOnSinglePage
  />
)

export default BackendPagination
