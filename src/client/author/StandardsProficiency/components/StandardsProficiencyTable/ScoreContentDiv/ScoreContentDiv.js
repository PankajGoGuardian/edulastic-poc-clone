import React, { Component } from "react";

import { StyledContent, ScoreSpan1, ScoreSpan2, ScoreSpan3, ScoreSpan4, SpanValue } from "./styled";

class ScoreContentDiv extends React.Component {
  render() {
    const { text } = this.props;
    return (
      <StyledContent>
        {text == 1 && <ScoreSpan1 />}
        {text == 2 && <ScoreSpan2 />}
        {text == 3 && <ScoreSpan3 />}
        {text == 4 && <ScoreSpan4 />}
        <SpanValue>{text}</SpanValue>
      </StyledContent>
    );
  }
}

export default ScoreContentDiv;
