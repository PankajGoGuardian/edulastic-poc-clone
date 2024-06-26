import styled from "styled-components";
import { PaddingDiv } from "@edulastic/common";

export const EditorContainer = styled(PaddingDiv)`
  border-radius: 10px;
  background: ${props => props.theme.widgets.clozeImageText.editorContainerBgColor};
`;
