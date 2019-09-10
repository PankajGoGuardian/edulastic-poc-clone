import styled from "styled-components";

// position of response === right;
export const RightResponseContainer = styled.div.attrs({
  className: ({ smallSize }) => `right responseboxContainer ${smallSize ? "small" : ""}`
})`
  height: auto;
  display: flex;
  justify-content: center;
  ${({ smallSize, theme }) => `
      width: ${smallSize ? "120px" : "100%"};
      margin: ${smallSize ? "0px" : "10px"};
      border-radius: ${smallSize ? 0 : 10}px;
      background: ${theme.widgets.clozeImageDragDrop.responseBoxBgColor}
  `};
`;

export const RightTemplateContainer = styled.div`
  flex: 1;
  border-radius: 10px;
  ${({ studentReport, smallSize, responseBoxContainerWidth }) => `
    margin: ${smallSize ? 0 : "15px 15px 15px 0"}
    width: ${studentReport ? null : `calc(100% - ${responseBoxContainerWidth + 30}px)`}
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
  overflow: auto;
`;

export const LeftTemplateContainer = styled.div`
  margin: 15px 0px 15px 15px;
  border-radius: 10px;
  flex: 1;
  width: ${({ studentReport, responseBoxContainerWidth }) =>
    studentReport ? null : `calc(100% - ${responseBoxContainerWidth + 30}px)}`};
`;

export const LeftResponseContainer = styled.div.attrs({
  className: "left responseboxContainer"
})`
  margin: 15px;
  height: auto;
  border-radius: 10;
  background: ${({ theme }) => theme.widgets.clozeImageDragDrop.responseBoxBgColor};
  display: flex;
  justify-content: center;
`;

export const StyledContainer = styled.div`
  margin: 15px 0px;
  border-radius: 10px;
`;
