import styled, { css } from 'styled-components'

export const StyledSelectContainer = styled.div`
  position: relative;
  .ant-select-dropdown-menu-item-group-title {
    font-weight: bold;
    margin: 5px 0px;
    text-transform: uppercase;
    color: rgba(0, 0, 0, 0.65);
  }
  ${({ hasCustomKeypads }) =>
    hasCustomKeypads &&
    css`
      .ant-select-dropdown-menu-item {
        padding-left: 20px;
      }
    `}
`
