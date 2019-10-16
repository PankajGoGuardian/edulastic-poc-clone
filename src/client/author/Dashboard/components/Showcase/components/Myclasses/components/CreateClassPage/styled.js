import styled from "styled-components";
import { lightBlue, white, themeColor } from "@edulastic/colors";

export const CreateClassDiv = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-evenly;
  background: ${themeColor};
  color: ${white};
  width: 100%;
  padding: 10px 0px;
  border-radius: 4px;
  & > svg {
    fill: ${white};
  }
  & > p {
    text-transform: uppercase;
  }
`;
export const SyncClassDiv = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: ${lightBlue};
  font-size: 14px;
  cursor: pointer;
  text-align: center;
  & > p {
    color: ${themeColor};
    text-transform: uppercase;
    padding-left: 10px;
  }
`;
export const CreateCardBox = styled.div`
  display: flex;
  padding: 30px 20px;
  justify-content: space-evenly;
  align-items: center;
  flex-direction: column;
  border: 2px dashed ${themeColor};
  border-radius: 5px;
  min-height: 300px;
  max-width: 350px;
  margin-top: 1rem;
`;
