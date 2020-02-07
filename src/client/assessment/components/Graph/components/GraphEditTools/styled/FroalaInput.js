import styled from "styled-components";
import { backgrounds, greyThemeLight } from "@edulastic/colors";

export const FroalaInput = styled.div`
  display: flex;
  justify-content: center;
  text-align: center;
  border-radius: 4px;
  border: 1px solid ${greyThemeLight};
  height: 40px;
  display: flex;
  padding: 5px 8px 0;
  background: ${backgrounds.primary};
  .fr-box {
    width: 100%;
  }
  [class^="fr-"] {
    height: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
  }
`;
