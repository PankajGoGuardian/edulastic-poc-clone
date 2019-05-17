import styled from "styled-components";

export const Label = styled.label`
  position: relative;
  display: inline-block;
  padding: ${props => (props.styleType === "primary" ? "0" : "9px 0px")};
  padding-left: ${props => (props.styleType === "primary" ? "17px" : "25px")};
  /* padding-left: ${props => (props.smallSize ? 5 : 20)}px; */
  border: ${props =>
    props.styleType === "primary" ? "0" : `dotted 1px ${props.theme.widgets.multipleChoice.labelBorderColor}`};
  border-left: ${props =>
    props.styleType === "primary" ? "0" : `solid 3px ${props.theme.widgets.multipleChoice.labelBorderColor}`};
  background-color: ${props => (props.styleType === "primary" ? "#fff" : props.color)};
  max-width: "100%";
  border-radius: ${props => (props.styleType === "primary" ? "4px" : "0px 10px 10px 0px")};
  min-height: ${props => (props.styleType === "primary" ? "40px" : "auto")};
  box-shadow: ${props => (props.styleType === "primary" ? "0 2px 5px 0 rgba(0, 0, 0, 0.07)" : "none")};
  display: flex;
  align-items: center;
  /* margin: ${props => (props.setAnswers ? "5px 0" : "10px 0")}; */
  /* width: ${props => props.width || "100%"}; */


  &:not(:first-child) {
    margin-top: ${props => (props.styleType === "primary" ? "17px" : "0")};
  }
  &:hover {
    /* border: dotted 1px ${props => props.theme.widgets.multipleChoice.labelBorderHoverColor};
    border-left: solid 3px ${props => props.theme.widgets.multipleChoice.labelBorderHoverColor};
    cursor: pointer; */
  }
  &.checked {
    background-color: ${props => props.theme.widgets.multipleChoice.labelCheckedBgColor};
    border-left: solid 3px ${props => props.theme.widgets.multipleChoice.labelCheckedBorderColor};
    border-top-right-radius: 8px;
    border-bottom-right-radius: 8px;
  }
  &.right {
    background-color: ${props => props.theme.widgets.multipleChoice.labelRightBgColor};
    border-left: solid 3px ${props => props.theme.widgets.multipleChoice.labelRightBorderColor};
    border-top-right-radius: 8px;
    border-bottom-right-radius: 8px;
    min-width: 100%;
  }
  &.right:hover {
    border-color: transparent;
  }
  &.wrong {
    background-color: ${props => props.theme.widgets.multipleChoice.labelWrongBgColor};
    border-left: solid 3px ${props => props.theme.widgets.multipleChoice.labelWrongBorderColor};
    border-top-right-radius: 8px;
    border-bottom-right-radius: 8px;
    min-width: 100%; 
  }
  &.preview {
    cursor: initial;
    border-color: transparent;
  }
  &.preview:hover {
    border-color: transparent;
  }
  & i {
    font-size: ${props => props.theme.widgets.multipleChoice.labelIconFontSize};
    line-height: 1;
  }
  & .fa-check {
    color: ${props => props.theme.widgets.multipleChoice.labelIconCheckColor};
  }
  & .fa-times {
    color: ${props => props.theme.widgets.multipleChoice.labelIconTimesColor};
  }
`;

export const QuestionTitleWrapper = styled.div`
  display: flex;
`;

export const QuestionNumber = styled.div`
  font-weight: 700;
  margin-right: 4px;
`;
