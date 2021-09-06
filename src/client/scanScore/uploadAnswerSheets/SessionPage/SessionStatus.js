import React, { useMemo } from 'react'
import { Link } from 'react-router-dom'
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
import { omrSheetScanStatus } from '../utils'

const SessionStatus = ({
  assignmentId,
  groupId,
  pages = [],
  handleAbortClick,
  toggleStatusFilter,
}) => {
  const { success, failed, scanned, scanProgress } = useMemo(() => {
    const _success = pages.filter((p) => p.status === omrSheetScanStatus.DONE)
      .length
    const _failed = pages.filter((p) => p.status > omrSheetScanStatus.DONE)
      .length
    const _scanned = _success + _failed
    const _scanProgress = pages.length
      ? Number(((100 * _scanned) / pages.length).toFixed(2))
      : 0
    return {
      success: _success,
      failed: _failed,
      scanned: _success + _failed,
      scanProgress: _scanProgress > 1 ? _scanProgress : 1,
    }
  }, [pages])

  const isDone = window.location.search.includes('done=1')

  return (
    <SessionStatusContainer>
      <div className="inner-container">
        <div className="scan-progress-text">
          {isDone ? 'Form Processing Done' : 'Form Processing Progress'}
        </div>
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
          <div className="scan-result-text-label">Forms Processed</div>
          <div className="scan-result-text-value">{scanned}</div>
        </div>
        <div className="scan-result-text">
          <div data-cy="success" className="scan-result-text-label">
            Success
            {success ? (
              <span
                className="scan-result-text-action"
                onClick={() => toggleStatusFilter(omrSheetScanStatus.DONE)}
              >
                View
              </span>
            ) : null}
          </div>
          <div className="scan-result-text-value">{success}</div>
        </div>
        <div className="scan-result-text">
          <div data-cy="failed" className="scan-result-text-label">
            Failed
            {failed ? (
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
          <div className="scan-result-text-value failed">{failed}</div>
        </div>
        {scanned === pages.length && (
          <>
            <div className="static-text">
              Successfully scanned responses have been recorded on Edulastic.
            </div>
            <div className="static-navigation-links">
              <Link
                data-cy="uploadAgainButton"
                className="upload-again-link"
                to={{
                  pathname: '/uploadAnswerSheets',
                  search: `?assignmentId=${assignmentId}&groupId=${groupId}`,
                }}
              >
                Upload Again
              </Link>
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
            </div>
          </>
        )}
      </div>
    </SessionStatusContainer>
  )
}

export default SessionStatus

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
  .static-text {
    margin: 50px 0 20px;
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
