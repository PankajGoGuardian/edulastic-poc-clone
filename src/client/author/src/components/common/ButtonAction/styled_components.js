import styled from "styled-components";
import {
  smallMobileWidth,
  mobileWidthLarge,
  mediumDesktopWidth,
  themeColor
} from "@edulastic/colors";
import { Button } from "antd";

export const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: ${props => props.position};
  z-index: ${props => props.zIndex};
  right: ${props => (props.showPublishButton ? "208px" : "101px")};
  top: 13px;
`;

export const HeaderActionButton = styled(Button)`
  max-width: 45px;
  height: 45px;

  @media (max-width: ${mediumDesktopWidth}) {
    max-width: 36px;
    height: 36px;
  }
`;

export const PreviewBar = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  width: 100%;
  position: relative;

  .ant-btn {
    background: transparent;
    padding: 0 10px;
    margin-left: 5px;
    border: 0;
    background: #fff;
    box-shadow: 0 3px 10px 0 rgba(0, 0, 0, 0.1);

    button {
      padding: 0;
      text-transform: initial;
      font-size: 12px;
      height: 45px;
      @media (max-width: ${mediumDesktopWidth}) {
        height: 36px;
      }
    }

    span {
      font-size: 0;
      margin: 0;
    }
  }
`;

export const RightActionButton = styled(Button).attrs(() => ({
  htmlType: "button"
}))`
  ${({ hints }) =>
    hints &&
    `@media (max-width: ${mobileWidthLarge}) {
      display: none;
    }
  `}
  display: flex;
  align-items: center;
  justify-content: center;

  @media (max-width: ${mobileWidthLarge}) {
    width: 45px;
    height: 28px;
    position: relative;

    label {
      display: none;
    }
  }
  @media (max-width: ${smallMobileWidth}) {
    width: 38px;
  }

  & svg {
    fill: ${themeColor};
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);

    &:hover {
      fill: ${themeColor};
    }

    @media (min-width: ${mobileWidthLarge}) {
      display: none;
    }
  }
`;

export const LabelText = styled.label`
  font-size: 10px;
  cursor: pointer;
  font-weight: 600;
  color: ${themeColor};
`;
