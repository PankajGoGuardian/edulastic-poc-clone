import React from 'react';
import PropTypes from 'prop-types';
import { FlexContainer } from '@edulastic/common';
import styled from 'styled-components';
import { Checkbox, Input } from 'antd';
import { grey, greenDark } from '@edulastic/colors';
import { IconList } from '@edulastic/icons';

import { SortableContainer, SortableElement, SortableHandle } from 'react-sortable-hoc';

import TestItemPreview from '../../../../../assessment/src/components/TestItemPreview';
import MetaInfoCell from '../common/ItemsTable/MetaInfoCell';

const DragHandle = SortableHandle(() => <IconList color={greenDark} style={{ cursor: 'grab' }} />);

const SortableItem = SortableElement(
  ({ indx, selected, item, onCheck, points, onChangePoints, metaInfoData }) => (
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
          <span>Points</span>{' '}
          <Input
            size="large"
            type="number"
            value={points}
            onChange={e => onChangePoints(indx, e.target.value)}
            style={{ width: 70 }}
          />
        </FlexContainer>
      </FlexContainer>
      <TestItemPreview
        style={{ padding: 0, boxShadow: 'none', display: 'flex' }}
        cols={item}
        previewTab="clear"
        verticalDivider={item.verticalDivider}
        scrolling={item.scrolling}
      />
      <FlexContainer style={{ margin: '20px 0' }}>
        <MetaInfoCell data={metaInfoData} />
      </FlexContainer>
    </TestItemWrapper>
  ),
);

const List = SortableContainer(
  ({ rows, selected, setSelected, testItems, onChangePoints, types, standards }) => {
    const handleCheckboxChange = (index, checked) => {
      if (checked) {
        setSelected([...selected, index]);
      } else {
        const removeIndex = selected.findIndex(item => item === index);
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
            metaInfoData={{
              id: testItems[i].id,
              by: 'Kevin Hart',
              shared: '9578 (1)',
              likes: 9,
              types: types[testItems[i].id],
              standards: standards[testItems[i].id],
            }}
            index={i}
            indx={i}
            item={item}
            points={testItems[i].points}
            onCheck={handleCheckboxChange}
            onChangePoints={onChangePoints}
            selected={selected}
          />
        ))}
      </div>
    );
  },
);

List.propTypes = {
  rows: PropTypes.array.isRequired,
  selected: PropTypes.array.isRequired,
  setSelected: PropTypes.func.isRequired,
  onChangePoints: PropTypes.func.isRequired,
  testItems: PropTypes.array.isRequired,
  types: PropTypes.any.isRequired,
  standards: PropTypes.object.isRequired,
};

export default List;

const TestItemWrapper = styled.div`
  border-bottom: 1px solid ${grey};
  margin-bottom: 40px;

  :last-child {
    margin-bottom: 0;
    border-bottom: none;
  }
`;
