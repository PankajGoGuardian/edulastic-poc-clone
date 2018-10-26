import React, { memo } from 'react';
import PropTypes from 'prop-types';
import { Checkbox } from '@edulastic/common';
import ViewButton from '../../../../../assessment/src/components/common/ViewButton';

const Item = ({ item, onSelect, checked }) => (
  <tr>
    <td>
      <Checkbox checked={checked} onChange={() => onSelect(item.id)} />
    </td>
    <td>{item.id}</td>
    <td>
      <ViewButton onClick={() => {}}>View</ViewButton>
    </td>
  </tr>
);

Item.propTypes = {
  item: PropTypes.object.isRequired,
  onSelect: PropTypes.object.isRequired,
  checked: PropTypes.bool.isRequired,
};

export default memo(Item);
