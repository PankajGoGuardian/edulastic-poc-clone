import styled from "styled-components";
import { blue, lightBlue, mainBlueColor } from "@edulastic/colors/index";

export default styled.div`
  background-color: ${({ previewTab, selected, fillColor }) =>
    selected ? (previewTab === "show" ? "green" : fillColor || mainBlueColor) : lightBlue};
  display: flex;
  justify-content: center;
  align-items: center;
  border-top: 2px solid ${blue};
  border-right: 2px solid ${blue};
  max-width: 200px;
  &:hover {
    background-color: ${({ previewTab }) => (previewTab === "clear" ? mainBlueColor : null)};
  }
`;
