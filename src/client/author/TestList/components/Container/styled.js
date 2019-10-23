import styled from "styled-components";
import { Pagination, Affix, Input } from "antd";

import {
  themeColor,
  desktopWidth,
  mediumDesktopWidth,
  textColor,
  grey,
  mediumDesktopExactWidth,
  extraDesktopWidthMax
} from "@edulastic/colors";
import { Card } from "@edulastic/common";

export const ScrollBox = styled.div`
  padding-right: 30px;
  & > div {
    padding: 20px 0px 5px;
  }
`;

export const Container = styled.div`
  padding: 0px 0px 0px 20px;
  left: 0;
  right: 0;
  height: 100%;
  overflow: auto;

  .ant-input {
    font-size: 13px;
    letter-spacing: 0.2px;
    color: #b1b1b1;
    ::placeholder {
      font-style: italic;
      color: #b1b1b1;
    }
  }

  .ant-input-suffix {
    font-size: 15px;
    svg {
      fill: ${themeColor};
    }
  }

  .scrollbar-container {
    overflow: auto !important;
    height: ${props => `calc(100vh - ${props.theme.HeaderHeight.xs + 40}px)`};

    ::-webkit-scrollbar {
      display: none;
    }

    @media (min-width: ${mediumDesktopExactWidth}) {
      height: ${props => `calc(100vh - ${props.theme.HeaderHeight.md + 40}px)`};
    }
    @media (min-width: ${extraDesktopWidthMax}) {
      height: ${props => `calc(100vh - ${props.theme.HeaderHeight.xl + 40}px)`};
    }
  }

  @media (max-width: ${desktopWidth}) {
    padding: 20px;
  }
`;

export const ScrollbarWrapper = styled.div``;

export const PaginationInfo = styled.span`
  font-weight: 600;
  font-size: 13px;
`;

export const Filter = styled.div`
  width: 250px;
  z-index: 0;

  @media (max-width: ${desktopWidth}) {
    display: none;
  }
`;

export const CardContainer = styled(Card)`
  box-shadow: none;
  border-radius: 0px;
  .ant-card-body {
    padding: 0px;
  }
`;

export const MobileFilter = styled.div`
  height: 50px;
  margin-bottom: 15px;
  display: none;

  @media (max-width: ${desktopWidth}) {
    display: flex;
    .ant-input-search {
      margin-right: 10px;
    }
  }
`;

export const Main = styled.div`
  flex: 1;
  background: white;
  box-shadow: -1px 0px 5px 1px ${grey};
  padding: 20px 25px;
  width: calc(100% - 250px);
  min-height: ${props => `calc(100vh - ${props.theme.HeaderHeight.xs}px)`};

  @media (min-width: ${mediumDesktopExactWidth}) {
    min-height: ${props => `calc(100vh - ${props.theme.HeaderHeight.md}px)`};
  }
  @media (min-width: ${extraDesktopWidthMax}) {
    min-height: ${props => `calc(100vh - ${props.theme.HeaderHeight.xl}px)`};
  }
  @media (max-width: ${desktopWidth}) {
    width: 100%;
  }
`;

export const FilterButton = styled.div`
  flex: 1;
  height: 50px;
  box-shadow: 0 2px 5px 0 rgba(0, 0, 0, 0.07);
  border-radius: 3px;

  .ant-btn {
    height: 50px;
    border-radius: 3px;
    width: 100%;

    span {
      font-size: 11px;
      font-weight: 600;
      color: ${textColor};
    }
  }
`;

export const SearchModalContainer = styled.div`
  width: 100%;
`;

export const AffixWrapper = styled(Affix)`
  position: fixed;
  width: 260px;
  top: ${props => props.theme.HeaderHeight.xs}px;
  padding: 20px 0px;

  @media (min-width: ${mediumDesktopExactWidth}) {
    top: ${props => props.theme.HeaderHeight.md}px;
  }
  @media (min-width: ${extraDesktopWidthMax}) {
    top: ${props => props.theme.HeaderHeight.xl}px;
  }
`;

export const PaginationWrapper = styled(Pagination)`
  padding: ${props => (props.type === "tile" ? "20px 0" : "24px 32px")};
  text-align: right;
`;

export const StyleChangeWrapper = styled.div`
  margin-right: 15px;
  width: 50px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  svg {
    cursor: pointer;
  }
`;
