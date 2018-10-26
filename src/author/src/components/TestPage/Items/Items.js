import React from 'react';
import PropTypes from 'prop-types';
import { Progress, Checkbox, Button } from '@edulastic/common';

import styled from 'styled-components';
import Item from './Item';

const Items = ({ items, loading, onSelect, checkedItems, onAddItems }) => {
  if (loading) return <Progress />;

  const handleSelectAll = () => {
    if (checkedItems.length) {
      onSelect([]);
    } else {
      const ids = items.map(({ id }) => id);
      onSelect(ids);
    }
  };

  const handleSelectItem = (id) => {
    const newCheckedItems = [...checkedItems];

    if (newCheckedItems.includes(id)) {
      const index = newCheckedItems.findIndex(it => it === id);
      newCheckedItems.splice(index, 1);
    } else {
      newCheckedItems.push(id);
    }

    onSelect(newCheckedItems);
  };

  const checkedLen = checkedItems.length;

  return (
    <Table>
      <thead>
        <Row>
          <th width="3%">
            <Checkbox checked={checkedLen === items.length} onChange={handleSelectAll} />
          </th>
          <th width="87%">
            {!!checkedLen && (
              <Button color="primary" variant="extendedFab" onClick={onAddItems}>
                Add {checkedLen} items
              </Button>
            )}
          </th>
          <th width="10%" />
        </Row>
      </thead>
      <tbody>
        {items.map(item => (
          <Item
            key={item.id}
            item={item}
            onSelect={handleSelectItem}
            checked={checkedItems.includes(item.id)}
          />
        ))}
      </tbody>
    </Table>
  );
};

Items.propTypes = {
  items: PropTypes.array.isRequired,
  loading: PropTypes.bool.isRequired,
  onSelect: PropTypes.func.isRequired,
  checkedItems: PropTypes.array.isRequired,
  onAddItems: PropTypes.func.isRequired,
};

export default Items;

const Table = styled.table`
  width: 100%;
`;

const Row = styled.tr`
  text-align: left;
`;
