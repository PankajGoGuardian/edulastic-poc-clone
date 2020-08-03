import styled from "styled-components";
import { white, lightGrey8, themeColorLight1 } from "@edulastic/colors/index";

export default styled.div`
  background-color: ${({ fillColor }) => fillColor || lightGrey8};
  display: flex;
  justify-content: center;
  align-items: center;
  border-top: 4px solid ${white};
  border-right: 4px solid ${white};
  max-width: 200px;
  transition: all 0.5s;
  &:hover {
    background-color: ${({ previewTab }) => (previewTab === "clear" ? themeColorLight1 : null)};
  }
`;
