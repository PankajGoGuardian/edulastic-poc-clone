import styled from "styled-components";
import { black } from "@edulastic/colors";

export const PreviewImage = styled.div`
  position: relative;
  border: 1px dotted ${black};
  border-radius: 4px;
  user-select: none;
  pointer-events: none;
  max-width: unset !important;
  background-size: 100% 100%;
  background-repeat: no-repeat;
  background-image: url(${({ imageSrc }) => imageSrc || ""});
`;
