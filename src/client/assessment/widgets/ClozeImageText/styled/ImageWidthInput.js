import styled from "styled-components";
import { InputNumber } from "antd";

export const ImageWidthInput = styled(InputNumber)`
  /* height: 40px; */
  padding: 0px 5px;
  color: ${props => props.theme.widgets.clozeImageText.imageWidthColor};
  font-weight: ${props => props.theme.widgets.clozeImageText.imageWidthFontWeight};
`;
