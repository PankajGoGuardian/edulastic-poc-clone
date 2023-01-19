import React, { useState, useMemo } from 'react'

import ScanResult from './ScanResult'
import SessionStatus from './SessionStatus'
import ScannedResponses from './ScannedResponses'

import { getFileNameFromUri, parsePageNumberFromName } from '../utils'

const SessionPage = ({
  sessionStatus,
  sessionMessage,
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

  const sortedPages = useMemo(() => {
    const pagesWithPageNumber = pages.map((p) => {
      const fileName = getFileNameFromUri(p.uri)
      const pageNumber = parsePageNumberFromName(fileName)
      return { ...p, pageNumber }
    })
    return pagesWithPageNumber.sort((a, b) => a.pageNumber - b.pageNumber)
  }, [pages])

  const filteredPages = useMemo(() => {
    return sortedPages.filter(
      (p) => !statusFilters.length || statusFilters.includes(p.status)
    )
  }, [sortedPages, statusFilters])

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
        sessionStatus={sessionStatus}
        sessionMessage={sessionMessage}
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
