import React, { Component } from "react";
import PropTypes from "prop-types";
import { cloneDeep } from "lodash";
import styled from "styled-components";

import { Button, MathInput } from "@edulastic/common";
import { CONSTANT } from "../../Builder/config";
import DeleteButton from "../../common/DeleteButton";

const numberPad = [
  "7",
  "8",
  "9",
  "\\div",
  "4",
  "5",
  "6",
  "\\times",
  "1",
  "2",
  "3",
  "-",
  "0",
  ".",
  ",",
  "+",
  "left_move",
  "right_move",
  "Backspace",
  "="
];

const symbols = ["basic"];

const emptyEquation = {
  _type: 98,
  type: CONSTANT.TOOLS.EQUATION,
  latex: "y=",
  label: false
};

class Equations extends Component {
  handleUpdateEquation = (oldValue, newValue, index) => {
    if (oldValue === newValue) {
      return;
    }
    const { equations, setEquations } = this.props;
    const newEquations = cloneDeep(equations);
    newEquations[index] = {
      ...emptyEquation,
      id: `jsxEq-${Math.random().toString(36)}`,
      latex: newValue,
      label: newEquations[index].label
    };
    setEquations(newEquations);
  };

  handleAddEquation = () => {
    const { equations, setEquations } = this.props;
    const newEquations = cloneDeep(equations);
    newEquations.push({
      ...emptyEquation,
      id: `jxgEq-${Math.random().toString(36)}`
    });
    setEquations(newEquations);
  };

  handleDeleteEquation = index => {
    const { equations, setEquations } = this.props;
    const newEquations = cloneDeep(equations);
    newEquations.splice(index, 1);
    setEquations(newEquations);
  };

  render() {
    const { equations } = this.props;

    return (
      <Container>
        {equations.map((eq, index) => (
          <Wrapper key={`equation-wrapper-${index}`}>
            <MathInput
              symbols={symbols}
              numberPad={numberPad}
              value={eq.latex}
              onInput={latex => {
                this.handleUpdateEquation(eq.latex, latex, index);
              }}
            />
            <DeleteButton
              onDelete={() => {
                this.handleDeleteEquation(index);
              }}
              deleteToolStyles={{ marginLeft: "10px" }}
            />
          </Wrapper>
        ))}
        <Button
          style={{
            margin: "5px 0",
            minHeight: 40,
            borderRadius: "4px"
          }}
          onClick={this.handleAddEquation}
          color="primary"
          outlined
        >
          ADD EQUATION
        </Button>
      </Container>
    );
  }
}

Equations.propTypes = {
  setEquations: PropTypes.func.isRequired,
  equations: PropTypes.array.isRequired
};

export default Equations;

const Container = styled.div`
  width: 50%;
`;

const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  justify-content: flex-start;
  margin: 5px 0 0 0;
`;
