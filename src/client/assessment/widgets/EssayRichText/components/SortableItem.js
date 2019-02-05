import React from 'react';
import { SortableElement, SortableHandle } from 'react-sortable-hoc';
import { FaBars } from 'react-icons/fa';

import { green } from '@edulastic/colors';
import { FlexContainer } from '@edulastic/common';

import { QlBlocks } from '../styled/QlBlocks';
import { FlexCon } from '../styled/FlexCon';

const DragHandle = SortableHandle(() => (
  <QlBlocks>
    <FlexContainer style={{ fontSize: 14, color: green }} justifyContent="center">
      <FaBars />
    </FlexContainer>
  </QlBlocks>
));

const SortableItem = SortableElement(({ item, i, handleActiveChange, validList }) => {
  const { value, param, active } = item;

  return (
    <FlexCon padding={0} childMarginRight={0} flexDirection="column">
      {value !== '|' ? (
        <QlBlocks
          active={active}
          onClick={(e) => {
            e.preventDefault();
            handleActiveChange(i);
          }}
          {...(validList.includes(value) ? { value: param } : {})}
          className={`ql-${value}`}
          type="button"
        />
      ) : (
        <QlBlocks
          active={active}
          onClick={(e) => {
            e.preventDefault();
            handleActiveChange(i);
          }}
          {...(validList.includes(value) ? { value: param } : {})}
          className={`ql-${value}`}
          type="button"
        >
          <div>
            <b style={{ fontSize: 16 }}>{value}</b>DIV
          </div>
        </QlBlocks>
      )}

      <DragHandle />
    </FlexCon>
  );
});

export default SortableItem;
