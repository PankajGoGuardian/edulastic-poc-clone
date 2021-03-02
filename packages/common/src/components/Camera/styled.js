import styled, { css } from 'styled-components'

export const CameraWrapper = styled.div`
  position: relative;
  text-align: center;
`

export const Video = styled.video`
  width: 100%;
  ${(props) =>
    props.isImageMirror &&
    css`
      transform: rotateY(180deg);
    `}
`

export const DelayOverlay = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  background: rgba(0,0,0,0.4);
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  z-index: 999;
  & > * {
    opacity: 1
  }
}
`

export const NumberCircle = styled.div`
  border-radius: 50%;
  width: 100px;
  height: 100px;
  padding: 30px;
  background: #fff;
  color: #000;
  text-align: center;
  font-size: 32px;
  font-weight: bold;
`

export const Image = styled.img`
  width: 100%;
`

export const WhiteFlash = styled.div`
  position: absolute;
  height: 100%;
  width: 100%;
  opacity: 1;
  transition: opacity 0.9s ease-out;
  ${(props) =>
    props.isFlashVisible &&
    css`
      opacity: 0;
      background: white;
    `}
`
