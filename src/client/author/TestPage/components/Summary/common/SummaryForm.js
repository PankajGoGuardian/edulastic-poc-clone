import styled from "styled-components";
import { Input, Select } from "antd";

import { lightGreySecondary, secondaryTextColor } from "@edulastic/colors";
import { Button } from "@edulastic/common";

export const SummaryInput = styled(Input)`
  border: none;
  background: ${lightGreySecondary};
  margin-bottom: 23px;
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
  min-height: ${props => (props.isplaylist ? "258px !important" : "354px !important")};
  height: ${props => (props.isplaylist ? "258px" : "354px")};
  max-height: ${props => (props.isplaylist ? "258px" : "354px")};
  padding: 10px 20px;
  border: none;
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
