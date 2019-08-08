import { themeColor, white, mobileWidth, mediumDesktopWidth } from "@edulastic/colors";
import styled from "styled-components";

export const Container = styled.div`
  display: flex;
  position: relative;
  padding: 0;
  min-height: ${({ flowLayout }) => (flowLayout ? "unset" : "250px")};
  margin-bottom: 30px;
  flex-direction: row;
  opacity: ${({ isDragging }) => (isDragging ? "0.4" : "1")};

  @media (max-width: ${mobileWidth}) {
    padding: 0;
  }
`;

export const Buttons = styled.div`
  position: absolute;
  right: 20px;
  top: 50%;
  width: 32px;
  display: flex;
  flex-direction: column;
  align-items: center;
  transform: translateY(-50%);
  oveflow-x: visible;

  .points {
    width: 300px;
    text-align: right;
    position: absolute;
    right: 0;
    top: -40px;

    input {
      width: 45px;
      padding: 0;
      text-align: center;
    }
  }

  .ant-btn-circle {
    background: ${white};
    display: flex;
    justify-content: center;
    align-items: center;
    width: 32px;
    height: 32px;
    border: 1px solid ${themeColor};
    border-radius: 3px;
    margin-bottom: 10px;

    svg {
      fill: ${themeColor};
    }
  }

  @media (max-width: ${mediumDesktopWidth}) {
    .ant-btn-circle {
      width: 30px;
      height: 30px;
    }
  }
  @media (max-width: ${mobileWidth}) {
    right: 0px;
  }
`;
