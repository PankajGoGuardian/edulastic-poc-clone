import React, { Fragment } from "react";
import PropTypes from "prop-types";

import { FRACTION_FORMATS } from "../../../constants/constantsForQuestions";
import { convertNumberToFraction } from "../../../utils/helpers";
import { Sub, Sup } from "../styled";

const AxisLabel = ({ value, fractionFormat }) => {
  const result = convertNumberToFraction(value, fractionFormat);

  return (
    <Fragment>
      {result.main !== null && <tspan>{result.main}</tspan>}
      {result.main !== null && result.sup !== null && result.sub !== null && <tspan> </tspan>}
      {result.sup !== null && result.sub !== null && (
        <Fragment>
          <Sup dy={-5}>{result.sup}</Sup>
          <tspan dy={5}>/</tspan>
          <Sub dy={5}>{result.sub}</Sub>
        </Fragment>
      )}
    </Fragment>
  );
};

AxisLabel.propTypes = {
  value: PropTypes.number.isRequired,
  fractionFormat: PropTypes.string
};

AxisLabel.defaultProps = {
  fractionFormat: FRACTION_FORMATS.decimal
};

export default AxisLabel;
