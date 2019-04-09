import React, { Fragment } from "react";
import PropTypes from "prop-types";
import { Collapse } from "antd";

import { EduButton } from "@edulastic/common";
import MathFormulaAnswerMethod from "../../MathFormula/components/MathFormulaAnswerMethod";

const { Panel } = Collapse;

const ClozeMathAnswer = ({ answer, onChange, onAdd, onDelete, item }) => {
  const _changeMethod = (methodValueIndex, methodIndex) => (prop, val) => {
    onChange({ methodValueIndex, methodIndex, prop, value: val });
  };

  return (
    <Fragment>
      <Collapse defaultActiveKey={["0"]} onChange={() => {}}>
        {answer.map((responseValue, i) => (
          <Panel header={`Response ${i + 1}`} key={`${i}`}>
            {responseValue.map((method, methodIndex) => (
              <MathFormulaAnswerMethod
                onDelete={() => onDelete({ methodIndex, methodValueIndex: i })}
                key={methodIndex}
                item={item}
                onChange={_changeMethod(i, methodIndex)}
                {...method}
              >
                MathFormulaAnswer
              </MathFormulaAnswerMethod>
            ))}
            <EduButton onClick={() => onAdd(i)} type="primary" size="large">
              Add new method
            </EduButton>
          </Panel>
        ))}
      </Collapse>
    </Fragment>
  );
};

ClozeMathAnswer.propTypes = {
  answer: PropTypes.array.isRequired,
  onAdd: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  item: PropTypes.object.isRequired
};

export default ClozeMathAnswer;
