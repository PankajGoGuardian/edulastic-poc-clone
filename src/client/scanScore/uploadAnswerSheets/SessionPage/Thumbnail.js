import React, { useMemo } from 'react'
import styled from 'styled-components'
import { Spin, Icon } from 'antd'

import { IconCloseCircle } from '@edulastic/icons'

import {
  themeColor,
  greyThemeDark1,
  white,
  borderGrey,
} from '@edulastic/colors'

import { omrSheetScanStatus } from '../utils'

const Thumbnail = ({ size, name, uri, status, message, onClick }) => {
  const isFailed = useMemo(() => status > omrSheetScanStatus.DONE, [status])

  return (
    <ThumbnailContainer width={size} onClick={onClick} isFailed={isFailed}>
      <div className="thumbnail-inner-container">
        <Spin spinning={status === omrSheetScanStatus.SCANNING}>
          <img alt={name} src={uri} />
        </Spin>
        {isFailed ? (
          <div className="thumbnail-overlay">
            <IconCloseCircle className="failed-icon" />
            <div className="failed-text">{message || 'Error'}</div>
          </div>
        ) : (
          <div className="thumbnail-overlay">
            <Icon className="show-icon" type="eye" />
          </div>
        )}
      </div>
      <div className="thumbnail-label">{name}</div>
    </ThumbnailContainer>
  )
}

export default Thumbnail

const ThumbnailContainer = styled.div`
  margin: 5px 15px;
  max-width: ${(props) => props.width || 150}px;
  ${(props) => (props.onClick && !props.isFailed ? `cursor: pointer;` : ``)}
  color: ${greyThemeDark1};
  .thumbnail-inner-container {
    margin: 2px;
    display: flex;
    flex-direction: column;
    max-width: ${(props) => props.width || 150}px;
    height: auto;
    border-radius: 4px;
    overflow: hidden;
    position: relative;
    border: solid 2px ${borderGrey};
    & img {
      max-width: 100%;
      height: auto;
    }
    & .ant-spin-container {
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .thumbnail-overlay {
      display: flex;
      width: 100%;
      height: 100%;
      position: absolute;
      top: 0;
      left: 0;
      border-radius: 2px;
      background-color: ${(props) =>
        props.isFailed ? 'rgba(0, 0, 0, 0.5)' : 'transparent'};
      font-size: ${(props) => props.width / 15 || 10}px;
      font-weight: 600;
      align-items: center;
      justify-content: center;
      text-align: center;
      color: ${white};
      .show-icon {
        display: none;
        font-size: ${(props) => props.width / 5 || 30}px;
      }
      .failed-icon {
        position: absolute;
        top: 3px;
        right: 4px;
        width: ${(props) => props.width / 10 || 20}px;
        height: ${(props) => props.width / 10 || 20}px;
      }
    }
  }
  .thumbnail-label {
    white-space: nowrap;
    text-overflow: ellipsis;
    text-align: center;
    overflow: hidden;
    font-weight: 600;
    margin-top: 5px;
  }
  &:hover {
    zoom: 102%;
    .thumbnail-inner-container {
      border: solid 2px ${themeColor};
      .thumbnail-overlay {
        background-color: rgba(0, 0, 0, 0.5);
        .show-icon {
          display: block;
        }
      }
    }
  }
`
