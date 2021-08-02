import React from 'react'
import styled from 'styled-components'
import { Spin } from 'antd'
import { omrSheetScanStatus } from '../utils'

// TODO: update UI for thumbnails
const FailedOverlay = ({ message }) => (
  <>
    <div className="show-on-hover">
      <span>{message || ''}</span>
    </div>
    <div className="icon">{'\u26A0'}</div>
  </>
)

const Thumbnail = ({ size, name, uri, status, message, onClick }) => (
  <div style={{ maxWidth: `${size || 150}px`, margin: '5px 15px' }}>
    <ThumbnailDiv width={size} onClick={onClick}>
      <Spin spinning={status === 2}>
        <img alt={name} src={uri} />
      </Spin>
      {status > omrSheetScanStatus.DONE && <FailedOverlay message={message} />}
    </ThumbnailDiv>
    <StyledTitle>{name}</StyledTitle>
  </div>
)

export default Thumbnail

const ThumbnailDiv = styled.div`
  ${(props) => (props.onClick ? `cursor: pointer;` : ``)}
  margin: 2px;
  display: flex;
  flex-direction: column;
  max-width: ${(props) => props.width || 150}px;
  height: auto;
  position: relative;
  & img {
    max-width: 100%;
    height: auto;
    box-shadow: 0 0 4px black;
  }
  & .ant-spin-container {
    display: flex;
    align-items: center;
    justify-content: center;
  }
  & .show-on-hover {
    display: flex;
    width: 100%;
    height: 100%;
    position: absolute;
    font-size: ${(props) => props.width / 15 || 10}px;
    top: 0;
    left: 0;
    background-color: rgba(255, 255, 255, 0.5);
    align-items: center;
    justify-content: center;
    text-align: center;
    backdrop-filter: blur(3px);
  }
  & .icon {
    position: absolute;
    top: 0;
    right: 0;
    color: red;
  }
`

const StyledTitle = styled.div`
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  font-weight: 600;
  margin-top: 5px;
`
