import { FlexContainer } from "@edulastic/common";
import styled from "styled-components";

export default styled(FlexContainer)`
  background-color: ${({ theme }) => theme.dropContainer.dragItemContainerBgColor};
  padding: 2rem;
  width: 100%;
  border: ${({
    theme: {
      answerBox: { borderWidth, borderStyle, borderColor }
    }
  }) => `${borderWidth} ${borderStyle} ${borderColor}`};
  border-radius: ${({
    theme: {
      answerBox: { borderRadius }
    }
  }) => borderRadius};
`;
