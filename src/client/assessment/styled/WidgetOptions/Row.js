import styled from "styled-components";
import { Row as AntRow } from "antd";

import { mobileWidth } from "@edulastic/colors";

export const Row = styled(AntRow)`
  margin-top: ${props => (props.marginTop ? `${props.marginTop}px` : 0)};

  ${props =>
    props.center &&
    `
    display: flex;
    align-items: center;
    margin-bottom: ${props.mb || "18"}px;
    
    > * {
      margin-top: 0 !important;
      margin-bottom: 0 !important;
    }
    
    @media(max-width: ${mobileWidth}) {
      margin-bottom: 15px;
      flex-wrap: wrap;
      
      > * {
        &:not(:last-child) {
          margin-bottom: 15px !important;
        }
      }
    }
  `}
`;
