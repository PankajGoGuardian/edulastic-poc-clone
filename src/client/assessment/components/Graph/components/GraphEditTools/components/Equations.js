import React, { Component } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import produce from "immer";
import { message } from "antd";
import { isEqual } from "lodash";

import { withNamespaces } from "@edulastic/localization";
import { graphEvaluateApi } from "@edulastic/api";
import { Button, MathModal, MathInput } from "@edulastic/common";
import { IconTrash } from "@edulastic/icons";
import { math } from "@edulastic/constants";
import { backgrounds, red, themeColor, white } from "@edulastic/colors";

import { CONSTANT } from "../../../Builder/config/index";
import { IconKeyboard } from "../styled/IconKeyboard";

const { defaultNumberPad } = math;

const symbols = ["basic"];

const emptyEquation = {
  _type: 98,
  type: CONSTANT.TOOLS.EQUATION,
  label: false
};

class Equations extends Component {
  constructor(props) {
    super(props);

    this.state = {
      showMathModal: false,
      selectedEqIndex: null,
      eqs: props.equations.map(e => e.latex),
      changedEqs: props.equations.map(() => false),
      newEquation: ""
    };
  }

  componentDidUpdate(prevProps) {
    const { equations } = this.props;

    if (!isEqual(equations, prevProps.equations)) {
      this.updateState();
    }
  }

  updateState = () => {
    const { equations } = this.props;

    this.setState({
      eqs: equations.map(e => e.latex),
      changedEqs: equations.map(() => false)
    });
  };

  setApiLatex = (latex, index = null) => {
    graphEvaluateApi
      .convert({ latex })
      .then(({ result }) => {
        const { equations, setEquations } = this.props;
        if (index === null) {
          setEquations(
            produce(equations, draft => {
              draft.push({
                ...emptyEquation,
                id: `jxgEq-${Math.random()
                  .toString(36)
                  .substr(2, 9)}`,
                latex,
                apiLatex: result
              });
            })
          );
          return;
        }
        if (!equations[index]) {
          return;
        }
        setEquations(
          produce(equations, draft => {
            draft[index].latex = latex;
            draft[index].apiLatex = result;
          })
        );
      })
      .catch(() => {
        message.error("Something went wrong in the entered equation. Please try again");
      });
  };

  handleAddEquation = () => {
    const { eqs, changedEqs, newEquation } = this.state;

    if (!newEquation) {
      return;
    }

    eqs.push(newEquation);
    changedEqs.push(false);
    this.setState({ eqs, changedEqs, newEquation: "" });
    this.setApiLatex(eqs[eqs.length - 1]);
  };

  handleDeleteEquation = index => () => {
    const { equations, setEquations } = this.props;
    setEquations(
      produce(equations, draft => {
        draft.splice(index, 1);
      })
    );
  };

  toggleMathModal = (open, index = null) => () => {
    this.setState({ showMathModal: open, selectedEqIndex: index });
  };

  handleInput = (latex, index = null) => {
    const { eqs, changedEqs } = this.state;

    if (index === null) {
      this.setState({ newEquation: latex });
    } else {
      eqs[index] = latex;
      changedEqs[index] = true;
      this.setState({ eqs, changedEqs });
    }
  };

  handleModalSave = latex => {
    const { eqs, changedEqs, selectedEqIndex } = this.state;

    if (selectedEqIndex === -1) {
      if (!latex) {
        return;
      }
      eqs.push(latex);
      changedEqs.push(false);
      this.setState({ eqs, changedEqs, newEquation: "" });
      this.setApiLatex(eqs[eqs.length - 1]);
    } else {
      const { equations } = this.props;
      eqs[selectedEqIndex] = latex;
      this.setState({ eqs });
      if (
        eqs[selectedEqIndex] &&
        equations[selectedEqIndex] &&
        equations[selectedEqIndex].latex !== eqs[selectedEqIndex]
      ) {
        this.setApiLatex(eqs[selectedEqIndex], selectedEqIndex);
      }
    }

    this.toggleMathModal(false)();
  };

  saveEquation = index => () => {
    const { eqs, changedEqs } = this.state;
    changedEqs[index] = false;
    this.setState({ changedEqs });
    this.setApiLatex(eqs[index], index);
  };

  render() {
    const { t } = this.props;
    const { showMathModal, selectedEqIndex, eqs, changedEqs, newEquation } = this.state;

    const btnStyles = {
      height: "40px",
      minWidth: "40px",
      maxWidth: "40px",
      marginLeft: "5px",
      borderRadius: "4px"
    };

    return (
      <Container>
        {eqs.map((eq, index) => (
          <Wrapper key={`equation-wrapper-${index}`} style={{ marginBottom: "7px" }}>
            <MathInput
              fullWidth
              style={{ height: "40px", width: "160px", background: backgrounds.primary }}
              alwaysHideKeyboard
              symbols={symbols}
              numberPad={defaultNumberPad}
              value={eq}
              onInput={latex => this.handleInput(latex, index)}
            />
            <Button
              key={`eq-math-${index}`}
              style={{ ...btnStyles, backgroundColor: white }}
              onClick={this.toggleMathModal(true, index)}
            >
              <IconKeyboard color={themeColor} />
            </Button>
            {!changedEqs[index] && (
              <Button
                key={`eq-del-${index}`}
                style={{ ...btnStyles, backgroundColor: red, minWidth: "50px", maxWidth: "50px" }}
                onClick={this.handleDeleteEquation(index)}
              >
                <IconTrash color={white} />
              </Button>
            )}
            {changedEqs[index] && (
              <Button
                key={`eq-plot-${index}`}
                style={{ ...btnStyles, minWidth: "50px", maxWidth: "50px" }}
                onClick={this.saveEquation(index)}
                color="primary"
              >
                {t("component.graphing.settingsPopup.plot")}
              </Button>
            )}
          </Wrapper>
        ))}
        <Wrapper key="equation-wrapper-add">
          <MathInput
            fullWidth
            style={{ height: "40px", width: "160px", background: backgrounds.primary }}
            alwaysHideKeyboard
            symbols={symbols}
            numberPad={defaultNumberPad}
            value={newEquation}
            onInput={latex => this.handleInput(latex)}
          />
          <Button
            key="eq-math-add"
            style={{ ...btnStyles, backgroundColor: white }}
            onClick={this.toggleMathModal(true, -1)}
          >
            <IconKeyboard color={themeColor} />
          </Button>
          <Button
            key="eq-add"
            style={{ ...btnStyles, minWidth: "50px", maxWidth: "50px" }}
            onClick={this.handleAddEquation}
            color="primary"
          >
            {t("component.graphing.settingsPopup.plot")}
          </Button>
        </Wrapper>
        <MathModal
          show={showMathModal}
          symbols={symbols}
          numberPad={defaultNumberPad}
          showDropdown
          showResposnse={false}
          width="max-content"
          value={selectedEqIndex !== -1 ? eqs[selectedEqIndex] : newEquation}
          onSave={latex => this.handleModalSave(latex)}
          onClose={this.toggleMathModal(false)}
        />
      </Container>
    );
  }
}

Equations.propTypes = {
  t: PropTypes.func.isRequired,
  setEquations: PropTypes.func.isRequired,
  equations: PropTypes.array.isRequired
};

export default withNamespaces("assessment")(Equations);

const Container = styled.div`
  padding: 12px 17px;
`;

const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
`;
