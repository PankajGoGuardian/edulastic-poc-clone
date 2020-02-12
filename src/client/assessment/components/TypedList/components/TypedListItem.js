import React from "react";
import PropTypes from "prop-types";
import { Select } from "antd";

import { typedList as types } from "@edulastic/constants";

import { IconTrash } from "../styled/IconTrash";
import { SortableItemContainer } from "../styled/SortableItemContainer";
import { SelectInputStyled, TextInputStyled } from "../../../styled/InputStyles";

const TypedListItem = ({ type, selectData, value, onRemove, onChange, columns, indx }) => (
  <SortableItemContainer columns={columns}>
    <div className="main">
      {type === types.SELECT && !!selectData.length && (
        <SelectInputStyled size="large" value={value} onChange={onChange} data-cy="text-formatting-options-select">
          {selectData.map(({ value: val, label }) => (
            <Select.Option key={val} value={val} data-cy={`text-formatting-options-selected-${val}`}>
              {label}
            </Select.Option>
          ))}
        </SelectInputStyled>
      )}
      {type === types.INPUT && <TextInputStyled value={value} onChange={e => onChange(e.target.value)} size="large" />}
    </div>
    {onRemove && (
      <IconTrash data-cy={`delete${indx}`} data-cypress="deleteButton" onClick={onRemove} width={20} height={20} />
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
