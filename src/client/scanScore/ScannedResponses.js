import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import { Pagination, Spin, Icon } from 'antd'
import styled from 'styled-components'
import { slice, getScannedPageNumber } from './ducks'
import ScanPage from './scanPage'

function DocImage({ scannedUri }) {
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
    return <StyledImg src={scannedUri} />
  }
  return <Spin />
}

function ScannedResponse({ docs, pageNumber, setPageNumber, closePage }) {
  return (
    <ScanPage title="Scan Student Responses">
      <CenterDiv>
        <CloseIconStyled onClick={closePage} type="close" />
        {docs[pageNumber - 1] && <DocImage {...docs[pageNumber - 1]} />}
      </CenterDiv>
      <StyledFooter>
        <StyledPagination
          current={pageNumber}
          total={docs.length}
          onChange={(page) => {
            setPageNumber(page)
          }}
          pageSize={1}
        />
      </StyledFooter>
    </ScanPage>
  )
}

const CenterDiv = styled.div`
  display: block;
  position: relative;
  margin-left: auto;
  margin-right: auto;
  width: 50%;
  backhground: green;
`

const StyledFooter = styled.div`
  bottom: 10px;
  box-size: border-box;
  margin-left: 28px;
  margin-right: 28px;
  width: 100%;
  position: absolute;
`

const CloseIconStyled = styled(Icon)`
  position: absolute;
  top: 20px;
  right: 20px;
  cursor: pointer;
`

const StyledPagination = styled(Pagination)`
  align-self: flex-end;
  margin-top: 15px;
  margin-right: 30px;
  position: absolute;
  right: 15px;
  bottom: 15px;
`

const StyledImg = styled.img`
  width: 100%;
  object-fit: contain;
`

export default connect(
  (state) => ({
    pageNumber: getScannedPageNumber(state),
  }),
  {
    setPageNumber: slice.actions.setScannedPageNumber,
  }
)(ScannedResponse)
