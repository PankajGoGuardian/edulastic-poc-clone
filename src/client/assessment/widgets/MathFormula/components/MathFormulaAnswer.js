import React, { Component } from "react";
import PropTypes from "prop-types";

import { withNamespaces } from "@edulastic/localization";
import { response } from "@edulastic/constants";

import MathFormulaAnswerMethod from "./MathFormulaAnswerMethod";
import { getStylesFromUiStyleToCssStyle } from "../../../utils/helpers";

class MathFormulaAnswer extends Component {
  render() {
    const {
      answer,
      onChange,
      onAdd,
      onDelete,
      item,
      onChangeKeypad,
      onChangeAllowedOptions,
      keypadOffset,
      onChangeShowDropdown
    } = this.props;

    const handleChangeMethod = index => (prop, val) => {
      onChange({ index, prop, value: val });
    };

    const { minWidth, minHeight } = response;
    const cssStyles = getStylesFromUiStyleToCssStyle(item.uiStyle);
    cssStyles.width = cssStyles.width || minWidth;
    cssStyles.height = cssStyles.height || minHeight;

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
            onChangeKeypad={onChangeKeypad}
            onChangeAllowedOptions={onChangeAllowedOptions}
            allowedVariables={item.allowedVariables || ""}
            onChangeShowDropdown={onChangeShowDropdown}
            onAdd={onAdd}
            keypadOffset={keypadOffset}
            style={cssStyles}
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
  onChangeAllowedOptions: PropTypes.func.isRequired,
  onChangeShowDropdown: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  keypadOffset: PropTypes.number.isRequired,
  onChangeKeypad: PropTypes.func.isRequired,
  item: PropTypes.object.isRequired,
  t: PropTypes.func.isRequired
};

export default withNamespaces("assessment")(MathFormulaAnswer);
