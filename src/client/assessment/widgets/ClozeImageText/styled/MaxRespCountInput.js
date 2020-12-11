import styled from 'styled-components'
import { tabletWidth } from '@edulastic/colors'
import InputNumber from "antd/es/InputNumber";

export const MaxRespCountInput = styled(InputNumber)`
  width: 180px;
  height: 38px;
  padding: 5px;
  color: ${(props) => props.theme.widgets.clozeImageText.maxRespCountColor};
  font-weight: ${(props) =>
    props.theme.widgets.clozeImageText.maxRespCountFontWeight};
  margin-right: 20px;
  @media screen and (max-width: ${tabletWidth}) {
    margin-top: 4px;
  }
`
