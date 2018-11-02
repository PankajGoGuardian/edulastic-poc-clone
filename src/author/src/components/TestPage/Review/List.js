import React from 'react';
import PropTypes from 'prop-types';
import { FlexContainer } from '@edulastic/common';
import styled from 'styled-components';
import { Checkbox, Input } from 'antd';
import { grey, greenDark } from '@edulastic/colors';
import { IconList } from '@edulastic/icons';

import { SortableContainer, SortableElement, SortableHandle } from 'react-sortable-hoc';

import TestItemPreview from '../../../../../assessment/src/components/TestItemPreview';

const DragHandle = SortableHandle(() => <IconList color={greenDark} style={{ cursor: 'grab' }} />);

const SortableItem = SortableElement(({ indx, selected, item, onCheck }) => (
  <div>
    <TestItemWrapper>
      <FlexContainer justifyContent="space-between">
        <FlexContainer>
          <DragHandle />
          <Checkbox
            checked={selected.includes(indx)}
            onChange={e => onCheck(indx, e.target.checked)}
          >
            Q{indx + 1}
          </Checkbox>
        </FlexContainer>
        <FlexContainer>
          <span>Points</span> <Input size="large" type="number" style={{ width: 70 }} />
        </FlexContainer>
      </FlexContainer>
      <TestItemPreview
        cols={item}
        previewTab="clear"
        verticalDivider={item.verticalDivider}
        scrolling={item.scrolling}
      />
    </TestItemWrapper>
  </div>
));

const List = SortableContainer(({ rows, selected, setSelected }) => {
  const handleCheckboxChange = (index, checked) => {
    if (checked) {
      setSelected([...selected, index]);
    } else {
      const removeIndex = selected.find(item => item === index);
      const newSelected = [...selected];

      newSelected.splice(removeIndex, 1);
      setSelected(newSelected);
    }
  };

  return (
    <div>
      {rows.map((item, i) => (
        <SortableItem
          key={i}
          index={i}
          indx={i}
          item={item}
          onCheck={handleCheckboxChange}
          selected={selected}
        />
      ))}
    </div>
  );
});

List.propTypes = {
  rows: PropTypes.array.isRequired,
  selected: PropTypes.array.isRequired,
  setSelected: PropTypes.func.isRequired,
};

export default List;

const TestItemWrapper = styled.div`
  margin-bottom: 20px;
  padding-bottom: 25px;
  border-bottom: 1px solid ${grey};
`;
