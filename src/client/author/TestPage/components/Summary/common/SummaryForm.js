import styled from "styled-components";
import { Input, Select } from "antd";

import { lightGreySecondary, secondaryTextColor } from "@edulastic/colors";
import { Button } from "@edulastic/common";

export const SummaryInput = styled(Input)`
  border: ${props => (props.value ? "" : "1px solid red")};
  background: ${lightGreySecondary};
  margin-bottom: ${props => (props.value ? "23px" : "5px")};
  &:focus {
    border: ${props => (props.value ? "" : "1px solid red")};
  }
`;

export const SummaryButton = styled(Button)`
  border: none;
  background: ${lightGreySecondary};
  display: inline-block;
`;

export const SummarySelect = styled(Select)`
  margin-bottom: 23px;

  .ant-select-selection {
    border: none;
    background: ${lightGreySecondary};

    &__placeholder {
      font-size: 13px;
      margin-left: 15px;
    }
  }
`;

export const SummaryTextArea = styled(Input.TextArea)`
  font-weight: 600;
  color: ${secondaryTextColor};
  min-height: 80px !important;
  height: 80px !important;
  max-height: 168px !important;
  padding: 10px 20px;
  border: none;
  margin-bottom: 23px;
  background: ${lightGreySecondary};
`;

export const SummaryDiv = styled.div`
  margin-bottom: 23px;
`;

export const ColorBox = styled.span`
  display: inline-block;
  vertical-align: middle;
  width: 40px;
  height: 40px;
  padding: 5px;
  border-radius: 5px;
  margin: 5px 5px;
  background-color: ${props => props.background};
`;
