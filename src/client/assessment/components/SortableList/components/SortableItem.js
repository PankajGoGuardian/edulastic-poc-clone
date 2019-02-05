import React from 'react';
import { SortableElement } from 'react-sortable-hoc';

import SortableItemContainer from '../styled/SortableItemContainer';
import DragHandle from './DragHandle';
import DeleteButton from './DeleteButton';
import FocusInput from './FocusInput';

const SortableItem = React.memo(
  SortableElement(({ value, onRemove, onChange }) => (
    <SortableItemContainer>
      <div className="main">
        <DragHandle />
        <div>
          <FocusInput
            style={{ background: 'transparent' }}
            type="text"
            value={value}
            onChange={onChange}
          />
        </div>
      </div>
      <DeleteButton onDelete={onRemove} />
    </SortableItemContainer>
  ))
);

export default SortableItem;
