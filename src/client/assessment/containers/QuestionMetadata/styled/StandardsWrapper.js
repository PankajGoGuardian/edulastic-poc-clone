import styled from "styled-components";
import { darkGrey1 } from "@edulastic/colors";

const StandardsWrapper = styled.div`
  display: flex;
  align-items: center;
  color: ${darkGrey1};
  padding: 5px 10px;
  margin: 5px 0px;
`;

export const RecentStandards = styled.div`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
`;

export default StandardsWrapper;
