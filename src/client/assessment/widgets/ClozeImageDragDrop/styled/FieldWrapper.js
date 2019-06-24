import styled from "styled-components";
import { InputNumber } from "antd";
import { tabletWidth } from "@edulastic/colors";

export const FieldWrapper = styled.div`
  display: flex;
  align-items: center;
  margin-right: 16px;
  white-space: nowrap;
`;

export const FieldLabel = styled.div`
  font-size: 16px;
  font-weight: 600;
  margin: 8px 0px;
`;

export const MaxRespCountWrapper = styled(FieldWrapper)`
  margin-top: 16px;

  @media screen and (max-width: ${tabletWidth}) {
    flex-direction: column-reverse;
    align-items: flex-start;
    margin-top: 4px;
  }
`;

export const MaxRespCountInput = styled(InputNumber)`
  height: 38px;
  padding: 5px;
  color: ${props => props.theme.widgets.clozeImageText.maxRespCountColor};
  font-weight: ${props => props.theme.widgets.clozeImageText.maxRespCountFontWeight};
  margin-right: 20px;
  @media screen and (max-width: ${tabletWidth}) {
    margin-top: 4px;
  }
`;
