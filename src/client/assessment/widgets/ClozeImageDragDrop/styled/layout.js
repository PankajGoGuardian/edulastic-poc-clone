import styled from "styled-components";

// position of response === right;
export const RightResponseContainer = styled.div.attrs({
  className: "right responseboxContainer"
})`
  flex-shrink: 0;
  height: auto;
  display: ${({ isReviewTab }) => (isReviewTab ? "none" : "flex")};
  justify-content: center;
  ${({ smallSize, theme, width }) => `
      width: ${smallSize ? "120px" : width ? `${width}px` : "20%"};
      margin: ${smallSize ? "0px" : "10px"};
      border-radius: ${smallSize ? 0 : 10}px;
      background: ${theme.widgets.clozeImageDragDrop.responseBoxBgColor}
  `};
`;

export const RightTemplateContainer = styled.div`
  flex: 1;
  flex-shrink: 0;
  border-radius: 10px;
  ${({ smallSize }) => `
    margin: ${smallSize ? 0 : "15px 15px 15px 0"};
  `}
`;

export const RightContainer = styled.div`
  display: flex;
  ${({ smallSize }) => `
    height: ${smallSize ? "190px" : "100%"};
    margin: ${smallSize ? "-30px -40px" : "0px"};
  `};
`;

// position of response === left
export const LeftContainer = styled.div`
  display: flex;
`;

export const LeftTemplateContainer = styled.div`
  margin: 15px 0px 15px 15px;
  border-radius: 10px;
  flex: 1;
  width: ${({ studentReport, responseBoxContainerWidth }) =>
    studentReport ? null : `calc(100% - ${responseBoxContainerWidth + 30}px)}`};
  overflow: auto;
`;

export const LeftResponseContainer = styled.div.attrs({
  className: "left responseboxContainer"
})`
  margin: 15px;
  height: auto;
  background: ${({ theme }) => theme.widgets.clozeImageDragDrop.responseBoxBgColor};
  display: ${({ isReviewTab }) => (isReviewTab ? "none" : "flex")};
  justify-content: center;
  width: ${({ width }) => (width ? `${width}px` : "20%")};
`;

export const StyledContainer = styled.div`
  margin: 15px 0px;
  border-radius: 10px;
`;
