import styled from 'styled-components'
import { themes } from '../../../theme'

const {
  playerSkin: { magnifierBorderColor },
} = themes

export const ZoomedContentWrapper = styled.div.attrs(
  ({ scale, pos, left, top }) => ({
    style: {
      left: -(scale * pos.x) - left,
      top: -(scale * pos.y) - top,
    },
  })
)`
  overflow: visible;
  position: absolute;
  display: block;
  transform: ${({ scale }) => `scale(${scale})`};
  width: ${({ windowWidth }) => windowWidth}px;
  height: ${({ windowHeight }) => windowHeight}px;
  transform-origin: left top;
  user-select: none;
  margin-left: ${({ width, scale }) => `-${width / scale}px`};
`

export const MagnifierOverlay = styled.div`
  position: absolute;
  z-index: 1500;
  width: ${({ magnifierWidth }) => magnifierWidth}px;
  height: ${({ magnifierHeight }) => magnifierHeight}px;
`

export const ZoomedWrapper = styled.div.attrs(({ pos }) => ({
  style: {
    left: pos.x,
    top: pos.y,
  },
}))`
  border: 1px solid ${magnifierBorderColor};
  width: ${({ magnifierWidth }) => magnifierWidth}px;
  height: ${({ magnifierHeight }) => magnifierHeight}px;
  border-radius: 5px;
  position: fixed;
  overflow: hidden;
  z-index: 1050;
  cursor: move;
  background: white;

  main {
    .test-item-preview {
      overflow: auto !important;
      .classification-preview {
        * {
          overflow: visible !important;
        }
      }
    }
  }
`
