import PropTypes from 'prop-types';
import React from 'react';
import { withNamespaces } from '@edulastic/localization';

import SelectContainer from './SelectContainer';
import Select from './Select';

const QuestionSelectDropdown = ({ gotoQuestion, options, currentItem, t }) => (
  <SelectContainer>
    <Select
      defaultValue={currentItem}
      onChange={e => {
        gotoQuestion(parseInt(e.target.value, 10));
      }}
    >
      {options.map((item, index) => (
        <option key={index} value={item}>
          {`${t('common.layout.selectbox.question')} ${index + 1}/ ${
            options.length
          }`}
        </option>
      ))}
    </Select>
  </SelectContainer>
);

QuestionSelectDropdown.propTypes = {
  options: PropTypes.array.isRequired,
  t: PropTypes.func.isRequired,
  gotoQuestion: PropTypes.func,
  currentItem: PropTypes.number
};

export default withNamespaces('student')(QuestionSelectDropdown);
