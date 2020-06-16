import styled from "styled-components";
import { darkGrey1 } from "@edulastic/colors";

const StandardsWrapper = styled.div`
  display: flex;
  align-items: center;
  color: ${darkGrey1};
  padding: 5px 0px;
  margin: 5px 0px;
  width: ${props => !props.isDocBased && "90%"};
`;

export const RecentStandards = styled.div`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
`;

export default StandardsWrapper;
