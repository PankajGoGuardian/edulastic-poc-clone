import React from 'react'

// components
import { Row, Col, Tooltip } from 'antd'
import {
  IconFolderAll,
  IconFolderDeactive,
  IconFolderNew,
} from '@edulastic/icons'
import { GroupItem, GroupItemLabel } from '../styled'

const GroupContainer = ({ name, Icon, onClick, isActive }) => (
  <GroupItem span={24} padding="9px 18px" onClick={onClick} isActive={isActive}>
    <Icon />
    <GroupItemLabel fontStyle="11px/15px" padding="0 0 0 20px">
      <Tooltip placement="right" title={name}>
        {name}
      </Tooltip>
    </GroupItemLabel>
  </GroupItem>
)

const GroupsFilter = ({ current, options, onClick, onNewGroupClick }) => (
  <Row type="flex" justify="center" style={{ width: '100%' }}>
    <Col span={24} style={{ display: 'flex', alignItems: 'center' }}>
      <GroupItemLabel fontStyle="12px/17px" weight="Bold">
        Student Groups
      </GroupItemLabel>
      <IconFolderNew
        style={{
          marginLeft: '15px',
          height: '25px',
          width: '25px',
          cursor: 'pointer',
        }}
        onClick={onNewGroupClick}
      />
    </Col>
    <GroupContainer
      Icon={(props) => <IconFolderAll {...props} />}
      name="All Students"
      onClick={() => onClick('')}
    />
    {options &&
      options.map((item) => (
        <GroupContainer
          {...item}
          Icon={(props) => <IconFolderDeactive {...props} />}
          isActive={current === item.id}
          onClick={() => onClick(item.id)}
        />
      ))}
  </Row>
)

export default GroupsFilter
