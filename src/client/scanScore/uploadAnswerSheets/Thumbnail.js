import React from 'react'
import styled from 'styled-components'
import { Spin } from 'antd'

export const getFileNameFromUri = (uri) =>
  uri
    .split('/')
    .lastItem.replace(/_([0-9a-fA-F]+|-)+[0-9a-fA-F]+(\.[a-zA-Z]+)/, '$2')

const Thumbnail = ({ doc, ...props }) => {
  const name = getFileNameFromUri(doc.sourceUri)
  return (
    <ThumbnailDiv title={name} uri={doc.sourceUri} {...props}>
      <Spin spinning={doc.processStatus === 'in_progress'}>
        <img alt={name} src={doc.sourceUri} />
      </Spin>
      {doc.processStatus === 'failed' && (
        <>
          <div className="show-on-hover">
            <span>
              {'\u26A0'}
              <br />
              {doc.message}
            </span>
          </div>
          <div className="icon">{'\u26A0'}</div>
        </>
      )}
      <div className="title">{name}</div>
    </ThumbnailDiv>
  )
}

export default Thumbnail

const ThumbnailDiv = styled.div`
  margin: 5px 15px;
  display: flex;
  flex-direction: column;
  max-width: 150px;
  height: 180px;
  max-height: 180px;
  position: relative;
  & img {
    max-width: 100%;
    max-height: 150px;
    box-shadow: 0 0 4px black;
  }
  & .ant-spin-container {
    display: flex;
    align-items: center;
    justify-content: center;
  }
  & .show-on-hover {
    display: none;
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    background-color: rgba(255, 255, 255, 0.5);
    align-items: center;
    justify-content: center;
    text-align: center;
  }
  &:hover {
    & .show-on-hover {
      display: flex;
      backdrop-filter: blur(3px);
    }
  }
  & .icon {
    position: absolute;
    top: 0;
    right: 0;
    color: red;
  }
  & .title {
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
    font-weight: 600;
    margin-top: 5px;
  }
`
