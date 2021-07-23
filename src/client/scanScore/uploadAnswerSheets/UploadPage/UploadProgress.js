import React from 'react'
import styled from 'styled-components'

import {
  white,
  themeColorBlue,
  greyThemeDark1,
  backgroundGrey,
  borderGrey,
} from '@edulastic/colors'

import { Button } from 'antd'

const UploadProgress = ({ uploadProgress, handleCancelUpload }) => {
  return (
    <StyledRow uploadProgress={uploadProgress}>
      <div className="inner-container">
        <div className="uploading-text">Uploading...</div>
        <div className="upload-progress" uploadProgress={uploadProgress}>
          <div className="upload-progress-front">{uploadProgress} %</div>
          <div className="upload-progress-back">{uploadProgress} %</div>
        </div>
        {handleCancelUpload && (
          <div className="stop-upload">
            <Button type="primary" onClick={handleCancelUpload}>
              STOP
            </Button>
          </div>
        )}
      </div>
    </StyledRow>
  )
}

export default UploadProgress

const StyledRow = styled.div`
  margin: 40px;
  display: flex;
  justify-content: center;
  .inner-container {
    background-color: ${backgroundGrey};
    border-radius: 5px;
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
    border-radius: 5px;
    font-size: 14px;
    font-weight: bold;
    overflow: hidden;
    margin-top: 80px;
  }
  .upload-progress-back {
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 6px;
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
  .stop-upload {
    margin-top: 80px;
    display: flex;
    justify-content: center;
    button {
      background-color: ${themeColorBlue};
      font-weight: 600;
      font-size: 12px;
      width: 180px;
    }
  }
`
