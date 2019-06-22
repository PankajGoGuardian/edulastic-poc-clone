import React, { Fragment } from "react";
import { Input } from "antd";
import PropTypes from "prop-types";
import { withTheme } from "styled-components";

import { FlexContainer } from "@edulastic/common";

import { Subtitle } from "../../../styled/Subtitle";
import withAddButton from "../../../components/HOC/withAddButton";
import QuillSortableList from "../../../components/QuillSortableList";

import { IconTrash } from "../styled/IconTrash";

const List = withAddButton(QuillSortableList);

const Group = ({
  item,
  firstFocus,
  index,
  onAddInner,
  onChange,
  onRemove,
  onSortEnd,
  onTitleChange,
  headText,
  groupHeadText,
  onRemoveInner,
  text,
  prefix,
  theme
}) => (
  <Fragment>
    <div data-cy="group-choices" style={{ marginBottom: 30 }}>
      <FlexContainer alignItems="baseline" justifyContent="space-between" style={{ width: "100%" }}>
        <Subtitle margin="20px 0px 0px">{`${groupHeadText}${index + 1}`}</Subtitle>
        <IconTrash onClick={onRemove(index)} />
      </FlexContainer>
      <Subtitle
        fontSize={theme.widgets.matchList.subtitleFontSize}
        color={theme.widgets.matchList.subtitleColor}
        margin="20px 0px 10px"
      >
        {headText}
      </Subtitle>
      <div style={{ marginBottom: 20 }}>
        <Input size="large" value={item.title} onChange={e => onTitleChange(index, e.target.value)} />
      </div>
      <List
        prefix={prefix}
        items={item.responses}
        onAdd={onAddInner(index)}
        firstFocus={firstFocus}
        onSortEnd={onSortEnd(index)}
        onChange={onChange(index)}
        onRemove={onRemoveInner(index)}
        useDragHandle
        columns={1}
      />
    </div>
  </Fragment>
);

Group.propTypes = {
  item: PropTypes.object.isRequired,
  firstFocus: PropTypes.bool.isRequired,
  onAddInner: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  onRemove: PropTypes.func.isRequired,
  onSortEnd: PropTypes.func.isRequired,
  onTitleChange: PropTypes.func.isRequired,
  index: PropTypes.number.isRequired,
  headText: PropTypes.string.isRequired,
  text: PropTypes.string.isRequired,
  groupHeadText: PropTypes.string.isRequired,
  onRemoveInner: PropTypes.func.isRequired,
  prefix: PropTypes.string.isRequired,
  theme: PropTypes.object.isRequired
};

export default withTheme(Group);
