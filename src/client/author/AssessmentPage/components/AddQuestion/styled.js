import styled from "styled-components";
import { Button } from "antd";

import { white, mainBgColor, themeColor, extraDesktopWidthMax } from "@edulastic/colors";

export const AddQuestionWrapper = styled.div`
  position: fixed;
  width: 100%;
  bottom: 0;
  padding: 15px 0;
  background: ${mainBgColor};
  @media (min-width: ${extraDesktopWidthMax}) {
    width: auto;
    right: 0;
  }
`;

export const ContentWrapper = styled.div`
  padding: 19px 18px 15px 18px;
  background: ${white};
  border-top-left-radius: 10px;
  border-bottom-left-radius: 10px;
  box-sizing: border-box;
  width: 300px;

  @media (min-width: ${extraDesktopWidthMax}) {
    width: 420px;
    margin-right: 10px;
    margin-left: auto;
  }
`;

export const QuestionTypes = styled.div`
  display: flex;
  justify-content: space-between;
  flex-direction: ${props => props.flexDirection || "row"};
  &:last-child {
    margin-top: 20px;
  }
  @media (min-width: ${extraDesktopWidthMax}) {
    flex-direction: row;
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

  &:not(:first-child) {
    margin-left: 30px;
  }

  svg {
    fill: ${white};
    width: 20px;
    height: unset;
  }
`;

export const AddButton = styled(Button)`
  border-radius: 5px;
  border: 1px solid ${themeColor};
  width: 120px;
  height: 32px;
  color: ${themeColor};
  font-size: 11px;
  text-transform: uppercase;
  font-weight: 600;
`;
