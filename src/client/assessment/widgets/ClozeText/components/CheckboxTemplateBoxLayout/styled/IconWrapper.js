import styled, { css } from "styled-components";

export const IconWrapper = styled.div`
  display: flex;
  align-items: center;
  align-self: stretch;
  ${({ inPopover }) =>
    inPopover &&
    css`
      margin-right: 0.5rem;
    `};
`;
