import React, { Component } from "react";
import PropTypes from "prop-types";

import { withNamespaces } from "@edulastic/localization";

import MathFormulaAnswerMethod from "./MathFormulaAnswerMethod";

class MathFormulaAnswer extends Component {
  state = {
    showAdditionals: []
  };

  render() {
    const { answer, onChange, onAdd, onDelete, item } = this.props;

    const { showAdditionals } = this.state;

    const handleChangeMethod = index => (prop, val) => {
      onChange({ index, prop, value: val });
    };

    const handleChangeAdditionals = (method, direction) => {
      const methods = showAdditionals;

      switch (direction) {
        case "pop":
          methods.splice(methods.findIndex(el => el === method), 1);
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
        {answer.map((method, i) => (
          <MathFormulaAnswerMethod
            onDelete={() => onDelete(i)}
            key={i}
            item={item}
            index={i}
            answer={answer}
            onChange={handleChangeMethod(i)}
            showAdditionals={showAdditionals}
            handleChangeAdditionals={handleChangeAdditionals}
            clearAdditionals={clearAdditionals}
            onAdd={onAdd}
            {...method}
          />
        ))}
      </div>
    );
  }
}

MathFormulaAnswer.propTypes = {
  answer: PropTypes.array.isRequired,
  onAdd: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  item: PropTypes.object.isRequired,
  t: PropTypes.func.isRequired
};

export default withNamespaces("assessment")(MathFormulaAnswer);
