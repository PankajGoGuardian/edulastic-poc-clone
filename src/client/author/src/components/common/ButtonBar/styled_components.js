import styled from "styled-components";
import {
  smallMobileWidth,
  mediumDesktopWidth,
  white,
  themeColor,
  fadedGrey,
  desktopWidth,
  secondaryTextColor
} from "@edulastic/colors";
import { Button, Menu, Dropdown } from "antd";

export const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  flex-wrap: wrap;
  width: 100%;

  .ant-menu-item {
    height: 62px;
    display: flex;
  }

  .ant-btn {
    height: 40px;
    width: 100px;
    border-radius: 4px;
    background-color: ${themeColor};
    border: none;
    display: flex;
    align-items: center;
    justify-content: center;

    span {
      font-size: 11px;
      font-weight: 600;
      color: ${white};
      letter-spacing: 0.2px;
    }
  }

  .ant-menu-horizontal {
    background: transparent;
    border-bottom: none;
    display: flex;
    flex: 1;
  }

  .ant-menu-item {
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 0.2px;
    color: ${fadedGrey};
    padding-top: 7px;
  }

  .ant-menu-item-active {
    letter-spacing: 0.2px !important;
    font-weight: 600 !important;
    color: ${white} !important;
    border-bottom: solid 4px #c9c9c9 !important;
  }

  .ant-menu-horizontal > .ant-menu-item-selected {
    background: ${themeColor};
    border-bottom: solid 4px #c9c9c9;
    letter-spacing: 0.2px;
    font-weight: 600;
    color: ${white};
  }
`;

export const CustomButton = styled(Button)`
  color: red;
  background: yellow;
`;

export const MobileContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

export const MobileBottom = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  overflow-x: auto;
`;

export const MobileSecondContainer = styled.div`
  display: none;
  justify-content: space-between;
  text-align: left;
  margin-bottom: 10px;
`;

export const PreviewBar = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;

  .ant-btn {
    background: transparent;
    height: 24px;
    margin-left: 17px;
  }
`;

export const StyledButton = styled.div`
  margin-right: 10px;
  margin-bottom: 10px;
`;

export const HeadIcon = styled.div`
  margin-top: ${props => props.mt || "4px"};
  margin-right: ${props => props.mr || "10px"};
`;

export const RightSide = styled.div`
  display: flex;
  align-items: center;

  .ant-btn {
    width: 137px;
    height: 45px;
    background: #fff;
    margin-left: 5px;

    span {
      color: #00ad50;
      font-size: 11px;
      text-transform: uppercase;
    }

    @media (max-width: ${mediumDesktopWidth}) {
      height: 36px;
      width: auto;
      padding: 0px 20px;
    }
  }

  @media (max-width: ${desktopWidth}) {
    position: absolute;
    right: 20px;
    top: 10px;
  }
`;

export const MobileTopRight = styled.div`
  .btn-save {
    position: absolute;
    right: 20px;
    top: 10px;
    background: ${white};
    color: ${themeColor};
    width: 45px;
    height: 40px;
    padding: 0px;
    display: flex;
    align-items: center;
    justify-content: center;
    svg {
      width: 20px;
      height: 20px;
      fill: ${themeColor};
    }
    div {
      margin: 0px;
    }
  }
`;

export const RightDropdown = styled(Dropdown)`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 40px;
  height: 36px;
  svg {
    width: 20px;
    height: 20px;
    fill: ${white};
    &:hover,
    &:active {
      fill: ${white};
    }
  }
`;

export const DropMenuList = styled(Menu)`
  width: 200px;
  border-radius: 6px;
  .ant-dropdown-menu-item {
    display: flex;
    align-items: center;
    padding: 10px 15px;
    color: ${secondaryTextColor};
    font-weight: 500;
    & > div {
      width: 25px;
      margin: 0px 15px 0px 0px;
      text-align: center;
      line-height: 0px;
    }
    svg {
      fill: ${secondaryTextColor};
    }
    &:hover {
      background: ${themeColor};
      color: ${white};
      svg {
        fill: ${white};
      }
    }
  }
`;

export const MenuList = styled(Menu)`
  margin: 0px 10px;
  justify-content: center;
  display: flex;
  background: none;
  border: none;

  @media (max-width: ${desktopWidth}) {
    margin: 0px;
    width: 100%;
  }
  @media (max-width: ${smallMobileWidth}) {
    width: unset;
  }
`;

export const MenuItem = styled.li`
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  width: initial;
  padding: 0 15px;
  height: 45px;
  border-radius: 4px;
  border: none;
  background-color: rgba(255, 255, 255, 0.15);
  margin-right: 5px;
  font-size: 13px;
  font-weight: 600;
  font-style: normal;
  font-stretch: normal;
  line-height: 1.36;
  letter-spacing: 0.2px;
  text-align: center;
  color: rgba(255, 255, 255, 0.75);
  white-space: nowrap;

  &:last-of-type {
    margin-right: 0;
  }

  svg {
    fill: rgba(255, 255, 255, 0.75);
  }

  &.active {
    color: #fff;
    background-color: rgba(255, 255, 255, 0.3);

    svg {
      fill: #fff;
    }
  }

  @media (max-width: ${mediumDesktopWidth}) {
    height: 36px;
    svg {
      display: none;
    }
  }
  @media (max-width: ${desktopWidth}) {
    flex-basis: 50%;
  }
`;
