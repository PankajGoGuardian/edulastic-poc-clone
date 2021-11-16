import React from 'react'
import { Link } from 'react-router-dom'
import styled from 'styled-components'

import { Button, Pagination } from 'antd'

import { themeColor, white, themeColorBlue } from '@edulastic/colors'

const ScanResult = ({
  pages,
  pageNumber,
  setPageNumber,
  closePage,
  assignmentId,
  groupId,
}) => {
  const page = pages[pageNumber - 1]
  return (
    <ScanResultContainer>
      <Button
        className="left-navigation-arrow"
        type="primary"
        shape="circle"
        icon="caret-left"
        onClick={() => setPageNumber(pageNumber > 1 ? pageNumber - 1 : 1)}
        style={{ visibility: pageNumber > 1 ? 'visible' : 'hidden' }}
      />
      <Button
        className="right-navigation-arrow"
        type="primary"
        shape="circle"
        icon="caret-right"
        onClick={() =>
          setPageNumber(
            pageNumber < pages.length ? pageNumber + 1 : pages.length
          )
        }
        style={{ visibility: pageNumber < pages.length ? 'visible' : 'hidden' }}
      />
      <div className="static-navigation-links">
        <Link
          className="fix-grade-link"
          to={{
            pathname: `/author/expressgrader/${assignmentId}/${groupId}`,
          }}
          target="_blank"
        >
          Adjust Grades
        </Link>
        {/* TODO: support for redirecting to testActivity in LCB without testActivityId is required */}
        {/* <Link
          className="review-answers-link"
          to={{
            pathname: `/author/classboard/${assignmentId}/${groupId}`,
          }}
          target="_blank"
        >
          Review Answers
        </Link> */}
      </div>
      <div className="scanned-image-container">
        {page && (
          <img
            className="scanned-image"
            src={page.scannedUri || page.uri}
            alt="scannedImage"
          />
        )}
      </div>
      <div className="footer-container">
        <div className="footer-section-1" onClick={closePage}>
          {'< Back to Scan Summary'}
        </div>
        <div className="footer-section-3">
          <Pagination
            current={pageNumber}
            total={pages.length}
            onChange={(pno) => setPageNumber(pno)}
            pageSize={1}
          />
        </div>
      </div>
    </ScanResultContainer>
  )
}

export default ScanResult

const ScanResultContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  position: relative;
  .left-navigation-arrow {
    position: absolute;
    left: 0;
    top: 50%;
    background-color: ${themeColor};
    &:hover {
      background-color: ${themeColorBlue};
    }
  }
  .right-navigation-arrow {
    position: absolute;
    right: 0;
    top: 50%;
    background-color: ${themeColor};
    &:hover {
      background-color: ${themeColorBlue};
    }
  }
  .static-navigation-links {
    position: absolute;
    right: 0%;
    top: 3%;
    width: 15%;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    a {
      color: ${themeColor};
      background-color: transparent;
      border: 2px solid ${themeColor};
      border-radius: 4px;
      margin: 2.5px;
      padding: 6px;
      font-weight: 600;
      font-size: 12px;
      text-align: center;
      transition: 0.1s ease-in;
      &.review-answers-link {
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
  .scanned-image-container {
    margin: 0 40px;
    width: 60%;
    height: auto;
    align-self: center;
    .scanned-image {
      width: 100%;
      object-fit: contain;
    }
  }
  .footer-container {
    display: flex;
    width: 100%;
    align-items: center;
    .footer-section-1 {
      flex: 1;
      cursor: pointer;
      font-size: 12px;
      font-weight: 600;
      color: ${themeColor};
    }
    .footer-section-3 {
      flex: 1;
      .ant-pagination {
        float: right;
      }
    }
  }
`
