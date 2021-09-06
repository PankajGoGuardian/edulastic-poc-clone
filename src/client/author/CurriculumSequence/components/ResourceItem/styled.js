import styled from 'styled-components'
import {
  borderGrey4,
  playlistTabLink,
  backgrounds,
  themeColor,
  extraDesktopWidthMax,
} from '@edulastic/colors'
import { Popover } from 'antd'

export const ResourceItemWrapper = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  padding: 10px;
  border-bottom: 1px solid ${borderGrey4};
  cursor: grab;

  .preview-btn {
    display: none;
    cursor: pointer;
  }
  .more-action-btn {
    display: none;
    cursor: pointer;
  }

  &:hover {
    background: ${backgrounds.default};
    -webkit-transition: background 300ms ease;
    -ms-transition: background 300ms ease;
    transition: background 300ms ease;

    .preview-btn {
      display: block;
    }
    .more-action-btn {
      display: block;
    }
  }
`

export const IconWrapper = styled.div`
  width: 30px;
  padding-right: 8px;
  svg {
    fill: ${({ isAdded }) => (isAdded ? themeColor : playlistTabLink)};
  }
  display: flex;
  align-items: center;
  justify-content: center;

  @media (max-width: ${extraDesktopWidthMax}) {
    svg {
      height: 16px;
      width: 16px;
    }
  }
`

export const ResourceTitle = styled.div`
  text-align: left;
  font: Semibold 10px/14px Open Sans;
  letter-spacing: 0.19px;
  color: ${({ isAdded }) => (isAdded ? themeColor : playlistTabLink)};
  text-transform: uppercase;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  font-size: 11px;
  align-items: center;
  display: flex;
  user-select: none;
  font-weight: 600;

  .ant-tag {
    overflow: hidden;
    text-overflow: ellipsis;
    &:first-child {
      margin-left: 15px;
    }
  }
`

export const TitleText = styled.div`
  display: inline-block;
  max-width: ${({ isPopup, noStandards }) =>
    isPopup ? '100%' : noStandards ? '90%' : '85%'}px;
  overflow: hidden;
  white-space: ${({ isPopup }) => (isPopup ? 'break-spaces' : 'nowrap')};
  padding-bottom: ${({ isPopup }) => (isPopup ? '10px' : '0')};
  text-overflow: ellipsis;

  @media (max-width: ${extraDesktopWidthMax}) {
    font-size: 10px;
  }
  padding-right: 5px;
`

export const PopupContainer = styled.div`
  flex-wrap: wrap;
  width: 340px;
  max-height: 200px;
  overflow: auto;
  text-overflow: none;

  @media (min-width: ${extraDesktopWidthMax}) {
    width: 400px;
  }
`
export const StyledPopOver = styled(Popover)`
  display: flex;
  max-width: 100%;
`

export const TitleWrapper = styled.div`
  display: flex;
  width: 92%;
`
