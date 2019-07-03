import styled from "styled-components";
import { lightBlue, white } from "@edulastic/colors";
import { Button } from "antd";

export const CreateClassButton = styled(Button)`
  display: flex;
  align-items: center;
  border: 2px solid ${lightBlue} !important;
  border-radius: 50px;
  color: ${lightBlue};
  width: 140px;
  &:hover {
    background: ${lightBlue};
    color: ${white};
  }
`;
export const SyncClassDiv = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: ${lightBlue};
  font-size: 14px;
`;
export const CreateCardBox = styled.div`
  display: flex;
  padding-top: 2rem;
  padding-bottom: 2rem;
  justify-content: space-evenly;
  align-items: center;
  flex-direction: column;
  border: 2px dashed ${lightBlue};
  border-radius: 5px;
  min-height: 230px;
  width: 270px;
  margin-top: 1rem;
`;
export const SyncImg = styled.img`
  margin-right: 0.5rem;
  width: 35px;
  height: 35px;
`;
