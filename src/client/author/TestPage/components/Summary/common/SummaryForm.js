import styled from "styled-components";
import { Input, Select } from "antd";

import {
  lightGreySecondary,
  secondaryTextColor,
  inputBorder,
  themeColor,
  white,
  largeDesktopWidth
} from "@edulastic/colors";
import { Button } from "@edulastic/common";

const FieldsMargin = "23px";

export const SummaryInput = styled(Input)`
  border: ${props => (props.value !== undefined && !props.value.trim().length ? "1px solid red" : "1px solid #e1e1e1")};
  background: ${lightGreySecondary};
  margin-bottom: ${FieldsMargin};
  &:focus {
    border: ${props => (props.value !== undefined && !props.value.trim().length ? "1px solid red !important" : "")};
  }
`;

export const SummaryButton = styled(Button)`
  border: 1px solid ${themeColor};
  background: ${white};
  display: inline-block;
  border-radius: 5px;
  &:hover {
    background: ${white};
  }
`;

export const SummarySelect = styled(props => <Select {...props} getPopupContainer={trigger => trigger.parentNode} />)`
  margin-bottom: ${FieldsMargin};
`;

export const SummaryTextArea = styled(Input.TextArea)`
  font-weight: 600;
  color: ${secondaryTextColor};
  min-height: 80px !important;
  height: ${props => (props.isPlaylist ? "220px" : "80px")} !important;
  max-height: ${props => (props.isPlaylist ? "none" : "168px")} !important;
  padding: 10px 20px;
  border: ${props => (props.isPlaylist ? "1px solid #e1e1e1" : "none")};
  margin-bottom: ${FieldsMargin};
  background: ${lightGreySecondary};
  ${props =>
    props.isPlaylist &&
    `@media(max-width:${largeDesktopWidth}){
      height:80px !important;
  }`}
`;

export const SummaryDiv = styled.div`
  margin-bottom: 12px;
`;

export const ColorBox = styled.span`
  display: inline-block;
  vertical-align: middle;
  width: 40px;
  height: 40px;
  padding: 5px;
  border-radius: 5px;
  margin: 5px 5px;
  margin-right: 20px;
  background-color: ${props => props.background};
  border: 1px solid ${inputBorder};
`;
