import React, { Component } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import produce from "immer";
import { message } from "antd";

import { graphEvaluateApi } from "@edulastic/api";
import { Button, MathModal, MathInput } from "@edulastic/common";
import { IconMath } from "@edulastic/icons";
import { CONSTANT } from "../../Builder/config";
import DeleteButton from "../../common/DeleteButton";
import { IconButton } from "./styled";

const numberPad = ["1", "2", "3", "+", "4", "5", "6", "-", "7", "8", "9", "\\times", "0", ".", "divide", "\\div"];

const symbols = ["basic"];

const emptyEquation = {
  _type: 98,
  type: CONSTANT.TOOLS.EQUATION,
  latex: "y=x",
  label: false
};

class Equations extends Component {
  state = {
    showMathModal: false,
    selectedEqIndex: null,
    eqs: [],
    plots: {}
  };

  handleUpdateEquation = (oldValue, newValue, index) => {
    const { equations, setEquations } = this.props;
    if (oldValue === newValue) {
      return;
    }
    setEquations(
      produce(equations, draft => {
        draft[index].latex = newValue;
        draft[index].apiLatex = null;
      })
    );
    this.setState({ showMathModal: false });
    this.setApiLatex(newValue, index);
  };

  setApiLatex = (latex, index) => {
    graphEvaluateApi
      .convert({ latex })
      .then(result => {
        const { equations, setEquations } = this.props;
        if (!equations[index]) {
          return;
        }
        setEquations(
          produce(equations, draft => {
            draft[index].apiLatex = result;
          })
        );
      })
      .catch(() => {
        message.error("Something went wrong in the entered equation. Please try again");
      });
  };

  handleAddEquation = () => {
    const { equations, setEquations } = this.props;
    setEquations(
      produce(equations, draft => {
        draft.push({
          ...emptyEquation,
          id: `jxgEq-${Math.random().toString(36)}`
        });
      })
    );

    this.setApiLatex(emptyEquation.latex, equations.length);
  };

  handleDeleteEquation = index => {
    const { equations, setEquations } = this.props;
    const { eqs } = this.state;
    setEquations(
      produce(equations, draft => {
        draft.splice(index, 1);
      })
    );
    eqs.splice(index, 1);
    this.setState({ eqs });
  };

  toggleMathModal = (open, index = null) => () => {
    this.setState({ showMathModal: open, selectedEqIndex: index });
  };

  handleBlurInput = index => () => {
    const { eqs } = this.state;
    const { equations, setEquations } = this.props;
    if (eqs[index] && equations[index] && equations[index].latex !== eqs[index]) {
      setEquations(
        produce(equations, draft => {
          draft[index].latex = eqs[index];
        })
      );
    }
  };

  handleInput = (latex, index) => {
    const { eqs, plots } = this.state;
    eqs[index] = latex;
    this.setState({ eqs, plots: { ...plots, [index]: true } });
  };

  handleModalSave = latex => {
    const { eqs, selectedEqIndex, plots } = this.state;
    const { equations } = this.props;
    eqs[selectedEqIndex] = latex;
    this.setState({
      eqs,
      plots: { ...plots, [selectedEqIndex]: false }
    });
    this.handleUpdateEquation(equations[selectedEqIndex]?.latex, latex, selectedEqIndex);
  };

  handleClickPlot = index => () => {
    const { plots, eqs } = this.state;
    this.setState({ plots: { ...plots, [index]: false } });
    this.setApiLatex(eqs[index], index);
  };

  render() {
    const { equations } = this.props;
    const { showMathModal, selectedEqIndex, eqs, plots } = this.state;

    return (
      <Container>
        {equations.map((eq, index) => (
          <Wrapper key={`equation-wrapper-${index}`}>
            <MathInput
              fullWidth
              style={{ height: 40 }}
              alwaysHideKeyboard
              symbols={symbols}
              numberPad={numberPad}
              value={eqs[index] || eq.latex}
              onInput={latex => this.handleInput(latex, index)}
              onBlur={this.handleBlurInput(index)}
            />
            <IconButton onClick={this.toggleMathModal(true, index)}>
              <IconMath />
            </IconButton>
            <IconButton disabled={!plots[index]} onClick={this.handleClickPlot(index)}>
              plot
            </IconButton>
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
        <MathModal
          show={showMathModal}
          symbols={symbols}
          numberPad={numberPad}
          showDropdown
          showResposnse={false}
          width="max-content"
          value={eqs[selectedEqIndex] || equations[selectedEqIndex]?.latex}
          onSave={latex => this.handleModalSave(latex)}
          onClose={this.toggleMathModal(false)}
        />
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
  width: 300px;
`;

const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  margin: 5px 0 0 0;
`;
