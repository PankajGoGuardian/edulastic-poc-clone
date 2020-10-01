import React, { Fragment } from 'react'
import { Input } from 'antd'
import PropTypes from 'prop-types'
import { withTheme } from 'styled-components'

import { FlexContainer } from '@edulastic/common'

import { Subtitle } from '../../../styled/Subtitle'
import withAddButton from '../../../components/HOC/withAddButton'
import QuillSortableList from '../../../components/QuillSortableList'

import { IconTrash } from '../styled/IconTrash'
import { TextInputStyled } from '../../../styled/InputStyles'
import { Row } from '../../../styled/WidgetOptions/Row'
import { Col } from '../../../styled/WidgetOptions/Col'

const List = withAddButton(QuillSortableList)

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
  prefix,
  theme,
}) => (
  <>
    <FlexContainer
      alignItems="baseline"
      justifyContent="space-between"
      style={{ width: '100%' }}
    >
      <Subtitle margin="20px 0px 0px">{`${groupHeadText}${
        index + 1
      }`}</Subtitle>
      <IconTrash onClick={onRemove(index)} />
    </FlexContainer>
    <Subtitle
      fontSize={theme.widgets.classification.subtitleFontSize}
      color={theme.widgets.classification.subtitleColor}
      margin="20px 0px 10px"
    >
      {headText}
    </Subtitle>
    <Row gutter={24}>
      <Col span={24}>
        <TextInputStyled
          size="large"
          value={item.title}
          onChange={(e) => onTitleChange(index, e.target.value)}
        />
      </Col>
      <Col span={24} data-cy="group-choices">
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
      </Col>
    </Row>
  </>
)

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
  groupHeadText: PropTypes.string.isRequired,
  onRemoveInner: PropTypes.func.isRequired,
  prefix: PropTypes.string.isRequired,
  theme: PropTypes.object.isRequired,
}

export default withTheme(Group)
