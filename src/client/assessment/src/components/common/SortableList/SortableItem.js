import React from 'react';
import styled from 'styled-components';
import { SortableElement, SortableHandle } from 'react-sortable-hoc';
import { IconTrash } from '@edulastic/icons';
import { greenDark, red } from '@edulastic/colors';
import PropTypes from 'prop-types';
import { CustomQuillComponent, FlexContainer } from '@edulastic/common';

const DragHandle = SortableHandle(() => <i className="fa fa-align-justify" />);

const SortableItem = SortableElement(
  ({ value, onRemove, rOnly, onChange, columns, indx, label }) => (
    <SortableItemContainer columns={columns}>
      {label && <Label>{label}</Label>}
      <FlexContainer>
        <div className="main">
          <DragHandle />
          <CustomQuillComponent
            readOnly={rOnly}
            toolbarId={`id${indx}`}
            onChange={onChange}
            showResponseBtn={false}
            value={value}
            style={{ minHeight: 'auto', padding: 10 }}
          />
        </div>
        {onRemove && (
          <IconTrash
            data-cy={`delete${indx}`}
            onClick={onRemove}
            color={greenDark}
            hoverColor={red}
            width={20}
            height={20}
            style={{ cursor: 'pointer' }}
          />
        )}
      </FlexContainer>
    </SortableItemContainer>
  )
);

SortableItem.propTypes = {
  columns: PropTypes.number.isRequired,
  label: PropTypes.string.isRequired,
  rOnly: PropTypes.bool
};

SortableItem.defaultProps = {
  rOnly: false
};

export default SortableItem;

const SortableItemContainer = styled.div`
  width: ${props => (props.columns === 1 ? 100 / props.columns : 100 / props.columns - 2)}%;
  min-height: 50px;
  margin: 10px 0;
  display: inline-flex;
  flex-direction: column;

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

const Label = styled.div`
  margin-bottom: 15px;
`;
