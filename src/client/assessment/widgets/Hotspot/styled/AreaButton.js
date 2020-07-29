import styled, { css } from "styled-components";
import { EduButton } from "@edulastic/common";

// background-color: #1A73E8;
//     border-color: #1A73E8;
//     color: #fff;

const activeStyle = css`
  &.ant-btn.ant-btn-primary {
    border-color: #1a73e8;
    background-color: #1a73e8;
    color: #fff;
  }
  & svg {
    fill: #fff;
  }
`;

const normalStyle = css`
  &.ant-btn.ant-btn-primary {
    border-color: #878a91;
    color: #878a91;
  }

  & svg {
    fill: #878a91;
  }
`;

export const AreaButton = styled(EduButton).attrs({ isGhost: true })`
  width: auto;
  height: 28px;
  margin: 0px 5px;
  ${({ active }) => (active ? activeStyle : normalStyle)}
`;
