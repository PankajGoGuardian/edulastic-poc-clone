import React, { Fragment } from 'react';
import { Input } from 'antd';
import PropTypes from 'prop-types';
import { withTheme } from 'styled-components';

import { FlexContainer } from '@edulastic/common';
import { IconTrash } from '@edulastic/icons';
import { greenDark, red } from '@edulastic/colors';

import { Subtitle } from '../../../styled/Subtitle';
import withAddButton from '../../../components/HOC/withAddButton';
import QuillSortableList from '../../../components/QuillSortableList';

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
    <FlexContainer alignItems="baseline" justifyContent="space-between" style={{ width: '100%' }}>
      <Subtitle>{`${groupHeadText}${index + 1}`}</Subtitle>
      <IconTrash
        onClick={onRemove(index)}
        color={greenDark}
        hoverColor={red}
        width={20}
        height={20}
        style={{ cursor: 'pointer' }}
      />
    </FlexContainer>
    <Subtitle
      fontSize={theme.widgets.matchList.subtitleFontSize}
      color={theme.widgets.matchList.subtitleColor}
      padding="0 0 16px 0"
    >
      {headText}
    </Subtitle>
    <Input size="large" value={item.title} onChange={e => onTitleChange(index, e.target.value)} />
    <Subtitle>{text}</Subtitle>
    <div style={{ marginBottom: 30 }}>
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
