import styled from "styled-components";
import { greyThemeLight, greyThemeLighter } from "@edulastic/colors";

export const PreivewImage = styled.div`
  position: relative;
  border: 1px dashed ${greyThemeLight};
  border-radius: 4px;
  user-select: none;
  pointer-events: none;
  max-width: unset !important;
  background-size: contain;
  background-repeat: no-repeat;
  background-color: ${greyThemeLighter};
  background-image: url(${({ imageSrc }) => imageSrc || ""});
`;
