import styled, { css } from 'styled-components'
import { white, borderGrey4 } from '@edulastic/colors'

const buttonWrapperExtraStyle = css`
  border-top-left-radius: ${({ collapseDirection }) =>
    collapseDirection === 'left' ? '0px' : '4px'};
  border-bottom-left-radius: ${({ collapseDirection }) =>
    collapseDirection === 'left' ? '0px' : '4px'};
  border-top-right-radius: ${({ collapseDirection }) =>
    collapseDirection === 'right' ? '0px' : '4px'};
  border-bottom-right-radius: ${({ collapseDirection }) =>
    collapseDirection === 'right' ? '0px' : '4px'};
  left: ${({ collapseDirection }) =>
    collapseDirection === 'left'
      ? 'auto'
      : collapseDirection === 'right'
      ? '-22px'
      : '-22px'};
  right: ${({ collapseDirection }) =>
    collapseDirection === 'right'
      ? 'auto'
      : collapseDirection === 'left'
      ? '-22px'
      : '-22px'};
`

const midStyles = css`
  cursor: pointer;
  &::after,
  &::before {
    content: '';
    display: block;
    border: 1px solid ${borderGrey4};
    position: absolute;
    height: 100%;
  }

  &::after {
    right: -3px;
  }

  &::before {
    left: -3px;
  }
`

export const Divider = styled.div`
  width: 0px;
  position: relative;
  background-color: ${(props) =>
    props.isCollapsed ? '#e5e5e5' : 'transparent'};
  border-radius: 10px;
  z-index: 1000;
  height: ${({ stackedView }) => (stackedView ? 'auto' : '80%')};
  ${({ hideMiddle }) => !hideMiddle && midStyles}

  .button-wrapper {
    background: #a7b5c1;
    display: flex;
    justify-content: space-between;
    position: absolute;
    top: 20px;
    z-index: 10;
    ${buttonWrapperExtraStyle}
  }
`

const rightCollaps = css`
  border-top-right-radius: 4px;
  border-bottom-right-radius: 4px;
  display: ${({ collapseDirection }) =>
    collapseDirection === 'right' ? 'none' : ''};
`

const leftCollaps = css`
  border-top-left-radius: 4px;
  border-bottom-left-radius: 4px;
  display: ${({ collapseDirection }) =>
    collapseDirection === 'left' ? 'none' : ''};
`

const midCollaps = css`
  .vertical-line {
    border: 1px solid #d4d8dc;
    height: 16px;
    &.first {
      display: ${({ collapseDirection }) =>
        collapseDirection === 'left' ? 'none' : ''};
      margin-right: 2px;
    }
    &.third {
      margin-left: 2px;
      display: ${({ collapseDirection }) =>
        collapseDirection === 'right' ? 'none' : ''};
    }
  }
`

export const CollapseBtn = styled.div`
  cursor: pointer;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;

  svg {
    width: 6px;
    height: 11px;
    fill: ${white};
    &:hover {
      fill: ${white};
    }
  }
  ${({ right, left, mid }) => {
    if (right) {
      return rightCollaps
    }
    if (mid) {
      return midCollaps
    }
    if (left) {
      return leftCollaps
    }
  }}
`
