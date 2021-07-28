import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import styled from 'styled-components'
import { Pagination, Spin } from 'antd'

import { themeColor, white, themeColorBlue } from '@edulastic/colors'

const DocImage = ({ uri, scannedUri }) => {
  const [loaded, setLoaded] = useState(false)
  const [loadError, setLoadError] = useState(false)
  if (loadError) {
    console.warn(loadError)
  }
  useEffect(() => {
    const img = new Image()
    setLoaded(false)
    img.src = scannedUri
    img.onload = () => {
      setLoaded(true)
    }
    img.onerror = () => {
      setLoaded(true)
      setLoadError(true)
    }
  }, [scannedUri])

  if (loaded) {
    return <StyledImg src={scannedUri || uri} />
  }
  return <Spin />
}

const ScannedResponses = ({
  docs,
  pageNumber,
  setPageNumber,
  closePage,
  assignmentId,
  groupId,
}) => {
  return (
    <ScannedResponsesContainer>
      <CenterDiv>
        {docs[pageNumber - 1] && <DocImage {...docs[pageNumber - 1]} />}
        <div className="static-navigation-links">
          <Link
            className="fix-grade-link"
            to={{
              pathname: `/author/expressgrader/${assignmentId}/${groupId}`,
            }}
            target="_blank"
          >
            Fix Grade
          </Link>
          <Link
            className="review-answers-link"
            to={{
              pathname: `/author/classboard/${assignmentId}/${groupId}`,
            }}
            target="_blank"
          >
            Review Answers
          </Link>
        </div>
      </CenterDiv>
      <div className="back-link" onClick={closePage}>
        {'< Back'}
      </div>
      <StyledPagination
        current={pageNumber}
        total={docs.length}
        onChange={(page) => {
          setPageNumber(page)
        }}
        pageSize={1}
      />
    </ScannedResponsesContainer>
  )
}

export default ScannedResponses

const ScannedResponsesContainer = styled.div`
  .back-link {
    cursor: pointer;
    position: absolute;
    margin-left: 40px;
    align-self: flex-start;
    left: 15px;
    bottom: 15px;
    font-size: 12px;
    font-weight: 600;
    color: ${themeColor};
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
`

const CenterDiv = styled.div`
  display: block;
  position: relative;
  margin-left: auto;
  margin-right: auto;
  width: 60%;
  min-height: 200px;
`

const StyledPagination = styled(Pagination)`
  align-self: flex-end;
  margin-top: 15px;
  margin-right: 35px;
  position: absolute;
  right: 15px;
  bottom: 15px;
`

const StyledImg = styled.img`
  width: 100%;
  object-fit: contain;
`
