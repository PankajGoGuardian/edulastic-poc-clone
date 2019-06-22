import styled from "styled-components";
import { greyDarken, white } from "@edulastic/colors";

export const ResponsTextInputWrapper = styled.div.attrs({
  className: "imagelabelDropDown-droppable iseditablearialabel"
})`
  display: flex;
  align-items: center;
  margin: 4px 0px;
  span {
    background: ${greyDarken};
    color: ${white};
    display: flex;
    align-items: center;
  }
`;
