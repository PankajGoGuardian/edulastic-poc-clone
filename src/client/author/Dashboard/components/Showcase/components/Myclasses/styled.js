import { Paper } from "@edulastic/common";
import styled from "styled-components";

export const Container = styled(Paper)`
  margin: 120px auto 0 auto;
  padding: 30px 30px;
  width: 90%;
  min-height: 75vh;
  border: none;
  box-shadow: 0 3px 10px 0 rgba(0, 0, 0, 0.1);
  border-radius: 10px;
`;

export const CardBox = styled.div`
  background: #ffffff;
  margin-bottom: 0.8rem;
  padding: 0.5rem;
  border-radius: 8px;
  border: 1px solid #eeeeee;
  box-shadow: none;
`;
