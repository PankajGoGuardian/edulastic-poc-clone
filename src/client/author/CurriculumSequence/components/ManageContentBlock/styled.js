import styled from "styled-components";
import { Modal } from "antd";
import {
  white,
  smallDesktopWidth,
  themeColor,
  playlistTabLink,
  greyThemeLight,
  backgrounds,
  borderGrey4,
  mainBgColor
} from "@edulastic/colors";
import { ConfirmationModal } from "../../../src/components/common/ConfirmationModal";

export const ManageContentOuterWrapper = styled.div`
  width: 400px;
  min-width: 400px;
  margin: 20px 30px 40px 0;
  border-radius: 4px;
`;

export const ManageContentContainer = styled.div`
  width: 400px;
  min-width: 400px;
  margin: 20px 30px 40px 0;
  background: ${white};
  padding: 10px 22px;
  border-radius: 10px;
  border: 1px solid ${borderGrey4};

  @media (max-width: ${smallDesktopWidth}) {
    margin: 20px 40px 40px 40px;
  }

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
`;

export const SearchByNavigationBar = styled.div`
  width: 100%;
  display: flex;
  justify-content: ${({ justify }) => justify};
`;

export const SearchByTab = styled.div`
  padding: 0px 6px 10px 6px;
  margin: 0px 10px 2px 0px;
  color: ${({ isTabActive }) => (isTabActive ? themeColor : playlistTabLink)};
  border-bottom: ${({ isTabActive }) => isTabActive && "1px solid " + themeColor};
  text-transform: uppercase;
  font-size: 11px;
  font-weight: 600;
  cursor: pointer;
  user-select: none;
`;

export const SearchBar = styled.input`
  border: 1px solid ${greyThemeLight};
  width: 305px;
  height: 40px;
  margin: 10px 6px 2px 0px;
  padding: 10px;
  background: ${backgrounds?.default};
  outline: none;
`;

export const FilterBtn = styled.div`
  width: 40px;
  height: 40px;
  border: 1px solid ${themeColor};
  background: ${({ isActive }) => (isActive ? themeColor : white)};
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 10px;
  cursor: pointer;
  user-select: none;
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
  height: 30px;
  border: 1px solid ${themeColor};
  color: ${themeColor};
  background: ${white};
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
  height: calc(100vh - 295px);
  margin-bottom: 20px;
  overflow: auto;
  display: flex;
  flex-direction: column;
  align-items: start;

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: #f1f1f1;
  }

  &::-webkit-scrollbar-thumb {
    background: #888;
  }

  &::-webkit-scrollbar-thumb:hover {
    background: #555;
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
