import React from 'react';
import styled from 'styled-components';
import { SortableElement, SortableHandle } from 'react-sortable-hoc';
import { IconTrash } from '@edulastic/icons';
import { greenDark, red } from '@edulastic/colors';
import PropTypes from 'prop-types';
import { CustomQuillComponent } from '@edulastic/common';

const DragHandle = SortableHandle(() => <i className="fa fa-align-justify" />);

const SortableItem = SortableElement(({ value, onRemove, onChange, columns, indx }) => (
  <SortableItemContainer columns={columns}>
    <div className="main">
      <DragHandle />
      <CustomQuillComponent
        toolbarId={`id${indx}`}
        onChange={onChange}
        showResponseBtn={false}
        value={value}
        style={{ minHeight: 'auto', padding: 10 }}
      />
    </div>
    {onRemove && (
      <IconTrash
        onClick={onRemove}
        color={greenDark}
        hoverColor={red}
        width={20}
        height={20}
        style={{ cursor: 'pointer' }}
      />
    )}
  </SortableItemContainer>
));

SortableItem.propTypes = {
  columns: PropTypes.number.isRequired
};

export default SortableItem;

const SortableItemContainer = styled.div`
  width: ${props => (props.columns === 1 ? 100 / props.columns : 100 / props.columns - 2)}%;
  min-height: 50px;
  margin: 10px 0;
  display: inline-flex;
  align-items: center;

  & div.main {
    border-radius: 4px;
    border: solid 1px #dfdfdf;
    margin-right: 10px;
    flex: 1;
    height: 100%;
    display: flex;
    align-items: center;
  }
  & div.main i.fa-align-justify {
    color: #1fe3a1;
    font-size: 16px;
    padding: 15px;
  }
  & i.fa-trash-o {
    color: #ee1658;
    font-size: 22px;
    padding: 15px;
    cursor: pointer;
  }
`;
