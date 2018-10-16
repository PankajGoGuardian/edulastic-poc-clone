import PropTypes from 'prop-types';
import React from 'react';
import { withNamespaces } from '@edulastic/localization';

import SelectContainer from './SelectContainer';
import Select from './Select';

const QuestionSelectDropdown = ({ onChange, options, value, t }) => (
  <SelectContainer>
    <Select onChange={onChange} defaultValue={value}>
      {options.map((item, index) => (
        <option key={index} value={item.value}>
          {`${t('common.layout.selectbox.question')} ${index + 1} / ${
            options.length
          }`}
        </option>
      ))}
    </Select>
  </SelectContainer>
);

QuestionSelectDropdown.propTypes = {
  value: PropTypes.number.isRequired,
  onChange: PropTypes.func.isRequired,
  options: PropTypes.array.isRequired,
  t: PropTypes.func.isRequired,
};

export default withNamespaces('student')(QuestionSelectDropdown);
