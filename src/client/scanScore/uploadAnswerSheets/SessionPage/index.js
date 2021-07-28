import React, { useState, useMemo } from 'react'
import { Slider } from 'antd'

import ScannedResponses from './ScannedResponses'
import SessionStatus from './SessionStatus'
import Thumbnail from './Thumbnail'

import { getFileNameFromUri, omrSheetScanStatus } from '../utils'

const SessionPage = ({
  assignmentId,
  groupId,
  pages,
  handleAbortClick,
  showResponses,
  toggleShowResponses,
}) => {
  const [pageNumber, setPageNumber] = useState(1)
  const [statusFilters, setStatusFilters] = useState([])
  const [thumbnailSize, setThumbnailSize] = useState(150)

  const filteredPages = useMemo(() => {
    return pages.filter(
      (p) => !statusFilters.length || statusFilters.includes(p.status)
    )
  }, [pages, statusFilters])

  return showResponses ? (
    <ScannedResponses
      assignmentId={assignmentId}
      groupId={groupId}
      docs={filteredPages}
      pageNumber={pageNumber}
      setPageNumber={setPageNumber}
      closePage={() => {
        toggleShowResponses(false)
        setPageNumber(1)
      }}
    />
  ) : (
    <>
      <SessionStatus
        assignmentId={assignmentId}
        groupId={groupId}
        pages={pages}
        handleAbortClick={handleAbortClick}
        toggleStatusFilter={(...statusList) =>
          setStatusFilters((prevStatusFilters) =>
            statusList.filter((s) => !prevStatusFilters.includes(s))
          )
        }
      />
      {statusFilters.length ? (
        <>
          <div
            style={{ textAlign: 'center', fontSize: '18px', fontWeight: '700' }}
          >
            {statusFilters.includes(omrSheetScanStatus.DONE)
              ? 'Successfully Scanned Responses'
              : 'Responses with Scan Errors'}
          </div>
          <div style={{ margin: '0 40px 80px 40px' }}>
            <Slider
              min={50}
              max={250}
              value={thumbnailSize}
              onChange={setThumbnailSize}
              tooltipVisible={false}
            />
            <div style={{ display: 'flex', margin: '20px 0 20px 0' }}>
              {filteredPages.map((page, index) => {
                const name = page.studentName || getFileNameFromUri(page.uri)
                const onClick = () => {
                  setPageNumber(index + 1)
                  toggleShowResponses(true)
                }
                return (
                  <Thumbnail
                    name={name}
                    size={thumbnailSize}
                    uri={page.scannedUri || page.uri}
                    status={page.status}
                    message={page.message}
                    onClick={
                      page.status === omrSheetScanStatus.DONE ? onClick : null
                    }
                  />
                )
              })}
            </div>
          </div>
        </>
      ) : null}
    </>
  )
}

export default SessionPage
