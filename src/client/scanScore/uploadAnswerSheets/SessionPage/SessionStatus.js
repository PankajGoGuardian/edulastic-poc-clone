import React, { useMemo } from 'react'
import styled from 'styled-components'
import { Progress, Button } from 'antd'

import {
  themeColorBlue,
  greyThemeDark1,
  themeColorLight,
  red,
} from '@edulastic/colors'
import { omrSheetScanStatus } from '../utils'

const SessionStatus = ({
  assignmentId,
  groupId,
  pages = [],
  handleAbortClick,
  toggleShowThumbnails,
}) => {
  const { success, failed, scanned, scanProgress } = useMemo(() => {
    const _success = pages.filter((p) => p.status === omrSheetScanStatus.DONE)
      .length
    const _failed = pages.filter((p) => p.status > omrSheetScanStatus.DONE)
      .length
    const _scanned = _success + _failed
    const _scanProgress = Number(((100 * _scanned) / pages.length).toFixed(2))
    return {
      success: _success,
      failed: _failed,
      scanned: _success + _failed,
      scanProgress: _scanProgress,
    }
  }, [pages])

  return (
    <SessionStatusContainer>
      <div className="inner-container">
        <div className="scan-progress-text">Scan Progress</div>
        <div className="scan-progress">
          <Progress
            strokeColor={themeColorBlue}
            percent={scanProgress}
            status="active"
            showInfo={false}
          />
          {handleAbortClick && (
            <div className="stop-scan" onClick={handleAbortClick}>
              STOP
            </div>
          )}
        </div>
        <div className="scan-result-text">
          <div className="scan-result-text-label">Responses Scanned</div>
          <div className="scan-result-text-value">{scanned}</div>
        </div>
        <div className="scan-result-text">
          <div className="scan-result-text-label">
            Success
            <span
              className="scan-result-text-action"
              onClick={toggleShowThumbnails}
            >
              View
            </span>
          </div>
          <div className="scan-result-text-value">{success}</div>
        </div>
        <div className="scan-result-text">
          <div className="scan-result-text-label">
            Failed
            <span
              className="scan-result-text-action"
              onClick={toggleShowThumbnails}
            >
              View
            </span>
          </div>
          <div className="scan-result-text-value failed">{failed}</div>
        </div>
        <div className="static-text">
          Successfully scanned responses have been recorded on Edulastic.
        </div>
        <div className="live-classboard-link">
          <Button type="primary" onClick={() => {}}>
            View Live Class Board
          </Button>
        </div>
      </div>
    </SessionStatusContainer>
  )
}

export default SessionStatus

const SessionStatusContainer = styled.div`
  margin: 40px 40px 20px 40px;
  display: flex;
  justify-content: center;
  color: ${greyThemeDark1};
  .inner-container {
    border-radius: 5px;
    padding: 50px 30px;
    height: auto;
    width: 500px;
  }
  .scan-progress-text {
    font-size: 24px;
    font-weight: bold;
    text-align: center;
  }
  .scan-progress {
    display: flex;
    align-items: baseline;
    margin: 20px 40px 50px 40px;
    .stop-scan {
      width: 50px;
      text-align: center;
      padding-left: 20px;
      font-size: 10px;
      font-weight: 700;
      color: ${themeColorLight};
    }
  }
  .scan-result-text {
    display: flex;
    margin: 15px 40px;
    align-items: baseline;
    justify-content: space-between;
    font-size: 12px;
    font-weight: 700;
    text-transform: uppercase;
    .scan-result-text-label {
    }
    .scan-result-text-action {
      padding-left: 5px;
      font-size: 10px;
      color: ${themeColorLight};
    }
    .scan-result-text-value {
      width: 50px;
      text-align: center;
      padding-left: 20px;
    }
    .failed {
      color: ${red};
    }
  }
  .static-text {
    margin: 50px 0;
  }
  .live-classboard-link {
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
