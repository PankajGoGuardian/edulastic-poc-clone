import styled from "styled-components";

import { darkGrey } from "@edulastic/colors";
import { FlexContainer } from "@edulastic/common";

export const UploadDescription = styled.p`
  font-size: 14px;
  color: ${darkGrey};
`;

export const CreateUploadContainer = styled(FlexContainer)`
  justify-content: center;
  align-items: center;
  flex-direction: column;
  width: 50%;
  height: 70%;
  /* todo: delete when upload icon is available */
  padding-bottom: 90px;
`;
