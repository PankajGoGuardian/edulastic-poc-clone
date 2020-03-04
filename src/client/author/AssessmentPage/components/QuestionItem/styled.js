import styled from "styled-components";

import {
  white,
  secondaryTextColor,
  greenDark,
  green,
  red,
  themeColor,
  sectionBorder,
  greyScoreCardTitleColor,
  smallDesktopWidth
} from "@edulastic/colors";

export const QuestionItemWrapper = styled.div`
  width: ${({ review, annotations }) => (annotations ? "70px" : review ? "100%" : "270px")};
  padding: ${({ pdfPreview }) => !pdfPreview && "10px"};
  background: ${({ pdfPreview }) => (pdfPreview ? "transparent" : white)};
  border-radius: ${({ review }) => (review ? "10px" : "0 10px 10px 0")};
  border: ${({ pdfPreview }) => !pdfPreview && `1px solid ${sectionBorder}`};
  box-shadow: ${({ highlighted, pdfPreview }) => (!pdfPreview && highlighted ? `0 0 10px 0 ${themeColor}` : "none")};
  border-left: ${({ review }) => !review && 0};

  @media (max-width: ${smallDesktopWidth}) {
    width: 225px;
  }
`;

export const AnswerForm = styled.div`
  display: flex;
  align-items: center;
  background: transparent;
`;

export const QuestionNumber = styled.span`
  display: inline-block;
  font-size: 18px;
  font-weight: bold;
  color: ${({ dragging }) => (dragging ? "#aaafb8" : "white")};
  background: ${({ dragging }) => (dragging ? "transparent" : "#aaafb8")};
  border: 2px ${({ dragging }) => (dragging ? "dashed" : "solid")} #aaafb8;
  border-radius: 4px;
  width: 32px;
  height: 32px;
  line-height: 30px;
  text-align: center;
  transition: all 300ms;
  cursor: ${({ dragging, viewMode }) => viewMode && (dragging ? "grabbing" : "grab")};
  box-shadow: ${({ highlighted, pdfPreview }) => pdfPreview && highlighted && `0 0 10px 0 ${themeColor}`};

  @media (max-width: ${smallDesktopWidth}) {
    font-size: 16px;
  }
`;

export const QuestionForm = styled.div`
  display: flex;
  flex-wrap: wrap;
  margin-left: 10px;
  width: 100%;
  padding-right: 2px;

  .ant-select-selection,
  .input__math,
  .ant-input {
    width: 100%;
  }
  .input__math {
    & + .input__absolute__keyboard {
      position: absolute;
      overflow: auto;
      right: 0px;
    }
  }

  @media (max-width: ${smallDesktopWidth}) {
    width: ${props => (props.review ? "100%" : "100px")};
  }
`;

export const EditButton = styled.span`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 0px;
  margin-left: 5px;
  position: relative;
  right: 6px;

  @media (max-width: ${smallDesktopWidth}) {
    right: -36px;
  }
`;

export const ButtonWrapper = styled.span`
  background: ${({ inverse }) => (inverse ? "transparent" : white)};
  font-weight: 600;
  margin-right: 5px;
  border-radius:4px;
  width: 30px;
  height: 30px;
  line-height: 30px;
  text-align: center;
  cursor: pointer;

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
