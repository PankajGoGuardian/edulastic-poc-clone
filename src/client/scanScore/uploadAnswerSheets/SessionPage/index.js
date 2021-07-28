import React, { useState } from 'react'
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
  const [showThumbnails, setShowThumbnails] = useState(false)
  const [thumbnailSize, setThumbnailSize] = useState(150)

  return showResponses ? (
    <ScannedResponses
      docs={pages}
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
        toggleShowThumbnails={() => setShowThumbnails(!showThumbnails)}
      />
      {showThumbnails && (
        <>
          <div
            style={{ textAlign: 'center', fontSize: '18px', fontWeight: '700' }}
          >
            Successfully Scanned Responses
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
              {pages.map((page, index) => {
                const name = page.studentName || getFileNameFromUri(page.uri)
                const onClick = () => {
                  setPageNumber(index + 1)
                  toggleShowResponses(true)
                }
                return (
                  <Thumbnail
                    name={name}
                    size={thumbnailSize}
                    uri={page.uri}
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
      )}
    </>
  )
}

export default SessionPage
