import styled from 'styled-components'
import Button from "antd/es/Button";
import { themeColor } from '@edulastic/colors'

export const StyledButton = styled(Button)`
  width: max-content;
  height: 40px;
  border-radius: 4px;
  border: 0;
  margin-top: 14px;
  margin-right: 10px;
  background: ${themeColor};

  font-family: '${(props) => props.theme.common.addNewChoiceButtonFontFamily}';
  text-transform: uppercase;
  font-size: ${(props) => props.theme.common.addNewChoiceButtonFontSize};
  font-weight: ${(props) => props.theme.common.addNewChoiceButtonFontWeight};
  font-style: ${(props) => props.theme.common.addNewChoiceButtonFontStyle};
  color: ${(props) => props.theme.common.addNewChoiceButtonColor};

  &:hover,
  &:active,
  &:focus {
    background-color: ${(props) =>
      props.theme.common.addNewChoiceButtonBgHoverColor};
    color: ${(props) => props.theme.common.addNewChoiceButtonHoverColor};
  }
`
