import styled from "styled-components";
import { Pagination, Affix, Input } from "antd";

import { themeColor, desktopWidth, mediumDesktopWidth, textColor, grey } from "@edulastic/colors";
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
    height: calc(100vh - 125px);

    ::-webkit-scrollbar {
      display: none;
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
  min-height: calc(100vh - 96px);
  box-shadow: -1px 0px 5px 1px ${grey};
  padding: 20px 25px;

  @media (max-width: ${mediumDesktopWidth}) {
    min-height: calc(100vh - 60px);
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
  top: 96px;
  padding: 20px 0px;

  @media (max-width: ${mediumDesktopWidth}) {
    top: 60px;
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
