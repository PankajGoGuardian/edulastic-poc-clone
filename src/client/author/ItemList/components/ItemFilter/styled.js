import { Icon, Row, Affix, Input } from "antd";
import {
  boxShadowDefault,
  desktopWidth,
  secondaryTextColor,
  textColor,
  greenDark,
  dropZoneTitleColor,
  lightGreySecondary,
  mobileWidthLarge,
  themeColor,
  mediumDesktopExactWidth,
  extraDesktopWidthMax,
  greyThemeLighter,
  greyThemeLight
} from "@edulastic/colors";
import { TextField } from "@edulastic/common";
import styled from "styled-components";
import Modal from "react-responsive-modal";

export const Container = styled.div`
  width: 240px;
  height: 100%;
  overflow: auto;

  @media (min-width: ${mediumDesktopExactWidth}) {
    width: 260px;
  }
  @media (min-width: ${extraDesktopWidthMax}) {
    width: 370px;
  }
  @media (max-width: ${desktopWidth}) {
    background: ${lightGreySecondary};
    width: 450px;
    height: calc(100vh - 80px);
    position: fixed;
    left: 50%;
    top: 70px;
    z-index: 1;
    transform: translateX(-50%);
  }
  @media (max-width: ${mobileWidthLarge}) {
    width: 300px;
  }
`;

export const AffixContainer = styled(Affix)``;

export const CloseIcon = styled(Icon)`
  display: none;

  @media (max-width: ${desktopWidth}) {
    font-size: 24px;
    width: 100%;
    padding: 15px 25px 0px;
    text-align: right;
    display: block;
    cursor: pointer;
  }
`;

export const Backdrop = styled.div`
  display: none;

  @media (max-width: ${desktopWidth}) {
    position: fixed;
    background: rgba(0, 0, 0, 0.6);
    top: 0px;
    right: 0px;
    bottom: 0px;
    left: 0px;
    display: block;
    z-index: 1;
  }
`;

export const FixedFilters = styled.div`
  padding: 20px 30px 0px;

  @media (min-width: ${extraDesktopWidthMax}) {
    padding: 20px 50px 0px;
  }

  @media (max-width: ${desktopWidth}) {
    width: 100%;
    position: relative;
    top: auto;
    padding: 0px;
  }
`;

export const SearchWrapper = styled.div`
  display: flex;

  @media (max-width: ${desktopWidth}) {
    padding: 25px 25px 0px 19px;
  }
`;

export const HeaderRow = styled(Row)`
  width: 100%;
`;

export const SearchInput = styled(Input.Search)`
  .ant-input {
    background: ${greyThemeLighter};
    border: 1px solid ${greyThemeLight};
    border-radius: 2px;
    height: 40px;
    font-size: ${props => props.theme.smallFontSize};

    @media (max-width: ${mediumDesktopExactWidth}) {
      font-size: ${props => props.theme.smallLinkFontSize};
    }
  }
  svg {
    fill: ${themeColor};
  }
`;

export const SearchField = styled.div`
  box-shadow: ${boxShadowDefault};
  border-radius: 0;
`;

export const TextFieldStyled = styled(TextField)`
  padding: 16px;
  padding-right: 68px;
  outline: none;
  border-radius: 0;
`;

export const TextFieldSearch = styled(TextField)`
  height: 40px;
  padding: 10px 15px;
  font-size: 12px;
  letter-spacing: 0;
  border: none;
  color: ${dropZoneTitleColor};
  font-style: normal;
  box-shadow: 0 2px 4px 0 #c9d0db;

  span {
    right: 8px;
  }

  .ant-input-search-icon {
    color: ${themeColor};
    font-size: 15px;
    &:hover {
      color: ${themeColor};
    }
  }

  @media (max-width: ${desktopWidth}) {
    height: 40px;
  }
`;

export const SearchIcon = styled(Icon)`
  color: ${themeColor};
  font-size: 15px;
`;

export const FilterButton = styled.div`
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
  }
`;

export const MainFilter = styled.div`
  margin-top: 19px;
  z-index: 0;

  .scrollbar-container {
    ::-webkit-scrollbar {
      display: none;
    }
  }

  .ant-menu {
    margin-top: 16px;

    &-item {
      font-size: 11px;
      border-left: 4px solid transparent;
      border-radius: 0 10px 10px 0;
      padding: 0 18px;
      text-transform: uppercase;

      &-selected {
        border-left: 4px solid ${greenDark};
      }
      .anticon {
        font-size: 21px;
      }
    }
  }

  @media (max-width: ${desktopWidth}) {
    position: relative;
    display: block;
    padding: 0px 25px 0px 19px;
  }
`;

export const MainFilterHeader = styled.div`
  display: flex;
`;

export const Title = styled.span`
  font-size: 14px;
  letter-spacing: 0.3px;
  color: ${secondaryTextColor};
  font-weight: 600;
  text-transform: uppercase;
  flex: 1;
`;

export const Clear = styled.div`
  font-size: 12px;
  font-weight: 600;
  color: ${themeColor};
  border: none;
  background: transparent;
  cursor: pointer;
  text-transform: uppercase;
  margin: 3px 0 0;
`;

export const StyledModal = styled(Modal)`
  width: 100%;
  height: 100%;

  svg {
    fill: red;
  }
`;

export const StyledModalContainer = styled.div`
  width: calc(100vw - 80px);
`;

export const StyledModalTitle = styled.div`
  font-size: 22px;
  color: ${themeColor};
  font-weight: 600;
`;
