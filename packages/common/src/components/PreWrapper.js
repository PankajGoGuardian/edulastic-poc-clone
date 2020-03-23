import styled from "styled-components";
import { title } from "@edulastic/colors";

const PreWrapper = styled.pre`
  font-family: "Open Sans", "Droid Sans", Arial, sans-serif;
  white-space: pre-wrap;

  .template_box {
    padding: ${props => (props.view === "preview" ? props.padding : "15px")} !important;
    .jsx-parser {
      & p,
      & span {
        color: ${title} !important;
      }
    }
  }
`;

PreWrapper.displayName = "PreWrapper";

export default PreWrapper;
