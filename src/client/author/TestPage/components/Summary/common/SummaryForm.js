import styled from "styled-components";
import { Input, Select } from "antd";

import { lightGreySecondary, secondaryTextColor } from "@edulastic/colors";

export const SummaryInput = styled(Input)`
  border: none;
  background: ${lightGreySecondary};
  margin-bottom: 23px;
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
  min-height: 354px !important;
  height: 354px;
  max-height: 354px;
  padding: 10px 20px;
  border: none;
  background: ${lightGreySecondary};
`;
