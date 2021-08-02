import React from 'react'
import styled from 'styled-components'

import { Slider } from 'antd'
import Thumbnail from './Thumbnail'

import { getFileNameFromUri, omrSheetScanStatus } from '../utils'

const ScannedResponses = ({
  thumbnailSize,
  setThumbnailSize,
  setResponsePageNumber,
  statusFilters,
  pages,
}) => {
  return statusFilters.length ? (
    <ScannedResponsesContainer>
      <div className="scanned-responses-header">
        {statusFilters.includes(omrSheetScanStatus.DONE)
          ? 'Successfully Scanned Responses'
          : 'Responses with Scan Errors'}
      </div>
      <div className="thumbnails-container">
        <Slider
          className="thumbnails-size-slider"
          min={50}
          max={250}
          vertical
          value={thumbnailSize}
          onChange={setThumbnailSize}
          tooltipVisible={false}
        />
        <div className="thumbnails-inner-container">
          {pages.map((page, index) => {
            const name = page.studentName || getFileNameFromUri(page.uri)
            const onClick = () => setResponsePageNumber(index + 1)
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
    </ScannedResponsesContainer>
  ) : null
}

export default ScannedResponses

const ScannedResponsesContainer = styled.div`
	.scanned-responses-header {
		text-align: center;
		font-size: 18px;
		font-weight: 700;
	}
	.thumbnails-container {
		position: relative;
		margin: 0 40px 80px 40px;
		.thumbnails-size-slider {
			display: inline-block;
			position: absolute;
			right: -30px;
			height: 120px;
		}
		.thumbnails-inner-container {
			margin: 20px 0;
			display: flex;
			flex-wrap: wrap,
			justify-content: center;
		}
	}
`
