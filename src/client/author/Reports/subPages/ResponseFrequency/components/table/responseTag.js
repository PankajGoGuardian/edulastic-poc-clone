import React from "react";
import { Component } from "react";
import styled from "styled-components";

import { getHSLFromRange1, getHSLFromRange2 } from "../../../../common/util";
import { StyledResponseTagContainer } from "../styled";
import { darkGrey } from "@edulastic/colors";

export class ResponseTag extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <StyledResponseTagContainer>
        <StyledTag
          style={
            this.props.data.isCorrect
              ? { borderColor: getHSLFromRange1(100) }
              : Number(this.props.data.value) > this.props.incorrectFrequencyThreshold
              ? { borderColor: getHSLFromRange2(100 - this.props.data.value) }
              : { borderColor: "#cccccc" }
          }
        >
          {<p>{this.props.data.name}</p>}
          <p>{this.props.data.value}%</p>
        </StyledTag>
      </StyledResponseTagContainer>
    );
  }
}

const StyledTag = styled.div`
  border: solid 2px ${darkGrey};
  border-radius: 40px;
  margin: 2px 5px;
  text-align: center;
  padding: 3px 10px;
  min-width: 100px;
  p {
    margin: 2px;
  }
`;
