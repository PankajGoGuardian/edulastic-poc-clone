import React, { useState } from 'react'
import { Row, Col, Button, Slider } from 'antd'

import { ScannedResponses } from './ScannedResponses'
import { Thumbnail, ThumbnailDropdown } from './Thumbnail'

import { statusFilterOptions, getFileNameFromUri } from '../utils'

const SessionPage = ({ pages, handleAbortClick }) => {
  const [showResponses, setShowResponses] = useState(false)
  const [pageNumber, setPageNumber] = useState(1)
  const [statusFilter, setStatusFilter] = useState(statusFilterOptions[0])
  const [thumbnailSize, setThumbnailSize] = useState(150)

  return showResponses ? (
    <ScannedResponses
      docs={pages}
      pageNumber={pageNumber}
      setPageNumber={setPageNumber}
      closePage={() => {
        setShowResponses(false)
        setPageNumber(1)
      }}
    />
  ) : (
    <Row
      type="flex"
      justify="space-between"
      style={{ padding: '40px' }}
      gutter={[10, 30]}
    >
      <Col span={6}>
        <ThumbnailDropdown
          defaultValue={statusFilterOptions[0]}
          value={statusFilter}
          options={statusFilterOptions}
          handleChange={setStatusFilter}
        />
      </Col>
      <Col span={12}>
        {handleAbortClick && (
          <Button type="primary" onClick={handleAbortClick}>
            Abort
          </Button>
        )}
      </Col>
      <Col span={6}>
        <Slider
          min={50}
          max={250}
          value={thumbnailSize}
          onChange={setThumbnailSize}
          tooltipVisible={false}
        />
      </Col>
      <Col span={24} style={{ display: 'flex', flexWrap: 'wrap' }}>
        {pages
          .filter(
            (page) => !statusFilter.key || statusFilter.key == page.status
          )
          .map((page, index) => {
            const name = page.studentName || getFileNameFromUri(page.uri)
            const onClick = () => {
              setPageNumber(index + 1)
              setShowResponses(true)
            }
            return (
              <Thumbnail
                name={name}
                size={thumbnailSize}
                uri={page.uri}
                status={page.status}
                message={page.message}
                onClick={page.status === 3 ? onClick : null}
              />
            )
          })}
      </Col>
    </Row>
  )
}

export default SessionPage
