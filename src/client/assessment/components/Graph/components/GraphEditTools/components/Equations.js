import React, { Component } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import produce from "immer";
import { isEqual } from "lodash";

import { withNamespaces } from "@edulastic/localization";
import { graphEvaluateApi } from "@edulastic/api";
import { MathModal, MathInput, EduButton, notification } from "@edulastic/common";
import { IconClose } from "@edulastic/icons";
import { math } from "@edulastic/constants";
import { backgrounds, greyThemeDark2 } from "@edulastic/colors";

import { CONSTANT } from "../../../Builder/config/index";
import { IconKeyboard } from "../styled/IconKeyboard";

const { defaultNumberPad } = math;

const symbols = ["basic"];

const emptyEquation = {
  _type: 98,
  type: CONSTANT.TOOLS.EQUATION,
  label: false,
  pointsLabel: false
};

class Equations extends Component {
  constructor(props) {
    super(props);

    this.state = {
      showMathModal: false,
      selectedEqIndex: -1,
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
                apiLatex: result[0]
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
            draft[index].apiLatex = result[0];
          })
        );
      })
      .catch(() => {
        notification({ message: "equationErr" });
      });
  };

  handleAddEquation = (latex = null) => {
    const { eqs, changedEqs, newEquation } = this.state;
    if (!newEquation && !latex) {
      return;
    }
    eqs.push(newEquation || latex);
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
    this.setState({ selectedEqIndex: -1 });
  };

  toggleMathModal = (open, index = -1) => () => {
    this.setState({ showMathModal: open, selectedEqIndex: index });
  };

  handleFocus = (index = -1) => {
    this.setState({ selectedEqIndex: index });
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
    const { eqs, selectedEqIndex } = this.state;

    if (selectedEqIndex === -1) {
      this.handleAddEquation(latex);
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

    return (
      <Container>
        {eqs.map((eq, index) => (
          <Wrapper key={`equation-wrapper-${index}`} onFocus={() => this.handleFocus(index)}>
            <StyledMathInput
              fullWidth
              style={{ height: "40px", background: backgrounds.primary }}
              alwaysHideKeyboard
              symbols={symbols}
              numberPad={defaultNumberPad}
              value={eq}
              onInput={latex => this.handleInput(latex, index)}
            />
            {selectedEqIndex === index && (
              <IconKeyboard
                width={25}
                height={20}
                color={greyThemeDark2}
                key={`eq-math-${index}`}
                onClick={this.toggleMathModal(true, index)}
              />
            )}
            {(selectedEqIndex === index || changedEqs[index]) && (
              <StyledEduButton key={`eq-plot-${index}`} onClick={this.saveEquation(index)}>
                {t("component.graphing.settingsPopup.plot")}
              </StyledEduButton>
            )}
            <IconClose key={`eq-del-${index}`} color={greyThemeDark2} onClick={this.handleDeleteEquation(index)} />
          </Wrapper>
        ))}
        <Wrapper key="equation-wrapper-add" onFocus={this.handleFocus}>
          <StyledMathInput
            fullWidth
            style={{ height: "40px", background: backgrounds.primary }}
            alwaysHideKeyboard
            symbols={symbols}
            numberPad={defaultNumberPad}
            value={newEquation}
            onInput={latex => this.handleInput(latex)}
          />
          <IconKeyboard
            key="eq-math-add"
            width={25}
            height={20}
            color={greyThemeDark2}
            onClick={this.toggleMathModal(true)}
          />
          <StyledEduButton key="eq-add" onClick={this.handleAddEquation}>
            {t("component.graphing.settingsPopup.plot")}
          </StyledEduButton>
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
  > div {
    margin-bottom: 7px;
  }
  div:last-child {
    margin-bottom: 0px;
  }
`;

const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  align-content: stretch;
  > svg {
    margin-left: 12px;
    cursor: pointer;
  }
`;

const StyledMathInput = styled(MathInput)`
  min-width: 120px;
  width: 100%;
  .input__math {
    border-radius: 3px;
  }
`;

const StyledEduButton = styled(EduButton)`
  padding: 0px;
  margin-left: 12px !important;
  max-height: 16px;
  border: unset;
  background-color: ${greyThemeDark2} !important;
`;
