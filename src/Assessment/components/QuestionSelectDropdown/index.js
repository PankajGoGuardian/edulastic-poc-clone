import PropTypes from 'prop-types';
import React from 'react';

import SelectContainer from './SelectContainer';
import Select from './Select';
import { translate } from '../../utilities/localization';

const QuestionSelectDropdown = (props) => {
  const { options, value } = props;
  return (
    <SelectContainer>
      <Select onChange={props.onChange} defaultValue={value} >
      { 
        options.map((item, index) => (
          <option key={index} value={item.value}>
            {`${translate('common.layout.selectbox.question')} ${index + 1} / ${options.length}`}
          </option>
        ))
      }
      </Select>
    </SelectContainer>
  );
};

QuestionSelectDropdown.propTypes = {
  value: PropTypes.number,
  onChange: PropTypes.func,
  options: PropTypes.array,
};

export default QuestionSelectDropdown;
