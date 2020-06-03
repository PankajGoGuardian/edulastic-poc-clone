import {
  backgrounds,
  borderGrey4,
  greyThemeDark1,
  greyThemeLight,
  mainBgColor,
  mediumDesktopExactWidth,
  playlistTabLink,
  smallDesktopWidth,
  desktopWidth,
  themeColor,
  white,
  secondaryTextColor,
  extraDesktopWidthMax,
  mobileWidthLarge
} from "@edulastic/colors";
import { IconSearch } from "@edulastic/icons";
import { Modal } from "antd";
import styled from "styled-components";
import { ConfirmationModal } from "../../../src/components/common/ConfirmationModal";

export const ManageContentOuterWrapper = styled.div`
  width: 400px;
  border-radius: 4px;

  @media (max-width: ${extraDesktopWidthMax}) {
    width: 340px;
  }
  @media (max-width: ${smallDesktopWidth}) {
    width: 240px;
  }
  @media (max-width: ${desktopWidth}) {
    position: fixed;
    right: 0px;
    top: ${props => props.theme.HeaderHeight.sd}px;
    min-height: ${({ theme }) => `calc(100vh - ${theme.HeaderHeight.sd}px)`};
    max-height: ${({ theme }) => `calc(100vh - ${theme.HeaderHeight.sd}px)`};
    background: white;

    .inner-wrapper {
      overflow: auto;
    }
  }
  @media (max-width: ${mobileWidthLarge}) {
    top: ${props => props.theme.HeaderHeight.xs}px;
    min-height: ${({ theme }) => `calc(100vh - ${theme.HeaderHeight.xs}px)`};
    max-height: ${({ theme }) => `calc(100vh - ${theme.HeaderHeight.xs}px)`};
  }
`;

export const ToggleManageContent = styled.div`
  display: none;

  @media (max-width: ${smallDesktopWidth}) {
    width: 32px;
    height: 32px;
    background: white;
    border-radius: 10px 0px 0px 10px;
    border: 1px solid ${greyThemeLight};
    border-right: none;
    position: absolute;
    top: 10px;
    left: -32px;
    display: flex;
    align-items: center;
    justify-content: center;
    svg {
      width: 12px;
      height: 12px;
      fill: ${greyThemeDark1};
    }
  }
`;

export const ManageContentContainer = styled.div`
  width: 100%;
  background: ${white};
  padding: 20px;
  border-radius: 10px;
  border: 1px solid ${borderGrey4};

  .ant-spin {
    position: relative;
  }

  .ant-select-selection {
    min-height: 40px;
    line-height: 40px;
    padding: 4px;
  }

  .ant-select-selection {
    background: ${backgrounds?.primary};
    &__choice {
      background: #b3bcc4 !important;
      &__content {
        color: #676e74 !important;
      }
      .ant-select-remove-icon svg {
        fill: #676e74 !important;
      }
    }
  }

  @media (max-width: ${mediumDesktopExactWidth}) {
    padding: 10px 15px;
  }

  @media (max-width: ${smallDesktopWidth}) {
    border-radius: 0px;
  }
`;

export const SearchByNavigationBar = styled.div`
  width: 100%;
  display: flex;
  justify-content: ${({ justify }) => justify};
`;

export const SearchByTab = styled.div`
  padding: 0px 6px 10px 6px;
  margin: 0px 20px 2px 0px;
  color: ${({ isTabActive }) => (isTabActive ? themeColor : playlistTabLink)};
  border-bottom: ${({ isTabActive }) => isTabActive && `1px solid ${themeColor}`};
  text-transform: uppercase;
  font-size: 11px;
  font-weight: 600;
  cursor: pointer;
  user-select: none;
`;

export const ManageContentLabel = styled.div`
  color: ${secondaryTextColor};
  text-transform: uppercase;
  margin-bottom: 16px;
  font-weight: 600;

  @media (max-width: ${extraDesktopWidthMax}) {
    font-size: 11px;
  }
`;

export const SearchBoxContainer = styled.div`
  position: relative;
  margin-right: 5px;
  flex: 1;
`;

