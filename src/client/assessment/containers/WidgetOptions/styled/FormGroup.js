import styled from "styled-components";

import { mobileWidth } from "@edulastic/colors";

export const FormGroup = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;

  ${props =>
    props.center &&
    `
    input {
      min-width: 170px;
    }
    
    > * {
      margin-top: auto;
      margin-bottom: auto;
    }
    
    @media(max-width: ${mobileWidth}) {
      flex-wrap: wrap;
      
      > * {
        width: 100%;
        max-width: 100%;
        
        &:not(:first-child) {
          margin-bottom: 5px !important;
        }
      } 
      
      label {
        order: 1;
      }
      
      input,
      select {
        order: 2;
      }
    }
  `}
`;
