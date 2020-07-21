import styled from "styled-components";
import { InputNumber, Input } from "antd";
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

export const PointsInput = styled(InputNumber)`
    min-width: 230px;
    width: ${({ width }) => width || null};
    background: #f8f8fb;
    border: 1px solid ${greyThemeLight};
    padding: 0px 15px;
    max-height: 40px;
    min-height: 34px;
    font-size: 11px;
    margin-right: ${props => props.mr || "0px"};
    position: relative;
    z-index: 1;
    outline: none;
    outline-style: none;
    box-shadow: none;
    &:hover{
      border: 1px solid ${greyThemeLight};
    }
`;
