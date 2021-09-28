import styled, { css } from 'styled-components'
import { Rnd } from 'react-rnd'
import { greyThemeDark4, white } from '@edulastic/colors'

export const Mask = styled(Rnd)`
  background: transparent;
  pointer-events: none;

  .lineReader-resize-bottomRight {
    z-index: 10000;
    pointer-events: auto;
    right: 0px !important;
    bottom: -0px !important;
    padding: 4px;

    &::before {
      content: '';
      display: block;
      border-bottom: 2px solid;
      border-right: 2px solid;
      border-color: ${white};
      width: 100%;
      height: 100%;
    }
  }

  .lineReader-resize-bottom {
    z-index: 10000;
    background: red;
    pointer-events: auto;
    width: 40px !important;
    height: 20px !important;
    left: 50% !important;
    bottom: 0px !important;
  }

  svg {
    fill: ${white};
    top: 12px;
    right: 12px;
    z-index: 10000;
    cursor: pointer;
    position: absolute;
    pointer-events: auto;

    &:hover {
      fill: ${white};
    }
  }
`

const commonCss = css`
  position: absolute;
  background: ${greyThemeDark4};
  pointer-events: auto;
  cursor: move;
`

export const MaskTop = styled.div.attrs(({ height }) => ({
  style: { height },
  className: 'lineReader-dragHandler',
}))`
  top: 0px;
  width: 100%;
  ${commonCss}
`

export const MaskLeft = styled.div.attrs(({ width }) => ({
  style: { width },
  className: 'lineReader-dragHandler',
}))`
  top: 0px;
  left: 0px;
  height: 100%;
  ${commonCss}
`

export const MaskRight = styled.div.attrs(({ width }) => ({
  style: { width },
  className: 'lineReader-dragHandler',
}))`
  height: 100%;
  top: 0px;
  right: 0px;
  ${commonCss}
`

export const MaskBottom = styled.div.attrs(({ height }) => ({
  style: { height },
  className: 'lineReader-dragHandler',
}))`
  bottom: 0px;
  width: 100%;
  ${commonCss}
`

export const InnerMask = styled(Rnd)`
  background: transparent;
  pointer-events: none;

  .innermask-resize-bottomright {
    z-index: 10000;
    pointer-events: auto;
    padding: 4px;
    right: -10px !important;
    bottom: -10px !important;

    &::before {
      content: '';
      display: block;
      border-bottom: 2px solid;
      border-right: 2px solid;
      border-color: ${white};
      width: 100%;
      height: 100%;
    }
  }
`

export const InnerMaskDragHandler = styled.div`
  height: 20px;
  width: 20px;
  pointer-events: auto;
  cursor: move;
  position: absolute;
  left: calc(50% - 10px);
  z-index: 10000;
  bottom: -12px;
  display: flex;
  align-items: flex-end;

  &::before {
    border-bottom: 2px solid;
    border-top: 2px solid;
    border-color: ${white};
    content: '';
    display: block;
    height: 8px;
    width: 100%;
  }
`
