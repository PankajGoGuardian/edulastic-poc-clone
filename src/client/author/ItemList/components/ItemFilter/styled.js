import { Icon, Row } from "antd";
import {
  boxShadowDefault,
  desktopWidth,
  secondaryTextColor,
  textColor,
  greenDark,
  dropZoneTitleColor,
  smallDesktopWidth,
  mediumDesktopWidth
} from "@edulastic/colors";
import { TextField } from "@edulastic/common";
import styled from "styled-components";
import Modal from "react-responsive-modal";

export const Container = styled.div`
  width: 280px;
  height: 100%;
  overflow: auto;

  @media only screen and (min-width: ${smallDesktopWidth}) and (max-width: ${mediumDesktopWidth}) {
    width: 235px;
  }
`;

export const FixedFilters = styled.div`
  padding: 25px 25px 0px;

  @media (max-width: ${desktopWidth}) {
    width: 100%;
    position: relative;
    top: auto;
    padding-right: 0;
    padding-left: 0;
  }
`;

export const Header = styled.div`
  display: flex;

  @media (max-width: ${desktopWidth}) {
    margin-top: 20px;
    margin-bottom: 10px;
  }
`;

export const HeaderRow = styled(Row)`
  width: 100%;
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
    color: #00ad50;
    font-size: 15px;
    &:hover {
      color: #00ad50;
    }
  }

  @media (max-width: ${desktopWidth}) {
    height: 40px;
  }
`;

export const SearchIcon = styled(Icon)`
  color: #00ad50;
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
  color: #00ad50;
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
  color: #00ad50;
  font-weight: 600;
`;
