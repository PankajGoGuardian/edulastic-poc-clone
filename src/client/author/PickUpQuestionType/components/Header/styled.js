import { white, newBlue, mobileWidth } from "@edulastic/colors";
import styled from "styled-components";

export const Container = styled.div`
  position: absolute;
  top: 0px;
  left: 0px;
  right: 0px;
  display: flex;
  align-items: center;
  margin-bottom: 70px;
  background: ${newBlue};
  padding: 0px 45px;
  height: 96px;
  z-index: 10;

  @media (max-width: ${mobileWidth}) {
    margin-bottom: 30px;
  }
`;

export const Title = styled.div`
  font-size: 22px;
  font-weight: bold;
  line-height: 1.36;
  color: ${white};
`;
