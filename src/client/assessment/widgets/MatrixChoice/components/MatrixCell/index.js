import React from 'react';
import PropTypes from 'prop-types';
import { Checkbox, Radio } from 'antd';

import { greenDark } from '@edulastic/colors';

import { Wrapper } from './styled/Wrapper';

const MatrixCell = ({ label, type, correct, isMultiple, checked, onChange, smallSize }) => {
  let input;

  if (isMultiple) {
    input = <Checkbox checked={checked} onChange={onChange} />;
  } else {
    input = <Radio checked={checked} onChange={onChange} />;
  }

  return (
    <Wrapper smallSize={smallSize} correct={correct}>
      {input}
      {type === 'inline' && (
        <div style={{ color: greenDark }} dangerouslySetInnerHTML={{ __html: label }} />
      )}
    </Wrapper>
  );
};

MatrixCell.propTypes = {
  label: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  correct: PropTypes.any.isRequired,
  isMultiple: PropTypes.bool.isRequired,
  checked: PropTypes.bool.isRequired,
  onChange: PropTypes.func.isRequired,
  smallSize: PropTypes.bool
};

MatrixCell.defaultProps = {
  smallSize: false
};

export default MatrixCell;
