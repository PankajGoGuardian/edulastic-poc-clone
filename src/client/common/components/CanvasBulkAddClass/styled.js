import { Table, Row, Modal } from "antd";
import styled from "styled-components";
import { themeColor, white, backgroundGrey2 } from "@edulastic/colors";

export const CanvasClassTable = styled(Table)`
  width: 100%;
`;

export const Container = styled(Row)`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin-top: 40px;
  > div {
    margin-bottom: 10px;
  }
`;

export const LogoWrapper = styled.div`
  margin-bottom: 20px;
`;

export const HeadingWrapper = styled.div`
  font-size: 18px;
  font-weight: 600;
`;

export const ButtonContainer = styled.div`
  display: flex;
  justify-content: ${({ justifyContent }) => justifyContent || "space-between"};
  width: 100%;
`;

export const Button = styled.span`
  padding: 6px 45px;
  color: ${props => (props.back ? themeColor : white)};
  background: ${props => (props.back ? white : themeColor)};
  border: 1px solid ${themeColor};
  border-radius: 5px;
  cursor: pointer;
  font-size: 14px;
  text-transform: uppercase;
  align-items: center;
  display: flex;
  width: fit-content;
`;

export const StyledModal = styled(Modal)`
  .ant-modal-content {
    background: ${backgroundGrey2};
    padding: 10px 20px;
    .ant-modal-header {
      background: transparent;
      padding: 0px;
      border-bottom: 0px;
    }
    .ant-modal-body {
      height: 200px;
      display: flex;
      justify-content: center;
      align-items: center;
      padding-bottom: ${({ footer }) => (footer ? "0px" : "inherit")};
      & > h4 {
        font-size: 15px;
        font-weight: 500;
      }
    }
    .ant-modal-footer {
      display: flex;
      align-items: center;
      justify-content: center;
      border-top: none;
    }
  }
`;

export const ClassNameWrapper = styled.div`
  display: flex;
  flex-direction: column;
`;
