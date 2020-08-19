import styled from "styled-components";
import { greyThemeLight, greyThemeLighter } from "@edulastic/colors";

export const StyledPreviewImage = styled.div`
  width: ${({ width }) => (width ? `${width}px` : "100%")};
  height: ${({ height }) => (!height ? "auto" : `${height}px`)};
  user-select: none;
  pointer-events: none;
  background-size: contain;
  background-repeat: no-repeat;
  background-color: ${greyThemeLighter};
  background-image: url(${({ imageSrc }) => imageSrc || ""});
  border: ${({ setAnswers }) => setAnswers && `1px dashed ${greyThemeLight}`};
`;
