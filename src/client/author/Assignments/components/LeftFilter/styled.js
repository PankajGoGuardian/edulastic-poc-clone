import styled, { keyframes } from "styled-components";
import { Modal, Menu } from "antd";
import {
  themeColor,
  fadedBlue,
  fadedGrey,
  mainBgColor,
  lightGreySecondary,
  textColor,
  black,
  title,
  white
} from "@edulastic/colors";
import { Button } from "@edulastic/common";

const filterWidth = "250px";

const width = keyframes`
  from {
    width: 0px;
  }

  to {
    width: ${filterWidth};
  }
`;

export const FilterContainer = styled.div`
  animation: ${width} 300ms ease;
  padding: 0px 40px 0px 0px;

  .ant-select-selection {
    background: ${lightGreySecondary};
  }
  .ant-select,
  .ant-input,
  .ant-input-number {
    min-width: 100px;
    width: 100%;
  }
  .ant-select-lg {
    font-size: 13px;
    font-weight: 600;
    letter-spacing: 0.2px;
    color: #434b5d;
    .ant-select-selection--multiple {
      .ant-select-selection__rendered {
        li.ant-select-selection__choice {
          height: 24px;
          line-height: 24px;
          margin-top: 7px;
        }
      }
    }
  }

  .ant-select-selection__choice {
    border-radius: 5px;
    border: solid 1px ${fadedBlue};
    background-color: ${fadedBlue};
    height: 23.5px;
  }

  .ant-select-selection__choice__content {
    font-size: 10px;
    font-weight: bold;
    letter-spacing: 0.2px;
    color: ${themeColor};
    opacity: 1;
  }

  .ant-select-remove-icon {
    svg {
      fill: ${themeColor};
    }
  }

  .ant-select-arrow-icon {
    font-size: 14px;
    svg {
      fill: ${themeColor};
    }
  }
`;

export const StyledBoldText = styled.p`
  font-weight: 600;
  font-size: 12px;
  margin: 15px 0px 10px 0px;
  text-align: left;
  width: ${filterWidth};
`;

export const NewFolderButton = styled(Button)`
  min-height: 28px;
  min-width: 140px;
  margin-top: 20px;
  padding: 2px;
  display: flex;
  justify-content: space-evenly;
  &:focus {
    outline: unset;
  }
`;

export const FolderButton = styled(NewFolderButton)`
  min-width: 100%;
  justify-content: flex-start;
  margin-top: 10px;
  color: ${({ active }) => (active ? black : textColor)};

  svg {
    margin-right: 15px;
  }
`;

export const FoldersListWrapper = styled.ul`
  padding: 0px;
  margin: 0px;
`;

export const FolderListItem = styled.li`
  min-height: 28px;
  min-width: 140px;
  margin-top: 5px;
  padding: 2px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-radius: 2px;
  background-color: ${({ active }) => (active ? fadedGrey : mainBgColor)};
  color: ${({ active }) => (active ? black : title)};
  /* text-transform: uppercase; */
  font-weight: 600;
  font-size: 11px;
  user-select: none;
  cursor: pointer;
`;

export const FolderListItemTitle = styled.div`
  width: calc(100% - 22px);
  display: flex;
  align-items: center;
  svg {
    margin-right: 15px;
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

export const ModalFooterButton = styled(Button)`
  margin-top: 0px;
  padding: 5px 30px;
  font-size: 11px;
  min-width: 80px;
  min-height: 30px;
`;

export const FooterCancelButton = styled(ModalFooterButton)`
  color: ${themeColor};
  margin-right: 10px;
  &:hover,
  &:focus {
    color: ${themeColor};
    background: ${white};
    outline: none;
  }
`;

export const FolderActionModal = styled(Modal)`
  .ant-modal-content {
    background: ${lightGreySecondary};
    .ant-modal-close {
      svg {
        fill: ${title};
        width: 14px;
      }
    }
    .ant-modal-header {
      background: transparent;
      border-bottom: 0px;
      padding: 20px 24px 0px;
    }
    .ant-modal-footer {
      border-top: 0px;
      display: flex;
      justify-content: flex-end;
      padding: 0px 24px 20px;
    }
    .ant-modal-body {
      .ant-input {
        border: none;
        box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.07);
      }
    }
  }
`;

export const MoveFolderActionModal = styled(FolderActionModal)`
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
        background: ${lightGreySecondary};
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

export const ModalTitle = styled.div`
  font-size: 18px;
  font-weight: 600;
  color: ${title};
`;

export const DropMenu = styled(Menu)`
  margin-top: 10px;
  min-width: 160px;
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

export const CaretUp = styled.i`
  position: absolute;
  top: -20px;
  color: ${white};
  right: 5px;
  font-size: 30px;
`;

export const ModalBody = styled.div`
  font-size: 14px;
`;
