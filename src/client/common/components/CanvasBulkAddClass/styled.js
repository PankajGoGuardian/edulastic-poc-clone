import { Table, Row, Modal } from "antd";
import styled from "styled-components";
import { IconHeader } from "@edulastic/icons";
import { themeColor, white, backgroundGrey } from "@edulastic/colors";

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

export const Logo = styled(IconHeader)`
  width: ${({ width }) => width || "119px"};
  height: ${({ height }) => height || "21px"};
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
  justify-content: space-between;
  width: 100%;
`;

export const Button = styled.span`
  display: inline-block;
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
`;

export const StyledModal = styled(Modal)`
  .ant-modal-content {
    background: ${backgroundGrey};
    padding: 10px 20px;
    .ant-modal-header {
      background: transparent;
      padding: 0px;
    }
    .ant-modal-body {
      height: 200px;
      display: flex;
      justify-content: center;
      align-items: center;
      background: ${white};
      box-shadow: 0px 2px 5px 0px rgba(0, 0, 0, 0.3);
    }
  }
`;

export const ClassNameWrapper = styled.div`
  display: flex;
  flex-direction: column;
`;
