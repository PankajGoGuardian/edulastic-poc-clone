import styled from "styled-components";
import { clozeImage } from "@edulastic/constants";

const RelativeContainer = styled.div`
  margin: 0 auto;
  position: relative;
  width: ${clozeImage.maxWidth}px;
  height: ${clozeImage.maxHeight}px;
`;

RelativeContainer.displayName = "RelativeContainer";

export { RelativeContainer };
