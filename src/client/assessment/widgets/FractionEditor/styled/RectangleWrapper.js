import styled from "styled-components";
import { blue } from "@edulastic/colors/index";

export default styled.div`
  display: grid;
  grid-template-columns: ${({ columns }) => `repeat(${columns}, 44px)`};
  grid-gap: 0px;
  grid-template-rows: ${({ rows }) => `repeat(${rows}, 44px)`};
  width: max-content;
  border-left: 2px solid ${blue};
  border-bottom: 2px solid ${blue};
  margin-bottom: 1em;
`;
