import styled from "styled-components";
import { mobileWidthMax, backgrounds } from "@edulastic/colors";

const CardComponent = styled.div`
  flex-basis: calc(33.33% - 30px);
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  padding: 30px;
  background-color: ${props => props.theme.brandLightGrey};
  border-radius: 10px;
  width: 414px;
  height: 446px;
  background-color: ${backgrounds.default};

  @media (max-width: ${mobileWidthMax}) {
    min-height: unset;
    flex-basis: 100%;
    margin-bottom: 10px;
  }
`;

export default CardComponent;
