import styled from "styled-components";
import { InputNumber } from "antd";

export const MaxRespCountInput = styled(InputNumber)`
  width: 180px;
  height: 38px;
  padding: 5px;
  color: ${props => props.theme.widgets.clozeImageText.maxRespCountColor};
  font-weight: ${props => props.theme.widgets.clozeImageText.maxRespCountFontWeight};
`;
