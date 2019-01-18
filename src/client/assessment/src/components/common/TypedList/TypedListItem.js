import React from 'react';
import styled from 'styled-components';
import { IconTrash } from '@edulastic/icons';
import { greenDark, red } from '@edulastic/colors';
import { typedList as types } from '@edulastic/constants';
import PropTypes from 'prop-types';
import { Select, Input } from 'antd';

const TypedListItem = ({ type, selectData, value, onRemove, onChange, columns, indx }) => (
  <SortableItemContainer columns={columns}>
    <div className="main">
      {type === types.SELECT && !!selectData.length && (
        <Select size="large" value={value} style={{ width: '100%' }} onChange={onChange}>
          {selectData.map(({ value: val, label }) => (
            <Select.Option key={val} value={val}>
              {label}
            </Select.Option>
          ))}
        </Select>
      )}
      {type === types.INPUT && (
        <Input value={value} onChange={e => onChange(e.target.value)} size="large" />
      )}
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
  </SortableItemContainer>
);

TypedListItem.propTypes = {
  columns: PropTypes.number.isRequired,
  onRemove: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  value: PropTypes.string.isRequired,
  type: PropTypes.oneOf([types.SELECT, types.INPUT]),
  indx: PropTypes.string.isRequired,
  selectData: PropTypes.array
};

TypedListItem.defaultProps = {
  type: types.INPUT,
  selectData: []
};

export default TypedListItem;

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
