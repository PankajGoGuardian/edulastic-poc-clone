import styled, { css } from 'styled-components'
import { Button } from 'antd'

export const ToolbarModalContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 350px;
  @media (max-width: 468px) {
    width: calc(100vw - 100px);
  }
`

export const ToolbarButton = styled(Button)`
  height: 50px;
  text-transform: uppercase;
  border: none;
  border-radius: 0px;
  font-size: 14px;
  font-weight: 600;
  letter-spacing: 0.3px;
  ${({ theme, hidden, disabled }) => css`
    ${hidden ? 'display:none;' : ''}
    border-bottom: 1px solid ${theme.default.headerButtonBorderColor};
    &:active,
    &:focus,
    &:hover {
      border-color: ${disabled
        ? 'transparent'
        : theme.default.headerButtonBorderHoverColor};
      color: ${theme.default.headerButtonBorderHoverColor};
    }
  `}
`
