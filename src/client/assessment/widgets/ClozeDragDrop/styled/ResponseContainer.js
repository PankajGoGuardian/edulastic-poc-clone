import styled from "styled-components";

import { response as Dimensions } from "@edulastic/constants";

export const ResponseContainer = styled.div.attrs({
  style: ({ smallSize }) => ({
    minWidth: smallSize ? 140 : Dimensions.minWidth,
    minHeight: smallSize ? 40 : Dimensions.minHeight
  })
})`
  padding: 5px 10px;
  display: inline-flex;
  align-items: center;
  border-radius: 10px;
  overflow: hidden;
  img {
    max-width: 100px;
    max-height: 100px;
  }
  p {
    margin-bottom: 0px;
  }
`;
