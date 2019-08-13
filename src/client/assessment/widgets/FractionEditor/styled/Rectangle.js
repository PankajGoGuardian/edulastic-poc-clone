import styled from "styled-components";
import { blue, lightBlue, mainBlueColor } from "@edulastic/colors/index";

export default styled.div`
  background-color: ${({ fillColor }) => fillColor || lightBlue};
  display: flex;
  justify-content: center;
  align-items: center;
  border-top: 2px solid ${blue};
  border-right: 2px solid ${blue};
  max-width: 200px;
  transition: all 0.5s;
  &:hover {
    background-color: ${({ previewTab }) => (previewTab === "clear" ? mainBlueColor : null)};
  }
`;
