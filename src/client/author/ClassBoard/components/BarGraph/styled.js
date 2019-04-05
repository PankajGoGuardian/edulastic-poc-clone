import styled from "styled-components";
import { mobileWidth } from "@edulastic/colors";

export const MainDiv = styled.div`
  width: 100%;
  .highcharts-credits {
    display: none;
  }
  .highcharts-title {
    display: none;
  }

  .xAxis {
    font-weight: 600;
  }
  @media (max-width: ${mobileWidth}) {
    margin-top: 25px;
  }
`;
