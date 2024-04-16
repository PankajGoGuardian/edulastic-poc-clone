import React from 'react'
import { Pagination } from 'antd'

const BackendPagination = ({
  itemsCount,
  backendPagination,
  setBackendPagination,
  hasMultiplePages,
}) => {
  const currentItemsCount =
    itemsCount ||
    backendPagination.itemsCount ||
    backendPagination.pageCount * backendPagination.pageSize

  // show dots on page 2 when item count is unknown but report has multiple pages
  const showDotsOnPageTwo = hasMultiplePages && !currentItemsCount

  const defaultItemsCount = showDotsOnPageTwo
    ? backendPagination.pageSize + 1 // items count to render for exactly two pagination boxes when totalCount is unknown
    : 1 // items count to hide pagination when totalCount is 0

  const itemRender = (current, type, originalElement) => {
    if (type === 'page' && current === 2 && showDotsOnPageTwo) {
      return <a>...</a>
    }
    return originalElement
  }

  return (
    <Pagination
      style={{ margin: '15px 55px 15px 10px' }}
      current={backendPagination.page}
      pageSize={backendPagination.pageSize}
      itemRender={itemRender}
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
      total={currentItemsCount || defaultItemsCount}
      showSizeChanger={false}
      hideOnSinglePage
    />
  )
}

export default BackendPagination
