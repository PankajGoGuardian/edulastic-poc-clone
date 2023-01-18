import React, { useState, useEffect, useMemo } from 'react'
import { withRouter, Link } from 'react-router-dom'
import styled from 'styled-components'
import { Progress } from 'antd'

import {
  themeColor,
  themeColorBlue,
  greyThemeDark1,
  themeColorLight,
  red,
  white,
} from '@edulastic/colors'
import { getUserConfirmation } from '../../../common/utils/helpers'
import { omrSheetScanStatus, omrUploadSessionStatus } from '../utils'

const uploadAgainHandler = (assignmentId, groupId, history) => {
  getUserConfirmation(
    'Sheets for this class is already scanned. Do you want to replace?',
    (ok) => {
      if (ok) {
        history.push({
          pathname: '/uploadAnswerSheets',
          search: `?assignmentId=${assignmentId}&groupId=${groupId}`,
        })
      }
    }
  )
}

const SessionStatus = ({
  sessionStatus = omrUploadSessionStatus.SCANNING,
  sessionMessage = '',
  assignmentId,
  groupId,
  pages = [],
  handleAbortClick,
  toggleStatusFilter,
  history,
}) => {
  const [fakeProgress, setFakeProgress] = useState(0)

  useEffect(() => {
    if (fakeProgress < 80) {
      setTimeout(() => setFakeProgress(fakeProgress + 1), fakeProgress * 500)
    }
  }, [fakeProgress])

  const {
    successCount,
    failedCount,
    scannedCount,
    scanProgress,
  } = useMemo(() => {
    const _successCount = pages.filter(
      (p) => p.status === omrSheetScanStatus.DONE
    ).length
    const _failedCount = pages.filter((p) => p.status > omrSheetScanStatus.DONE)
      .length
    const _scanned = _successCount + _failedCount
    // scan progress when scanning is in progress
    let _scanProgress = pages.length
      ? Number(((100 * _scanned) / pages.length).toFixed(2))
      : 0
    // set scan progress to 100% when scanning is completed
    if (sessionStatus > omrUploadSessionStatus.SCANNING) {
      _scanProgress = 100
    }
    return {
      successCount: _successCount,
      failedCount: _failedCount,
      scannedCount: _successCount + _failedCount,
      scanProgress: _scanProgress > 1 ? _scanProgress : 1,
    }
  }, [pages, sessionStatus])

  const isDone = scanProgress === 100
  const progressMessage = isDone
    ? 'Form Processing Done'
    : 'Form Processing In Progress...'
  const progressHint = isDone
    ? ''
    : '(System is processing the uploaded bubble sheets. You can either wait or close the page and revisit the scan bubble sheet page after sometime.)'
  const scanResultMessage =
    sessionStatus === omrUploadSessionStatus.FAILED ||
    sessionStatus === omrUploadSessionStatus.ABORTED
      ? sessionMessage
      : 'Successfully scanned responses have been recorded on Edulastic.'

  const viewLiveClassboardNavigation =
    sessionStatus === omrUploadSessionStatus.FAILED ||
    sessionStatus === omrUploadSessionStatus.ABORTED ? null : (
      <Link
        data-cy="viewLiveClassBoard"
        className="live-classboard-link"
        to={{
          pathname: `/author/classboard/${assignmentId}/${groupId}`,
        }}
        target="_blank"
      >
        View Live Class Board
      </Link>
    )

  return (
    <SessionStatusContainer>
      <div className="inner-container">
        <div className="scan-progress-text">
          <p>{progressMessage}</p>
          <p style={{ color: 'GrayText', fontSize: '0.5em' }}>{progressHint}</p>
        </div>
        <div className="scan-progress">
          <Progress
            strokeColor={themeColorBlue}
            percent={
              pages.length && fakeProgress > scanProgress
                ? fakeProgress
                : scanProgress
            }
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
          <div className="scan-result-text-label">Forms Processed</div>
          <div className="scan-result-text-value">{scannedCount}</div>
        </div>
        <div className="scan-result-text">
          <div data-cy="success" className="scan-result-text-label">
            Success
            {successCount ? (
              <span
                className="scan-result-text-action"
                onClick={() => toggleStatusFilter(omrSheetScanStatus.DONE)}
              >
                View
              </span>
            ) : null}
          </div>
          <div className="scan-result-text-value">{successCount}</div>
        </div>
        <div className="scan-result-text">
          <div data-cy="failed" className="scan-result-text-label">
            Failed
            {failedCount ? (
              <span
                className="scan-result-text-action"
                onClick={() =>
                  toggleStatusFilter(
                    omrSheetScanStatus.FAILED,
                    omrSheetScanStatus.ABORTED
                  )
                }
              >
                View
              </span>
            ) : null}
          </div>
          <div className="scan-result-text-value failed">{failedCount}</div>
        </div>
        {isDone && (
          <>
            <div className="scan-result-message">{scanResultMessage}</div>
            <div className="static-navigation-links">
              <a
                data-cy="uploadAgainButton"
                className="upload-again-link"
                onClick={() => {
                  uploadAgainHandler(assignmentId, groupId, history)
                }}
              >
                Upload Again
              </a>
              {viewLiveClassboardNavigation}
            </div>
          </>
        )}
      </div>
    </SessionStatusContainer>
  )
}

export default withRouter(SessionStatus)

const SessionStatusContainer = styled.div`
  margin: 0 40px;
  display: flex;
  justify-content: center;
  color: ${greyThemeDark1};
  .inner-container {
    border-radius: 5px;
    padding: 30px;
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
      cursor: pointer;
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
      cursor: pointer;
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
  .scan-result-message {
    margin: 50px 0 20px;
    text-align: center;
  }
  .static-navigation-links {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    a {
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
      &.live-classboard-link {
        color: ${white};
        background-color: ${themeColor};
      }
      &:hover {
        color: ${white};
        background-color: ${themeColorBlue};
        border: 1.5px solid ${themeColorBlue};
      }
    }
  }
`
