import { desktopWidth, mobileWidth, white } from "@edulastic/colors";
import styled from "styled-components";

export const Container = styled.div`
  padding: 0;
  left: 0;
  right: 0;
  height: 100%;
  overflow: hidden;
  display: flex;
  position: relative;
  background: #f3f3f8;
  height: calc(100vh - 96px);

  @media (max-width: ${desktopWidth}) {
    flex-direction: column;
  }

  @media (max-width: ${mobileWidth}) {
    padding: 0;
    height: initial;
    overflow: auto;
  }
`;

export const ListItems = styled.div`
  flex: 1;

  @media (max-width: ${mobileWidth}) {
    padding: 0 26px 20px;
  }
`;

export const Element = styled.div`
  margin: 0;
  height: 100%;

  > div {
    position: relative;
    height: 100%;
    overflow-y: auto;
    overflow-x: hidden;

    @media (max-width: ${mobileWidth}) {
      height: initial;
      overflow-y: initial;
      overflow-x: initial;
      border-radius: 10px;
      padding: 0 0 28px 0;
    }
  }
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
    padding: 0;
    background: transparent;
    margin-top: 42px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
`;
