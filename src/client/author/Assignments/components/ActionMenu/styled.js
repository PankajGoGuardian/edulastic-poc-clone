import styled from "styled-components";
import { Menu, Button } from "antd";

import { white, mobileWidth, themeColor } from "@edulastic/colors";

export const Container = styled.div`
  left: 0;
  right: 0;
  height: 100%;
  box-shadow: 0 3px 10px 0 rgba(0, 0, 0, 0.1);
  background: white;
  margin-top: -4px;
  width: 170px;

  @media screen and (max-width: ${mobileWidth}) {
    width: 244px;
  }
`;

export const StyledMenu = styled(Menu)`
  border: 0px;

  .ant-menu-item {
    margin: 0 !important;
    padding: 0 13px;
    font-weight: 600;
    height: 31px;
    line-height: 31px;
    font-size: 12px;

    @media screen and (max-width: ${mobileWidth}) {
      height: 40px;
      line-height: 41px;
    }

    a {
      margin: 0;
    }

    :hover {
      background: ${themeColor};

      img {
        filter: brightness(10);
      }

      a {
        color: ${white};
      }
    }
  }
`;

export const StyledLink = styled.a`
  margin-top: 2px;
`;

export const SpaceElement = styled.div`
  display: inline-block;
  width: 10px;
`;

export const ActionButtonWrapper = styled.div`
  text-align: center;
  padding: 9px 0;

  @media screen and (max-width: ${mobileWidth}) {
    display: none;
  }
`;

export const ActionButton = styled(Button)`
  color: ${white};
  background-color: ${themeColor};
  border: none;
  box-shadow: 0px 2px 8px 1px rgba(163, 160, 160, 0.2);
  max-width: 140px;
  height: 32px;
  font-size: 11px;
  font-weight: 600;
  width: 100%;
  padding: 0px 20px;
  text-align: center;
  width: 90px;
  text-transform: uppercase;

  :hover {
    background-color: ${themeColor};
    color: ${white};
  }
`;
