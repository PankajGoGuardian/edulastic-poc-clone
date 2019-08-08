import styled from "styled-components";
import { blue, lightBlue, mainBlueColor } from "@edulastic/colors/index";

export default styled.div`
  background-color: ${({ selected }) => (selected ? mainBlueColor : lightBlue)};
  display: flex;
  justify-content: center;
  align-items: center;
  border-top: 2px solid ${blue};
  border-right: 2px solid ${blue};
  max-width: 200px;
  &:hover {
    background-color: ${mainBlueColor};
  }
`;
