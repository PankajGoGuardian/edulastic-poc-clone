import styled from "styled-components";

import { FlexContainer } from "@edulastic/common";
import { lightBlueSecondary, secondaryTextColor } from "@edulastic/colors";

export const Block = styled.div`
  display: flex;
  width: 100%;
  flex-direction: column;
  margin-right: 0;

  :last-child {
    border-bottom: none;
    margin-bottom: 0;
    padding-bottom: 0;
  }

  .ant-input {
    font-size: 13px;
    font-weight: 600;
    letter-spacing: 0.2px;
    color: #434b5d;
    padding-left: 20px;
  }

  .ant-select-selection__choice {
    height: 23px !important;
    border-radius: 5px;
    display: flex;
    align-items: center;
    background: #cbdef7;
    color: ${lightBlueSecondary};
    font-weight: 600;
    margin-top: 9px !important;
  }

  .ant-select-selection__rendered {
    padding-left: 9px;
    margin-left: 0;
  }

  .ant-select-selection__choice__content {
    font-size: 11px;
    letter-spacing: 0.2px;
    color: #0083be;
    font-weight: bold;
    height: 23px;
    display: flex;
    align-items: center;
  }

  .ant-select-remove-icon svg {
    fill: ${lightBlueSecondary};
    width: 12px;
    height: 12px;
  }

  textarea {
    height: 116px;
  }
`;

export const MainTitle = styled.div`
  font-size: 13px;
  font-weight: 600;
  color: ${secondaryTextColor};
  letter-spacing: 0.2px;
  margin-bottom: 8px;
`;

export const Title = styled.span`
  font-size: 13px;
  font-weight: 600;
  color: #4aac8b;
  margin-right: 3px;
`;

export const TitleContent = styled.span`
  font-size: 13px;
  font-weight: 600;
  color: #444444;
`;

export const MetaTitle = styled.span`
  font-size: 10px;
  font-weight: 600;
  color: #bbbfc4;
`;

export const AnalyticsContainer = styled(FlexContainer)`
  margin-top: 23px;
`;

export const AnalyticsItem = styled(FlexContainer)`
  margin-right: 31px;
`;

export const ErrorWrapper = styled.div`
  color: red;
  margin-top: -6px;
  margin-bottom: 15px;
`;
