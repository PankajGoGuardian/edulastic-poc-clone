import styled from 'styled-components'
import { darkRed, greyThemeLight } from '@edulastic/colors'

export const ScratchpadContainer = styled.div`
  position: absolute;
  height: 100%;
  width: 100%;
  /* froalar z-index is 998 */
  /* @see https://snapwiz.atlassian.net/browse/EV-19269 */
  z-index: 999;
  display: ${({ hideData }) => (hideData ? 'none' : 'block')};
`

export const ZwibblerMain = styled.div`
  width: ${({ width }) => (width ? `${width}px` : '100%')};
  height: ${({ height, hideToolBar }) =>
    height ? `${height}px` : hideToolBar ? '100%' : 'calc(100% - 90px)'};
  border: ${({ readOnly, deleteMode }) =>
    readOnly ? '0px' : `1px solid ${deleteMode ? darkRed : greyThemeLight}`};
  background: radial-gradient(#b9b9b9 2px, transparent 2px);
  background-size: 30px 30px;

  &:focus {
    outline: none;
  }

  & .zwibbler-canvas-holder {
    &:focus {
      outline: none;
    }
    touch-action: ${({ readOnly }) => readOnly && `unset !important`};
  }

  & .zwibbler-overlay {
    outline: none !important;
  }
`
