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
  height: ${({ height }) => (height ? `${height}px` : '100%')};
  border: ${({ readOnly, deleteMode }) =>
    readOnly ? '0px' : `2px dashed ${deleteMode ? darkRed : greyThemeLight}`};
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
