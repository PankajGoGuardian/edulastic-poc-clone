import { Paper } from "@edulastic/common";
import styled from "styled-components";
import { mediumDesktopWidth } from "@edulastic/colors";

export const Container = styled(Paper)`
  margin: 126px auto 0 auto;
  padding: 30px;
  width: calc(100% - 60px);
  min-height: 75vh;
  border: none;
  box-shadow: 0 3px 10px 0 rgba(0, 0, 0, 0.1);
  border-radius: 10px;

  @media (max-width: ${mediumDesktopWidth}) {
    margin: 90px auto 0 auto;
  }
`;

export const CardBox = styled.div`
  background: #ffffff;
  margin-bottom: 16px;
  padding: 9px 14px 22px;
  border-radius: 8px;
  border: 1px solid #eeeeee;
  box-shadow: none;
`;
