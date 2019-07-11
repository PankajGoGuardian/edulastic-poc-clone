import { themeColor, white } from "@edulastic/colors";
import styled from "styled-components";

export const Container = styled.div`
  border-radius: 5px;
  box-shadow: 0 2px 5px 0 rgba(0, 0, 0, 0.07);
  padding: 15px;
  margin-bottom: 50px;
  background-color: ${white};
`;

export const Heading = styled.div`
  color: ${themeColor};
  font-size: 13px;
  font-weight: 600;
  margin-bottom: 15px;
`;
