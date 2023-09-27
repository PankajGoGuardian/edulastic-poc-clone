import React from 'react'
import * as PropTypes from 'prop-types'
import { Select } from 'antd'
import { IconPlusCircle } from '@edulastic/icons'
import { themeColor } from '@edulastic/colors'
import MemberDropdown from './MemberDropdown'
import RemoveButtonGroup from './RemoveButtonGroup'
import FilterInput from './FilterInput'

const operators = [
  { name: 'equals', title: 'equals', type: ['time', 'string', 'number'] },
  {
    name: 'notEquals',
    title: 'does not equal',
    type: ['time', 'string', 'number'],
  },
  { name: 'set', title: 'is set', type: ['time', 'string', 'number'] },
  {
    name: 'notSet',
    title: 'is not set',
    type: ['time', 'string', 'number'],
  },
  { name: 'contains', title: 'contains', type: ['time', 'string'] },
  {
    name: 'notContains',
    title: 'does not contain',
    type: ['time', 'string'],
  },
  { name: 'gt', title: '>', type: ['number'] },
  { name: 'gte', title: '>=', type: ['number'] },
  { name: 'lt', title: '<', type: ['number'] },
  { name: 'lte', title: '<=', type: ['number'] },
]

const FilterGroup = ({
  members,
  availableMembers,
  addMemberName,
  updateMethods,
}) => {
  const updateMembers = (oldMember, newMember) => {
    const idxToReplace = members.findIndex(
      (o) => o.dimension.name === oldMember.dimension.name
    )
    const existingMembers = [...members]
    existingMembers[idxToReplace] = {
      dimension: newMember,
      operators: operators.filter((op) => op.type.includes(newMember.type)),
    }
    updateMethods(existingMembers)
  }

  const updateValue = (member, key, value) => {
    const idxToReplace = members.findIndex(
      (o) => o.dimension.name === member.dimension.name
    )
    const existingMembers = [...members]
    existingMembers[idxToReplace][key] = value
    updateMethods(existingMembers)
  }
  return (
    <span>
      {members.map((m) => (
        <div style={{ marginBottom: 12 }} key={m.dimension.name}>
          <RemoveButtonGroup
            onRemoveClick={() =>
              updateMethods(
                members.filter(
                  (member) => member.dimension.name !== m.dimension.name
                )
              )
            }
          >
            <MemberDropdown
              type="selected-filter"
              onClick={(updateWith) => updateMembers(m, updateWith)}
              availableMembers={availableMembers}
              style={{
                width: 150,
                textOverflow: 'ellipsis',
                overflow: 'hidden',
              }}
              members={members}
            >
              {m.dimension?.title}
            </MemberDropdown>
          </RemoveButtonGroup>
          <Select
            value={m.operator}
            onChange={(operator) => updateValue(m, 'operator', operator)}
            style={{ width: 200, marginRight: 8 }}
          >
            {m.operators.map((operator) => (
              <Select.Option
                key={`${m.dimension.name}-${operator.name}`}
                value={operator.name}
              >
                {operator.title}
              </Select.Option>
            ))}
          </Select>
          <FilterInput
            member={m}
            key="filterInput"
            updateMethods={updateValue}
          />
        </div>
      ))}
      <MemberDropdown
        onClick={(m) =>
          updateMethods([
            ...members,
            {
              dimension: m,
              operators: operators.filter((op) => op.type.includes(m.type)),
            },
          ])
        }
        availableMembers={availableMembers}
        members={members}
        type="new"
      >
        {addMemberName}
        <IconPlusCircle
          style={{
            marginLeft: '7px',
            fill: themeColor,
            height: '18',
            width: '18',
            marginBottom: '-3px',
          }}
        />
      </MemberDropdown>
    </span>
  )
}

FilterGroup.propTypes = {
  members: PropTypes.array.isRequired,
  availableMembers: PropTypes.array.isRequired,
  addMemberName: PropTypes.string.isRequired,
  updateMethods: PropTypes.object.isRequired,
}

export default FilterGroup
