import styled from "styled-components";
import { white } from "@edulastic/colors/index";

export default styled.div`
  display: grid;
  grid-template-columns: ${({ columns }) => `repeat(${columns}, 44px)`};
  grid-gap: 0px;
  grid-template-rows: ${({ rows }) => `repeat(${rows}, 44px)`};
  width: max-content;
  border-left: 2px solid ${white};
  border-bottom: 2px solid ${white};
  margin-bottom: 1em;
  margin-right: 10px;
`;
