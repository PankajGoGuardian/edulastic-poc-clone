import React from 'react'
import styled from 'styled-components'
import { Tooltip } from 'antd'

import { IconPDFFile } from '@edulastic/icons'

import {
  white,
  themeColor,
  themeColorBlue,
  greyThemeDark1,
  greyThemeDark2,
  backgroundGrey,
  borderGrey,
} from '@edulastic/colors'

import { formatBytes } from '../utils'

const UploadProgress = ({
  uploadProgress: _uploadProgress,
  currentSession,
  handleCancelUpload,
}) => {
  const uploadProgress = (_uploadProgress || 0).toFixed(2)
  return (
    <UploadProgressContainer uploadProgress={uploadProgress}>
      <div className="inner-container">
        <div className="uploading-text">Uploading...</div>
        <div className="upload-progress" uploadProgress={uploadProgress}>
          <div className="upload-progress-front">{uploadProgress} %</div>
          <div className="upload-progress-back">{uploadProgress} %</div>
        </div>
        <div className="file-details-container">
          <IconPDFFile width={25} height={25} />
          <div className="file-details">
            <Tooltip title={currentSession?.source?.name}>
              <span className="file-name">
                {currentSession?.source?.name || ''}
              </span>
            </Tooltip>
            <span className="file-size">
              {formatBytes(currentSession?.source?.size)}
            </span>
          </div>
        </div>
        {handleCancelUpload && (
          <div className="stop-upload-container">
            <div className="stop-upload" onClick={handleCancelUpload}>
              STOP
            </div>
          </div>
        )}
      </div>
    </UploadProgressContainer>
  )
}

export default UploadProgress

const UploadProgressContainer = styled.div`
  margin: 40px;
  display: flex;
  justify-content: center;
  .inner-container {
    background-color: ${backgroundGrey};
    border-radius: 4px;
    padding: 50px 30px;
    height: auto;
    width: 500px;
  }
  .uploading-text {
    font-size: 16px;
    font-weight: bold;
    text-align: center;
    color: ${greyThemeDark1};
  }
  .upload-progress {
    position: relative;
    display: flex;
    height: 30px;
    border-radius: 4px;
    font-size: 14px;
    font-weight: bold;
    overflow: hidden;
    margin-top: 80px;
  }
  .upload-progress-back {
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 5px;
    width: 100%;
    background: ${themeColorBlue};
    color: ${white};
  }
  .upload-progress-front {
    position: absolute;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 5px;
    left: 0;
    right: -1px;
    top: 0;
    bottom: 0;
    background: ${borderGrey};
    color: ${greyThemeDark1};
    clip-path: inset(0 0 0 ${({ uploadProgress }) => uploadProgress || 0}%);
    -webkit-clip-path: inset(
      0 0 0 ${({ uploadProgress }) => uploadProgress || 0}%
    );
    transition: clip-path 1s linear;
  }
  .file-details-container {
    display: flex;
    margin-top: 15px;
    align-items: center;
    .file-details {
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: space-between;
      overflow: hidden;
      .file-name {
        width: 70%;
        font-size: 12px;
        font-weight: 600;
        margin-left: 20px;
        color: ${greyThemeDark1};
        text-transform: uppercase;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      .file-size {
        font-size: 12px;
        font-weight: 600;
        float: right;
        color: ${greyThemeDark2};
      }
    }
  }
  .stop-upload-container {
    margin-top: 50px;
    display: flex;
    justify-content: center;
    .stop-upload {
      color: ${themeColor};
      background-color: transparent;
      border: 2px solid ${themeColor};
      border-radius: 4px;
      margin: 2.5px;
      padding: 6px;
      font-weight: 600;
      font-size: 12px;
      width: 180px;
      text-align: center;
      transition: 0.1s ease-in;
      &:hover {
        color: ${white};
        background-color: ${themeColorBlue};
        border: 1.5px solid ${themeColorBlue};
      }
    }
  }
`
