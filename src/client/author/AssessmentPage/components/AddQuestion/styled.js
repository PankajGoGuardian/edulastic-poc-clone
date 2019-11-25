import styled from "styled-components";
import { Button } from "antd";

import { white, mainBgColor, themeColor, sectionBorder } from "@edulastic/colors";

export const AddQuestionWrapper = styled.div`
  position: fixed;
  width: 100%;
  bottom: 0;
  padding: 15px 0;
  background: ${mainBgColor};
`;

export const ContentWrapper = styled.div`
  padding: 19px 18px 15px 18px;
  background: ${white};
  border-radius: 10px;
  box-sizing: border-box;
  width: 365px;
  border: 1px solid ${sectionBorder};
`;

export const QuestionTypes = styled.div`
  display: flex;
  justify-content: space-between;
  flex-direction: row;
  &:last-child {
    margin-top: 20px;
  }
`;

export const AddQuestionIcon = styled.span`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 40px;
  height: 40px;
  border-radius: 5px;
  background: ${themeColor};
  cursor: pointer;

  &:hover {
    svg {
      fill: ${white};
    }
  }

  svg {
    fill: ${white};
    width: 21px;
    height: 19px;
    height: unset;
  }
`;

export const AddButton = styled(Button)`
  border-radius: 5px;
  border: 1px solid ${themeColor};
  width: 48%;
  height: 32px;
  color: ${themeColor};
  font-size: 11px;
  text-transform: uppercase;
  font-weight: 600;
`;
