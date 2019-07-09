import styled from "styled-components";
import { themeColor, darkGrey } from "@edulastic/colors";

const IndexBox = styled.span`
  background: ${props => (props.isActive ? themeColor : darkGrey)};
  padding: 0 10px;
  color: white;
  display: inline-flex;
  align-items: center;
  height: 100%;
  border-top-left-radius: 5px;
  border-bottom-left-radius: 5px;
`;

export default IndexBox;
