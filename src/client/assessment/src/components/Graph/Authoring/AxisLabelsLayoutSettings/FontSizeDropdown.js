import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { withNamespaces } from '@edulastic/localization';
import { Select } from '@edulastic/common';
// import { SelectContainer, Select } from '../../common/styled_components';

class FontSizeDropdown extends Component {
  changeFontSize = (e) => {
    const { onChangeFontSize } = this.props;
    onChangeFontSize(e);
  };

  render() {
    const { fontSizeList, currentItem } = this.props;

    return (
    // <SelectContainer>
      <Select
        style={{ width: '77%' }}
        value={currentItem.value}
        onChange={this.changeFontSize}
        options={fontSizeList}
      >
        {/* {fontSizeList.map(item => (
            <option key={item.id} value={item.value}>
              {t(item.label)}
            </option>
          ))} */}
      </Select>
    // </SelectContainer>
    );
  }
}

FontSizeDropdown.propTypes = {
  t: PropTypes.func.isRequired,
  fontSizeList: PropTypes.array.isRequired,
  currentItem: PropTypes.object.isRequired,
  onChangeFontSize: PropTypes.func.isRequired
};

const enhance = compose(
  withNamespaces('assessment'),
);

export default enhance(FontSizeDropdown);
