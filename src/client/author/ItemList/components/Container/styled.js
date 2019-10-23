import {
  mobileWidth,
  white,
  largeDesktopWidth,
  desktopWidth,
  mobileWidthLarge,
  mediumDesktopExactWidth,
  extraDesktopWidthMax
} from "@edulastic/colors";
import styled from "styled-components";
import { Button } from "antd";
import { Paper } from "@edulastic/common";
import PerfectScrollbar from "react-perfect-scrollbar";

export const Container = styled.div`
  padding: 0;
  left: 0;
  right: 0;
  height: 100%;
  overflow: hidden;
  display: flex;
  position: relative;
  background: #f3f3f8;
  height: ${props => `calc(100vh - ${props.theme.HeaderHeight.xs}px)`};

  @media (min-width: ${mediumDesktopExactWidth}) {
    height: ${props => `calc(100vh - ${props.theme.HeaderHeight.md}px)`};
  }
  @media (min-width: ${extraDesktopWidthMax}) {
    height: ${props => `calc(100vh - ${props.theme.HeaderHeight.xl}px)`};
  }

  @media (max-width: ${mobileWidth}) {
    padding: 0;
    height: initial;
    overflow: auto;
  }
`;

export const ContentWrapper = styled(Paper)`
  position: relative;
  height: 100%;
  overflow: hidden;
  padding-bottom: 40px;

  @media (max-width: ${mobileWidth}) {
    height: initial;
    overflow-y: initial;
    overflow-x: initial;
    border-radius: 10px;
    padding: 0 0 28px 0;
  }
`;

export const MobileFilterIcon = styled.div`
  display: none;
  @media (max-width: ${largeDesktopWidth}) {
    display: block;
  }
  @media (max-width: ${desktopWidth}) {
    display: none;
  }
`;

export const ListItems = styled.div`
  flex: 1;
  padding-left: ${props => (props.isShowFilter ? "0px" : "30px")};

  @media (max-width: ${desktopWidth}) {
    padding-left: 0px;
  }
`;

export const ScrollbarContainer = styled(PerfectScrollbar)`
  padding: 0px 30px;

  @media (max-width: ${mobileWidthLarge}) {
    padding: 0px 15px;
  }
`;

export const Element = styled.div`
  margin: 0;
  height: 100%;

  .ant-pagination {
    padding: 30px 0 0 0;
    background: ${white};
    justify-content: flex-end;
  }
  .ant-pagination-total-text {
    display: none;
  }
  @media (max-width: ${mobileWidth}) {
    margin: 0 0 20px 0;
    height: initial;

    .ant-pagination {
      justify-content: flex-end;
      padding: 20px 0 0 0;
      margin: 0;
      width: 100%;
    }
  }
`;

export const SpinContainer = styled.div`
  transition: all 0.3s ease;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #fff;
  z-index: 10;
  pointer-events: none;
  opacity: 0;

  &.active {
    pointer-events: all;
    opacity: 1;
  }
`;

export const PaginationContainer = styled.div`
  .ant-pagination {
    padding: 20px 0px;
    background: transparent;
    display: flex;
    align-items: center;
    justify-content: center;
  }
`;
