import {
  black,
  fadedGrey,
  tabGrey,
  textColor,
  themeColor,
  title,
  white,
  greyThemeDark1,
  mediumDesktopExactWidth
} from "@edulastic/colors";
import { Button, CustomModalStyled } from "@edulastic/common";
import { Menu } from "antd";
import styled from "styled-components";

export const FoldersListWrapper = styled.ul`
  padding: 0px;
  margin: 0px;
  position: relative;
`;

export const NewFolderButton = styled(Button)`
  min-height: 40px;
  width: 100%;
  padding: 0px;
  border: none;
  font-size: 11px;
  justify-content: flex-start;
  color: ${greyThemeDark1};
  &:hover,
  &:focus {
    border: none;
    outline: none;
    box-shadow: none;
  }
  & > span {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    svg {
      margin-left: 15px;
    }
  }
`;

export const DropMenu = styled(Menu)`
  margin-top: 10px;
  min-width: 160px;
`;

export const CaretUp = styled.i`
  position: absolute;
  top: -20px;
  color: ${white};
  right: 5px;
  font-size: 30px;
`;

export const MenuItems = styled(Menu.Item)`
  color: ${title};
  display: flex;
  align-items: center;
  font-size: 12px;
  svg,
  i {
    fill: ${title};
    color: ${title};
    margin-right: 12px !important;
    width: 12px;
  }
  &:not(.ant-dropdown-menu-item-disabled):hover {
    color: ${white};
    background-color: ${themeColor};
    svg,
    i {
      fill: ${white};
      color: ${white};
    }
  }
`;

export const FolderButton = styled(NewFolderButton)`
  min-width: 100%;
  justify-content: flex-start;
  margin-top: 10px;
  color: ${({ active }) => (active ? black : textColor)};
  background: ${({ active }) => (active ? fadedGrey : "transparent")};
  padding: 3px 5px;
  border-radius: 0px;
  &:hover,
  &:focus {
    background: ${({ active }) => (active ? fadedGrey : "transparent")};
  }
  svg {
    margin-right: 15px;
    width: 20px;
    height: 20px;
    fill: ${({ active }) => (active ? themeColor : tabGrey)};
  }
`;

export const FolderListItem = styled.li`
  min-height: 34px;
  width: 100%;
  margin-top: 5px;
  padding: 5px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: ${({ active }) => (active ? themeColor : greyThemeDark1)};
  font-weight: 600;
  font-size: 11px;
  user-select: none;
  position: relative;
  cursor: pointer;
  &:hover {
    svg {
      fill: ${themeColor};
    }
  }
  svg {
    width: 20px;
    height: 20px;
    fill: ${({ active }) => (active ? themeColor : tabGrey)};
  }

  border-left: ${({ leftBorder }) => leftBorder && `3px solid ${themeColor}`};
`;

export const FolderListItemTitle = styled.div`
  width: calc(100% - 22px);
  display: flex;
  align-items: center;
  svg {
    margin: 0px 15px;
  }
  span {
    max-width: ${props => (props.ellipsis ? "125px" : "100%")};
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
    display: block;
    position: relative;
  }
`;

export const MoreButton = styled.div`
  min-width: 20px;
  display: flex;
  justify-content: center;
  height: 100%;
  svg {
    fill: ${({ active }) => (active ? black : title)};
  }
`;

export const ModalTitle = styled.div`
  font-size: 16px;
  font-weight: 600;
  color: ${title};

  @media (min-width: ${mediumDesktopExactWidth}) {
    font-size: 18px;
  }
`;

export const MoveFolderActionModal = styled(CustomModalStyled)`
  min-width: 560px;
  .ant-modal-body {
    padding: 20px 0px;
    ul {
      li {
        margin: 0px;
        font-size: 14px;
        padding: 10px 24px;
        height: 56px;
        display: flex;
        align-items: center;
        &:hover {
          background: rgba(0, 173, 80, 0.15);
        }
        svg {
          width: 32px;
          height: 32px;
        }
      }
    }
  }
`;

export const FolderActionButton = styled(Button)`
  min-width: 200px;
  border-radius: 4px;
  display: flex;
  justify-content: flex-start;
  margin-bottom: 20px;
  svg {
    margin-right: 30px;
  }
`;

export const StyledBoldText = styled.p`
  font-weight: 600;
  font-size: 12px;
  margin-bottom: 5px;
  text-align: left;
  width: 100%;
`;

export const AddFolderButton = styled.div`
  position: absolute;
  display: flex;
  align-items: center;
  width: 18px;
  right: ${({ right }) => right || "24px"};
  top: ${({ top }) => top || "8px"};
  cursor: pointer;

  & svg {
    width: 17px;
    height: 17px;
    fill: ${themeColor};
    &:hover {
      fill: ${themeColor};
    }
  }
`;
