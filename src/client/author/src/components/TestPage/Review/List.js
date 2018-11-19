import React from 'react';
import PropTypes from 'prop-types';
import { FlexContainer } from '@edulastic/common';
import styled from 'styled-components';
import { Checkbox, Input } from 'antd';
import { grey, greenDark, blue } from '@edulastic/colors';
import { IconList, IconPreview } from '@edulastic/icons';

import { SortableContainer, SortableElement, SortableHandle } from 'react-sortable-hoc';

import TestItemPreview from '../../../../../assessment/src/components/TestItemPreview';
import MetaInfoCell from './ItemsTable/MetaInfoCell';

const DragHandle = SortableHandle(() => <IconList color={greenDark} style={{ cursor: 'grab' }} />);

const SortableItem = SortableElement(
  ({ indx, selected, item, onCheck, points, onChangePoints, metaInfoData, onPreview }) => (
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
          <PreviewContainer onClick={() => onPreview(metaInfoData._id)}>
            <IconPreview color={blue} />{' '}
            <span style={{ textTransform: 'uppercase', fontSize: 11, fontWeight: 600 }}>
              Preview
            </span>
          </PreviewContainer>
          <span style={{ fontWeight: 600, fontSize: 14 }}>Points</span>{' '}
          <Input
            size="large"
            type="number"
            value={points}
            onChange={e => onChangePoints(metaInfoData._id, +e.target.value)}
            style={{ width: 70, fontSize: 13, fontWeight: 600 }}
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
  ({
    rows,
    selected,
    setSelected,
    testItems,
    onChangePoints,
    types,
    standards,
    scoring,
    onPreview,
  }) => {
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

    const getPoints = i => scoring.testItems.find(({ id }) => id === testItems[i]._id).points;

    return (
      <div>
        {rows.map((item, i) => (
          <SortableItem
            key={i}
            metaInfoData={{
              id: testItems[i]._id,
              by: 'Kevin Hart',
              shared: '9578 (1)',
              likes: 9,
              types: types[testItems[i]._id],
              standards: standards[testItems[i]._id],
            }}
            index={i}
            indx={i}
            item={item}
            points={getPoints(i)}
            onCheck={handleCheckboxChange}
            onChangePoints={onChangePoints}
            onPreview={onPreview}
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
  onPreview: PropTypes.func.isRequired,
  testItems: PropTypes.array.isRequired,
  types: PropTypes.any.isRequired,
  standards: PropTypes.object.isRequired,
  scoring: PropTypes.object.isRequired,
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

const PreviewContainer = styled(FlexContainer)`
  color: ${blue};
  margin-right: 45px;
  cursor: pointer;
`;
