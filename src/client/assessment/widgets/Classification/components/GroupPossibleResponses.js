import React, { Fragment } from 'react';
import { Checkbox, Input, Row, Col } from 'antd';
import PropTypes from 'prop-types';

import { withNamespaces } from '@edulastic/localization';
import { FlexContainer, EduButton } from '@edulastic/common';
import { IconTrash } from '@edulastic/icons';
import { greenDark, red, secondaryTextColor } from '@edulastic/colors';

import QuillSortableList from '../../../components/QuillSortableList/index';
import { Subtitle } from '../../../styled/Subtitle';
import withAddButton from '../../../components/HOC/withAddButton';

const List = withAddButton(QuillSortableList);

const Group = ({
  item,
  index,
  onAddInner,
  onChange,
  onRemove,
  onSortEnd,
  onTitleChange,
  headText,
  groupHeadText,
  onRemoveInner,
  firstFocus,
  text,
  prefix
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
    <Subtitle fontSize={13} color={secondaryTextColor} padding="0 0 16px 0">
      {headText}
    </Subtitle>
    <Input size="large" value={item.title} onChange={e => onTitleChange(index, e.target.value)} />
    <Subtitle>{text}</Subtitle>
    <div style={{ marginBottom: 30 }}>
      <List
        prefix={prefix}
        items={item.responses}
        firstFocus={firstFocus}
        onAdd={onAddInner(index)}
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
  onAddInner: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  onRemove: PropTypes.func.isRequired,
  onSortEnd: PropTypes.func.isRequired,
  onTitleChange: PropTypes.func.isRequired,
  firstFocus: PropTypes.bool.isRequired,
  index: PropTypes.number.isRequired,
  headText: PropTypes.string.isRequired,
  text: PropTypes.string.isRequired,
  groupHeadText: PropTypes.string.isRequired,
  onRemoveInner: PropTypes.func.isRequired,
  prefix: PropTypes.string.isRequired
};

const GroupPossibleResponses = ({
  checkboxChange,
  checkboxVal,
  items,
  t,
  firstFocus,
  onAdd,
  ...restProps
}) =>
  (checkboxVal ? (
    <div>
      <Checkbox style={{ marginTop: 29 }} defaultChecked={checkboxVal} onChange={checkboxChange}>
        {t('component.classification.groupPossibleRespTitle')}
      </Checkbox>
      <Row gutter={70}>
        {items.map((item, index) => (
          <Col key={index} span={12}>
            <Group
              prefix={`group${index}`}
              item={item}
              firstFocus={firstFocus}
              index={index}
              groupHeadText={t('component.classification.titleOfGroupTitle')}
              headText={t('component.classification.titleOfGroupTitleLabel')}
              text={t('component.classification.possibleRespTitle')}
              {...restProps}
            />
          </Col>
        ))}
      </Row>
      <EduButton type="primary" onClick={onAdd}>
        {t('component.classification.addNewGroup')}
      </EduButton>
    </div>
  ) : (
    <Row gutter={70}>
      <Col span={12}>
        <Checkbox style={{ marginTop: 29 }} defaultChecked={checkboxVal} onChange={checkboxChange}>
          {t('component.classification.groupPossibleRespTitle')}
        </Checkbox>
        <Subtitle>{t('component.classification.possibleRespTitle')}</Subtitle>
        <List
          prefix="group"
          items={items}
          firstFocus={firstFocus}
          onAdd={onAdd}
          onSortEnd={restProps.onSortEnd}
          onChange={restProps.onChange}
          onRemove={restProps.onRemove}
          useDragHandle
          columns={1}
        />
      </Col>
    </Row>
  ));

GroupPossibleResponses.propTypes = {
  checkboxChange: PropTypes.func.isRequired,
  items: PropTypes.array.isRequired,
  onAdd: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  onRemove: PropTypes.func.isRequired,
  firstFocus: PropTypes.bool.isRequired,
  onSortEnd: PropTypes.func.isRequired,
  t: PropTypes.func.isRequired,
  checkboxVal: PropTypes.bool.isRequired,
  onTitleChange: PropTypes.func.isRequired
};

export default withNamespaces('assessment')(GroupPossibleResponses);
