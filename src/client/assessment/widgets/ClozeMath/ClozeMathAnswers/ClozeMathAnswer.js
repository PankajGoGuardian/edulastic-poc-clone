import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";
import { withNamespaces } from "react-i18next";

import { EduButton } from "@edulastic/common";

import MathFormulaAnswerMethod from "../../MathFormula/components/MathFormulaAnswerMethod";

class ClozeMathAnswer extends Component {
  state = {
    showAdditionals: []
  };

  render() {
    const { answer, onChange, onAdd, onDelete, item, t } = this.props;

    const { showAdditionals } = this.state;

    const _changeMethod = (methodValueIndex, methodIndex) => (prop, val) => {
      onChange({ methodValueIndex, methodIndex, prop, value: val });
    };

    const handleChangeAdditionals = (method, direction) => {
      const methods = showAdditionals;

      switch (direction) {
        case "pop":
          methods.splice(methods.findIndex(el => el === method));
          break;
        case "push":
        default:
          methods.push(method);
          break;
      }

      this.setState({
        showAdditionals: methods
      });
    };

    const clearAdditionals = () => {
      this.setState({
        showAdditionals: []
      });
    };

    return (
      <div>
        {answer.map((responseValue, i) => (
          <Fragment>
            {responseValue.length &&
              responseValue.map((method, methodIndex) => (
                <MathFormulaAnswerMethod
                  onDelete={() => onDelete({ i, methodValueIndex: i })}
                  key={methodIndex}
                  item={item}
                  index={methodIndex}
                  onChange={_changeMethod(i, methodIndex)}
                  showAdditionals={showAdditionals}
                  handleChangeAdditionals={handleChangeAdditionals}
                  clearAdditionals={clearAdditionals}
                  {...method}
                />
              ))}
            {showAdditionals.length === 0 ? (
              <EduButton onClick={() => onAdd(i)} type="primary" size="large" data-cy="add-new-method">
                {t("component.math.addComparison")}
              </EduButton>
            ) : null}
          </Fragment>
        ))}
      </div>
    );
  }
}

ClozeMathAnswer.propTypes = {
  answer: PropTypes.array.isRequired,
  onAdd: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  item: PropTypes.object.isRequired,
  t: PropTypes.func.isRequired
};

export default withNamespaces("assessment")(ClozeMathAnswer);
