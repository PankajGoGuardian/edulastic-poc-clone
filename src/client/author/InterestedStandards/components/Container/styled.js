import styled from "styled-components";
import { Layout, Spin, Button, Row, Checkbox } from "antd";
import { mediumDesktopExactWidth } from "@edulastic/colors";

const { Content } = Layout;

export const InterestedStandardsDiv = styled.div`
  display: flex;
  flex-direction: row;
`;

export const StyledContent = styled(Content)`
  width: 100%;
  padding: 90px 30px 30px;

  @media (min-width: ${mediumDesktopExactWidth}) {
    padding: 126px 30px 30px;
  }
`;

export const StyledLayout = styled(Layout)`
  position: relative;
  box-shadow: 0 3px 10px 0 rgba(0, 0, 0, 0.1);
  border-radius: 10px;
  background: #fff;
  padding: 30px;
  display: flex;
  flex-direction: column;
  pointer-events: ${props => (props.loading === "true" ? "none" : "auto")}
  min-height: 400px;
`;

export const SpinContainer = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  left: 0;
  top: 0;
  background: rgba(68, 68, 68, 0.1);
  z-index: 999;
  border-radius: 10px;
`;

export const StyledSpin = styled(Spin)`
  position: absolute;
  left: 50%;
  top: 35%;
  transform: translate(-50%, -50%);
`;

export const StyledSubjectContent = styled(Row)`
  margin-top: 20px;
`;

export const StyledSaveButton = styled(Button)`
  float: right;
`;

export const StyledSubjectTitle = styled.p`
  padding: 0 5px;
  font-weight: bold;
`;

export const StyledSubjectLine = styled.div`
  display: flex;
  padding: 5px 0px 5px 20px;
`;

export const StyledSubjectCloseButton = styled.a`
  margin-right: 20px;
  color: rgba(0, 0, 0, 0.25);
`;
export const StyledCheckbox = styled(Checkbox)`
  margin: 0px 0px 10px 0px !important;
`;

export const DropdownWrapper = styled.div`
  .ant-select {
    width: 200px;
  }
  .ant-select-selection {
    border: 1px solid #40b394;
    color: #40b394;
  }
`;
