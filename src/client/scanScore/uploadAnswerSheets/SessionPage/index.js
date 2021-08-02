import React, { useState, useMemo } from 'react'

import ScanResult from './ScanResult'
import SessionStatus from './SessionStatus'
import ScannedResponses from './ScannedResponses'

const SessionPage = ({
  assignmentId,
  groupId,
  pages,
  handleAbortClick,
  showResponses,
  responsePageNumber,
  setResponsePageNumber,
}) => {
  const [statusFilters, setStatusFilters] = useState([])
  const [thumbnailSize, setThumbnailSize] = useState(150)

  const filteredPages = useMemo(() => {
    return pages.filter(
      (p) => !statusFilters.length || statusFilters.includes(p.status)
    )
  }, [pages, statusFilters])

  return showResponses ? (
    <ScanResult
      assignmentId={assignmentId}
      groupId={groupId}
      pages={filteredPages}
      pageNumber={responsePageNumber}
      setPageNumber={setResponsePageNumber}
      closePage={() => setResponsePageNumber(0)}
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
      <ScannedResponses
        thumbnailSize={thumbnailSize}
        setThumbnailSize={setThumbnailSize}
        setResponsePageNumber={setResponsePageNumber}
        statusFilters={statusFilters}
        pages={filteredPages}
      />
    </>
  )
}

export default SessionPage
