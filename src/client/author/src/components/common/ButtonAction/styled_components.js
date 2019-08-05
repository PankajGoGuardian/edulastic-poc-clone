import styled from "styled-components";
import { mobileWidth, mediumDesktopWidth } from "@edulastic/colors";
import { Button } from "antd";

export const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: ${props => props.position};
  z-index: ${props => props.zIndex};
  right: ${props => (props.showPublishButton ? "208px" : "101px")};
  top: 13px;

  @media (max-width: ${mobileWidth}) {
    margin-top: 32px;
  }
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

  .ant-btn {
    background: transparent;
    height: 45px;
    padding: 0 10px;
    margin-left: 5px;
    border: 0;
    background: #fff;
    box-shadow: 0 3px 10px 0 rgba(0, 0, 0, 0.1);

    button {
      padding: 0;
      text-transform: initial;
      font-size: 12px;
    }

    span {
      font-size: 0;
      margin: 0;
    }

    @media (max-width: ${mediumDesktopWidth}) {
      width: auto;
      height: 36px;
    }
  }
`;

export const DisplayBlock = styled.div`
  @media (max-width: ${mobileWidth}) {
    display: none;
  }
`;
