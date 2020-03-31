import React, { Fragment } from "react";
import PropTypes from "prop-types";
import { Text, VxText } from "../styled";

import { FRACTION_FORMATS } from "../../../constants/constantsForQuestions";
import { convertNumberToFraction } from "../../../utils/helpers";
import { Sub, Sup } from "../styled";

const AxisLabel = ({ value, fractionFormat, textAnchor = "middle", verticalAnchor = "start" }) => {
  const result = convertNumberToFraction(value, fractionFormat);
  return (
    <Fragment>
      {fractionFormat === "Decimal" && (
        <VxText textAnchor={textAnchor} verticalAnchor={verticalAnchor} width={70}>
          {result.main + ""}
        </VxText>
      )}
      {fractionFormat !== "Decimal" && (
        <Text textAnchor={textAnchor}>
          {result.main !== null && <tspan>{result.main}</tspan>}
          {result.main !== null && result.sup !== null && result.sub !== null && <tspan> </tspan>}
          {result.sup !== null && result.sub !== null && (
            <Fragment>
              <Sup dy={-5}>{result.sup}</Sup>
              <tspan dy={5}>/</tspan>
              <Sub dy={5}>{result.sub}</Sub>
            </Fragment>
          )}
        </Text>
      )}
    </Fragment>
  );
};

AxisLabel.propTypes = {
  value: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
  fractionFormat: PropTypes.string
};

AxisLabel.defaultProps = {
  fractionFormat: FRACTION_FORMATS.decimal
};

export default AxisLabel;
