import styled from "styled-components";
import {
  smallMobileWidth,
  white,
  themeColor,
  desktopWidth,
  secondaryTextColor,
  greyThemeDark2,
  mediumDesktopExactWidth
} from "@edulastic/colors";
import { Button, Menu, Dropdown } from "antd";

export const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  width: 100%;

  .ant-menu-item {
    height: 62px;
    display: flex;
  }
`;

export const CustomButton = styled(Button)``;

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
  align-self: flex-start;

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
  height: 36px;
  border-radius: 4px;
  border: none;
  background-color: #f2f3f2;
  color: ${greyThemeDark2};
  margin-right: 5px;
  font-size: 13px;
  font-weight: 600;
  font-style: normal;
  font-stretch: normal;
  line-height: 1.36;
  letter-spacing: 0.2px;
  text-align: center;
  white-space: nowrap;

  &:last-of-type {
    margin-right: 0;
  }

  svg {
    fill: ${greyThemeDark2};
    display: none;
  }

  &.active {
    color: ${white};
    background-color: #b3bcc4;

    svg {
      fill: ${white};
    }
  }

  @media (min-width: ${mediumDesktopExactWidth}) {
    height: 45px;
    svg {
      display: block;
    }
  }
  @media (max-width: ${desktopWidth}) {
    flex-basis: 50%;
  }
`;
