import { desktopWidth, greenDark, mobileWidth, secondaryTextColor, white, newBlue } from "@edulastic/colors";
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
    padding: 0 0 40px 0;
    height: initial;
    overflow: auto;
  }
`;

export const ListItems = styled.div`
  flex: 1;

  @media (max-width: ${mobileWidth}) {
    padding: 20px;
  }

  .ant-pagination {
    display: flex;
  }

  .ant-pagination-total-text {
    flex: 1;
    font-size: 13px;
    font-weight: 600;
    font-family: "Open Sans";
    color: ${secondaryTextColor};
    letter-spacing: normal;
  }

  .ant-pagination-item-active {
    border: none;
    opacity: 0.75;
    background-color: ${greenDark};
  }

  .ant-pagination-item-active a {
    color: ${white};
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
    }
  }
  .ant-pagination {
    padding: 30px 0 0 0;
    background: ${white};
    justify-content: flex-end;

    &-next a,
    &-prev a {
      border: 0;
    }
    &-prev,
    &-next,
    &-disabled,
    &-disabled:hover,
    &-disabled:focus {
      border-radius: 4px;
      box-shadow: 0 2px 7px 0 rgba(201, 208, 219, 0.5);
      border: 0;
    }
    &-jump-next,
    &-item {
      font-size: 13px;
      font-weight: 600;
      color: ${secondaryTextColor};
      border-radius: 4px;
      box-shadow: 0 2px 7px 0 rgba(201, 208, 219, 0.5);
      border: 0;

      &-active {
        font-size: 13px;
        font-weight: 600;
        opacity: 1;
        background: ${newBlue};
      }
    }
  }
  .ant-pagination-total-text {
    display: none;
  }
  @media (max-width: ${mobileWidth}) {
    margin: 20px 0px;
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
