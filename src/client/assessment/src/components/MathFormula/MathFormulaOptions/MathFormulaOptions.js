import React from 'react';
import PropTypes from 'prop-types';

import Options, { FontSizeSelect } from '../../common/Options';

function MathFormulaOptions({ onChange, uiStyle }) {
  const changeUiStyle = (prop, value) => {
    console.log(prop, value);
    onChange('ui_style', {
      ...uiStyle,
      [prop]: value
    });
  };

  return (
    <Options>
      <Options.Block>
        <Options.Heading>Layout</Options.Heading>

        <Options.Row>
          <Options.Col md={6}>
            <FontSizeSelect
              onChange={val => changeUiStyle('fontsize', val)}
              value={uiStyle.fontsize}
            />
          </Options.Col>
        </Options.Row>
      </Options.Block>
    </Options>
  );
}

MathFormulaOptions.propTypes = {
  onChange: PropTypes.func.isRequired,
  uiStyle: PropTypes.object
};

MathFormulaOptions.defaultProps = {
  uiStyle: {
    type: 'standard',
    fontsize: 'normal',
    columns: 0,
    orientation: 'horizontal',
    choice_label: 'number'
  }
};

export default MathFormulaOptions;
