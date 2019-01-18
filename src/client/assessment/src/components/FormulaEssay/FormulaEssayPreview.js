import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { lightBlue } from '@edulastic/colors';

import { MathEssayInput } from '../MathFormula/common';

const FormulaEssayPreview = ({ item, lines, setLines }) => (
  <div>
    {item.instructor_stimulus && (
      <InstructorStimulus dangerouslySetInnerHTML={{ __html: item.instructor_stimulus }} />
    )}
    <div style={{ marginBottom: 15 }} dangerouslySetInnerHTML={{ __html: item.stimulus }} />

    <MathEssayInput
      item={item}
      textFormattingOptions={item.ui_style.text_formatting_options}
      uiStyle={item.ui_style}
      value={item.template}
      lines={lines}
      setLines={setLines}
      onInput={latex => console.log(latex)}
    />
  </div>
);

FormulaEssayPreview.propTypes = {
  item: PropTypes.object.isRequired,
  lines: PropTypes.array.isRequired,
  setLines: PropTypes.func.isRequired
};

export default FormulaEssayPreview;

const InstructorStimulus = styled.div`
  border-radius: 10px;
  background: ${lightBlue};
  padding: 20px;
`;
