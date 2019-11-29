import styled from "styled-components";

import {
  white,
  secondaryTextColor,
  greenDark,
  green,
  red,
  themeColor,
  sectionBorder,
  greyScoreCardTitleColor
} from "@edulastic/colors";

export const QuestionItemWrapper = styled.div`
  width: 100%;
  max-width: ${({ review }) => (review ? "315px" : "340px")};
  padding: 19px 6px 18px 13px;
  background: ${white};
  border-radius: 0 10px 10px 0;
  border: 1px solid ${sectionBorder};
  border-left-color: transparent;
  box-shadow: ${({ highlighted }) => (highlighted ? `0 0 10px 0 ${themeColor}` : "none")};
`;

export const AnswerForm = styled.div`
  display: flex;
  align-items: center;
`;

export const QuestionNumber = styled.span`
  display: inline-block;
  font-size: 18px;
  font-weight: bold;
  color: ${({ dragging }) => (dragging ? "#aaafb8" : "white")};
  background: ${({ dragging }) => (dragging ? "transparent" : "#aaafb8")};
  border: 2px ${({ dragging }) => (dragging ? "dashed" : "solid")} #aaafb8;
  border-radius: 4px;
  width: 40px;
  height: 40px;
  text-align: center;
  padding-top: 6px;
  transition: all 300ms;
  cursor: ${({ dragging, viewMode }) => viewMode && (dragging ? "grabbing" : "grab")};
`;

export const QuestionForm = styled.div`
  display: flex;
  flex-wrap: wrap;
  margin-left: 13px;

  .ant-select-selection {
    width: ${({ review }) => (review ? "220px" : "133px")};
  }

  .input__math {
    width: 220px;
  }

  .ant-input {
    width: ${({ review }) => (review ? "220px" : "133px")};
  }
`;

export const EditButton = styled.span`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 15px;
  padding-left: 0;
  margin-left: 10px;
`;

export const ButtonWrapper = styled.span`
  padding: 10px;
  background: #fff;
  box-shadow: 0px 2px 4px rgba(201, 208, 219, 0.5);
  margin-right: 5px;
  border-radius:4px;
  svg {
    fill: ${themeColor};
    width: 13px;
    height: 13px;
    cursor: pointer;
    &:hover {
      fill: ${themeColor};
    }
  }
}
`;

export const AnswerIndicator = styled.span`
  display: inline-block;
  padding: 8px 15px;

  svg {
    fill: ${({ correct }) => (correct ? green : red)};
    width: 13px;
    height: 13px;

    &:hover {
      fill: ${greenDark};
    }
  }
`;

export const DetailsContainer = styled.p`
  margin: 15px 0 0 5px;
`;

export const DetailTitle = styled.span`
  display: inline-block;
  margin-right: 5px;
  font-size: 11px;
  text-transform: uppercase;
  color: ${greyScoreCardTitleColor};
`;

export const DetailContents = styled.span`
  display: inline-block;
  font-size: 11px;
  font-weight: bold;
  color: ${secondaryTextColor};
`;

export const DetailContentsAlternate = styled(DetailContents)`
  display: inline-block;
  padding-left: 8px;
`;

export const DetailAlternateContainer = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
`;