export const SearchIcon = styled(IconSearch)`
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  width: 14px;
  height: 14px;
`;

export const SearchBar = styled.input`
  height: 40px;
  padding: 10px;
  padding-right: 25px;
  border-radius: 2px;
  border: 1px solid ${greyThemeLight};
  background: ${backgrounds?.default};
  outline: none;
  width: 100%;

  @media (max-width: ${extraDesktopWidthMax}) {
    height: 38px;
    font-size: 11px;
  }
`;

export const ActionButton = styled.div`
  width: 40px;
  height: 40px;
  border: 1px solid ${themeColor};
  background: ${({ isActive }) => (isActive ? themeColor : white)};
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  user-select: none;
  margin-right: 5px;

  &:last-child {
    margin-right: 0px;
  }

  @media (max-width: ${extraDesktopWidthMax}) {
    height: 38px;
    width: 38px;
  }
`;

export const ActionsContainer = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
  margin-top: 0%;
  position: relative;
`;

export const ManageModuleBtn = styled.div`
  display: flex;
  align-items: center;
  justify-content: ${({ justify }) => justify};
  height: 35px;
  border: 1px solid ${themeColor};
  color: ${({ active }) => (active ? white : themeColor)};
  background: ${({ active }) => (active ? themeColor : white)};
  text-transform: uppercase;
  padding: 6px 15px 4px 15px;
  border-radius: 4px;
  font-size: 11px;
  font-weight: 600;
  width: 48%;
  user-select: none;
  cursor: pointer;

  &:hover {
    color: ${white};
    background: ${themeColor};

    i {
      transform: rotate(0.5turn);
    }
  }
`;

export const ResourceDataList = styled.div`
  margin-bottom: 20px;
  overflow: auto;
  display: flex;
  flex-direction: column;
  align-items: start;
  height: ${({ urlHasUseThis, isDifferentiationTab }) => {
    if (isDifferentiationTab) {
      return "calc(100vh - 355px)";
    }
    if (urlHasUseThis) {
      return "calc(100vh - 305px)";
    }
    return "calc(100vh - 345px)";
  }};

  &::-webkit-scrollbar {
    width: 5px;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }

  &::-webkit-scrollbar-thumb {
    background: transparent;
  }

  &::-webkit-scrollbar-thumb:hover {
    background: #555;
  }

  &:hover {
    &::-webkit-scrollbar-track {
      background: #f1f1f1;
    }

    &::-webkit-scrollbar-thumb {
      background: #888;
    }
  }

  @media (min-width: ${desktopWidth}) and (max-width: ${smallDesktopWidth}) {
    height: ${({ urlHasUseThis }) => (urlHasUseThis ? "calc(100vh - 285px)" : "calc(100vh - 322px)")};
  }

  @media (max-width: ${desktopWidth}) {
    height: ${props => `calc(100vh - ${props.theme.HeaderHeight.xs + 142}px)`};
  }
  @media (min-width: ${extraDesktopWidthMax}) {
    height: ${({ urlHasUseThis }) => (urlHasUseThis ? "calc(100vh - 332px)" : "calc(100vh - 370px)")};
  }
  @media (max-width: ${mobileWidthLarge}) {
    height: calc(100vh - 242px);
  }
`;

export const LoaderWrapper = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  padding: 10px;
  margin-top: 10px;
  cursor: default;
`;

export const CustomModal = styled(ConfirmationModal)`
  && {
    .ant-modal-content {
      background: ${white};
      .ant-modal-header {
        padding: 0 25px 0 25px;
        background: ${white};
      }
      .ant-modal-body {
        box-shadow: none;
      }
    }
  }
`;

export const ModalWrapper = styled(Modal)`
  top: 0px;
  padding: 0;
  overflow: hidden;
  .ant-modal-content {
    background: ${mainBgColor};
    .ant-modal-close-icon {
      color: ${white};
    }
    .ant-modal-body {
      padding: 0px;
      min-height: 100px;
      text-align: center;
      main {
        padding: 20px 40px;
        height: calc(100vh - 62px);
        & > section {
          padding: 0px;
        }
      }
    }
  }
`;
