import styled from "styled-components";
import { Input } from "antd";
import { greyThemeLight } from "@edulastic/colors";

export const CorrectAnswerHeader = styled.div`
  display: flex;
  align-items: center;
  position: relative;
  position: ${({ placement }) => placement?.position || "relative"};
  top: ${({ placement }) => placement?.top || null};
  margin-top: ${props => props.mt || "0px"};
  margin-bottom: ${props => props.mb || "0px"};
  label {
    margin-bottom: 0px;
    margin-right: 15px;
  }
`;

export const PointsInput = styled(Input)`
  &.ant-input {
    min-width: 230px;
    width: ${({ width }) => width || null};
    background: #f8f8fb;
    border: 1px solid ${greyThemeLight};
    max-height: 40px;
    min-height: 34px;
    font-size: 11px;
    line-height: 38px;
    padding: 0 15px;
    margin-right: ${props => props.mr || "0px"};
    position: relative;
    z-index: 1;
  }
`;
