import React from "react";
import { fadedGrey, mainBgColor } from "@edulastic/colors";

import CodeEditor from "../CodeEditor";
import { StyledWrapper, StyledDivider, StyledCodeEvalWrapper } from "./styled";

const DisplayEditor = ({ item, setQuestionData, layout, ...restProps }) => {
  const style = {
    padding: "0"
  };
  if (layout === "column") {
    style.width = "100%";
    style.background = mainBgColor;
  }
  return (
    <StyledWrapper style={style}>
      <CodeEditor
        item={item}
        type="codeStubs"
        setQuestionData={setQuestionData}
        focus={true}
        style={{ borderRadius: "10px", border: "none" }}
        headerStyle={{ borderRadius: "10px 10px 0 0", background: fadedGrey }}
        editorStyle={{ borderRadius: "0 0 10px 10px" }}
        {...restProps}
      />
      <StyledDivider />
      <StyledCodeEvalWrapper>sec</StyledCodeEvalWrapper>
    </StyledWrapper>
  );
};

export default DisplayEditor;
