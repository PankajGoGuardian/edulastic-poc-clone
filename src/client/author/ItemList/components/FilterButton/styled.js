import { boxShadowDefault, textColor, desktopWidth, mobileWidth, newBlue } from "@edulastic/colors";
import styled from "styled-components";

export const FilterButtonContainer = styled.div`
  display: none;
  flex: 1;
  height: 40px;
  box-shadow: ${boxShadowDefault};
  border-radius: 10px;

  .ant-btn {
    height: 40px;
    border-radius: 10px;
    width: 100%;

    span {
      font-size: 11px;
      font-weight: 600;
      color: ${textColor};
    }
  }

  @media (max-width: ${desktopWidth}) {
    display: block;
    margin-left: 10px;
    width: 44px;
    height: 44px;
    border-radius: 3px;

    .ant-btn {
      border-radius: 3px;
      width: 44px;
      height: 44px;
      padding: 0;

      span {
        font-size: 0;
      }
    }
    svg {
      width: 22px;
      height: 22px;
      margin: auto auto -4px;
      fill: ${newBlue};
    }
  }

  @media (max-width: ${mobileWidth}) {
    height: 40px;
    width: 45px;
    border-radius: 3px;

    .ant-btn {
      height: 40px;
      width: 45px;
    }
  }
`;
