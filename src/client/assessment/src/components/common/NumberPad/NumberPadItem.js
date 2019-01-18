import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Popover } from 'antd';
import CharacterMap from './CharacterMap';
import NumberPadButton from './NumberPadButton';

const NumberPadItem = ({ item, onSelect }) => {
  const [visible, setVisible] = useState(false);

  return (
    <Popover
      content={<CharacterMap onClick={onSelect} />}
      title="Character Map"
      placement="bottom"
      trigger="click"
      visible={visible}
      onVisibleChange={() => setVisible(!visible)}
    >
      <NumberPadButton onClick={() => setVisible(!visible)}>{item.label}</NumberPadButton>
    </Popover>
  );
};

NumberPadItem.propTypes = {
  item: PropTypes.object.isRequired,
  onSelect: PropTypes.func.isRequired
};

export default NumberPadItem;
